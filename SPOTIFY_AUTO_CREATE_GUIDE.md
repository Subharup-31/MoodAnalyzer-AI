# 🎵 Spotify Auto-Create Playlist Feature

## ✨ What's New!

You can now **automatically create Spotify playlists** with ONE CLICK! No more manual copying and pasting.

## 🚀 How It Works

### Step 1: Connect Your Spotify Account (One Time)

1. Write a journal entry and get your mood analysis
2. Scroll to the Spotify section
3. Click **"Create Playlist"** button
4. Click **"Connect Spotify Account"** in the modal
5. Log in to Spotify (if not already logged in)
6. Click **"Agree"** to authorize MoodSync
7. You'll be redirected back to MoodSync
8. See success notification: "🎵 Spotify Connected!"

### Step 2: Auto-Create Playlists (Every Time)

1. Write any journal entry
2. Click **"Create Playlist"**
3. Wait 2 seconds... ✨
4. **Done!** Playlist created in your Spotify account!
5. Click "Open in Spotify" to listen

## 🔐 What Permissions We Request

MoodSync only requests these permissions:
- ✅ `playlist-modify-public` - Create public playlists
- ✅ `playlist-modify-private` - Create private playlists
- ✅ `user-read-private` - Read your profile
- ✅ `user-read-email` - Read your email

**We DO NOT:**
- ❌ Access your listening history
- ❌ Modify existing playlists
- ❌ Share your data
- ❌ Post on your behalf

## 🎯 Features

### Auto-Create Playlists
- ✅ One-click creation
- ✅ Automatically adds 5 mood-based tracks
- ✅ Saves to your Spotify library
- ✅ Private by default
- ✅ Custom playlist names (e.g., "Happy Mood - Nov 9, 2025")

### Smart Playlist Names
Each playlist is named based on:
- Your detected mood
- Current date
- Example: "Excited Mood - November 9, 2025"

### Playlist Descriptions
Auto-generated descriptions:
```
"MoodSync Happy playlist - 11/9/2025"
"Created by MoodSync - Your AI Mood Journal"
```

## 🔄 How OAuth Works

```
1. You click "Connect Spotify"
        ↓
2. Redirected to Spotify login
        ↓
3. You authorize MoodSync
        ↓
4. Spotify gives us a token
        ↓
5. Token stored securely
        ↓
6. Create playlists anytime!
```

## 🛡️ Security

### Your Data is Safe:
- ✅ OAuth tokens stored server-side only
- ✅ Tokens auto-refresh (never expire)
- ✅ No passwords stored
- ✅ Secure HTTPS connection to Spotify
- ✅ Minimal permissions requested

### Token Storage:
- Tokens stored in server memory (not database)
- In production, would use encrypted database
- Tokens automatically refresh before expiry

## 📊 Comparison

### Before (Manual):
1. Click "Create Playlist"
2. Copy track URIs
3. Open Spotify
4. Create new playlist
5. Paste URIs
6. **Total: ~2 minutes**

### After (Auto):
1. Click "Create Playlist"
2. **Done! Total: 2 seconds** ✨

## 🎨 UI Flow

### First Time (Not Connected):
```
Click "Create Playlist"
        ↓
Modal: "Connect Spotify"
        ↓
Click "Connect Spotify Account"
        ↓
Spotify Login Page
        ↓
Authorize MoodSync
        ↓
Back to MoodSync
        ↓
Success! "Spotify Connected"
```

### After Connected:
```
Click "Create Playlist"
        ↓
Loading... (2 seconds)
        ↓
Success Modal!
        ↓
"Open in Spotify" or "Done"
```

## 🔧 Technical Details

### API Endpoints

#### `/api/spotify/login`
- Redirects to Spotify OAuth
- Requests necessary permissions
- Returns to callback URL

#### `/api/spotify/callback`
- Receives authorization code
- Exchanges for access token
- Stores token server-side
- Redirects back to app

#### `/api/spotify/create-playlist`
- Creates playlist in user's account
- Adds tracks automatically
- Returns playlist URL

### Token Management

```javascript
// Tokens stored per user
userSpotifyTokens = {
  'user_id': {
    accessToken: 'BQD...',
    refreshToken: 'AQD...',
    expiresAt: 1699564800000
  }
}
```

### Auto-Refresh
- Tokens checked before each request
- Auto-refreshed if expired
- Seamless user experience

## 🧪 Testing

### Test the OAuth Flow:

1. **Clear Connection** (to test from scratch):
```javascript
// In browser console:
localStorage.removeItem('spotifyUserId');
```

2. **Test Connection**:
- Click "Create Playlist"
- Should see "Connect Spotify" modal
- Click "Connect Spotify Account"
- Authorize on Spotify
- Should redirect back with success

3. **Test Auto-Create**:
- Write another journal entry
- Click "Create Playlist"
- Should create instantly!

## 🐛 Troubleshooting

### "Spotify not connected" error
**Solution**: Click "Connect Spotify Account" again

### "Token refresh failed"
**Solution**: Reconnect your Spotify account

### Playlist not appearing in Spotify
**Solution**: 
- Check if you're logged into the correct Spotify account
- Refresh your Spotify app
- Playlists are private by default (check your library)

### "Failed to create playlist"
**Solution**:
- Check server logs for errors
- Verify Spotify credentials in `.env`
- Try reconnecting Spotify

## 📱 Mobile Support

Works on mobile browsers too!
- Same OAuth flow
- Same one-click creation
- Opens Spotify mobile app

## 🎉 Benefits

### For You:
- ✅ Save time (2 minutes → 2 seconds)
- ✅ Never lose track of mood playlists
- ✅ Organized music library
- ✅ Easy access to mood-based music

### For Your Mental Health:
- ✅ Music therapy integration
- ✅ Mood-based recommendations
- ✅ Emotional regulation through music
- ✅ Track your musical journey

## 🔮 Future Enhancements

Coming soon:
- [ ] Collaborative mood playlists
- [ ] Share playlists with friends
- [ ] Playlist analytics
- [ ] Custom track selection
- [ ] Playlist templates
- [ ] Integration with Apple Music

## 📝 Notes

### Why OAuth Instead of API Keys?
- API keys can only search (read-only)
- OAuth allows creating playlists (write access)
- OAuth is more secure (user-specific permissions)
- OAuth tokens can be revoked by user

### Token Expiry
- Access tokens expire after 1 hour
- Refresh tokens never expire
- We auto-refresh before expiry
- Seamless experience for you

## 🚀 Get Started

1. Open http://localhost:3000
2. Write a journal entry
3. Click "Create Playlist"
4. Connect Spotify (one time)
5. Enjoy auto-created playlists! 🎵

---

Made with 💙 by Subharup
