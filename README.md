# MoodSync - AI-Powered Mood Journal

An intelligent mood tracking journal that uses AI to provide personalized, empathetic responses to your daily entries.

## Features

- 🎭 **17 Emotion Detection** - Accurately identifies your mood from journal entries
- 🤖 **AI-Powered Responses** - Google Gemini generates personalized, contextual replies
- 📊 **Mood Analytics** - Track your emotional patterns over time
- 🎵 **Spotify Integration** - Get mood-based music recommendations
- 🔐 **Firebase Auth** - Secure user authentication and data storage
- 📱 **Responsive Design** - Works beautifully on all devices

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

```env
# Get Gemini API Key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase config from: https://console.firebase.google.com/
FIREBASE_API_KEY=your_firebase_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
# ... etc
```

### 3. Get API Keys

#### Google Gemini API (Required for AI responses)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key
4. Copy and paste into `.env` file

#### Firebase (Required for authentication)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to Project Settings → General
4. Scroll to "Your apps" and add a Web app
5. Copy the config values to `.env`

#### Spotify (Optional - for music recommendations)
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create an app
3. Get your access token
4. Add to `.env`

### 4. Run the Application

```bash
npm start
```

The app will be available at `http://localhost:3000`

## Usage

1. **Sign Up/Sign In** - Create an account or sign in with email
2. **Write Your Entry** - Share your thoughts, feelings, and experiences
3. **Get AI Response** - Receive a personalized, empathetic response from Gemini AI
4. **Track Your Moods** - View charts and statistics of your emotional patterns
5. **Listen to Music** - Get Spotify recommendations based on your mood

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js + Express
- **AI**: Google Gemini API
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Charts**: Chart.js
- **Music**: Spotify Web API

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI responses | Yes |
| `FIREBASE_API_KEY` | Firebase API key | Yes |
| `FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `FIREBASE_APP_ID` | Firebase app ID | Yes |
| `HUGGINGFACE_API_KEY` | Hugging Face API (fallback) | No |
| `SPOTIFY_ACCESS_TOKEN` | Spotify access token | No |

## Security Notes

- Never commit `.env` file to version control
- The `.env` file is already in `.gitignore`
- API keys are loaded server-side and not exposed to the client
- Use the `/api/gemini` proxy endpoint to keep your Gemini API key secure

## License

MIT

## Author

Made with 💙 by Subharup
