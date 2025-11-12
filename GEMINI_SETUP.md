# Google Gemini API Setup Guide

## Quick Setup Steps

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Choose "Create API key in new project" or select existing project
5. Copy the generated API key

### 2. Update config.js
Replace the Gemini configuration in `config.js`:

```javascript
gemini: {
    apiKey: "your-actual-api-key-here",
    model: "gemini-pro"
}
```

### 3. Features Enabled
- ✅ **Personalized AI Responses** - Context-aware replies to your journal entries
- ✅ **Emotional Intelligence** - Understands nuanced emotions and situations
- ✅ **Supportive Guidance** - Provides gentle encouragement and motivation
- ✅ **Natural Conversations** - Human-like, empathetic responses

## Example Responses

**Your Entry:** "I had a really good day at work today. Finally finished that big project!"

**Gemini Response:** "That's fantastic! Completing a big project is such a rewarding feeling. Your hard work and dedication really paid off - you should be proud of this accomplishment! 🎉"

## API Limits
- **Free Tier:** 60 requests per minute
- **Rate Limits:** Automatically handled with fallbacks
- **Fallback System:** Uses template responses if API is unavailable

## Privacy & Safety
- Your journal entries are sent to Google's Gemini API for processing
- Google's safety filters prevent harmful content
- No data is stored by Google beyond processing your request
- All responses are filtered for appropriateness

## Troubleshooting
- If responses seem generic, check your API key
- Rate limits may cause temporary fallbacks to templates
- Check browser console for detailed error messages

## Alternative Options
If you prefer not to use external APIs:
1. Leave `apiKey: "YOUR_GEMINI_API_KEY"` unchanged
2. The app will use intelligent template responses instead
3. Still provides personalized, context-aware replies!