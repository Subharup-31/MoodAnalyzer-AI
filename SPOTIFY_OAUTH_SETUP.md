# 🎵 Spotify OAuth Setup Guide

## ❌ Error: "INVALID_CLIENT: Invalid redirect URI"

This error means your Spotify app doesn't have the redirect URI configured.

## ✅ Quick Fix (5 minutes)

### Step 1: Open Spotify Developer Dashboard

1. Go to: **https://developer.spotify.com/dashboard**
2. Log in with your Spotify account
3. You should see your app listed

### Step 2: Configure Redirect URI

1. Click on your app name
2. Click **"Edit Settings"** (top right)
3. Scroll down to **"Redirect URIs"** section
4. Add this EXACT URL:
   ```
   http://localhost:3000/api/spotify/callback
   ```
5. Click the **"Add"** button
6. Scroll to bottom and click **"Save"**

### Step 3: Verify Settings

Your Spotify app should now have:

**App Name**: (Your app name)
**Client ID**: `35ac290b2c2d41688fe2330ac4186b10`
**Client Secret**: `e76b8afc04b740d09a77a33686ff1fb3`
**Redirect URIs**: 
- ✅ `http://localhost:3000/api/spotify/callback`

### Step 4: Test It

1. Refresh your MoodSync app: http://localhost:3000
2. Write a journal entry
3. Click "Create Playlist"
4. Click "Connect Spotify Account"
5. Should now work! ✅

## 📸 Visual Guide

### What You Should See:

#### In Spotify Dashboard:
```
┌─────────────────────────────────────┐
│ Edit Settings                    [X]│
├─────────────────────────────────────┤
│                                     │
│ Redirect URIs                       │
│ ┌─────────────────────────────────┐│
│ │ http://localhost:3000/api/spot..││
│ │                            [Add] ││
│ └─────────────────────────────────┘│
│                                     │
│                          [Cancel]   │
│                          [Save]     │
└─────────────────────────────────────┘
```

## 🔐 Security Notes

### Why Redirect URIs?
- Prevents unauthorized apps from stealing your tokens
- Spotify validates the redirect URL
- Must match exactly (including http/https, port, path)

### Common Mistakes:
- ❌ `http://localhost:3000` (missing `/api/spotify/callback`)
- ❌ `https://localhost:3000/api/spotify/callback` (https instead of http)
- ❌ `http://127.0.0.1:3000/api/spotify/callback` (127.0.0.1 instead of localhost)
- ✅ `http://localhost:3000/api/spotify/callback` (CORRECT!)

## 🚀 After Setup

Once configured, you can:
1. ✅ Connect Spotify with one click
2. ✅ Auto-create playlists
3. ✅ Add tracks automatically
4. ✅ Save to your Spotify library

## 🐛 Still Having Issues?

### Error: "INVALID_CLIENT"
**Solution**: Double-check Client ID and Secret in `.env` file

### Error: "Invalid redirect URI"
**Solution**: Make sure redirect URI is EXACTLY:
```
http://localhost:3000/api/spotify/callback
```

### Error: "Access denied"
**Solution**: Click "Agree" on Spotify authorization page

### Can't find your app?
**Solution**: Create a new app:
1. Go to https://developer.spotify.com/dashboard
2. Click "Create app"
3. Fill in details:
   - App name: MoodSync
   - App description: AI Mood Journal
   - Redirect URI: `http://localhost:3000/api/spotify/callback`
   - APIs: Web API
4. Click "Save"
5. Copy Client ID and Secret to `.env`

## 📝 Production Deployment

When deploying to production, add your production URL:

```
https://yourdomain.com/api/spotify/callback
```

You can have multiple redirect URIs:
- `http://localhost:3000/api/spotify/callback` (development)
- `https://yourdomain.com/api/spotify/callback` (production)

## ✅ Checklist

Before testing:
- [ ] Spotify app created
- [ ] Client ID in `.env`
- [ ] Client Secret in `.env`
- [ ] Redirect URI added: `http://localhost:3000/api/spotify/callback`
- [ ] Settings saved in Spotify Dashboard
- [ ] Server restarted (`npm start`)

## 🎉 Success!

Once configured, you'll see:
1. Click "Connect Spotify Account"
2. Spotify login page opens
3. Shows permissions request
4. Click "Agree"
5. Redirects back to MoodSync
6. Success notification: "🎵 Spotify Connected!"
7. Create playlists with one click!

---

Need help? Check the server logs for detailed error messages.

Made with 💙 by Subharup
