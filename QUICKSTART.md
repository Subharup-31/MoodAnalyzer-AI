# MoodSync Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Firebase (Required)

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Name it "MoodSync"
   - Follow the setup wizard

2. **Enable Authentication**
   - In Firebase Console, click "Authentication"
   - Click "Get Started"
   - Enable "Email/Password" sign-in method
   - Enable "Google" sign-in method (optional)

3. **Create Firestore Database**
   - Click "Firestore Database"
   - Click "Create database"
   - Start in "test mode"
   - Choose your region

4. **Get Configuration**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click web icon (</>)
   - Copy the config object

5. **Update config.js**
   - Open `config.js` in your project
   - Replace the Firebase section with your config

### Step 2: Setup Gemini AI (Optional but Recommended)

1. **Get API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Click "Create API Key"
   - Copy the key

2. **Update config.js**
   ```javascript
   gemini: {
       apiKey: "your-gemini-api-key-here",
       model: "gemini-pro"
   }
   ```

### Step 3: Launch the App

1. **Open the app**
   - Double-click `index.html`
   - Or use a local server: `python3 -m http.server 8080`

2. **Create Account**
   - Click "Create Account"
   - Enter your name, email, and password
   - Or click "Continue with Google"

3. **Start Journaling**
   - Write your first entry
   - Get personalized AI response
   - Track your mood over time

## 🎯 Features Overview

### Authentication
- ✅ Email/password sign-up
- ✅ Google OAuth sign-in
- ✅ Password reset
- ✅ Secure user sessions

### Journaling
- ✅ Write daily entries
- ✅ 14 mood categories
- ✅ AI-powered sentiment analysis
- ✅ Personalized responses from Gemini AI

### Analytics
- ✅ Weekly mood trends chart
- ✅ Monthly mood distribution
- ✅ Streak tracking
- ✅ Entry statistics

### Integrations
- ✅ Spotify playlist recommendations
- ✅ Daily inspirational quotes
- ✅ Cloud sync across devices

## 📱 Using the App

### Writing an Entry
1. Type your thoughts in the text area
2. Minimum 10 characters required
3. Click "Save Entry" or press Ctrl/Cmd + Enter
4. View your mood analysis and AI response

### Viewing History
- Scroll down to see all past entries
- Each entry shows mood, date, and AI response
- Entries are sorted newest first

### Understanding Moods
- 😊 Happy - Positive, joyful feelings
- 😢 Sad - Down, melancholy emotions
- 😠 Angry - Frustrated, irritated feelings
- 😰 Anxious - Worried, stressed emotions
- 😌 Calm - Peaceful, relaxed state
- 😐 Bored - Uninterested, monotonous
- 🤩 Excited - Enthusiastic, energetic
- 🙏 Grateful - Thankful, appreciative
- 😕 Confused - Uncertain, puzzled
- 😤 Proud - Accomplished, confident
- 😔 Lonely - Isolated, disconnected
- 🌅 Hopeful - Optimistic, positive outlook
- 😵 Overwhelmed - Too much, stressed
- 😊 Content - Satisfied, at peace

### Charts & Analytics
- **Weekly Trends**: Shows mood patterns over 7 days
- **Monthly Distribution**: Pie chart of mood breakdown
- **Streak Counter**: Days of consecutive journaling
- **Total Entries**: Lifetime journal count

## 🔧 Troubleshooting

### Can't Sign In
- Check email spelling
- Verify password
- Use "Forgot Password" to reset

### No AI Response
- Check Gemini API key in config.js
- Verify API key is active
- App will use template responses as fallback

### Data Not Syncing
- Verify Firebase configuration
- Check internet connection
- Look for errors in browser console (F12)

### Charts Not Showing
- Make sure you have at least one entry
- Refresh the page
- Check browser console for errors

## 💡 Tips for Best Experience

1. **Journal Daily** - Build a streak for better insights
2. **Be Honest** - The AI provides better responses with authentic entries
3. **Review Trends** - Check your charts weekly to understand patterns
4. **Use Details** - More detailed entries get more personalized responses
5. **Stay Consistent** - Regular journaling provides better analytics

## 🆘 Need Help?

- Check `AUTHENTICATION_SETUP.md` for auth issues
- See `FIREBASE_SETUP.md` for database setup
- Read `GEMINI_SETUP.md` for AI configuration
- Open browser console (F12) for error messages

## 🎉 You're Ready!

Start your mental health journey with MoodSync. Write your first entry and discover how AI-powered journaling can help you understand your emotions better!