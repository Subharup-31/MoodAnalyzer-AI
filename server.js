// Simple Express server to serve the app and provide API keys securely
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Spotify token management
let spotifyToken = null;
let spotifyTokenExpiry = null;

// Store user OAuth tokens (in production, use a database)
const userSpotifyTokens = new Map();

async function getSpotifyToken() {
    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        
        if (!clientId || !clientSecret) {
            console.log('⚠️ Spotify credentials not configured');
            return null;
        }
        
        const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
            }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            spotifyToken = data.access_token;
            spotifyTokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
            console.log('✅ Spotify token refreshed (Client Credentials)');
            return spotifyToken;
        } else {
            console.error('❌ Failed to get Spotify token:', data);
            return null;
        }
    } catch (error) {
        console.error('❌ Spotify token error:', error);
        return null;
    }
}

async function getValidSpotifyToken() {
    if (!spotifyToken || Date.now() >= spotifyTokenExpiry) {
        return await getSpotifyToken();
    }
    return spotifyToken;
}

// Initialize Spotify token on startup
getSpotifyToken();

// OAuth helper functions
function generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function refreshUserToken(userId, refreshToken) {
    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            userSpotifyTokens.set(userId, {
                accessToken: data.access_token,
                refreshToken: refreshToken,
                expiresAt: Date.now() + (data.expires_in * 1000)
            });
            return data.access_token;
        }
        return null;
    } catch (error) {
        console.error('Error refreshing user token:', error);
        return null;
    }
}

// Serve static files with cache control
app.use(express.static(path.join(__dirname, 'landing'), {
    maxAge: '1h', // Cache for 1 hour
    etag: true,
    lastModified: true
}));

app.use('/app', express.static(__dirname, {
    maxAge: '1h', // Cache for 1 hour
    etag: true,
    lastModified: true
}));

app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1h', // Cache for 1 hour
    etag: true,
    lastModified: true
}));

// API endpoint to get configuration (without exposing .env directly)
app.get('/api/config', async (req, res) => {
    // Prevent caching of config data
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    const validSpotifyToken = await getValidSpotifyToken();
    
    res.json({
        firebase: {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID
        },
        gemini: {
            apiKey: process.env.GEMINI_API_KEY
        },
        huggingface: {
            apiKey: process.env.HUGGINGFACE_API_KEY
        },
        spotify: {
            token: validSpotifyToken
        }
    });
});

// Endpoint to get fresh Spotify token
app.get('/api/spotify/token', async (req, res) => {
    // Prevent caching of tokens
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    const token = await getValidSpotifyToken();
    if (token) {
        res.json({ token });
    } else {
        res.status(500).json({ error: 'Failed to get Spotify token' });
    }
});

// Proxy endpoint for Spotify search
app.get('/api/spotify/search', async (req, res) => {
    try {
        const validSpotifyToken = await getValidSpotifyToken();
        if (!validSpotifyToken) {
            return res.status(500).json({ error: 'Failed to get Spotify token' });
        }
        
        const searchParams = new URLSearchParams(req.query);
        const response = await fetch(
            `https://api.spotify.com/v1/search?${searchParams.toString()}`,
            {
                headers: {
                    'Authorization': `Bearer ${validSpotifyToken}`
                }
            }
        );

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Spotify search error:', error);
        res.status(500).json({ error: 'Failed to search Spotify' });
    }
});

// Spotify OAuth - Step 1: Redirect to Spotify login
app.get('/api/spotify/login', (req, res) => {
    const state = generateRandomString(16);
    const scope = 'playlist-modify-public playlist-modify-private user-read-private user-read-email';
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `http://localhost:${PORT}/api/spotify/callback`;
    
    const authUrl = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: redirectUri,
        state: state
    });
    
    res.redirect(authUrl);
});

