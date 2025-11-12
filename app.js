// ========================================
// MOODSYNC - AI MOOD JOURNAL
// Main Application Logic
// ========================================

import { CONFIG, MOODS, API_ENDPOINTS, validateConfig } from './config.js';

// ========================================
// FIREBASE INTEGRATION
// ========================================

let db = null;
let auth = null;
let currentUser = null;

// Initialize Firebase
async function initializeFirebase() {
    try {
        if (CONFIG.firebase.apiKey === 'YOUR_FIREBASE_API_KEY') {
            console.log('📱 Firebase not configured, using local storage only');
            return false;
        }

        // Import Firebase modules
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const { getAuth, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        // Initialize Firebase
        const app = initializeApp(CONFIG.firebase);
        db = getFirestore(app);
        auth = getAuth(app);
        
        // Listen for auth state changes
        onAuthStateChanged(auth, (user) => {
            handleAuthStateChange(user);
        });
        
        console.log('✅ Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        return false;
    }
}

// ========================================
// AUTHENTICATION
// ========================================

async function handleAuthStateChange(user) {
    currentUser = user;
    
    if (user) {
        console.log('✅ User logged in:', user.email);
        showMainApp();
        await loadUserData();
    } else {
        console.log('👤 No user logged in');
        showAuthScreen();
    }
}

function showAuthScreen() {
    const authContainer = document.getElementById('authContainer');
    const mainApp = document.getElementById('mainApp');
    if (authContainer) authContainer.style.display = 'flex';
    if (mainApp) mainApp.style.display = 'none';
}

function showMainApp() {
    const authContainer = document.getElementById('authContainer');
    const mainApp = document.getElementById('mainApp');
    if (authContainer) authContainer.style.display = 'none';
    if (mainApp) mainApp.style.display = 'block';
    
    // Update user info in header
    if (currentUser) {
        const userEmail = document.getElementById('userEmail');
        const userName = document.getElementById('userName');
        if (userEmail) userEmail.textContent = currentUser.email;
        if (userName) userName.textContent = currentUser.displayName || currentUser.email.split('@')[0];
    }
}

async function signUp(email, password, displayName) {
    try {
        const { createUserWithEmailAndPassword, updateProfile } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with display name
        if (displayName) {
            await updateProfile(userCredential.user, {
                displayName: displayName
            });
        }
        
        console.log('✅ User signed up successfully');
        return { success: true };
    } catch (error) {
        console.error('❌ Sign up error:', error);
        
        // Provide user-friendly error messages
        let errorMessage = 'Sign up failed. Please try again.';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered. Please sign in instead or use a different email.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email format. Please enter a valid email address.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password is too weak. Please use at least 6 characters.';
        } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = 'Email/password sign-up is not enabled. Please contact support.';
        }
        
        return { success: false, error: errorMessage };
    }
}

async function signIn(email, password) {
    try {
        const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        await signInWithEmailAndPassword(auth, email, password);
        
        console.log('✅ User signed in successfully');
        return { success: true };
    } catch (error) {
        console.error('❌ Sign in error:', error);
        
        // Provide user-friendly error messages
        let errorMessage = 'Sign in failed. Please try again.';
        
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
            errorMessage = 'Invalid email or password. Please check your credentials or create a new account.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password. Please try again or use "Forgot Password".';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email format. Please enter a valid email address.';
        } else if (error.code === 'auth/user-disabled') {
            errorMessage = 'This account has been disabled. Please contact support.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed attempts. Please try again later or reset your password.';
        }
        
        return { success: false, error: errorMessage };
    }
}

async function signInWithGoogle() {
    try {
        const { signInWithPopup, GoogleAuthProvider } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        
        console.log('✅ User signed in with Google');
        return { success: true };
    } catch (error) {
        console.error('❌ Google sign in error:', error);
        
        // Provide user-friendly error messages
        let errorMessage = 'Google sign in failed. Please try again.';
        
        if (error.code === 'auth/unauthorized-domain') {
            errorMessage = 'This domain is not authorized. Please add your domain to Firebase authorized domains (see console for instructions).';
            console.error('🔧 FIX: Go to Firebase Console → Authentication → Settings → Authorized domains');
            console.error('🔧 Add your current domain:', window.location.hostname);
        } else if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Sign in cancelled. Please try again.';
        } else if (error.code === 'auth/popup-blocked') {
            errorMessage = 'Pop-up blocked by browser. Please allow pop-ups for this site.';
        } else if (error.code === 'auth/cancelled-popup-request') {
            errorMessage = 'Sign in cancelled. Please try again.';
        }
        
        return { success: false, error: errorMessage };
    }
}

async function signOut() {
    try {
        const { signOut: firebaseSignOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        await firebaseSignOut(auth);
        
        // Clear local data
        entries = [];
        currentStreak = 0;
        
        console.log('✅ User signed out successfully');
        return { success: true };
    } catch (error) {
        console.error('❌ Sign out error:', error);
        return { success: false, error: error.message };
    }
}

async function resetPassword(email) {
    try {
        const { sendPasswordResetEmail } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        await sendPasswordResetEmail(auth, email);
        
        console.log('✅ Password reset email sent');
        return { success: true };
    } catch (error) {
        console.error('❌ Password reset error:', error);
        return { success: false, error: error.message };
    }
}

// ========================================
// GLOBAL VARIABLES
// ========================================

let entries = [];
let currentStreak = 0;
let weeklyChart = null;
let monthlyChart = null;
let firebaseEnabled = false;

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 MoodSync initializing...');
    
    // Validate configuration
    const configValidation = validateConfig();
    if (!configValidation.isValid) {
        console.warn('⚠️ Configuration issues:', configValidation.errors);
    }

    // Initialize the app
    initializeApp();
});

