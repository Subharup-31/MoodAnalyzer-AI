# 🚀 MoodSync - Complete Setup Guide

## Quick Start (2 minutes)

### 1. Start the Server
```bash
python3 -m http.server 8080
```

### 2. Open in Browser
Visit: **http://localhost:8080**

### 3. Create Account
- Click "Create Account"
- Enter your name, email, and password
- Start journaling!

## ✅ What Works Right Now (No Setup Required)

✨ **Fully Functional Features:**
- ✅ 19 mood detection types
- ✅ AI-powered mood analysis
- ✅ Intelligent template responses
- ✅ Beautiful dark theme UI
- ✅ Weekly & monthly charts
- ✅ Streak tracking
- ✅ Journal history
- ✅ Local data storage
- ✅ Responsive design

## 🎵 Enable Spotify Playlists (5 minutes)

### Get Your Token
1. Visit: https://developer.spotify.com/console/get-search-item/
2. Click "GET TOKEN"
3. Login with Spotify
4. Copy the token

### Add to Config
Open `config.js` and replace:
```javascript
spotify: {
    token: "YOUR_SPOTIFY_ACCESS_TOKEN"  // Paste your token here
}
```

**Result:** You'll see 5 personalized songs with album art for each mood! 🎵

## 🤖 Enable Advanced AI Responses (Optional)

### Get Gemini API Key (Free)
1. Visit: https://makersuite.google.com/app/apikey
2. Create a free API key
3. Copy the key

### Add to Config
Open `config.js` and replace:
```javascript
gemini: {
    apiKey: "YOUR_GEMINI_API_KEY",  // Paste your key here
    model: "gemini-pro"
}
```

**Result:** Get personalized, context-aware AI responses! 🧠

## 🔥 Enable Firebase (Optional - For Cloud Sync)

### Setup Firebase
1. Visit: https://console.firebase.google.com/
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Copy your config

### Add to Config
Open `config.js` and replace the firebase section with your config.

**Result:** Sync data across devices! ☁️

## 📱 How to Use

### 1. Write a Journal Entry
- Type at least 10 characters
- Be honest about your feelings
- Click "Save Entry"

### 2. See Your Mood
- AI detects your mood automatically
- Get a personalized response
- See your Spotify playlist (if configured)

### 3. Track Progress
- View weekly mood trends
- See monthly distribution
- Track your streak

### 4. Review History
- Scroll down to see past entries
- Each entry shows mood and AI response
- Click entries to expand

## 🎨 Features Overview

### Mood Detection
The app detects 19 different moods:
- 😊 Happy, 😔 Sad, 😡 Angry, 😰 Anxious
- 😌 Calm, 😐 Bored, 🤩 Excited, 🙏 Grateful
- 😕 Confused, 😤 Proud, 🥀 Lonely, 🌅 Hopeful
- 😵 Overwhelmed, 😊 Content, 😴 Tired, 💪 Motivated
- ❤️ In Love, 😎 Confident, 😞 Guilty

### Spotify Integration
When configured, you get:
- 5 curated songs per mood
- Album artwork
- Artist names
- Direct Spotify links
- Beautiful playlist UI

### Analytics
- Line chart: Weekly mood trends
- Doughnut chart: Monthly distribution
- Stats: Streak, total entries, dominant mood
- Weekly summary with insights

## 🔧 Troubleshooting

### Spotify Not Working
- Check if token is pasted correctly in config.js
- Token expires after 1 hour - get a new one
- Check browser console (F12) for errors

### AI Responses Not Showing
- They are showing! Look for "💭 AI Response:" in entries
- Without Gemini, you get smart template responses
- Template responses are still personalized based on mood

### Data Not Saving
- Check if you're logged in
- Data saves to localStorage automatically
- For cloud sync, configure Firebase

### Charts Not Showing
- Make sure you have at least one entry
- Check browser console for errors
- Try refreshing the page

## 📚 Documentation

- **FEATURES.md** - Complete feature list
- **SPOTIFY_SETUP.md** - Detailed Spotify setup
- **AUTHENTICATION_SETUP.md** - Firebase auth setup
- **TROUBLESHOOTING.md** - Common issues

## 🎯 Tips for Best Experience

1. **Write Daily** - Build a streak for better insights
2. **Be Honest** - The AI works best with genuine feelings
3. **Review Weekly** - Check your mood trends
4. **Use Spotify** - Music enhances the experience
5. **Mobile Friendly** - Use on any device

## 🌟 What's Special

- **No Setup Required** - Works immediately
- **Privacy First** - Your data stays local
- **Beautiful UI** - Modern dark theme
- **Smart AI** - Accurate mood detection
- **Music Therapy** - Mood-based playlists
- **Visual Insights** - Charts and analytics

## 🚀 You're All Set!

Start journaling and let MoodSync help you understand your emotions better! 💙

---

**Need Help?** Check the browser console (F12) for detailed logs and error messages.