// Spotify OAuth - Step 2: Handle callback
app.get('/api/spotify/callback', async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    
    if (!code) {
        return res.redirect('/?error=spotify_auth_failed');
    }
    
    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `http://localhost:${PORT}/api/spotify/callback`;
        const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code: code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Get user ID
            const userResponse = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${data.access_token}`
                }
            });
            const userData = await userResponse.json();
            
            // Store tokens (in production, save to database)
            userSpotifyTokens.set(userData.id, {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                expiresAt: Date.now() + (data.expires_in * 1000)
            });
            
            console.log(`✅ Spotify OAuth successful for user: ${userData.id}`);
            
            // Redirect back to app with success
            res.redirect(`/?spotify_connected=true&spotify_user=${userData.id}`);
        } else {
            console.error('Spotify OAuth error:', data);
            res.redirect('/?error=spotify_auth_failed');
        }
    } catch (error) {
        console.error('Spotify callback error:', error);
        res.redirect('/?error=spotify_auth_failed');
    }
});

// Create Spotify playlist with OAuth token
app.post('/api/spotify/create-playlist', express.json(), async (req, res) => {
    try {
        const { name, description, trackUris, spotifyUserId } = req.body;
        
        if (!spotifyUserId) {
            return res.status(400).json({ 
                error: 'Not connected to Spotify',
                needsAuth: true 
            });
        }
        
        // Get user's OAuth token
        let userToken = userSpotifyTokens.get(spotifyUserId);
        
        if (!userToken) {
            return res.status(401).json({ 
                error: 'Spotify not connected',
                needsAuth: true 
            });
        }
        
        // Refresh token if expired
        if (Date.now() >= userToken.expiresAt) {
            const newToken = await refreshUserToken(spotifyUserId, userToken.refreshToken);
            if (!newToken) {
                return res.status(401).json({ 
                    error: 'Token refresh failed',
                    needsAuth: true 
                });
            }
            userToken = userSpotifyTokens.get(spotifyUserId);
        }
        
        // Create playlist
        const createResponse = await fetch(
            `https://api.spotify.com/v1/users/${spotifyUserId}/playlists`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    description: description || 'Created by MoodSync - Your AI Mood Journal',
                    public: false
                })
            }
        );
        
        const playlist = await createResponse.json();
        
        if (!createResponse.ok) {
            console.error('Failed to create playlist:', playlist);
            return res.status(500).json({ error: 'Failed to create playlist' });
        }
        
        // Add tracks to playlist
        if (trackUris && trackUris.length > 0) {
            const addTracksResponse = await fetch(
                `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${userToken.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        uris: trackUris
                    })
                }
            );
            
            if (!addTracksResponse.ok) {
                console.error('Failed to add tracks to playlist');
            }
        }
        
        console.log(`✅ Created playlist: ${playlist.name} (${playlist.id})`);
        
        res.json({
            success: true,
            playlist: {
                id: playlist.id,
                name: playlist.name,
                url: playlist.external_urls.spotify,
                uri: playlist.uri
            }
        });
        
    } catch (error) {
        console.error('Playlist creation error:', error);
        res.status(500).json({ error: 'Failed to create playlist' });
    }
});

// Proxy endpoint for Gemini API to hide API key
app.post('/api/gemini', express.json(), async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API key not configured' });
        }
        
        // Try different models/API versions in order of preference
        // Prioritize 2.0-flash as it's more reliable than 2.5-flash
        const attempts = [
            { version: 'v1beta', model: 'gemini-2.0-flash' },
            { version: 'v1', model: 'gemini-2.0-flash' },
            { version: 'v1beta', model: 'gemini-2.5-flash' },
            { version: 'v1', model: 'gemini-2.5-flash' }
        ];
        
        let lastError = null;
        
        for (const attempt of attempts) {
            try {
                const url = `https://generativelanguage.googleapis.com/${attempt.version}/models/${attempt.model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
                
                // Add timeout to fetch request
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
                
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: prompt
                                }]
                            }],
                            generationConfig: {
                                temperature: 0.7,
                                topK: 40,
                                topP: 0.95,
                                maxOutputTokens: 150,
                            }
                        }),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (response.ok) {
                        const data = await response.json();
                        
                        // Check if response has valid content
                        const hasContent = data.candidates && 
                                         data.candidates.length > 0 && 
                                         (data.candidates[0]?.content?.parts?.[0]?.text || 
                                          data.candidates[0]?.content?.text);
                        
                        if (hasContent) {
                            console.log(`✅ Gemini API success with ${attempt.version}/${attempt.model}`);
                            return res.json(data);
                        } else {
                            console.log(`⚠️ Gemini ${attempt.version}/${attempt.model} returned empty content`);
                            // Continue to next attempt
                        }
                    } else {
                        const errorText = await response.text();
                        lastError = { status: response.status, statusText: response.statusText, details: errorText };
                        console.log(`⚠️ Gemini ${attempt.version}/${attempt.model} failed: ${response.status}`);
                    }
                } catch (fetchError) {
                    clearTimeout(timeoutId);
                    if (fetchError.name === 'AbortError') {
                        lastError = { error: 'Request timeout after 30 seconds' };
                        console.log(`⚠️ Gemini ${attempt.version}/${attempt.model} timeout`);
                    } else {
                        lastError = { error: fetchError.message };
                        console.log(`⚠️ Gemini ${attempt.version}/${attempt.model} error: ${fetchError.message}`);
                    }
                }
            } catch (err) {
                lastError = { error: err.message };
                console.log(`⚠️ Gemini ${attempt.version}/${attempt.model} error: ${err.message}`);
            }
        }
        
        // All attempts failed
        console.error('❌ All Gemini API attempts failed');
        return res.status(lastError?.status || 500).json({ 
            error: `Gemini API error: ${lastError?.statusText || 'All model attempts failed'}`, 
            status: lastError?.status || 500,
            details: lastError?.details || lastError 
        });
        
    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({ error: 'Failed to generate response', message: error.message });
    }
});