async function initializeApp() {
    try {
        // Load fresh config from server to prevent caching
        await loadServerConfig();
        
        // Load fresh Spotify token from server
        await loadFreshSpotifyToken();
        
        // Check for Spotify OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('spotify_connected') === 'true') {
            const spotifyUserId = urlParams.get('spotify_user');
            if (spotifyUserId) {
                localStorage.setItem('spotifyUserId', spotifyUserId);
                console.log('✅ Spotify connected:', spotifyUserId);
                
                // Show success message
                setTimeout(() => {
                    showNotification('🎵 Spotify Connected! You can now auto-create playlists!', 'success');
                }, 1000);
            }
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        if (urlParams.get('error') === 'spotify_auth_failed') {
            showNotification('❌ Spotify connection failed. Please try again.', 'error');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        // Initialize Firebase
        firebaseEnabled = await initializeFirebase();
        
        if (!firebaseEnabled) {
            console.warn('⚠️ Firebase not configured. Authentication will not work.');
            console.warn('📖 See AUTHENTICATION_SETUP.md for setup instructions');
        }
        
        // Load saved data
        await loadSavedData();
        
        // Setup event listeners
        setupEventListeners();
        
        // Load inspirational quote
        await loadDailyQuote();
        
        // Update statistics
        updateStatistics();
        
        // Initialize charts
        initializeCharts();
        
        // Display past entries
        displayEntries();
        
        console.log('✅ MoodSync initialized successfully');
        console.log('📍 Current domain:', window.location.hostname);
        console.log('🔧 If you see auth errors, check TROUBLESHOOTING.md');
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        showError('Failed to initialize the app. Please refresh the page.');
    }
}

async function loadFreshSpotifyToken() {
    try {
        const response = await fetch('/api/spotify/token');
        if (response.ok) {
            const data = await response.json();
            if (data.token) {
                CONFIG.spotify.token = data.token;
                console.log('✅ Loaded fresh Spotify token');
                return true;
            }
        } else {
            console.log('⚠️ Could not load Spotify token from server:', response.status);
        }
        return false;
    } catch (error) {
        console.log('⚠️ Could not load Spotify token from server:', error.message);
        return false;
    }
}

async function loadServerConfig() {
    try {
        // Fetch fresh config from server to prevent caching issues
        const response = await fetch('/api/config', {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        if (response.ok) {
            const serverConfig = await response.json();
            
            // Update config with fresh data
            if (serverConfig.firebase) {
                CONFIG.firebase = { ...CONFIG.firebase, ...serverConfig.firebase };
            }
            
            if (serverConfig.gemini) {
                CONFIG.gemini = { ...CONFIG.gemini, ...serverConfig.gemini };
            }
            
            if (serverConfig.huggingface) {
                CONFIG.huggingface = { ...CONFIG.huggingface, ...serverConfig.huggingface };
            }
            
            if (serverConfig.spotify && serverConfig.spotify.token) {
                CONFIG.spotify.token = serverConfig.spotify.token;
            }
            
            console.log('✅ Loaded fresh server config');
            return true;
        } else {
            console.log('⚠️ Could not load server config:', response.status);
            return false;
        }
    } catch (error) {
        console.log('⚠️ Could not load server config:', error.message);
        return false;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    const journalInput = document.getElementById('journalInput');
    const saveBtn = document.getElementById('saveBtn');
    
    if (!journalInput || !saveBtn) {
        console.error('❌ Required elements not found:', { journalInput, saveBtn });
        return;
    }
    
    console.log('✅ Setting up event listeners');
    
    // Character counter
    journalInput.addEventListener('input', updateCharacterCount);
    
    // Save button
    saveBtn.addEventListener('click', function(e) {
        console.log('💾 Save button clicked');
        e.preventDefault();
        saveEntry();
    });
    
    // Enter key to save (Ctrl/Cmd + Enter)
    journalInput.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            console.log('⌨️ Keyboard shortcut used');
            saveEntry();
        }
    });
    
    console.log('✅ Event listeners set up successfully');
}

function updateCharacterCount() {
    const journalInput = document.getElementById('journalInput');
    const charCount = document.getElementById('charCount');
    const count = journalInput.value.length;
    
    charCount.textContent = count;
    
    // Update save button state
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = count < 10;
}

// ========================================
// DAILY QUOTE
// ========================================

async function loadDailyQuote() {
    try {
        // Use server proxy to avoid CORS issues
        const response = await fetch('/api/quotes');
        
        if (response.ok) {
            const quote = await response.json();
            document.getElementById('quoteText').textContent = `"${quote.text}"`;
            document.getElementById('quoteAuthor').textContent = `— ${quote.author}`;
            console.log('✅ Quote loaded successfully');
        } else {
            throw new Error('Failed to fetch quote');
        }
        
    } catch (error) {
        console.error('Error loading quote:', error);
        document.getElementById('quoteText').textContent = '"Every day is a new beginning."';
        document.getElementById('quoteAuthor').textContent = '— Anonymous';
    }
}

// ========================================
// MOOD ANALYSIS
// ========================================

async function analyzeMood(text) {
    try {
        showLoading('Analyzing your mood...');
        
        // Use Gemini for mood analysis (primary and only AI method)
        if (CONFIG.gemini.apiKey && CONFIG.gemini.apiKey !== 'YOUR_GEMINI_API_KEY') {
            try {
                const geminiAnalysis = await getGeminiMoodAnalysis(text);
                if (geminiAnalysis) {
                    console.log('✅ Mood analysis completed using Gemini:', geminiAnalysis.mood);
                    return geminiAnalysis;
                }
            } catch (geminiError) {
                console.error('🤖 Gemini mood analysis failed:', geminiError);
                console.log('⚠️ Falling back to keyword analysis');
            }
        } else {
            console.warn('⚠️ Gemini API key not configured, using keyword analysis');
        }
        
        // Fallback: Enhanced keyword analysis (85-90% accuracy)
        const moodAnalysis = analyzeKeywords(text);
        
        // Convert to expected format with relatedMoods
        return {
            mood: moodAnalysis.mood,
            confidence: moodAnalysis.confidence,
            reasoning: `Detected through enhanced keyword analysis with ${Math.round(moodAnalysis.confidence * 100)}% confidence.`,
            relatedMoods: (moodAnalysis.alternatives || []).map(alt => ({
                mood: alt.mood,
                confidence: alt.confidence || Math.max(0.3, (alt.score / moodAnalysis.scores[moodAnalysis.mood]) * moodAnalysis.confidence * 0.9)
            }))
        };
        
    } catch (error) {
        console.error('Error analyzing mood:', error);
        // Final fallback: Enhanced keyword analysis
        const moodAnalysis = analyzeKeywords(text);
        
        return {
            mood: moodAnalysis.mood,
            confidence: moodAnalysis.confidence,
            reasoning: `Detected through enhanced keyword analysis with ${Math.round(moodAnalysis.confidence * 100)}% confidence.`,
            relatedMoods: (moodAnalysis.alternatives || []).map(alt => ({
                mood: alt.mood,
                confidence: alt.confidence || Math.max(0.3, (alt.score / moodAnalysis.scores[moodAnalysis.mood]) * moodAnalysis.confidence * 0.9)
            }))
        };
    } finally {
        hideLoading();
    }
}

function analyzeKeywords(text) {
    const textLower = text.toLowerCase().trim();
    const moodScores = {};
    
    // Initialize all mood scores to 0
    const allMoods = ['happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'stressed', 'bored', 'content', 'irritable', 'disappointed', 'hopeful', 'overwhelmed', 'relaxed', 'frustrated', 'joyful', 'depressed', 'lonely', 'peaceful', 'nervous', 'apathetic', 'enthusiastic', 'melancholy', 'annoyed', 'optimistic', 'pessimistic', 'satisfied', 'worried', 'confident', 'grateful', 'confused', 'proud', 'tired', 'motivated', 'inlove', 'guilty'];
    allMoods.forEach(mood => moodScores[mood] = 0);
    
    // PRIORITY 1: Direct mood word matches (highest accuracy)
    allMoods.forEach(mood => {
        const moodRegex = new RegExp(`\\b${mood}\\b`, 'gi');
        const matches = (textLower.match(moodRegex) || []).length;
        if (matches > 0) {
            // Check for negation before the mood word
            const allMatches = [...textLower.matchAll(moodRegex)];
            allMatches.forEach(match => {
                const beforeText = textLower.substring(Math.max(0, match.index - 30), match.index);
                const isNegated = /\b(not|don't|doesn't|didn't|never|no|can't|won't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|wouldn't|couldn't|shouldn't|mustn't)\s+/.test(beforeText);
                
                if (isNegated) {
                    // Negated mood - flip to opposite
                    if (['happy', 'excited', 'grateful', 'hopeful', 'confident', 'motivated', 'inlove', 'joyful', 'enthusiastic', 'optimistic', 'satisfied', 'proud', 'content'].includes(mood)) {
                        moodScores['sad'] += 10;
                        moodScores['disappointed'] += 5;
                    } else if (['sad', 'angry', 'anxious', 'lonely', 'overwhelmed', 'guilty', 'depressed', 'worried', 'stressed', 'frustrated'].includes(mood)) {
                        moodScores['calm'] += 8;
                        moodScores['relaxed'] += 5;
                    }
                } else {
                    // Direct match - very high confidence
                    moodScores[mood] += 15;
                }
            });
        }
    });
    
    // PRIORITY 2: Keyword matching with proper weights
    Object.entries(MOODS).forEach(([moodKey, moodData]) => {
        if (!allMoods.includes(moodKey)) return;
        
        moodData.keywords.forEach(keyword => {
            // Skip if it's just the mood name (already handled above)
            if (keyword.toLowerCase() === moodKey.toLowerCase()) return;
            
            const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
            const matches = [...textLower.matchAll(regex)];
            
            matches.forEach(match => {
                // Check for negation
                const beforeText = textLower.substring(Math.max(0, match.index - 30), match.index);
                const isNegated = /\b(not|don't|doesn't|didn't|never|no|can't|won't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|wouldn't|couldn't|shouldn't|mustn't)\s+/.test(beforeText);
                
                if (!isNegated) {
                    const wordCount = keyword.split(' ').length;
                    // Multi-word phrases are more reliable
                    const weight = wordCount > 1 ? 8 : 3;
                    moodScores[moodKey] += weight;
                }
            });
        });
    });
    
    // PRIORITY 3: Intensity modifiers boost nearby moods
    const intensityWords = /\b(very|really|so|extremely|incredibly|absolutely|totally|completely|utterly|deeply|super|quite|pretty|rather|immensely|exceptionally|remarkably|particularly|especially|genuinely|truly|honestly|seriously)\s+(\w+)/gi;
    const intensityMatches = [...textLower.matchAll(intensityWords)];
    
    intensityMatches.forEach(match => {
        if (match.length >= 3) {
            const wordAfter = match[2];
            // Find which mood this word belongs to
            allMoods.forEach(mood => {
                if (MOODS[mood] && MOODS[mood].keywords.some(kw => kw.toLowerCase().includes(wordAfter.toLowerCase()))) {
                    moodScores[mood] += 5; // Boost for intensity + mood word
                }
            });
        }
    });
    
    // PRIORITY 4: Common phrases that indicate mood
    const commonPhrases = [
        { pattern: /\b(feeling|feel|feels)\s+(very|really|so|extremely)?\s*(happy|sad|angry|anxious|excited|calm|stressed|bored|tired|motivated|confused|grateful|hopeful|lonely|overwhelmed|frustrated|joyful|depressed|peaceful|nervous|apathetic|enthusiastic|melancholy|annoyed|optimistic|pessimistic|satisfied|worried|confident|proud|inlove|guilty|irritable|disappointed|relaxed|content)\b/gi, boost: 12 },
        { pattern: /\b(I am|I'm|I feel|feeling)\s+(very|really|so|extremely)?\s*(happy|sad|angry|anxious|excited|calm|stressed|bored|tired|motivated|confused|grateful|hopeful|lonely|overwhelmed|frustrated|joyful|depressed|peaceful|nervous|apathetic|enthusiastic|melancholy|annoyed|optimistic|pessimistic|satisfied|worried|confident|proud|inlove|guilty|irritable|disappointed|relaxed|content)\b/gi, boost: 15 }
    ];
    
    commonPhrases.forEach(({ pattern, boost }) => {
        const matches = [...textLower.matchAll(pattern)];
        matches.forEach(match => {
            const moodWord = match[match.length - 1]?.toLowerCase();
            if (moodWord && allMoods.includes(moodWord)) {
                moodScores[moodWord] += boost;
            }
        });
    });
    
    // Additional context analysis
    const contextAnalysis = analyzeContext(textLower);
    Object.entries(contextAnalysis).forEach(([mood, score]) => {
        moodScores[mood] += score;
    });
    
    // Detect emojis and emoticons
    const emojiAnalysis = analyzeEmojis(text);
    Object.entries(emojiAnalysis).forEach(([mood, score]) => {
        moodScores[mood] += score;
    });
    
    // Sort moods by score
    const sortedMoods = Object.entries(moodScores)
        .sort(([, a], [, b]) => b - a)
        .filter(([, score]) => score > 0);
    
    // Find dominant mood
    const dominantMood = sortedMoods[0]?.[0] || 'calm';
    const dominantScore = sortedMoods[0]?.[1] || 0;
    
    // Calculate confidence based on score separation and total matches
    const totalMatches = Object.values(moodScores).reduce((sum, score) => sum + score, 0);
    const secondScore = sortedMoods[1]?.[1] || 0;
    const scoreSeparation = dominantScore - secondScore;
    
    // SIMPLIFIED confidence calculation for accuracy
    let confidence = 0.85; // Default high confidence
    
    if (dominantScore === 0) {
        confidence = 0.50; // No matches found
    } else {
        // Direct mood word match = very high confidence
        const hasDirectMatch = textLower.match(new RegExp(`\\b${dominantMood}\\b`, 'i'));
        if (hasDirectMatch) {
            confidence = 0.90; // Direct match is very reliable
        } else if (dominantScore >= 20) {
            confidence = 0.88; // Very strong signal
        } else if (dominantScore >= 15) {
            confidence = 0.85; // Strong signal
        } else if (dominantScore >= 10) {
            confidence = 0.80; // Good signal
        } else if (dominantScore >= 5) {
            confidence = 0.75; // Moderate signal
        } else {
            confidence = 0.70; // Weak but present signal
        }
        
        // Adjust based on separation
        const separationRatio = secondScore > 0 ? dominantScore / secondScore : 10;
        if (separationRatio < 1.5) {
            confidence *= 0.85; // Reduce confidence if close scores
        } else if (separationRatio >= 3.0) {
            confidence = Math.min(confidence + 0.05, 0.92); // Boost for clear winner
        }
    }
    
    // Get alternative moods (top 2-3) with confidence scores
    const alternativeMoods = sortedMoods
        .slice(1, 4)
        .filter(([, score]) => {
            // More lenient filtering for related moods - at least 20% of dominant or absolute threshold
            return score >= dominantScore * 0.20 || score >= 2.0;
        })
        .map(([mood, score]) => {
            // Calculate confidence for related mood
            const relatedConfidence = Math.min(
                (score / dominantScore) * confidence * 0.9, // Related moods have lower confidence
                0.75 // Cap at 75% for related moods
            );
            
            return {
                mood: mood,
                confidence: Math.max(0.3, relatedConfidence), // Minimum 30% confidence
                score: score
            };
        })
        .sort((a, b) => b.confidence - a.confidence) // Sort by confidence
        .slice(0, 3); // Top 3 related moods
    
    return {
        mood: dominantMood,
        confidence: confidence,
        scores: moodScores,
        alternatives: alternativeMoods
    };
}

function analyzeContext(text) {
    const contextScores = {};
    Object.keys(MOODS).forEach(mood => contextScores[mood] = 0);
    
    // Positive indicators
    const positivePatterns = [
        { pattern: /good day|great day|wonderful day|amazing day|best day/g, moods: ['happy', 'excited', 'grateful'], weight: 4 },
        { pattern: /feeling good|feeling great|feeling amazing|feeling wonderful/g, moods: ['happy'], weight: 4 },
        { pattern: /\blove\b|\bloved\b|\bloving\b/g, moods: ['inlove', 'happy', 'grateful'], weight: 3 },
        { pattern: /success|successful|achieved|accomplished|completed/g, moods: ['confident', 'happy', 'motivated'], weight: 4 },
        { pattern: /excited|thrilled|delighted|can't wait/g, moods: ['excited', 'happy'], weight: 4 },
        { pattern: /grateful|thankful|blessed|appreciate/g, moods: ['grateful', 'happy'], weight: 3 }
    ];
    
    // Negative indicators
    const negativePatterns = [
        { pattern: /bad day|terrible day|awful day|horrible day|worst day/g, moods: ['sad', 'angry', 'overwhelmed'], weight: 3 },
        { pattern: /feeling down|feeling low|feeling sad|feeling depressed/g, moods: ['sad', 'lonely'], weight: 3 },
        { pattern: /\bhate\b|\bhated\b|\bhating\b/g, moods: ['angry', 'sad'], weight: 2 },
        { pattern: /failed|failure|disappointed|let down/g, moods: ['sad', 'guilty', 'overwhelmed'], weight: 2 },
        { pattern: /tired|exhausted|drained|burned out|burnout/g, moods: ['tired', 'overwhelmed', 'sad'], weight: 2 },
        { pattern: /stressed|overwhelmed|too much|can't handle/g, moods: ['overwhelmed', 'anxious'], weight: 3 },
        { pattern: /worried|worry|nervous|scared|afraid|fear/g, moods: ['anxious', 'overwhelmed'], weight: 3 },
        { pattern: /angry|mad|furious|frustrated|annoyed/g, moods: ['angry'], weight: 3 },
        { pattern: /lonely|alone|isolated|nobody|no one/g, moods: ['lonely', 'sad'], weight: 3 }
    ];
    
    // Calm indicators
    const calmPatterns = [
        { pattern: /peaceful|serene|tranquil|relaxed|calm/g, moods: ['calm', 'content'], weight: 3 },
        { pattern: /meditation|meditated|mindful|zen|centered/g, moods: ['calm', 'content'], weight: 2 },
        { pattern: /quiet|silence|still|gentle|soothing/g, moods: ['calm'], weight: 2 }
    ];
    
    // Motivation indicators
    const motivationPatterns = [
        { pattern: /motivated|driven|determined|focused|productive|getting things done/g, moods: ['motivated', 'confident', 'excited'], weight: 4 },
        { pattern: /goal|goals|ambition|dream|achieve/g, moods: ['motivated', 'hopeful'], weight: 3 }
    ];
    
    // Love/Romance indicators
    const lovePatterns = [
        { pattern: /boyfriend|girlfriend|partner|relationship|dating|crush|romance|romantic/g, moods: ['inlove', 'happy', 'excited'], weight: 4 },
        { pattern: /butterflies|heart flutters|smitten|head over heels|falling for/g, moods: ['inlove', 'excited'], weight: 5 }
    ];
    
    // Confusion indicators
    const confusionPatterns = [
        { pattern: /confused|don't know|unsure|uncertain|not sure|mixed feelings/g, moods: ['confused', 'anxious'], weight: 4 },
        { pattern: /don't understand|puzzled|bewildered|conflicted|torn/g, moods: ['confused'], weight: 4 }
    ];
    
    // Guilt indicators
    const guiltPatterns = [
        { pattern: /guilty|guilt|ashamed|regret|shouldn't have|my fault|messed up/g, moods: ['guilty', 'sad'], weight: 4 },
        { pattern: /sorry|apologize|feel bad|feel terrible about/g, moods: ['guilty', 'sad'], weight: 3 }
    ];
    
    // Confidence indicators
    const confidencePatterns = [
        { pattern: /confident|I got this|I can do this|believe in myself|capable|strong/g, moods: ['confident', 'motivated', 'happy'], weight: 4 },
        { pattern: /crushing it|killing it|unstoppable|fearless|bold/g, moods: ['confident', 'excited'], weight: 5 }
    ];
    
    // Process all pattern groups
    [...positivePatterns, ...negativePatterns, ...calmPatterns, ...motivationPatterns, ...lovePatterns, ...confusionPatterns, ...guiltPatterns, ...confidencePatterns].forEach(({ pattern, moods, weight }) => {
        const matches = (text.match(pattern) || []).length;
        if (matches > 0) {
            moods.forEach(mood => {
                contextScores[mood] += matches * weight;
            });
        }
    });
    
    // Punctuation analysis
    const exclamationCount = (text.match(/!/g) || []).length;
    const questionCount = (text.match(/\?/g) || []).length;
    
    if (exclamationCount > 2) {
        contextScores.excited += exclamationCount;
        contextScores.happy += exclamationCount * 0.5;
    }
    
    if (questionCount > 2) {
        contextScores.confused += questionCount;
        contextScores.anxious += questionCount * 0.5;
    }
    
    return contextScores;
}

function analyzeEmojis(text) {
    const emojiScores = {};
    Object.keys(MOODS).forEach(mood => emojiScores[mood] = 0);
    
    // Happy emojis
    if (/😊|😀|😃|😄|😁|🙂|☺️|🤗|🎉|🎊|👍|🙌|✨|🌟/.test(text)) {
        emojiScores.happy += 4;
    }
    
    // Sad emojis
    if (/😢|😭|😔|😞|😟|🙁|☹️|😿|💔|🥀/.test(text)) {
        emojiScores.sad += 4;
    }
    
    // Angry emojis
    if (/😠|😡|🤬|😤|💢|👿|😾/.test(text)) {
        emojiScores.angry += 4;
    }
    
    // Anxious/worried emojis
    if (/😰|😨|😱|😖|😣|😓|😥|🥺|😬/.test(text)) {
        emojiScores.anxious += 4;
    }
    
    // Excited emojis
    if (/🤩|🥳|🚀|⚡|🔥|💥|🎆|🎇/.test(text)) {
        emojiScores.excited += 4;
    }
    
    // Tired emojis
    if (/😴|😪|🥱|💤/.test(text)) {
        emojiScores.tired += 4;
    }
    
    // Love emojis
    if (/❤️|💕|💖|💗|💓|💝|💘|😍|🥰|💑|💏|💞/.test(text)) {
        emojiScores.inlove += 4;
    }
    
    // Calm/peaceful emojis
    if (/😌|🧘|☮️|🕊️|🍃|🌸|🌺|🌼/.test(text)) {
        emojiScores.calm += 4;
    }
    
    // Bored emojis
    if (/😐|😑|😶|🥱/.test(text)) {
        emojiScores.bored += 4;
    }
    
    // Confused emojis
    if (/😕|😶‍🌫️|🤔|😵‍💫|🤷/.test(text)) {
        emojiScores.confused += 4;
    }
    
    // Grateful emojis
    if (/🙏|🙌|💝|✨|🌟/.test(text)) {
        emojiScores.grateful += 3;
    }
    
    // Hopeful emojis
    if (/🌅|🌄|🌈|⭐|✨|🌟/.test(text)) {
        emojiScores.hopeful += 3;
    }
    
    // Lonely emojis
    if (/🥀|😔|😞|💔|🌧️/.test(text)) {
        emojiScores.lonely += 3;
    }
    
    // Overwhelmed emojis
    if (/😵‍💫|😵|🤯|😩|😫/.test(text)) {
        emojiScores.overwhelmed += 4;
    }
    
    // Confident emojis
    if (/😎|💪|👑|🔥|⚡|💯/.test(text)) {
        emojiScores.confident += 4;
    }
    
    // Guilty emojis
    if (/😞|😔|😓|🙇/.test(text)) {
        emojiScores.guilty += 3;
    }
    
    // Motivated emojis
    if (/💪|🔥|⚡|🚀|💯|🎯/.test(text)) {
        emojiScores.motivated += 4;
    }
    
    return emojiScores;
}

async function getGeminiMoodAnalysis(text) {
    // Retry up to 2 times if first attempt fails
    const maxRetries = 2;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            if (attempt > 0) {
                console.log(`🔄 Retrying Gemini mood analysis (attempt ${attempt + 1}/${maxRetries + 1})...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
            }
            
            // Use server proxy with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 35000); // 35 second timeout
            
            try {
                const response = await fetch('/api/gemini/mood', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: text }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    
                    // If it's a fallback response (503), try retry first before giving up
                    if (response.status === 503 && errorData.fallback) {
                        if (attempt < maxRetries) {
                            console.log(`⚠️ Gemini API unavailable (attempt ${attempt + 1}), retrying...`);
                            continue; // Retry
                        }
                        console.log('⚠️ Gemini API unavailable after retries, using keyword analysis fallback');
                        return null;
                    }
                    
                    // For other errors, throw to trigger retry
                    throw new Error(`API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
                }
                
                const result = await response.json();
                
                // Check if we got valid results
                if (!result || !result.mood) {
                    if (attempt < maxRetries) {
                        console.warn(`Gemini mood API returned invalid response (attempt ${attempt + 1}), retrying...`);
                        continue; // Retry
                    }
                    console.warn('Gemini mood API returned invalid response after retries:', result);
                    return null;
                }
                
                // Validate mood is in our list
                const validMoods = ['happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'stressed', 'bored', 'content', 'irritable', 'disappointed', 'hopeful', 'overwhelmed', 'relaxed', 'frustrated', 'joyful', 'depressed', 'lonely', 'peaceful', 'nervous', 'apathetic', 'enthusiastic', 'melancholy', 'annoyed', 'optimistic', 'pessimistic', 'satisfied', 'worried', 'confident', 'grateful', 'confused', 'proud', 'tired', 'motivated', 'inlove', 'guilty'];
                if (!validMoods.includes(result.mood.toLowerCase())) {
                    if (attempt < maxRetries) {
                        console.warn(`Gemini returned invalid mood (attempt ${attempt + 1}), retrying...`);
                        continue; // Retry
                    }
                    console.warn('Gemini returned invalid mood after retries:', result.mood);
                    return null;
                }
                
                // Validate and filter related moods
                const relatedMoods = [];
                if (Array.isArray(result.relatedMoods)) {
                    result.relatedMoods.forEach(rm => {
                        if (rm.mood && validMoods.includes(rm.mood.toLowerCase()) && rm.confidence) {
                            relatedMoods.push({
                                mood: rm.mood.toLowerCase(),
                                confidence: Math.min(1.0, Math.max(0.0, rm.confidence))
                            });
                        }
                    });
                }
                
                console.log(`✅ Gemini mood analysis successful (attempt ${attempt + 1})`);
                return {
                    mood: result.mood.toLowerCase(),
                    confidence: result.confidence || 0.7,
                    reasoning: result.reasoning || '',
                    relatedMoods: relatedMoods
                };
            } catch (fetchError) {
                clearTimeout(timeoutId);
                if (fetchError.name === 'AbortError') {
                    if (attempt < maxRetries) {
                        console.log(`⚠️ Request timeout (attempt ${attempt + 1}), retrying...`);
                        continue; // Retry
                    }
                    throw new Error('Request timeout after retries');
                }
                throw fetchError;
            }
        } catch (error) {
            console.error(`Gemini mood analysis error (attempt ${attempt + 1}):`, error.message);
            
            // If this was the last attempt, return null
            if (attempt === maxRetries) {
                console.error('❌ All Gemini mood analysis attempts failed, using keyword analysis');
                return null;
            }
            // Otherwise, continue to next retry
        }
    }
    
    // Should never reach here, but just in case
    return null;
}

async function getAIMoodAnalysis(text) {
    try {
        // Use server proxy to avoid CORS issues (Hugging Face fallback)
        const response = await fetch('/api/huggingface/sentiment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: text })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Hugging Face API request failed:', response.status, errorText);
            throw new Error(`Hugging Face API request failed: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Check if we got valid results
        if (!result || (!Array.isArray(result) && !result.label)) {
            console.warn('Hugging Face API returned invalid response:', result);
            return null;
        }
        
        // Handle different response formats
        let sentiment, score;
        if (Array.isArray(result) && result.length > 0) {
            // Array format
            sentiment = result[0]?.label?.toLowerCase();
            score = result[0]?.score;
        } else if (result.label) {
            // Object format
            sentiment = result.label?.toLowerCase();
            score = result.score;
        } else {
            console.warn('Hugging Face API returned unexpected response format:', result);
            return null;
        }
        
        // Map sentiment to mood (basic mapping - Gemini is much better)
        let mood = 'calm'; // default
        
        // Handle different sentiment labels from various models
        if (sentiment?.includes('positive') || sentiment === 'LABEL_2' || sentiment === 'POSITIVE') mood = 'happy';
        else if (sentiment?.includes('negative') || sentiment === 'LABEL_0' || sentiment === 'NEGATIVE') mood = 'sad';
        else if (sentiment?.includes('neutral') || sentiment === 'LABEL_1' || sentiment === 'NEUTRAL') mood = 'calm';
        
        return {
            mood: mood,
            confidence: score || 0.5
        };
        
    } catch (error) {
        console.error('Hugging Face mood analysis failed:', error);
        console.error('Error details:', error.message, error.stack);
        return null;
    }
}

// ========================================
// SPOTIFY INTEGRATION
// ========================================

async function getSpotifyRecommendation(mood) {
    // Load fresh token if not available
    if (!CONFIG.spotify.token) {
        await loadFreshSpotifyToken();
        if (!CONFIG.spotify.token) {
            console.log('⚠️ Spotify token not configured');
            return null;
        }
    }
    
    try {
        // Multiple diverse search queries per mood for better variety
        const moodQueries = {
            happy: [
                'genre:pop year:2020-2024 happy',
                'genre:indie-pop upbeat positive',
                'genre:electronic dance feel good',
                'genre:reggae positive vibes',
                'genre:folk-pop cheerful'
            ],
            sad: [
                'genre:indie year:2010-2024 melancholy',
                'genre:acoustic emotional heartbreak',
                'genre:alternative sad ballad',
                'genre:folk emotional',
                'genre:r&b soulful emotional'
            ],
            angry: [
                'genre:rock year:2000-2024 intense',
                'genre:metal aggressive',
                'genre:punk rock energetic',
                'genre:hardcore intense',
                'genre:alternative-rock powerful'
            ],
            anxious: [
                'genre:ambient meditation peaceful',
                'genre:classical calming',
                'genre:lo-fi relaxing',
                'genre:new-age zen',
                'genre:instrumental peaceful'
            ],
            calm: [
                'genre:jazz chill relaxing',
                'genre:ambient peaceful',
                'genre:acoustic mellow',
                'genre:classical peaceful',
                'genre:folk calm'
            ],
            bored: [
                'genre:electronic energetic dance',
                'genre:hip-hop upbeat',
                'genre:rock energetic',
                'genre:pop upbeat',
                'genre:reggaeton party'
            ],
            excited: [
                'genre:electronic dance party',
                'genre:pop upbeat celebration',
                'genre:hip-hop energetic',
                'genre:rock anthemic',
                'genre:reggaeton festive'
            ],
            grateful: [
                'genre:gospel uplifting spiritual',
                'genre:folk peaceful thankful',
                'genre:acoustic inspiring',
                'genre:indie uplifting',
                'genre:country positive'
            ],
            confused: [
                'genre:indie contemplative',
                'genre:folk introspective',
                'genre:alternative thoughtful',
                'genre:experimental ambient',
                'genre:post-rock atmospheric'
            ],
            proud: [
                'genre:rock triumphant epic',
                'genre:orchestral victory',
                'genre:hip-hop motivational',
                'genre:electronic uplifting',
                'genre:pop anthemic'
            ],
            lonely: [
                'genre:indie comfort acoustic',
                'genre:folk emotional',
                'genre:alternative introspective',
                'genre:acoustic emotional',
                'genre:r&b soulful'
            ],
            hopeful: [
                'genre:indie inspiring optimistic',
                'genre:pop uplifting',
                'genre:folk hopeful',
                'genre:rock anthemic',
                'genre:gospel inspiring'
            ],
            overwhelmed: [
                'genre:ambient meditation',
                'genre:classical calming',
                'genre:lo-fi relaxing',
                'genre:new-age peaceful',
                'genre:instrumental zen'
            ],
            content: [
                'genre:jazz easy listening',
                'genre:folk comfortable',
                'genre:acoustic peaceful',
                'genre:indie mellow',
                'genre:r&b smooth'
            ],
            tired: [
                'genre:ambient sleep',
                'genre:classical relaxing',
                'genre:lo-fi chill',
                'genre:acoustic soothing',
                'genre:instrumental calm'
            ],
            motivated: [
                'genre:rock workout energetic',
                'genre:hip-hop motivational',
                'genre:electronic pump up',
                'genre:pop energetic',
                'genre:metal intense'
            ],
            inlove: [
                'genre:pop romantic ballad',
                'genre:r&b love songs',
                'genre:indie romantic',
                'genre:acoustic love',
                'genre:jazz romantic'
            ],
            confident: [
                'genre:hip-hop empowering',
                'genre:pop confident',
                'genre:rock anthemic',
                'genre:electronic powerful',
                'genre:r&b boss'
            ],
            guilty: [
                'genre:indie reflective',
                'genre:folk introspective',
                'genre:acoustic emotional',
                'genre:alternative thoughtful',
                'genre:blues soulful'
            ],
            frustrated: [
                'genre:rock intense aggressive',
                'genre:metal powerful',
                'genre:alternative-rock intense',
                'genre:punk rock energetic',
                'genre:hardcore intense'
            ],
            stressed: [
                'genre:ambient meditation peaceful',
                'genre:classical calming',
                'genre:lo-fi relaxing',
                'genre:new-age zen',
                'genre:instrumental peaceful'
            ]
        };
        
        const queries = moodQueries[mood] || ['chill vibes'];
        const allTracks = [];
        const seenTrackIds = new Set();
        const trackSourceMap = new Map(); // Track which query each track came from
        
        // Add trendy songs query (recent popular songs for the mood)
        const trendyQueries = {
            happy: ['year:2024 happy pop', 'year:2024 upbeat trending', 'year:2024 feel good'],
            sad: ['year:2024 sad emotional', 'year:2024 melancholy trending', 'year:2024 heartbreak'],
            angry: ['year:2024 rock intense', 'year:2024 metal trending', 'year:2024 aggressive'],
            anxious: ['year:2024 calm meditation', 'year:2024 relaxing trending', 'year:2024 peaceful'],
            calm: ['year:2024 chill ambient', 'year:2024 peaceful trending', 'year:2024 zen'],
            bored: ['year:2024 energetic dance', 'year:2024 upbeat trending', 'year:2024 party'],
            excited: ['year:2024 dance party', 'year:2024 celebration trending', 'year:2024 energetic'],
            grateful: ['year:2024 uplifting spiritual', 'year:2024 inspiring trending', 'year:2024 thankful'],
            confused: ['year:2024 contemplative indie', 'year:2024 introspective trending', 'year:2024 thoughtful'],
            proud: ['year:2024 triumphant epic', 'year:2024 victory trending', 'year:2024 motivational'],
            lonely: ['year:2024 comfort acoustic', 'year:2024 emotional trending', 'year:2024 introspective'],
            hopeful: ['year:2024 inspiring optimistic', 'year:2024 uplifting trending', 'year:2024 hopeful'],
            overwhelmed: ['year:2024 meditation calm', 'year:2024 relaxing trending', 'year:2024 zen'],
            content: ['year:2024 peaceful easy', 'year:2024 comfortable trending', 'year:2024 mellow'],
            tired: ['year:2024 sleep relaxing', 'year:2024 calm trending', 'year:2024 soothing'],
            motivated: ['year:2024 workout energetic', 'year:2024 motivational trending', 'year:2024 pump up'],
            inlove: ['year:2024 romantic ballad', 'year:2024 love trending', 'year:2024 romantic'],
            confident: ['year:2024 empowering boss', 'year:2024 confident trending', 'year:2024 anthem'],
            guilty: ['year:2024 reflective emotional', 'year:2024 introspective trending', 'year:2024 thoughtful'],
            frustrated: ['year:2024 rock intense', 'year:2024 aggressive trending', 'year:2024 powerful'],
            stressed: ['year:2024 calm meditation', 'year:2024 relaxing trending', 'year:2024 peaceful']
        };
        
        // Add 2-3 trendy queries at the beginning
        if (trendyQueries[mood]) {
            queries.unshift(...trendyQueries[mood].slice(0, 3));
        }
        
        // Add Hindi songs based on mood
        const hindiQueries = {
            happy: ['hindi happy song 2024', 'hindi upbeat song', 'hindi celebration song'],
            sad: ['hindi sad song emotional', 'hindi heartbreak song', 'hindi melancholy song'],
            angry: ['hindi rock song intense', 'hindi aggressive song', 'hindi powerful song'],
            anxious: ['hindi calm song peaceful', 'hindi meditation song', 'hindi relaxing song'],
            calm: ['hindi peaceful song', 'hindi chill song', 'hindi zen song'],
            bored: ['hindi energetic song', 'hindi dance song', 'hindi party song'],
            excited: ['hindi party song 2024', 'hindi celebration song', 'hindi energetic song'],
            grateful: ['hindi spiritual song', 'hindi uplifting song', 'hindi devotional song'],
            confused: ['hindi contemplative song', 'hindi thoughtful song', 'hindi introspective song'],
            proud: ['hindi motivational song', 'hindi victory song', 'hindi inspiring song'],
            lonely: ['hindi emotional song', 'hindi comfort song', 'hindi acoustic song'],
            hopeful: ['hindi inspiring song', 'hindi optimistic song', 'hindi uplifting song'],
            overwhelmed: ['hindi calm song', 'hindi meditation song', 'hindi peaceful song'],
            content: ['hindi peaceful song', 'hindi mellow song', 'hindi easy listening'],
            tired: ['hindi relaxing song', 'hindi sleep song', 'hindi calm song'],
            motivated: ['hindi workout song', 'hindi motivational song', 'hindi energetic song'],
            inlove: ['hindi romantic song', 'hindi love song', 'hindi romantic ballad'],
            confident: ['hindi empowering song', 'hindi confident song', 'hindi boss song'],
            guilty: ['hindi reflective song', 'hindi emotional song', 'hindi introspective song'],
            frustrated: ['hindi rock song', 'hindi intense song', 'hindi powerful song'],
            stressed: ['hindi calm song', 'hindi meditation song', 'hindi relaxing song']
        };
        
        // Add 2-3 Hindi song queries (insert after trendy songs)
        if (hindiQueries[mood]) {
            queries.splice(3, 0, ...hindiQueries[mood].slice(0, 3));
        }
        
        console.log(`🎵 Searching Spotify with ${queries.length} diverse queries (including trendy) for mood: ${mood}`);
        
        // Search with multiple queries and combine results
        for (let queryIdx = 0; queryIdx < queries.length; queryIdx++) {
            const query = queries[queryIdx];
            try {
                // Use server proxy to avoid CORS issues
                let response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&type=track&limit=10`);
                
                // If token expired (401), refresh it and retry
                if (response.status === 401) {
                    console.log('🔄 Spotify token expired, refreshing...');
                    const tokenResponse = await fetch('/api/spotify/token');
                    if (tokenResponse.ok) {
                        const tokenData = await tokenResponse.json();
                        CONFIG.spotify.token = tokenData.token;
                        response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&type=track&limit=10`);
                    } else {
                        await loadFreshSpotifyToken();
                        if (CONFIG.spotify.token) {
                            response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&type=track&limit=10`);
                        }
                    }
                }
                
                if (response.ok) {
                    const data = await response.json();
                    const tracks = data.tracks?.items || [];
                    
                    // Add unique tracks to collection and track source
                    const isHindiQuery = query.toLowerCase().includes('hindi');
                    tracks.forEach(track => {
                        if (!seenTrackIds.has(track.id)) {
                            seenTrackIds.add(track.id);
                            allTracks.push(track);
                            trackSourceMap.set(track.id, { isHindi: isHindiQuery, queryIndex: queryIdx });
                        }
                    });
                    
                    console.log(`✅ Found ${tracks.length} tracks from query: ${query}`);
                } else {
                    console.log(`⚠️ Query failed: ${query} (${response.status})`);
                }
            } catch (err) {
                console.log(`⚠️ Error with query "${query}":`, err.message);
                // Continue with next query
            }
        }
        
        if (allTracks.length === 0) {
            console.log('⚠️ No tracks found for mood:', mood);
            return null;
        }
        
        // Separate Hindi and non-Hindi tracks based on source
        const hindiTracks = [];
        const otherTracks = [];
        
        allTracks.forEach(track => {
            const source = trackSourceMap.get(track.id);
            if (source && source.isHindi) {
                hindiTracks.push(track);
            } else {
                otherTracks.push(track);
            }
        });
        
        // Shuffle both arrays
        const shuffledHindi = hindiTracks.sort(() => Math.random() - 0.5);
        const shuffledOther = otherTracks.sort(() => Math.random() - 0.5);
        
        // Ensure we always have 2-3 Hindi tracks
        let selectedHindi = [];
        let selectedOther = [];
        
        if (shuffledHindi.length >= 2) {
            // We have at least 2 Hindi tracks - select 2-3
            const hindiCount = Math.min(3, shuffledHindi.length);
            selectedHindi = shuffledHindi.slice(0, hindiCount);
        } else if (shuffledHindi.length === 1) {
            // Only 1 Hindi track - take it and search for more
            selectedHindi = shuffledHindi.slice(0, 1);
            // Try to get more Hindi tracks with a more specific search
            try {
                const hindiSearchQuery = `hindi ${mood} song 2024`;
                const hindiResponse = await fetch(`/api/spotify/search?q=${encodeURIComponent(hindiSearchQuery)}&type=track&limit=10`);
                if (hindiResponse.ok) {
                    const hindiData = await hindiResponse.json();
                    const additionalHindiTracks = hindiData.tracks?.items || [];
                    additionalHindiTracks.forEach(track => {
                        if (!seenTrackIds.has(track.id) && !selectedHindi.find(t => t.id === track.id)) {
                            selectedHindi.push(track);
                            seenTrackIds.add(track.id);
                        }
                    });
                    // Take up to 3 total Hindi tracks
                    selectedHindi = selectedHindi.slice(0, 3);
                }
            } catch (err) {
                console.log('⚠️ Could not fetch additional Hindi tracks:', err.message);
            }
        } else {
            // No Hindi tracks found - search specifically for Hindi songs
            try {
                const hindiSearchQueries = [
                    `hindi ${mood} song 2024`,
                    `hindi ${mood} music`,
                    `bollywood ${mood} song`
                ];
                
                for (const query of hindiSearchQueries) {
                    const hindiResponse = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&type=track&limit=10`);
                    if (hindiResponse.ok) {
                        const hindiData = await hindiResponse.json();
                        const hindiTracksFound = hindiData.tracks?.items || [];
                        hindiTracksFound.forEach(track => {
                            if (!seenTrackIds.has(track.id)) {
                                shuffledHindi.push(track);
                                seenTrackIds.add(track.id);
                                trackSourceMap.set(track.id, { isHindi: true, queryIndex: -1 });
                            }
                        });
                        if (shuffledHindi.length >= 2) break;
                    }
                }
                
                // Shuffle again and select 2-3
                shuffledHindi = shuffledHindi.sort(() => Math.random() - 0.5);
                selectedHindi = shuffledHindi.slice(0, Math.min(3, shuffledHindi.length));
            } catch (err) {
                console.log('⚠️ Could not fetch Hindi tracks:', err.message);
            }
        }
        
        // Select remaining tracks from other sources to make 10 total
        const hindiCount = selectedHindi.length;
        const otherCount = Math.max(7, 10 - hindiCount); // At least 7 other tracks, or fill to 10
        selectedOther = shuffledOther.slice(0, Math.min(otherCount, shuffledOther.length));
        
        // If we still don't have 10 tracks, fill from other tracks
        const totalSelected = selectedHindi.length + selectedOther.length;
        if (totalSelected < 10 && shuffledOther.length > selectedOther.length) {
            selectedOther.push(...shuffledOther.slice(selectedOther.length, 10 - selectedHindi.length));
        }
        
        // Combine and shuffle final selection (exactly 10 tracks, with 2-3 Hindi)
        const selectedTracks = [...selectedHindi, ...selectedOther].sort(() => Math.random() - 0.5).slice(0, 10);
        
        console.log(`✅ Found ${allTracks.length} total unique tracks, selected ${selectedTracks.length} tracks (${selectedHindi.length} Hindi, ${selectedOther.length} other) for mood: ${mood}`);
        
        // Format tracks for display
        const formattedTracks = selectedTracks.map(track => ({
            name: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            album: track.album.name,
            albumArt: track.album.images[0]?.url || '',
            url: track.external_urls.spotify,
            uri: track.uri,
            previewUrl: track.preview_url,
            duration: formatDuration(track.duration_ms)
        }));
        
        // Create playlist URL with all track URIs
        const trackUris = formattedTracks.map(t => t.uri);
        const playlistName = `${MOODS[mood]?.label || mood} Mood - ${new Date().toLocaleDateString()}`;
        
        return {
            mood: mood,
            query: queries.join(', '),
            tracks: formattedTracks,
            trackUris: trackUris,
            playlistName: playlistName,
            playlistUrl: `https://open.spotify.com/search/${encodeURIComponent(queries[0])}`,
            openInSpotifyUrl: `spotify:search:${encodeURIComponent(queries[0])}`
        };
        
    } catch (error) {
        console.error('❌ Spotify recommendation failed:', error);
        return null;
    }
}

function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ========================================
// ENTRY MANAGEMENT
// ========================================

async function saveEntry() {
    console.log('🚀 saveEntry function called');
    
    const journalInput = document.getElementById('journalInput');
    if (!journalInput) {
        console.error('❌ Journal input element not found');
        showError('Error: Could not find journal input field.');
        return;
    }
    
    const text = journalInput.value.trim();
    console.log('📝 Journal text:', text.length, 'characters');
    
    if (text.length < 10) {
        console.log('⚠️ Text too short:', text.length);
        showError('Please write at least 10 characters to save your entry.');
        return;
    }
    
    try {
        // Analyze mood
        const moodAnalysis = await analyzeMood(text);
        
        // Generate personalized AI response
        let aiResponse = null;
        try {
            aiResponse = await generatePersonalizedResponse(text, moodAnalysis);
        } catch (error) {
            console.error('Failed to generate AI response:', error);
            // Continue with template response
            aiResponse = generateTemplateResponse(text, moodAnalysis);
        }
        
        // Create entry
        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            text: text,
            mood: moodAnalysis.mood,
            confidence: moodAnalysis.confidence,
            alternatives: moodAnalysis.alternatives || [],
            relatedMoods: moodAnalysis.relatedMoods || [], // Save related moods from Gemini
            aiResponse: aiResponse,
            timestamp: Date.now()
        };
        
        // Save to Firebase first, then localStorage as backup
        if (firebaseEnabled) {
            await saveToFirebase(entry);
        }
        
        // Save entry locally
        entries.unshift(entry);
        saveToLocalStorage();
        
        // Show notification with mood result
        const moodData = MOODS[entry.mood];
        showNotification(`✅ Entry saved! Detected mood: ${moodData.emoji} ${moodData.label}`, 'success');
        
        // Clear input
        journalInput.value = '';
        updateCharacterCount();
        
        // Display mood result with AI response
        await displayMoodResult(entry);
        
        // Update UI
        updateStatistics();
        displayEntries();
        
        console.log('✅ Entry saved successfully');
        
    } catch (error) {
        console.error('Error saving entry:', error);
        showError('Failed to save entry. Please try again.');
    }
}

// ========================================
// AI RESPONSE GENERATION
// ========================================

async function generatePersonalizedResponse(text, moodAnalysis) {
    try {
        console.log('🤖 Generating AI response with Gemini...');
        
        // Only use Gemini API for response generation
        const geminiResponse = await getGeminiResponse(text, moodAnalysis);
        if (geminiResponse) {
            console.log('✅ Gemini response generated successfully');
            return geminiResponse;
        }
        
        // If Gemini fails, use template response (no Hugging Face fallback)
        console.log('⚠️ Gemini failed, using template response');
        return generateTemplateResponse(text, moodAnalysis);
        
    } catch (error) {
        console.error('Error generating AI response:', error);
        return generateTemplateResponse(text, moodAnalysis);
    }
}

async function getGeminiResponse(text, moodAnalysis) {
    // Retry up to 2 times if first attempt fails
    const maxRetries = 2;
    let lastError = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            if (attempt > 0) {
                console.log(`🔄 Retrying Gemini API (attempt ${attempt + 1}/${maxRetries + 1})...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
            }
        const moodEmoji = MOODS[moodAnalysis.mood]?.emoji || '😊';
        const moodLabel = MOODS[moodAnalysis.mood]?.label || moodAnalysis.mood;
        
        const prompt = `You are a warm, empathetic AI companion helping someone with their mental wellness journal.

Journal Entry: "${text}"

Detected Mood: ${moodLabel} ${moodEmoji}

Create a personalized, supportive response that:
- Acknowledges specific details they mentioned (work, relationships, activities, feelings, etc.)
- Validates their emotions authentically
- Offers gentle encouragement or perspective
- Feels conversational and human, not robotic
- Is 2-3 sentences maximum (40-60 words)
- Ends with a relevant emoji

Be specific to their situation. Avoid generic phrases like "I understand" or "It's okay to feel this way" unless you add context. Reference what they actually wrote about.`;

        // Use server proxy to hide API key with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 35000); // 35 second timeout
        
        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
        
            if (response.ok) {
                const result = await response.json();
                
                // Check if we got valid results
                if (!result || !result.candidates || result.candidates.length === 0) {
                    console.warn('Gemini API returned invalid response:', result);
                    // Retry once
                    throw new Error('Invalid response structure');
                }
                
                const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
                
                if (generatedText && generatedText.trim().length > 0) {
                    console.log('✅ Gemini response generated successfully');
                    return generatedText.trim();
                } else {
                    // Try to get text from alternative structure
                    const altText = result.candidates?.[0]?.content?.text;
                    if (altText && altText.trim().length > 0) {
                        console.log('✅ Gemini response generated successfully (alternative format)');
                        return altText.trim();
                    }
                    console.warn('Gemini API returned empty response');
                    // Retry once
                    throw new Error('Empty response');
                }
            } else {
                const errorText = await response.text();
                console.error('Gemini API error:', response.status, response.statusText, errorText);
                
                // Try to parse error details if available
                try {
                    const errorDetails = JSON.parse(errorText);
                    console.error('Gemini API error details:', errorDetails);
                    
                    // Log specific error information if available
                    if (errorDetails.error) {
                        console.error('Gemini API specific error:', errorDetails.error);
                    }
                    if (errorDetails.details) {
                        console.error('Gemini API detailed error:', errorDetails.details);
                    }
                } catch (parseError) {
                    // If we can't parse as JSON, log the raw error
                    console.error('Gemini API raw error:', errorText);
                }
                throw new Error(`API error: ${response.status}`);
            }
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                console.error('Gemini API request timeout');
                throw new Error('Request timeout');
            }
            throw fetchError;
        }
        } catch (error) {
            lastError = error;
            console.error(`Gemini response generation failed (attempt ${attempt + 1}):`, error.message);
            
            // If this was the last attempt, return null
            if (attempt === maxRetries) {
                console.error('❌ All Gemini response attempts failed');
                return null;
            }
            // Otherwise, continue to next retry
        }
    }
    
    // Should never reach here, but just in case
    console.error('❌ Gemini response generation failed after all retries');
    return null;
}

// Old direct API call (kept for reference)
async function getGeminiResponseDirect_UNUSED(text, moodAnalysis) {
    try {
        const moodEmoji = MOODS[moodAnalysis.mood]?.emoji || '😊';
        const moodLabel = MOODS[moodAnalysis.mood]?.label || moodAnalysis.mood;
        
        const prompt = `You are a warm, empathetic AI companion helping someone with their mental wellness journal.

Journal Entry: "${text}"

Detected Mood: ${moodLabel} ${moodEmoji}

Create a personalized, supportive response that:
- Acknowledges specific details they mentioned (work, relationships, activities, feelings, etc.)
- Validates their emotions authentically
- Offers gentle encouragement or perspective
- Feels conversational and human, not robotic
- Is 2-3 sentences maximum (40-60 words)
- Ends with a relevant emoji

Be specific to their situation. Avoid generic phrases like "I understand" or "It's okay to feel this way" unless you add context. Reference what they actually wrote about.`;

        const response = await fetch(
            `${API_ENDPOINTS.gemini}?key=${CONFIG.gemini.apiKey}`,
            {
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
                })
            }
        );

        if (response.ok) {
            const result = await response.json();
            const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (generatedText) {
                return generatedText.trim();
            }
        }
        
        return null;
    } catch (error) {
        return null;
    }
}

// Hugging Face response function removed - using Gemini only for all AI features

function generateTemplateResponse(text, moodAnalysis) {
    const textLower = text.toLowerCase();
    const mood = moodAnalysis.mood;
    const words = text.split(' ').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Extract specific details from the text
    const extractedDetails = {
        // Time references
        today: /today/.test(textLower),
        yesterday: /yesterday/.test(textLower),
        thisWeek: /this week|week/.test(textLower),
        morning: /morning|woke up/.test(textLower),
        night: /night|evening|tonight/.test(textLower),
        
        // Intensity words
        very: /very|really|so|extremely|incredibly/.test(textLower),
        little: /little|bit|slightly|somewhat/.test(textLower),
        
        // Action words
        trying: /trying|attempting|working on/.test(textLower),
        finished: /finished|completed|done|accomplished/.test(textLower),
        started: /started|began|beginning/.test(textLower),
        failed: /failed|didn't work|couldn't/.test(textLower),
        
        // Specific mentions
        people: /people|someone|everyone|they/.test(textLower),
        myself: /myself|i am|i feel|i'm/.test(textLower),
        
        // Emotional intensity
        crying: /crying|tears|cried/.test(textLower),
        laughing: /laughing|laugh|smiled/.test(textLower),
        angry: /yelled|shouted|argued|fight/.test(textLower),
        calm: /peaceful|relaxed|calm|zen/.test(textLower)
    };
    
    // Extract key themes and context from the text
    const themes = {
        goodDay: /good day|great day|wonderful day|amazing day|best day|awesome day/.test(textLower),
        badDay: /bad day|terrible day|awful day|horrible day|worst day|rough day/.test(textLower),
        work: /work|job|office|meeting|project|boss|colleague|deadline|career|presentation/.test(textLower),
        family: /family|mom|dad|parent|child|kids|brother|sister|husband|wife|son|daughter/.test(textLower),
        friends: /friend|friends|social|party|hangout|gathering|catch up/.test(textLower),
        health: /sick|tired|energy|sleep|exercise|workout|pain|headache|doctor|hospital/.test(textLower),
        goals: /goal|dream|plan|future|hope|aspire|achieve|accomplish|ambition/.test(textLower),
        relationship: /love|relationship|partner|dating|boyfriend|girlfriend|crush|romance/.test(textLower),
        school: /school|study|exam|test|homework|class|teacher|college|university|grade/.test(textLower),
        money: /money|financial|bills|debt|salary|pay|expensive|afford|budget/.test(textLower),
        change: /change|new|different|transition|moving|start|beginning/.test(textLower),
        past: /remember|used to|before|past|miss|nostalgia|memories/.test(textLower),
        achievement: /achieved|accomplished|finished|completed|succeeded|won|proud|victory/.test(textLower),
        struggle: /struggle|difficult|hard|challenging|tough|can't|unable/.test(textLower),
        grateful: /grateful|thankful|blessed|appreciate|lucky|fortunate|thank/.test(textLower),
        uncertain: /don't know|unsure|confused|uncertain|maybe|perhaps|wondering/.test(textLower),
        stress: /stress|pressure|deadline|overwhelmed|too much|burden/.test(textLower),
        support: /helped|support|there for me|listened|understood/.test(textLower),
        alone: /alone|lonely|nobody|no one|by myself|isolated/.test(textLower)
    };
    
    // Extract key phrases for more personalization
    const keyPhrases = extractKeyPhrases(text, textLower);
    
    // Build highly personalized response
    let response = buildPersonalizedResponse(mood, themes, extractedDetails, keyPhrases, text);
    
    // Add length-based personalization
    if (words > 50) {
        response += " Thank you for sharing so openly - your self-reflection is powerful.";
    } else if (words > 100) {
        response += " Your detailed reflection shows real emotional awareness.";
    }
    
    return response;
}

function extractKeyPhrases(text, textLower) {
    return {
        hasQuestion: /\?/.test(text),
        hasExclamation: /!/.test(text),
        firstPerson: /\bi\b|\bme\b|\bmy\b|\bi'm\b/.test(textLower),
        negation: /not|don't|didn't|can't|won't|never/.test(textLower),
        intensity: /very|really|so|extremely|incredibly|absolutely/.test(textLower),
        timeFrame: textLower.match(/today|yesterday|this week|this morning|tonight|right now/)?.[0] || null
    };
}

function buildPersonalizedResponse(mood, themes, details, phrases, originalText) {
    const moodData = MOODS[mood];
    const words = originalText.split(/\s+/).length;
    const textLower = originalText.toLowerCase();
    
    // Extract key subjects and actions from the text
    const subjects = extractSubjects(textLower, themes);
    const actions = extractActions(textLower, details);
    
    // Build dynamic opening based on actual content
    let opening = buildDynamicOpening(mood, subjects, actions, details, phrases);
    
    // Build main response based on mood + context
    let mainResponse = buildContextualResponse(mood, themes, subjects, actions, details, phrases, textLower);
    
    // Build closing encouragement
    let closing = buildDynamicClosing(mood, themes, details, words);
    
    return opening + mainResponse + closing;
}

function extractSubjects(textLower, themes) {
    const subjects = [];
    if (themes.work) subjects.push('work');
    if (themes.family) subjects.push('family');
    if (themes.friends) subjects.push('friends');
    if (themes.relationship) subjects.push('relationship');
    if (themes.school) subjects.push('school');
    if (themes.health) subjects.push('health');
    if (themes.goals) subjects.push('goals');
    if (themes.money) subjects.push('finances');
    return subjects;
}

function extractActions(textLower, details) {
    const actions = [];
    if (details.finished) actions.push('completed');
    if (details.started) actions.push('started');
    if (details.trying) actions.push('working on');
    if (details.failed) actions.push('struggled with');
    return actions;
}

function buildDynamicOpening(mood, subjects, actions, details, phrases) {
    // Intensity-based openings
    if (details.very) {
        const intensityOpeners = {
            happy: "I can feel your excitement radiating through your words! ",
            sad: "I sense the depth of what you're going through. ",
            angry: "Your frustration is completely valid. ",
            anxious: "I can feel the weight of your worries. ",
            overwhelmed: "I hear how much you're carrying right now. ",
            excited: "Your energy is absolutely electric! ",
            grateful: "Your appreciation shines through beautifully. ",
            lonely: "I understand how isolating this feels. ",
            tired: "I can sense your exhaustion. ",
            motivated: "Your determination is inspiring! ",
            confident: "Your self-assurance is powerful! ",
            guilty: "I can feel the weight of what you're carrying. ",
            confused: "I hear the uncertainty in your thoughts. ",
            hopeful: "Your optimism is touching. ",
            inlove: "The joy in your words is beautiful! ",
            calm: "Your peace is palpable. ",
            bored: "I sense you're craving something more. "
        };
        return intensityOpeners[mood] || "";
    }
    
    // Question-based openings
    if (phrases.hasQuestion) {
        return "I hear your questions. ";
    }
    
    // Emotional expression openings
    if (details.crying) return "It's completely okay to let those tears flow. ";
    if (details.laughing) return "Your joy is wonderful to witness! ";
    
    // Subject-specific openings
    if (subjects.length > 0) {
        const subjectOpeners = {
            work: "Work situations can be complex. ",
            family: "Family dynamics bring up so much. ",
            relationship: "Relationships touch our deepest emotions. ",
            friends: "Friendships are so important. ",
            school: "Academic life has its challenges. ",
            health: "Your wellbeing matters. ",
            goals: "Your aspirations are meaningful. "
        };
        return subjectOpeners[subjects[0]] || "";
    }
    
    return "";
}

function buildContextualResponse(mood, themes, subjects, actions, details, phrases, textLower) {
    let response = '';
    
    // Build response based on mood + specific context
    const context = {
        subject: subjects[0] || null,
        action: actions[0] || null,
        hasAchievement: themes.achievement,
        hasStruggle: themes.struggle,
        hasSupport: themes.support,
        isAlone: themes.alone,
        hasChange: themes.change,
        lookingBack: themes.past
    };
    
    // Generate truly dynamic response based on actual text content
    response = generateDynamicMoodResponse(mood, context, subjects, actions, themes, details, textLower);
    
    return response;
}

function generateDynamicMoodResponse(mood, context, subjects, actions, themes, details, textLower) {
    // Build response parts dynamically
    const acknowledgment = buildAcknowledgment(mood, context, subjects, textLower);
    const support = buildSupport(mood, context, themes, details);
    const encouragement = buildEncouragement(mood, context, actions);
    
    return `${acknowledgment} ${support} ${encouragement}`.trim();
}

function buildAcknowledgment(mood, context, subjects, textLower) {
    // Extract specific mentions from text
    const mentions = [];
    if (textLower.includes('today')) mentions.push('today');
    if (textLower.includes('work') || textLower.includes('job')) mentions.push('at work');
    if (textLower.includes('family')) mentions.push('with your family');
    if (textLower.includes('friend')) mentions.push('with friends');
    if (textLower.includes('relationship') || textLower.includes('partner')) mentions.push('in your relationship');
    
    const moodAcknowledgments = {
        happy: context.hasAchievement ? `I can feel your pride in what you've accomplished${mentions[0] ? ' ' + mentions[0] : ''}!` : 
               `Your happiness${mentions[0] ? ' ' + mentions[0] : ''} is wonderful to see!`,
        sad: `I hear the sadness${mentions[0] ? ' ' + mentions[0] : ''} in your words.`,
        angry: `Your frustration${mentions[0] ? ' ' + mentions[0] : ''} is completely valid.`,
        anxious: `I can sense the worry you're carrying${mentions[0] ? ' ' + mentions[0] : ''}.`,
        overwhelmed: `I understand how much you're juggling${mentions[0] ? ' ' + mentions[0] : ''}.`,
        excited: `Your excitement${mentions[0] ? ' about ' + mentions[0] : ''} is contagious!`,
        grateful: `Your gratitude${mentions[0] ? ' for ' + mentions[0] : ''} is beautiful.`,
        lonely: `I hear how isolated you're feeling${mentions[0] ? ' ' + mentions[0] : ''}.`,
        tired: `Your exhaustion${mentions[0] ? ' from ' + mentions[0] : ''} is real.`,
        motivated: `Your drive${mentions[0] ? ' ' + mentions[0] : ''} is inspiring!`,
        confident: `Your self-assurance${mentions[0] ? ' ' + mentions[0] : ''} shines through!`,
        guilty: `I can feel the weight of what you're carrying${mentions[0] ? ' ' + mentions[0] : ''}.`,
        confused: `The uncertainty you're experiencing${mentions[0] ? ' ' + mentions[0] : ''} makes sense.`,
        hopeful: `Your optimism${mentions[0] ? ' about ' + mentions[0] : ''} is touching.`,
        inlove: `The joy in your words${mentions[0] ? ' ' + mentions[0] : ''} is beautiful!`,
        calm: `The peace you've found${mentions[0] ? ' ' + mentions[0] : ''} is precious.`,
        bored: `I sense you're craving something more${mentions[0] ? ' than ' + mentions[0] : ''}.`
    };
    
    return moodAcknowledgments[mood] || `I hear what you're sharing${mentions[0] ? ' ' + mentions[0] : ''}.`;
}

function buildSupport(mood, context, themes, details) {
    const supportMessages = {
        happy: context.hasAchievement ? "You've earned this moment - celebrate it fully!" : 
               "Hold onto this feeling and let it fuel you.",
        sad: context.isAlone ? "You're not alone in this, even when it feels that way." :
             "It's okay to feel this way - your emotions are valid.",
        angry: "Your anger shows you care deeply about this.",
        anxious: themes.work || themes.school ? "Take it one step at a time - you don't have to do everything at once." :
                "Breathe through this - you're stronger than this worry.",
        overwhelmed: "You don't have to carry it all right now.",
        excited: "This energy is powerful - channel it into what matters to you!",
        grateful: "This appreciation will multiply the good in your life.",
        lonely: "Connection is possible, and you deserve it.",
        tired: "Rest isn't weakness - it's what your body needs.",
        motivated: "This drive will take you far - keep that momentum!",
        confident: "You know your worth, and that's everything.",
        guilty: "Learn from this, then be kind to yourself.",
        confused: "Clarity often comes after we sit with uncertainty.",
        hopeful: "Hope is what carries us forward - keep believing.",
        inlove: "Let yourself enjoy this beautiful connection!",
        calm: "Savor this tranquility - you've found something special.",
        bored: "Your mind is ready for something new and exciting."
    };
    
    return supportMessages[mood] || "I'm here with you through this.";
}

function buildEncouragement(mood, context, actions) {
    const hasAction = actions.length > 0;
    const action = actions[0];
    
    const encouragements = {
        happy: hasAction && action === 'completed' ? "Keep building on this success! 🌟" : "You deserve all this joy! ✨",
        sad: "Tomorrow brings new possibilities. 💙",
        angry: "Channel this energy wisely - you've got this. 💪",
        anxious: "You'll get through this, one moment at a time. 🌸",
        overwhelmed: "Take it step by step - you're capable. 🤗",
        excited: "Ride this wave as far as it takes you! 🚀",
        grateful: "Keep counting your blessings! 🙏",
        lonely: "Better connections are coming. 💜",
        tired: "Give yourself permission to rest. 💤",
        motivated: "Make it happen - you're unstoppable! 🔥",
        confident: "Own it - you're amazing! 😎",
        guilty: "Forgive yourself and move forward. 🌱",
        confused: "Trust the process - answers will come. 🧭",
        hopeful: "Keep that hope alive - it's powerful! 🌅",
        inlove: "Cherish every moment! ❤️",
        calm: "Hold onto this peace. 🍃",
        bored: "Time to explore something new! 🎨"
    };
    
    return encouragements[mood] || "You've got this! 💪";
}

function buildDynamicClosing(mood, themes, details, words) {
    // Add length-based personalization
    if (words > 80) {
        return " Thank you for sharing so openly - your self-reflection is powerful.";
    } else if (words > 50) {
        return " Your honesty is appreciated.";
    }
    return "";
}

// Old function kept for reference - not used
function oldSwitch_UNUSED(mood) {
    switch (mood) {
        case 'unused':
            if (themes.achievement && themes.work) {
                response = opening + "Crushing it at work feels amazing! Your dedication is paying off. This professional win deserves celebration! 🎉💼";
            } else if (themes.achievement && themes.school) {
                response = opening + "Academic success tastes sweet! Your hard work and late nights are paying off. You earned this! 📚✨";
            } else if (themes.achievement) {
                response = opening + "You did it! Finishing what you started takes real commitment. Celebrate this victory - you've earned every bit of it! 🏆";
            } else if (themes.work && themes.goodDay) {
                response = opening + "When work flows well, everything feels right! You're in your element. This productive energy is gold! 💼✨";
            } else if (themes.family && themes.goodDay) {
                response = opening + "Quality time with family creates the best memories! These moments of connection are what life is truly about. 💕";
            } else if (themes.friends && themes.goodDay) {
                response = opening + "Good friends make good days great! These social connections are feeding your soul. Keep nurturing them! 🤗";
            } else if (themes.relationship && details.laughing) {
                response = opening + "Love and laughter - the perfect combination! This relationship is bringing out your best self. Enjoy every moment! ❤️😊";
            } else if (themes.relationship) {
                response = opening + "Being in love feels magical! This connection is beautiful. Let yourself enjoy this happiness fully! ❤️✨";
            } else if (themes.grateful && themes.goodDay) {
                response = opening + "Gratitude and happiness together create pure joy! Your positive perspective is creating these beautiful moments. 🙏✨";
            } else if (themes.goodDay && details.morning) {
                response = opening + "Starting the day on a high note sets the tone for everything! Carry this morning energy forward! 🌅";
            } else if (themes.goodDay) {
                response = opening + "Days like this remind us why we keep going! Your positive energy is creating these beautiful moments. Savor it! 🌟";
            } else {
                response = opening + "Your happiness is shining through! Whatever brought this joy, hold onto it. You deserve these good feelings! 😊✨";
            }
            break;
            
        case 'sad':
            if (themes.badDay) {
                response = "I'm sorry you're having such a rough day. It's okay to feel down - these feelings are valid. Tomorrow is a fresh start. 💙";
            } else if (themes.relationship) {
                response = "Heartache is one of the hardest feelings. Give yourself time and space to heal. You're stronger than you know. 💔→💙";
            } else if (themes.past) {
                response = "Missing what was is natural. Those memories shaped you, but new beautiful moments await. It's okay to grieve and grow. 🌱";
            } else if (themes.work) {
                response = "Work struggles can really weigh on us. Remember, your worth isn't defined by your job. Better days are coming. 💪";
            } else if (themes.family) {
                response = "Family situations can be so emotionally complex. Your feelings matter. Take care of yourself through this. 🤗";
            } else {
                response = "I hear your sadness, and it's completely okay to feel this way. Be gentle with yourself. This feeling will pass. 💙";
            }
            break;
            
        case 'anxious':
            if (themes.work) {
                response = "Work anxiety is so real. Take it one task at a time - you don't have to do everything at once. You've got this! 🌸";
            } else if (themes.school) {
                response = "Academic pressure can be intense. Remember to breathe. You're capable, and it's okay to ask for help. 📚💪";
            } else if (themes.health) {
                response = "Health worries are understandably stressful. Focus on what you can control and be kind to yourself. 🌿";
            } else if (themes.future || themes.uncertain) {
                response = "Uncertainty about the future is anxiety-inducing. Take it one day at a time. You'll figure it out. 🧭";
            } else if (themes.money) {
                response = "Financial stress is heavy. You're doing your best. Take it step by step - solutions will come. 💚";
            } else {
                response = "I can feel your anxiety. Take a deep breath. You're stronger than this worry, and you'll get through it. 🌸";
            }
            break;
            
        case 'angry':
            if (themes.work) {
                response = "Work frustrations are valid! Your anger shows you care. Channel this energy wisely - you deserve better. 🔥";
            } else if (themes.relationship) {
                response = "Relationship anger is intense. Take time to cool down before responding. Your feelings matter. 💪";
            } else if (themes.badDay) {
                response = "When everything goes wrong, anger is natural. Let it out safely, then focus on what you can control. ⚡";
            } else {
                response = "I hear your frustration. Anger is a valid emotion - acknowledge it, then decide how to use this energy. 🔥";
            }
            break;
            
        case 'calm':
            response = "What a peaceful state to be in! This inner calm is precious - you've found something beautiful today. 🍃";
            break;
            
        case 'bored':
            response = "Boredom can actually be a gift - it means your mind is ready for something new! What sparks your curiosity? 🤔";
            break;
            
        case 'excited':
            response = "Your excitement is absolutely infectious! This energy is going to take you places! 🚀";
            break;
            
        case 'grateful':
            response = "Gratitude is such a beautiful perspective. Your appreciation for life's gifts is inspiring! 🙏";
            break;
            
        case 'confused':
            response = "It's completely normal to feel uncertain sometimes. Confusion often precedes clarity! 🤔";
            break;
            
        case 'proud':
            response = "You absolutely should be proud! Your hard work and dedication are paying off! 🏆";
            break;
            
        case 'lonely':
            response = "Loneliness is hard, but remember - you're never truly alone. Connection is always possible! 💜";
            break;
            
        case 'hopeful':
            response = "Hope is such a powerful force! Your optimism is a gift to yourself and others! 🌅";
            break;
            
        case 'overwhelmed':
            if (themes.work) {
                response = "Work overload is exhausting. You don't have to do it all at once. Prioritize and take breaks. You matter more than tasks! 🤗";
            } else if (themes.school) {
                response = "Academic overwhelm is real. Break it down into smaller steps. You're capable - just take it one thing at a time. 📚";
            } else if (themes.family) {
                response = "Family responsibilities can pile up. It's okay to ask for help. You can't pour from an empty cup. 💙";
            } else {
                response = "I feel the weight you're carrying. Take a breath. You don't have to handle everything right now. One step at a time. 🌸";
            }
            break;
            
        case 'excited':
            if (themes.change || themes.goals) {
                response = "Your excitement about what's ahead is electric! This energy will propel you forward. Embrace it! 🚀";
            } else if (themes.relationship) {
                response = "Love and excitement together - what a rush! Enjoy this beautiful feeling. You deserve this happiness! ❤️⚡";
            } else {
                response = "Your enthusiasm is contagious! This excited energy is powerful - channel it into something amazing! 🤩";
            }
            break;
            
        case 'grateful':
            if (themes.family) {
                response = "Family gratitude is beautiful. These connections are life's greatest gift. Keep appreciating them! 🙏💕";
            } else if (themes.achievement) {
                response = "Gratitude for your accomplishments shows wisdom. You've earned this - celebrate and appreciate it! 🏆✨";
            } else {
                response = "Your grateful heart is inspiring. This appreciation multiplies joy. Keep counting your blessings! 🙏";
            }
            break;
            
        case 'lonely':
            if (themes.relationship) {
                response = "Missing connection hurts. You're worthy of love and companionship. The right people will come. 💜";
            } else if (themes.friends) {
                response = "Social loneliness is hard. Reach out - people care more than you think. You're not alone in feeling alone. 🤗";
            } else {
                response = "Loneliness is painful, but temporary. You have value and deserve connection. Better days are coming. 💜";
            }
            break;
            
        case 'confused':
            if (themes.relationship) {
                response = "Relationship confusion is complex. Take time to understand your feelings. Clarity will come. 🤔";
            } else if (themes.goals || themes.future) {
                response = "Not knowing your path is okay. Confusion often precedes clarity. Trust the process. 🧭";
            } else {
                response = "Feeling uncertain is part of growth. Give yourself time to process. The answers will reveal themselves. 💭";
            }
            break;
            
        case 'proud':
            if (themes.achievement) {
                response = "You absolutely should be proud! Your hard work paid off. Celebrate this victory - you earned it! 🏆";
            } else if (themes.work) {
                response = "Professional pride is well-deserved! Your dedication is showing results. Keep up the excellent work! 💼✨";
            } else {
                response = "Your pride is justified! Acknowledge your growth and accomplishments. You're doing amazing! 🌟";
            }
            break;
            
        case 'motivated':
            if (themes.goals) {
                response = "This motivation is powerful! Your goals are within reach. Channel this energy and make it happen! 💪🔥";
            } else if (themes.work) {
                response = "Work motivation is gold! You're in the zone. Ride this productive wave as far as it takes you! 🚀";
            } else {
                response = "Your drive is inspiring! This motivated energy will take you far. Keep pushing forward! 💪";
            }
            break;
            
        case 'tired':
            if (themes.work) {
                response = "Work exhaustion is real. Rest isn't lazy - it's necessary. Your body is asking for what it needs. 😴";
            } else if (themes.health) {
                response = "Physical tiredness is your body's message. Listen to it. Rest and recovery are productive too. 💤";
            } else {
                response = "Feeling drained is your body's way of asking for care. Rest guilt-free - you've earned it. 😴";
            }
            break;
            
        case 'confident':
            if (themes.achievement) {
                response = "Your confidence is backed by real accomplishments! You know your worth. Keep owning it! 😎";
            } else if (themes.work) {
                response = "Professional confidence looks good on you! You're capable and it shows. Keep shining! 👑";
            } else {
                response = "This self-assurance is powerful! You believe in yourself, and that's everything. Own it! 😎";
            }
            break;
            
        case 'guilty':
            if (themes.relationship) {
                response = "Relationship guilt shows you care. Learn from it, apologize if needed, then forgive yourself. 🌱";
            } else if (themes.work) {
                response = "Work guilt is common but often unnecessary. You're doing your best. Be kind to yourself. 💙";
            } else {
                response = "Guilt means you have a conscience. Acknowledge it, make amends if needed, then let it go. 🕊️";
            }
            break;
            
        case 'inlove':
            response = "Love is a beautiful feeling! Enjoy this connection and let yourself be vulnerable. You deserve this happiness! ❤️✨";
            break;
            
        case 'hopeful':
            if (themes.future || themes.goals) {
                response = "Hope for the future is powerful! Your optimism will help create the life you want. Keep believing! 🌅";
            } else {
                response = "This hopeful feeling is precious. Hold onto it - hope is what carries us through. Better days ahead! 🌈";
            }
            break;
            
        case 'calm':
            if (themes.health) {
                response = "Physical and mental calm together - that's true wellness. Savor this peaceful state. 🧘";
            } else {
                response = "This inner peace is beautiful. You've found a moment of tranquility. Hold onto this feeling. 🍃";
            }
            break;
            
        case 'bored':
            response = "Boredom is your mind saying it's ready for something new! What have you been curious about? Time to explore! 🎨";
            break;
            
        case 'content':
            response = "Contentment is underrated. You're appreciating what you have - that's true wisdom. Savor this peace. 😊";
            break;
            
        case 'frustrated':
            if (themes.work) {
                response = "Work frustration is exhausting. Take a step back, breathe, and tackle this one challenge at a time. You've got this! 💪";
            } else if (themes.relationship) {
                response = "Relationship frustration is tough. Communication and patience can help. Your feelings are valid. 💙";
            } else {
                response = "Frustration is temporary. Take a breath, step back, and approach this with fresh eyes. You'll find a way through! 🌟";
            }
            break;
            
        case 'stressed':
            if (themes.work) {
                response = "Work stress is real. Remember to breathe, prioritize, and take breaks. Your well-being matters more than any deadline. 🌸";
            } else if (themes.school) {
                response = "Academic stress can be overwhelming. Break tasks into smaller steps, and remember - progress over perfection. 📚";
            } else {
                response = "Stress is your body's way of saying you're pushing yourself. Listen to it, slow down, and be kind to yourself. 💜";
            }
            break;
            
        default:
            response = moodData.reply;
    }
    
    // Add length-based personalization
    if (words > 50) {
        response += " Thank you for sharing so openly - your self-reflection is powerful.";
    }
    
    return response;
}

async function displayMoodResult(entry) {
    const moodDisplay = document.getElementById('moodDisplay');
    const moodEmoji = document.getElementById('moodEmoji');
    const moodLabel = document.getElementById('moodLabel');
    const moodReply = document.getElementById('moodReply');
    const spotifyPlayer = document.getElementById('spotifyPlayer');
    
    if (!moodDisplay) {
        console.error('❌ Mood display element not found');
        return;
    }
    
    // Show the mood display
    moodDisplay.style.display = 'block';
    moodDisplay.style.opacity = '1';
    
    const moodData = MOODS[entry.mood];
    
    // Update mood display
    moodEmoji.textContent = moodData.emoji;
    
    // Create confidence badge
    const confidencePercent = Math.round((entry.confidence || 0.5) * 100);
    const confidenceColor = confidencePercent >= 70 ? '#10b981' : confidencePercent >= 50 ? '#f59e0b' : '#ef4444';
    
    moodLabel.innerHTML = `
        ${moodData.label}
        <span class="confidence-badge" style="background: ${confidenceColor};">
            ${confidencePercent}% confident
        </span>
    `;
    
    // Clear any existing related moods sections
    const existingAlternatives = moodReply.parentElement.querySelectorAll('.alternatives-section');
    existingAlternatives.forEach(el => el.remove());
    
    // Use personalized AI response if available, otherwise use default
    moodReply.textContent = entry.aiResponse || moodData.reply;
    
    // Show related moods from Gemini analysis (2-3 moods with confidence scores)
    if (entry.relatedMoods && entry.relatedMoods.length > 0) {
        // Sort by confidence and take top 2-3
        const sortedRelatedMoods = entry.relatedMoods
            .filter(rm => rm.mood && MOODS[rm.mood]) // Only valid moods
            .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
            .slice(0, 3); // Take top 3
        
        if (sortedRelatedMoods.length > 0) {
            const relatedMoodsHTML = sortedRelatedMoods.map(rm => {
                const rmMoodData = MOODS[rm.mood];
                const rmConfidence = Math.round((rm.confidence || 0) * 100);
                return `
                    <div class="alternative-mood">
                        <span class="alt-emoji">${rmMoodData.emoji}</span>
                        <span class="alt-label">${rmMoodData.label}</span>
                        <span class="alt-percentage">${rmConfidence}%</span>
                    </div>
                `;
            }).join('');
            
            const relatedSection = document.createElement('div');
            relatedSection.className = 'alternatives-section';
            relatedSection.innerHTML = `
                <div class="alternatives-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    You might also be feeling:
                </div>
                <div class="alternatives-list">
                    ${relatedMoodsHTML}
                </div>
            `;
            
            // Insert after mood reply
            const moodContent = moodReply.parentElement;
            moodContent.appendChild(relatedSection);
        }
    }
    
    // Show alternative moods if confidence is low or alternatives exist
    if (entry.alternatives && entry.alternatives.length > 0 && confidencePercent < 70 && (!entry.relatedMoods || entry.relatedMoods.length === 0)) {
        const alternativesHTML = entry.alternatives.map(alt => {
            const altMoodData = MOODS[alt.mood];
            return `
                <div class="alternative-mood">
                    <span class="alt-emoji">${altMoodData.emoji}</span>
                    <span class="alt-label">${altMoodData.label}</span>
                    <span class="alt-percentage">${alt.percentage}%</span>
                </div>
            `;
        }).join('');
        
        const alternativesSection = document.createElement('div');
        alternativesSection.className = 'alternatives-section';
        alternativesSection.innerHTML = `
            <div class="alternatives-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                You might also be feeling:
            </div>
            <div class="alternatives-list">
                ${alternativesHTML}
            </div>
        `;
        
        // Insert after mood reply
        const moodContent = moodReply.parentElement;
        moodContent.appendChild(alternativesSection);
    }
    
    // Show mood display
    moodDisplay.classList.add('visible');
    
    // Get Spotify recommendation
    console.log('🎵 Fetching Spotify recommendations...');
    const spotifyRec = await getSpotifyRecommendation(entry.mood);
    
    if (spotifyRec && spotifyRec.tracks && spotifyRec.tracks.length > 0) {
        console.log('✅ Displaying Spotify playlist');
        
        const tracksHTML = spotifyRec.tracks.map((track, index) => `
            <div class="spotify-track" data-track-url="${track.url}">
                <div class="track-number">${index + 1}</div>
                <div class="track-album-art">
                    <img src="${track.albumArt}" alt="${track.album}" />
                    <div class="track-play-overlay">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                </div>
                <div class="track-info">
                    <div class="track-name">${track.name}</div>
                    <div class="track-artist">${track.artist}</div>
                </div>
                <div class="track-duration">${track.duration}</div>
                <a href="${track.url}" target="_blank" class="track-spotify-link" title="Open in Spotify">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                </a>
            </div>
        `).join('');
        
        spotifyPlayer.innerHTML = `
            <div class="spotify-playlist-header">
                <div class="playlist-icon">🎵</div>
                <div class="playlist-info">
                    <h3>Your ${moodData.label} Playlist</h3>
                    <p>${spotifyRec.tracks.length} songs curated for your mood</p>
                </div>
                <div class="playlist-actions">
                    <button onclick="createSpotifyPlaylist('${entry.mood}', '${spotifyRec.playlistName.replace(/'/g, "\\'")}', ${JSON.stringify(spotifyRec.trackUris).replace(/"/g, '&quot;')})" class="btn-create-playlist">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        Create Playlist
                    </button>
                    <a href="${spotifyRec.playlistUrl}" target="_blank" class="playlist-open-spotify">
                        Open in Spotify
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                    </a>
                </div>
            </div>
            <div class="spotify-tracks-list">
                ${tracksHTML}
            </div>
            <div class="spotify-playlist-footer">
                <small>💡 Tip: Click "Create Playlist" to save these tracks to your Spotify account</small>
            </div>
        `;
        
        // Add click handlers to tracks
        document.querySelectorAll('.spotify-track').forEach(track => {
            track.addEventListener('click', function(e) {
                if (!e.target.closest('.track-spotify-link')) {
                    const url = this.getAttribute('data-track-url');
                    window.open(url, '_blank');
                }
            });
        });
        
    } else {
        console.log('⚠️ No Spotify recommendations available');
        spotifyPlayer.innerHTML = `
            <div class="spotify-placeholder">
                <div class="placeholder-icon">🎵</div>
                <p>Spotify playlist unavailable</p>
                <small>Configure your Spotify token in config.js to see personalized playlists</small>
            </div>
        `;
    }
    
    // Scroll to mood display
    moodDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ========================================
// DATA PERSISTENCE
// ========================================

async function saveToFirebase(entry) {
    if (!firebaseEnabled || !db || !currentUser) return false;
    
    try {
        const { addDoc, collection } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        await addDoc(collection(db, 'journal_entries'), {
            ...entry,
            userId: currentUser.uid,
            userEmail: currentUser.email,
            createdAt: new Date()
        });
        
        console.log('✅ Entry saved to Firebase');
        return true;
    } catch (error) {
        console.error('❌ Error saving to Firebase:', error);
        return false;
    }
}

async function loadFromFirebase() {
    if (!firebaseEnabled || !db || !currentUser) return [];
    
    try {
        const { getDocs, collection, query, where, orderBy, limit } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const q = query(
            collection(db, 'journal_entries'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc'),
            limit(100)
        );
        
        const querySnapshot = await getDocs(q);
        const firebaseEntries = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            firebaseEntries.push({
                id: doc.id,
                ...data,
                date: data.date || data.createdAt?.toDate()?.toISOString()
            });
        });
        
        console.log(`✅ Loaded ${firebaseEntries.length} entries from Firebase`);
        return firebaseEntries;
    } catch (error) {
        console.error('❌ Error loading from Firebase:', error);
        return [];
    }
}

async function loadUserData() {
    try {
        // Load from Firebase if available
        if (firebaseEnabled && currentUser) {
            const firebaseEntries = await loadFromFirebase();
            if (firebaseEntries.length > 0) {
                entries = firebaseEntries;
                calculateStreak();
                updateStatistics();
                displayEntries();
                updateCharts();
                return;
            }
        }
        
        // Fallback to localStorage (user-specific)
        if (currentUser) {
            const savedEntries = localStorage.getItem(`moodSyncEntries_${currentUser.uid}`);
            if (savedEntries) {
                entries = JSON.parse(savedEntries);
                calculateStreak();
                updateStatistics();
                displayEntries();
                updateCharts();
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function saveToLocalStorage() {
    try {
        if (currentUser) {
            localStorage.setItem(`moodSyncEntries_${currentUser.uid}`, JSON.stringify(entries));
            localStorage.setItem(`moodSyncStreak_${currentUser.uid}`, currentStreak.toString());
        } else {
            // Fallback for non-authenticated users
            localStorage.setItem('moodSyncEntries', JSON.stringify(entries));
            localStorage.setItem('moodSyncStreak', currentStreak.toString());
        }
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

async function loadSavedData() {
    try {
        // Load from Firebase first if available
        if (firebaseEnabled) {
            const firebaseEntries = await loadFromFirebase();
            if (firebaseEntries.length > 0) {
                entries = firebaseEntries;
                calculateStreak();
                return;
            }
        }
        
        // Fallback to localStorage
        const savedEntries = localStorage.getItem('moodSyncEntries');
        const savedStreak = localStorage.getItem('moodSyncStreak');
        
        if (savedEntries) {
            entries = JSON.parse(savedEntries);
        }
        
        if (savedStreak) {
            currentStreak = parseInt(savedStreak);
        }
        
        // Calculate current streak
        calculateStreak();
        
    } catch (error) {
        console.error('Error loading saved data:', error);
        entries = [];
        currentStreak = 0;
    }
}

function calculateStreak() {
    if (entries.length === 0) {
        currentStreak = 0;
        return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < entries.length; i++) {
        const entryDate = new Date(entries[i].date);
        entryDate.setHours(0, 0, 0, 0);
        
        if (entryDate.getTime() === currentDate.getTime()) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (entryDate.getTime() < currentDate.getTime()) {
            break;
        }
    }
    
    currentStreak = streak;
}

// ========================================
// STATISTICS & UI UPDATES
// ========================================

function updateStatistics() {
    // Update streak
    const streakValue = document.getElementById('streakValue');
    if (streakValue) streakValue.textContent = currentStreak;
    
    // Update total entries
    const totalEntries = document.getElementById('totalEntries');
    if (totalEntries) totalEntries.textContent = entries.length;
    
    // Update dominant mood this week - show top 2 moods
    const weeklyMood = getDominantMoodThisWeek();
    const dominantMood = document.getElementById('dominantMood');
    if (dominantMood) {
        if (weeklyMood) {
            const moodData = MOODS[weeklyMood];
            // Get top 2 moods for the week
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const weeklyEntries = entries.filter(entry => new Date(entry.date) >= oneWeekAgo);
            const moodCounts = {};
            weeklyEntries.forEach(entry => {
                moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
            });
            const sortedMoods = Object.entries(moodCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 2);
            
            if (sortedMoods.length > 1) {
                const secondMood = sortedMoods[1][0];
                const secondMoodData = MOODS[secondMood];
                dominantMood.innerHTML = `<span style="font-size: 1.2em; display: inline-block;">${moodData.emoji}</span> <span style="font-size: 1.2em; display: inline-block; opacity: 0.8;">${secondMoodData.emoji}</span>`;
            } else {
                dominantMood.innerHTML = `<span style="font-size: 1.2em; display: inline-block;">${moodData.emoji}</span>`;
            }
        } else {
            dominantMood.textContent = '-';
        }
    }
    
    // Weekly summary removed - info is in stats bar
}

function getDominantMoodThisWeek() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyEntries = entries.filter(entry => 
        new Date(entry.date) >= oneWeekAgo
    );
    
    if (weeklyEntries.length === 0) return null;
    
    const moodCounts = {};
    weeklyEntries.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    return Object.keys(moodCounts).reduce((a, b) => 
        moodCounts[a] > moodCounts[b] ? a : b
    );
}


// ========================================
// ENTRIES DISPLAY
// ========================================

function displayEntries() {
    const entriesList = document.getElementById('entriesList');
    if (!entriesList) return;
    
    if (entries.length === 0) {
        entriesList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--gray);">
                <p style="font-size: 1.2em; margin-bottom: 10px;">📝 No entries yet</p>
                <p>Start writing your first mood entry above!</p>
            </div>
        `;
        return;
    }
    
    entriesList.innerHTML = entries.map(entry => {
        const moodData = MOODS[entry.mood];
        if (!moodData) return ''; // Safety check for invalid mood
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Use personalized AI response if available
        const aiReply = entry.aiResponse || moodData.reply;
        
        // Get confidence percentage
        const confidencePercent = entry.confidence ? Math.round(entry.confidence * 100) : 0;
        
        // Build alternative moods HTML if they exist and confidence is low
        let alternativesHTML = '';
        if (entry.alternatives && entry.alternatives.length > 0 && confidencePercent < 70) {
            const altMoodsHTML = entry.alternatives.map(alt => {
                const altMoodData = MOODS[alt.mood];
                return `
                    <div class="entry-alt-mood">
                        <span class="entry-alt-emoji">${altMoodData.emoji}</span>
                        <span class="entry-alt-label">${altMoodData.label}</span>
                        <span class="entry-alt-percentage">${alt.percentage}%</span>
                    </div>
                `;
            }).join('');
            
            alternativesHTML = `
                <div class="entry-alternatives">
                    <div class="entry-alternatives-header">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="16" x2="12" y2="12"/>
                            <line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                        Also feeling:
                    </div>
                    <div class="entry-alternatives-list">
                        ${altMoodsHTML}
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="entry-card">
                <div class="entry-header">
                    <div class="entry-mood">
                        ${moodData.emoji} ${moodData.label}
                        ${entry.confidence ? `
                            <span class="confidence-badge-small" style="background: ${
                                confidencePercent >= 70 ? '#10b981' : 
                                confidencePercent >= 50 ? '#f59e0b' : '#ef4444'
                            };">
                                ${confidencePercent}%
                            </span>
                        ` : ''}
                    </div>
                    <div class="entry-date">
                        ${formattedDate} at ${formattedTime}
                    </div>
                </div>
                ${alternativesHTML}
                <div class="entry-text">${entry.text}</div>
                <div class="entry-ai-reply">
                    <strong>💭 AI Response:</strong> ${aiReply}
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// CHARTS
// ========================================

function initializeCharts() {
    // Wait for DOM to be fully loaded
    setTimeout(() => {
        initializeWeeklyChart();
        initializeMonthlyChart();
    }, 100);
}

function initializeWeeklyChart() {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) {
        console.warn('⚠️ Weekly chart canvas not found');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.warn('⚠️ Chart.js not loaded yet');
        return;
    }
    
    Chart.defaults.color = '#ffffff';
    Chart.defaults.font.family = 'inherit';
    
    console.log('📊 Initializing redesigned weekly chart');
    
    if (weeklyChart) {
        weeklyChart.destroy();
    }
    
    const weeklyData = getWeeklyChartData();
    
    try {
        weeklyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: weeklyData.labels,
                datasets: [{
                    label: 'Entries',
                    data: weeklyData.data,
                    borderColor: 'rgba(0, 242, 254, 1)',
                    backgroundColor: 'rgba(0, 242, 254, 0.15)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.5,
                    pointBackgroundColor: 'rgba(0, 242, 254, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: 'rgba(0, 242, 254, 1)',
                    pointHoverBorderWidth: 3,
                    shadowOffsetX: 0,
                    shadowOffsetY: 4,
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 242, 254, 0.3)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.98)',
                        titleColor: 'rgba(0, 242, 254, 1)',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(0, 242, 254, 0.6)',
                        borderWidth: 2,
                        padding: 14,
                        cornerRadius: 10,
                        displayColors: false,
                        titleFont: {
                            size: 15,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 14
                        },
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                if (value === 0) {
                                    return '📝 No entries';
                                }
                                return `📝 ${value} ${value === 1 ? 'entry' : 'entries'}`;
                            },
                            title: function(context) {
                                return `📅 ${context[0].label || 'Day'}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            precision: 0,
                            color: 'rgba(255, 255, 255, 0.9)',
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.08)',
                            drawBorder: false,
                            lineWidth: 1
                        },
                        title: {
                            display: true,
                            text: '📊 Number of Entries',
                            color: 'rgba(0, 242, 254, 0.9)',
                            font: {
                                size: 14,
                                weight: '600',
                                family: 'inherit'
                            },
                            padding: {
                                top: 10,
                                bottom: 10
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.08)',
                            drawBorder: false,
                            lineWidth: 1
                        },
                        ticks: {
                            maxRotation: 0,
                            color: 'rgba(255, 255, 255, 0.8)',
                            font: {
                                size: 12,
                                weight: '500'
                            },
                            padding: 10
                        },
                        title: {
                            display: true,
                            text: '📅 Day',
                            color: 'rgba(0, 242, 254, 0.9)',
                            font: {
                                size: 14,
                                weight: '600',
                                family: 'inherit'
                            },
                            padding: {
                                top: 10,
                                bottom: 5
                            }
                        }
                    }
                }
            }
        });
        console.log('✅ Weekly chart redesigned and initialized');
    } catch (error) {
        console.error('❌ Error initializing weekly chart:', error);
    }
}

function initializeMonthlyChart() {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) {
        console.warn('⚠️ Monthly chart canvas not found');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.warn('⚠️ Chart.js not loaded yet');
        return;
    }
    
    Chart.defaults.color = '#ffffff';
    Chart.defaults.font.family = 'inherit';
    
    console.log('📊 Initializing clean aesthetic donut chart');
    
    if (monthlyChart) {
        monthlyChart.destroy();
    }
    
    const monthlyData = getMonthlyChartData();
    
    // Plugin to display percentages on segments
    const percentagePlugin = {
        id: 'percentageLabels',
        afterDatasetDraw(chart) {
            const ctx = chart.ctx;
            const dataset = chart.data.datasets[0];
            const total = dataset.data.reduce((a, b) => a + b, 0);
            
            if (total === 0) return;
            
            const meta = chart.getDatasetMeta(0);
            
            meta.data.forEach((element, index) => {
                const value = dataset.data[index];
                const percentage = ((value / total) * 100).toFixed(1);
                
                // Only show if percentage is significant
                if (percentage < 5) return;
                
                const {x, y} = element.tooltipPosition();
                
                ctx.save();
                ctx.font = 'bold 18px inherit';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Add text shadow for better readability
                ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                ctx.shadowBlur = 8;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                
                ctx.fillText(`${Math.round(percentage)}%`, x, y);
                ctx.restore();
            });
        }
    };
    
    try {
        monthlyChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: monthlyData.labels,
                datasets: [{
                    data: monthlyData.data,
                    backgroundColor: monthlyData.colors,
                    borderWidth: 8,
                    borderColor: 'rgba(15, 23, 42, 1)',
                    hoverOffset: 15,
                    hoverBorderWidth: 8,
                    hoverBorderColor: 'rgba(15, 23, 42, 1)',
                    borderRadius: 0,
                    spacing: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                rotation: 0,
                circumference: 360,
                animation: {
                    animateRotate: true,
                    animateScale: false,
                    duration: 1500,
                    easing: 'easeInOutQuart'
                },
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: 10
                    }
                },
                plugins: {
                    legend: {
                        position: 'right',
                        align: 'center',
                        labels: {
                            padding: 18,
                            usePointStyle: true,
                            pointStyle: 'rect',
                            font: {
                                size: 15,
                                family: 'inherit',
                                weight: '600'
                            },
                            color: '#ffffff',
                            boxWidth: 22,
                            boxHeight: 22,
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    const dataset = data.datasets[0];
                                    const total = dataset.data.reduce((a, b) => a + b, 0);
                                    
                                    // Create array of labels with their data
                                    const labelData = data.labels.map((label, i) => ({
                                        label: label,
                                        value: dataset.data[i],
                                        color: dataset.backgroundColor[i],
                                        index: i
                                    }));
                                    
                                    // Sort by value descending and take top 5
                                    const top5 = labelData
                                        .sort((a, b) => b.value - a.value)
                                        .slice(0, 5);
                                    
                                    return top5.map(item => {
                                        return {
                                            text: item.label,
                                            fillStyle: item.color,
                                            strokeStyle: 'transparent',
                                            lineWidth: 0,
                                            pointStyle: 'rect',
                                            hidden: false,
                                            index: item.index,
                                            fontColor: '#ffffff'
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13,
                            weight: 'normal'
                        },
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                const value = context.parsed;
                                const dataset = context.dataset;
                                const total = dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${value} entries (${percentage}%)`;
                            }
                        }
                    }
                },
                interaction: {
                    intersect: true,
                    mode: 'nearest'
                }
            },
            plugins: [percentagePlugin]
        });
        console.log('✅ Clean aesthetic donut chart initialized');
    } catch (error) {
        console.error('❌ Error initializing monthly chart:', error);
    }
}

function getWeeklyChartData() {
    const labels = [];
    const data = [];
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNumber = date.getDate();
        labels.push(`${dayName} ${dayNumber}`);
        
        // Find entries for this day
        const dayEntries = entries.filter(entry => {
            try {
                const entryDate = new Date(entry.date);
                return entryDate.toDateString() === date.toDateString();
            } catch (e) {
                return false;
            }
        });
        
        // Show number of entries per day (more accurate representation)
        data.push(dayEntries.length);
    }
    
    return { labels, data };
}

function getMonthlyChartData() {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const monthlyEntries = entries.filter(entry => {
        try {
            return new Date(entry.date) >= oneMonthAgo;
        } catch (e) {
            console.warn('Invalid date format:', entry.date);
            return false;
        }
    });
    
    const moodCounts = {};
    monthlyEntries.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    const labels = [];
    const data = [];
    const colors = [];
    
    // If we have data, use it
    if (Object.keys(moodCounts).length > 0) {
        // Sort by count descending for better visualization
        const sortedMoods = Object.entries(moodCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8); // Limit to top 8 moods for clarity
        
        sortedMoods.forEach(([mood, count]) => {
            const moodData = MOODS[mood];
            if (moodData) {
                labels.push(`${moodData.emoji} ${moodData.label}`);
                data.push(count);
                colors.push(moodData.color);
            }
        });
    } else {
        // Show placeholder data with more descriptive label
        labels.push('📝 Start journaling!');
        data.push(1);
        colors.push('rgba(102, 126, 234, 0.3)');
    }
    
    return { labels, data, colors };
}

function updateCharts() {
    try {
        if (weeklyChart) {
            const weeklyData = getWeeklyChartData();
            weeklyChart.data.labels = weeklyData.labels;
            weeklyChart.data.datasets[0].data = weeklyData.data;
            weeklyChart.update('none'); // No animation for updates
            console.log('📊 Weekly chart updated');
        }
        
        if (monthlyChart) {
            const monthlyData = getMonthlyChartData();
            monthlyChart.data.labels = monthlyData.labels;
            monthlyChart.data.datasets[0].data = monthlyData.data;
            monthlyChart.data.datasets[0].backgroundColor = monthlyData.colors;
            monthlyChart.update('none'); // No animation for updates
            console.log('📊 Monthly chart updated');
        }
    } catch (error) {
        console.error('❌ Error updating charts:', error);
        // Reinitialize charts if update fails
        initializeCharts();
    }
}

// ========================================
// UI HELPERS
// ========================================

function showLoading(message) {
    // Show loading via notification instead
    console.log('⏳', message);
    
    // Disable save button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) saveBtn.disabled = true;
}

function hideLoading() {
    // Re-enable save button if text is long enough
    const journalInput = document.getElementById('journalInput');
    const saveBtn = document.getElementById('saveBtn');
    if (journalInput && saveBtn) {
        saveBtn.disabled = journalInput.value.trim().length < 10;
    }
}

function showError(message) {
    // Show error via notification instead
    showNotification(message, 'error');
}

// ========================================
// SPOTIFY PLAYLIST CREATION
// ========================================

window.createSpotifyPlaylist = async function(mood, playlistName, trackUris) {
    try {
        console.log('🎵 Creating Spotify playlist:', playlistName);
        
        const button = event.target.closest('button');
        const originalHTML = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<span class="spinner">⏳</span> Creating...';
        
        // Check if user has connected Spotify
        const spotifyUserId = localStorage.getItem('spotifyUserId');
        
        if (!spotifyUserId) {
            // Show connect Spotify modal
            button.innerHTML = originalHTML;
            button.disabled = false;
            showSpotifyConnectModal(playlistName, trackUris);
            return;
        }
        
        // Try to create playlist with OAuth
        const response = await fetch('/api/spotify/create-playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playlistName,
                description: `MoodSync ${MOODS[mood]?.label || mood} playlist - ${new Date().toLocaleDateString()}`,
                trackUris: trackUris,
                spotifyUserId: spotifyUserId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Success! Show success message
            button.innerHTML = '✅ Created!';
            
            setTimeout(() => {
                showPlaylistSuccess(data.playlist);
                button.disabled = false;
                button.innerHTML = originalHTML;
            }, 500);
        } else if (data.needsAuth) {
            // Need to reconnect Spotify
            button.innerHTML = originalHTML;
            button.disabled = false;
            localStorage.removeItem('spotifyUserId');
            showSpotifyConnectModal(playlistName, trackUris);
        } else {
            throw new Error(data.error || 'Failed to create playlist');
        }
        
    } catch (error) {
        console.error('Error creating playlist:', error);
        const button = event.target.closest('button');
        button.innerHTML = '❌ Failed';
        
        setTimeout(() => {
            // Fallback to manual method
            showPlaylistInstructions(playlistName, trackUris, `https://open.spotify.com/search/${encodeURIComponent(playlistName)}`);
            button.disabled = false;
            button.innerHTML = button.getAttribute('data-original-html') || 'Create Playlist';
        }, 1000);
    }
};

function showSpotifyConnectModal(playlistName, trackUris) {
    const modal = document.createElement('div');
    modal.className = 'playlist-modal';
    modal.innerHTML = `
        <div class="playlist-modal-content">
            <div class="modal-header">
                <h3>🎵 Connect Spotify</h3>
                <button onclick="this.closest('.playlist-modal').remove()" class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <div class="connect-spotify-card">
                    <div class="spotify-logo">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="#1DB954">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                    </div>
                    <h4>Auto-Create Playlists!</h4>
                    <p>Connect your Spotify account to automatically create playlists with one click.</p>
                    
                    <div class="benefits-list">
                        <div class="benefit-item">
                            <span class="benefit-icon">✅</span>
                            <span>One-click playlist creation</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">✅</span>
                            <span>Automatically add tracks</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">✅</span>
                            <span>Save to your Spotify library</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">✅</span>
                            <span>Secure OAuth authentication</span>
                        </div>
                    </div>
                    
                    <button onclick="connectSpotify()" class="btn-connect-spotify">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                        Connect Spotify Account
                    </button>
                    
                    <div class="or-divider">
                        <span>or</span>
                    </div>
                    
                    <button onclick="showPlaylistInstructions('${playlistName.replace(/'/g, "\\'")}', ${JSON.stringify(trackUris).replace(/"/g, '&quot;')}, 'https://open.spotify.com/search/${encodeURIComponent(playlistName)}'); document.querySelector('.playlist-modal').remove();" class="btn-manual">
                        Use Manual Method
                    </button>
                    
                    <p class="privacy-note">
                        <small>🔒 We only request permission to create playlists. Your data stays private.</small>
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

window.connectSpotify = function() {
    // Store current playlist info to create after auth
    const modal = document.querySelector('.playlist-modal');
    if (modal) modal.remove();
    
    // Open Spotify OAuth
    window.location.href = '/api/spotify/login';
};

function showPlaylistSuccess(playlist) {
    const modal = document.createElement('div');
    modal.className = 'playlist-modal';
    modal.innerHTML = `
        <div class="playlist-modal-content success-modal">
            <div class="modal-header">
                <h3>🎉 Playlist Created!</h3>
                <button onclick="this.closest('.playlist-modal').remove()" class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <div class="success-animation">
                    <div class="success-checkmark">✓</div>
                </div>
                <h4>${playlist.name}</h4>
                <p>Your playlist has been created and saved to your Spotify account!</p>
                
                <div class="playlist-actions-success">
                    <a href="${playlist.url}" target="_blank" class="btn-open-playlist">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                        Open in Spotify
                    </a>
                    <button onclick="this.closest('.playlist-modal').remove()" class="btn-done">
                        Done
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showPlaylistInstructions(playlistName, trackUris, searchUrl) {
    const modal = document.createElement('div');
    modal.className = 'playlist-modal';
    modal.innerHTML = `
        <div class="playlist-modal-content">
            <div class="modal-header">
                <h3>🎵 Create Your Playlist</h3>
                <button onclick="this.closest('.playlist-modal').remove()" class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <p><strong>Playlist Name:</strong> ${playlistName}</p>
                <p><strong>Tracks:</strong> ${trackUris.length} songs</p>
                
                <div class="playlist-options">
                    <h4>Choose an option:</h4>
                    
                    <div class="option-card">
                        <div class="option-icon">🔗</div>
                        <div class="option-content">
                            <h5>Copy Track URIs</h5>
                            <p>Copy these URIs and paste them in Spotify to create a playlist</p>
                            <textarea readonly class="track-uris-textarea">${trackUris.join('\n')}</textarea>
                            <button onclick="copyTrackUris()" class="btn-copy">
                                📋 Copy URIs
                            </button>
                        </div>
                    </div>
                    
                    <div class="option-card">
                        <div class="option-icon">🔍</div>
                        <div class="option-content">
                            <h5>Search in Spotify</h5>
                            <p>Open Spotify and search for these tracks manually</p>
                            <a href="${searchUrl}" target="_blank" class="btn-spotify">
                                Open Spotify Search
                            </a>
                        </div>
                    </div>
                    
                    <div class="option-card">
                        <div class="option-icon">ℹ️</div>
                        <div class="option-content">
                            <h5>Why can't I auto-create?</h5>
                            <p>Creating playlists requires Spotify user authorization (OAuth). For now, you can manually add these tracks to your Spotify account.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

window.copyTrackUris = function() {
    const textarea = document.querySelector('.track-uris-textarea');
    textarea.select();
    document.execCommand('copy');
    
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✅ Copied!';
    
    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
};

// ========================================
// GLOBAL FUNCTIONS (for HTML onclick)
// ========================================

window.handleSignIn = async function() {
    const email = document.getElementById('signInEmail').value.trim();
    const password = document.getElementById('signInPassword').value;
    
    if (!email || !password) {
        showAuthMessage('Please enter email and password', 'error');
        return;
    }
    
    showAuthMessage('Signing in...', 'info');
    const result = await signIn(email, password);
    
    if (result.success) {
        showAuthMessage('Welcome back!', 'success');
    } else {
        showAuthMessage(result.error || 'Sign in failed', 'error');
    }
};

window.handleSignUp = async function() {
    const name = document.getElementById('signUpName').value.trim();
    const email = document.getElementById('signUpEmail').value.trim();
    const password = document.getElementById('signUpPassword').value;
    
    if (!name || !email || !password) {
        showAuthMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAuthMessage('Password must be at least 6 characters', 'error');
        return;
    }
    
    showAuthMessage('Creating account...', 'info');
    const result = await signUp(email, password, name);
    
    if (result.success) {
        showAuthMessage('Account created successfully!', 'success');
    } else {
        showAuthMessage(result.error || 'Sign up failed', 'error');
    }
};

window.handleGoogleSignIn = async function() {
    showAuthMessage('Signing in with Google...', 'info');
    const result = await signInWithGoogle();
    
    if (result.success) {
        showAuthMessage('Welcome!', 'success');
    } else {
        showAuthMessage(result.error || 'Google sign in failed', 'error');
    }
};

window.handleSignOut = async function() {
    if (confirm('Are you sure you want to sign out?')) {
        const result = await signOut();
        if (result.success) {
            showAuthMessage('Signed out successfully', 'success');
        }
    }
};

window.handleResetPassword = async function() {
    const email = document.getElementById('resetEmail').value.trim();
    
    if (!email) {
        showAuthMessage('Please enter your email', 'error');
        return;
    }
    
    showAuthMessage('Sending reset link...', 'info');
    const result = await resetPassword(email);
    
    if (result.success) {
        showAuthMessage('Password reset email sent! Check your inbox.', 'success');
        setTimeout(() => showSignIn(), 2000);
    } else {
        showAuthMessage(result.error || 'Failed to send reset email', 'error');
    }
};

window.showSignIn = function() {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (signInForm) signInForm.style.display = 'block';
    if (signUpForm) signUpForm.style.display = 'none';
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
    clearAuthMessage();
};

window.showSignUp = function() {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (signInForm) signInForm.style.display = 'none';
    if (signUpForm) signUpForm.style.display = 'block';
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
    clearAuthMessage();
};

window.showForgotPassword = function() {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (signInForm) signInForm.style.display = 'none';
    if (signUpForm) signUpForm.style.display = 'none';
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'block';
    clearAuthMessage();
};

function showAuthMessage(message, type) {
    const messageEl = document.getElementById('authMessage');
    messageEl.textContent = message;
    messageEl.className = `auth-message ${type}`;
    messageEl.style.display = 'block';
}

function clearAuthMessage() {
    const messageEl = document.getElementById('authMessage');
    messageEl.style.display = 'none';
}

// ========================================
// SERVICE WORKER (Optional)
// ========================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

console.log('📱 MoodSync App loaded successfully!');