// Proxy endpoint for Gemini mood analysis
app.post('/api/gemini/mood', express.json(), async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API key not configured' });
        }
        
        if (!text || text.trim().length < 10) {
            return res.status(400).json({ error: 'Text too short for mood analysis' });
        }
        
        // Try different models/API versions (in order of preference)
        // Prioritize 2.0-flash as it's more reliable than 2.5-flash
        const attempts = [
            { version: 'v1beta', model: 'gemini-2.0-flash' },
            { version: 'v1', model: 'gemini-2.0-flash' },
            { version: 'v1beta', model: 'gemini-2.5-flash' },
            { version: 'v1', model: 'gemini-2.5-flash' }
        ];
        
        const moodOptions = ['happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'stressed', 'bored', 'content', 'irritable', 'disappointed', 'hopeful', 'overwhelmed', 'relaxed', 'frustrated', 'joyful', 'depressed', 'lonely', 'peaceful', 'nervous', 'apathetic', 'enthusiastic', 'melancholy', 'annoyed', 'optimistic', 'pessimistic', 'satisfied', 'worried', 'confident', 'grateful', 'confused', 'proud', 'tired', 'motivated', 'inlove', 'guilty'];
        
        const prompt = `You are an expert emotional intelligence analyst. Analyze this journal entry with high accuracy and respond with ONLY a JSON object in this exact format:
{
  "mood": "one_mood_from_list",
  "confidence": 0.0_to_1.0,
  "reasoning": "brief_explanation",
  "relatedMoods": [
    {"mood": "related_mood_name", "confidence": 0.0_to_1.0},
    {"mood": "related_mood_name", "confidence": 0.0_to_1.0}
  ]
}

Available moods (30 total): ${moodOptions.join(', ')}

CRITICAL INSTRUCTIONS FOR ACCURATE MOOD DETECTION WITH MIXED EMOTIONS:
1. Read the ENTIRE journal entry carefully - emotions are often mixed and layered
2. Consider CONTEXT, TONE, SUBTEXT, and MIXED EMOTIONS - people often feel multiple things at once
3. The PRIMARY mood should be the MOST DOMINANT emotion you detect
4. RELATED MOODS (2-3 required): Identify 2-3 secondary emotions that are also clearly present in the text
   - Look for mixed emotions: e.g., "excited but nervous", "happy but worried", "sad but hopeful"
   - If the entry shows conflicting emotions, include both (e.g., anxious + hopeful, frustrated + determined)
   - Related moods should have confidence scores between 0.3-0.7 (secondary but present)
5. Distinguish between similar moods:
   - "anxious" vs "nervous" vs "worried" vs "stressed": Anxious = general worry, Nervous = specific anticipation, Worried = concern about something, Stressed = pressure/deadlines
   - "sad" vs "depressed" vs "melancholy" vs "lonely": Sad = general unhappiness, Depressed = deep/prolonged sadness, Melancholy = reflective sadness, Lonely = isolation
   - "angry" vs "frustrated" vs "irritable" vs "annoyed": Angry = strong negative emotion, Frustrated = blocked/stuck, Irritable = easily annoyed, Annoyed = bothered
   - "happy" vs "joyful" vs "excited" vs "enthusiastic": Happy = general positivity, Joyful = deep happiness, Excited = anticipation, Enthusiastic = passionate energy
   - "calm" vs "relaxed" vs "peaceful" vs "content": Calm = steady state, Relaxed = unwound, Peaceful = inner harmony, Content = satisfied
6. Look for emotional INTENSITY indicators (very, extremely, really, so, etc.)
7. Consider NEGATIONS and CONTRADICTIONS (not happy = likely sad/anxious, "but" indicates mixed emotions)
8. Confidence should reflect how certain you are (0.7-0.95 for high confidence, 0.5-0.7 for moderate)
9. ALWAYS return 2-3 related moods if mixed emotions are present (which is common in journal entries)

Journal entry: "${text.substring(0, 2000)}"

Respond with ONLY the JSON object, no other text.`;
        
        let lastError = null;
        
        for (const attempt of attempts) {
            try {
                const url = `https://generativelanguage.googleapis.com/${attempt.version}/models/${attempt.model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
                
                // Add timeout to fetch request
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
                
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: prompt
                                }]
                            }],
                            generationConfig: {
                                temperature: 0.2,
                                topK: 10,
                                topP: 0.7,
                                maxOutputTokens: 500,
                            }
                        }),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);
                    
                    if (response.ok) {
                        const data = await response.json();
                        
                        // Check if response has candidates
                        if (!data.candidates || data.candidates.length === 0) {
                            console.log(`⚠️ No candidates in response from Gemini ${attempt.version}/${attempt.model}`);
                            continue; // Try next model
                        }
                        
                        const generatedText = data.candidates[0]?.content?.parts?.[0]?.text || 
                                             data.candidates[0]?.content?.text || 
                                             '';
                        
                        if (!generatedText || generatedText.trim().length === 0) {
                            console.log(`⚠️ Empty response from Gemini ${attempt.version}/${attempt.model}`);
                            continue; // Try next model
                        }
                    
                    // Try multiple methods to extract JSON
                    let moodData = null;
                    
                    // Method 1: Try parsing the entire response as JSON
                    try {
                        moodData = JSON.parse(generatedText.trim());
                    } catch (e1) {
                        // Method 2: Extract JSON object from text
                        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            try {
                                moodData = JSON.parse(jsonMatch[0]);
                            } catch (e2) {
                                // Method 3: Try to find JSON in code blocks
                                const codeBlockMatch = generatedText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
                                if (codeBlockMatch) {
                                    try {
                                        moodData = JSON.parse(codeBlockMatch[1]);
                                    } catch (e3) {
                                        console.log(`⚠️ Failed to parse JSON from code block: ${e3.message}`);
                                        console.log(`Response preview: ${generatedText.substring(0, 300)}`);
                                    }
                                } else {
                                    console.log(`⚠️ Failed to parse Gemini mood response. Text: ${generatedText.substring(0, 300)}`);
                                }
                            }
                        }
                    }
                    
                    if (moodData && moodData.mood) {
                        // Validate mood
                        if (moodOptions.includes(moodData.mood.toLowerCase())) {
                            // Validate and filter related moods
                            const relatedMoods = [];
                            if (Array.isArray(moodData.relatedMoods)) {
                                moodData.relatedMoods.forEach(rm => {
                                    if (rm.mood && moodOptions.includes(rm.mood.toLowerCase()) && rm.confidence) {
                                        relatedMoods.push({
                                            mood: rm.mood.toLowerCase(),
                                            confidence: Math.min(1.0, Math.max(0.0, rm.confidence))
                                        });
                                    }
                                });
                            }
                            
                            console.log(`✅ Mood analysis by Gemini ${attempt.version}/${attempt.model}: ${moodData.mood} with ${relatedMoods.length} related moods`);
                            return res.json({
                                mood: moodData.mood.toLowerCase(),
                                confidence: Math.min(1.0, Math.max(0.0, moodData.confidence || 0.7)),
                                reasoning: moodData.reasoning || '',
                                relatedMoods: relatedMoods
                            });
                        } else {
                            console.log(`⚠️ Invalid mood returned: ${moodData.mood}`);
                            continue; // Try next model
                        }
                    } else {
                        console.log(`⚠️ No valid mood data found in response from ${attempt.version}/${attempt.model}`);
                        continue; // Try next model
                    }
                    } else {
                        const errorText = await response.text();
                        lastError = { status: response.status, statusText: response.statusText, details: errorText };
                        console.error(`❌ Gemini mood API error (${attempt.version}/${attempt.model}):`, response.status, response.statusText);
                        console.error('Error details:', errorText);
                    }
                } catch (fetchError) {
                    clearTimeout(timeoutId);
                    if (fetchError.name === 'AbortError') {
                        lastError = { error: 'Request timeout after 30 seconds' };
                        console.log(`⚠️ Gemini ${attempt.version}/${attempt.model} timeout`);
                    } else {
                        lastError = { error: fetchError.message };
                        console.log(`⚠️ Gemini ${attempt.version}/${attempt.model} fetch error: ${fetchError.message}`);
                    }
                }
            } catch (err) {
                lastError = { error: err.message };
                console.error(`❌ Gemini mood analysis ${attempt.version}/${attempt.model} exception:`, err.message);
                console.error('Full error:', err);
            }
        }
        
        // All attempts failed - return a fallback response to let client use keyword analysis
        console.error('❌ All Gemini mood analysis attempts failed');
        console.error('Last error:', lastError);
        
        // If API key is missing, return 500 instead of 503
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ 
                error: 'Gemini API key not configured',
                message: 'Please set GEMINI_API_KEY in your .env file'
            });
        }
        
        return res.status(503).json({ 
            error: 'Gemini API temporarily unavailable',
            fallback: true,
            message: 'Using keyword analysis instead',
            lastError: lastError
        });
        
    } catch (error) {
        console.error('Gemini mood analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze mood', message: error.message });
    }
});

// Proxy endpoint for Hugging Face sentiment analysis (kept as fallback)
app.post('/api/huggingface/sentiment', express.json(), async (req, res) => {
    try {
        const { inputs } = req.body;
        
        const response = await fetch(
            'https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment-latest',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inputs })
            }
        );

        // Check if the response is successful
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Hugging Face API error:', response.status, response.statusText, errorText);
            
            // Try to parse as JSON, but handle plain text responses
            let errorDetails;
            try {
                errorDetails = JSON.parse(errorText);
            } catch (parseError) {
                // If it's not JSON, use the raw text
                errorDetails = { message: errorText };
            }
            
            return res.status(response.status).json({ 
                error: `Hugging Face API error: ${response.statusText}`, 
                status: response.status,
                details: errorDetails 
            });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Hugging Face sentiment API error:', error);
        res.status(500).json({ 
            error: 'Failed to analyze sentiment', 
            message: error.message,
            stack: error.stack
        });
    }
});

// Proxy endpoint for Hugging Face text generation
app.post('/api/huggingface/generate', express.json(), async (req, res) => {
    try {
        const { inputs, parameters } = req.body;
        
        if (!process.env.HUGGINGFACE_API_KEY) {
            return res.status(500).json({ error: 'Hugging Face API key not configured' });
        }
        
        // Try different Hugging Face endpoints and models
        const attempts = [
            { url: 'https://api-inference.huggingface.co/models/gpt2' },
            { url: 'https://api-inference.huggingface.co/models/google/flan-t5-base' },
            { url: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium' }
        ];
        
        let lastError = null;
        
        for (const attempt of attempts) {
            try {
                const response = await fetch(attempt.url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ inputs, parameters })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`✅ Hugging Face API success with ${attempt.url}`);
                    return res.json(data);
                } else {
            const errorText = await response.text();
                    lastError = { status: response.status, statusText: response.statusText, details: errorText };
                    console.log(`⚠️ Hugging Face ${attempt.url} failed: ${response.status}`);
                }
            } catch (err) {
                lastError = { error: err.message };
                console.log(`⚠️ Hugging Face ${attempt.url} error: ${err.message}`);
            }
        }
        
        // All attempts failed
        console.error('❌ All Hugging Face API attempts failed');
        
        // Try to parse error details
            let errorDetails;
        if (lastError?.details) {
            try {
                errorDetails = JSON.parse(lastError.details);
            } catch (parseError) {
                errorDetails = { message: lastError.details };
            }
        } else {
            errorDetails = lastError || { message: 'All model attempts failed' };
            }
            
        return res.status(lastError?.status || 500).json({ 
            error: `Hugging Face API error: ${lastError?.statusText || 'All model attempts failed'}`, 
            status: lastError?.status || 500,
                details: errorDetails 
            });
        
    } catch (error) {
        console.error('Hugging Face generation API error:', error);
        res.status(500).json({ 
            error: 'Failed to generate response', 
            message: error.message
        });
    }
});

// Proxy endpoint for Quotes API - Primary: Gemini, Fallback: Quote APIs
app.get('/api/quotes', async (req, res) => {
    try {
        // Primary: Use Gemini to generate an inspirational quote
        if (process.env.GEMINI_API_KEY) {
            try {
                    const attempts = [
                        { version: 'v1beta', model: 'gemini-2.0-flash' },
                        { version: 'v1', model: 'gemini-2.0-flash' },
                        { version: 'v1beta', model: 'gemini-2.5-flash' },
                        { version: 'v1', model: 'gemini-2.5-flash' }
                    ];
                
                for (const attempt of attempts) {
                    try {
                        const url = `https://generativelanguage.googleapis.com/${attempt.version}/models/${attempt.model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
                        
                        // 85% chance to use famous personality, 15% chance for general inspirational
                        const useFamousPersonality = Math.random() < 0.85;
                        
                        const famousPersonalities = [
                            'Albert Einstein', 'Mahatma Gandhi', 'Nelson Mandela', 'Martin Luther King Jr.',
                            'Maya Angelou', 'Winston Churchill', 'Steve Jobs', 'Oprah Winfrey',
                            'Dalai Lama', 'Confucius', 'Buddha', 'Rumi', 'Mark Twain', 'Oscar Wilde',
                            'Eleanor Roosevelt', 'Helen Keller', 'Mother Teresa', 'Abraham Lincoln',
                            'Theodore Roosevelt', 'Walt Disney', 'Thomas Edison', 'Leonardo da Vinci',
                            'Pablo Picasso', 'Vincent van Gogh', 'Shakespeare', 'Jane Austen',
                            'J.K. Rowling', 'Maya Angelou', 'Toni Morrison', 'Rumi', 'Khalil Gibran'
                        ];
                        
                        let prompt;
                        if (useFamousPersonality) {
                            const personality = famousPersonalities[Math.floor(Math.random() * famousPersonalities.length)];
                            prompt = `Generate a short, inspirational quote (1-2 sentences, maximum 150 characters) in the style and wisdom of ${personality}. The quote should be perfect for a daily mood journal app. Format your response EXACTLY as: "Quote text" - ${personality}`;
                        } else {
                            prompt = `Generate a short, inspirational quote (1-2 sentences, maximum 150 characters) that would be perfect for a daily mood journal app. Include a well-known author's name (choose from: Albert Einstein, Mahatma Gandhi, Maya Angelou, Rumi, Dalai Lama, or similar famous inspirational figures). Format your response EXACTLY as: "Quote text" - Author Name`;
                        }
                        
                        const response = await fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                contents: [{
                                    parts: [{
                                        text: prompt
                                    }]
                                }],
                                generationConfig: {
                                    temperature: 0.9,
                                    topK: 40,
                                    topP: 0.95,
                                    maxOutputTokens: 100,
                                }
                            })
                        });
                        
                        if (response.ok) {
                            const data = await response.json();
                            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                                                 data.candidates?.[0]?.content?.text || '';
                            
                            if (generatedText) {
                                // Parse the quote format: "Quote text" - Author Name
                                const match = generatedText.match(/["'](.+?)["']\s*[-–—]\s*(.+)/);
                                if (match) {
                                    console.log(`✅ Quote generated by Gemini ${attempt.version}/${attempt.model}`);
                                    return res.json({ text: match[1].trim(), author: match[2].trim() });
                                } else {
                                    // Try to extract quote and author from any format
                                    const lines = generatedText.split('\n').filter(l => l.trim());
                                    if (lines.length >= 2) {
                                        return res.json({ text: lines[0].replace(/["']/g, '').trim(), author: lines[1].replace(/[-–—]/g, '').trim() });
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        console.log(`⚠️ Gemini quote generation failed with ${attempt.version}/${attempt.model}: ${err.message}`);
                    }
                }
            } catch (geminiError) {
                console.log('⚠️ Gemini quote generation failed, trying fallback APIs');
            }
        }
        
        // Fallback: Try multiple quote APIs
        const quoteAPIs = [
            'https://api.quotable.io/random',
            'https://zenquotes.io/api/today',
            'https://api.quotable.io/quotes/random'
        ];
        
        for (const apiUrl of quoteAPIs) {
            try {
                const response = await fetch(apiUrl);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Handle different API response formats
                    let quote, author;
                    
                    if (Array.isArray(data) && data.length > 0) {
                        quote = data[0].q || data[0].text;
                        author = data[0].a || data[0].author;
                    } else if (data.content) {
                        quote = data.content;
                        author = data.author;
                    } else if (data.quote) {
                        quote = data.quote;
                        author = data.author;
                    }
                    
                    if (quote && author) {
                        console.log(`✅ Quote fetched from ${apiUrl}`);
                        return res.json({ text: quote, author: author });
                    }
                }
            } catch (err) {
                console.log(`⚠️ Quote API ${apiUrl} failed: ${err.message}`);
            }
        }
        
        // Final fallback: Static quotes
        const fallbackQuotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
            { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" }
        ];
        
        const fallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        console.log('📝 Using fallback quote');
        return res.json(fallback);
        
    } catch (error) {
        console.error('Quotes API error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch quote',
            text: "Every day is a new beginning.",
            author: "Anonymous"
        });
    }
});

// Middleware to prevent caching of HTML files (for login/refresh scenarios)
app.use((req, res, next) => {
    // Prevent caching of HTML files
    if (req.path.endsWith('.html') || req.path === '/' || req.path === '/app') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    next();
});

// Redirect root path to landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing', 'index.html'));
});

// Serve main app at /app path
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 MoodSync server running at http://localhost:${PORT}`);
    console.log(`📝 Make sure to set your GEMINI_API_KEY in .env file`);
    console.log(`🎵 Spotify token will auto-refresh every hour`);
});

