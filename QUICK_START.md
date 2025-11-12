# 🚀 Quick Start Guide

## ⚠️ Current Issue: Spotify OAuth Setup Required

You're seeing this error:
```
INVALID_CLIENT: Invalid redirect URI
```

## ✅ Fix in 3 Steps (2 minutes)

### Step 1: Open Spotify Dashboard
```
🌐 https://developer.spotify.com/dashboard
```

### Step 2: Add Redirect URI
```
1. Click your app
2. Click "Edit Settings"
3. Find "Redirect URIs"
4. Add: http://localhost:3000/api/spotify/callback
5. Click "Add"
6. Click "Save"
```

### Step 3: Test
```
1. Refresh MoodSync
2. Click "Create Playlist"
3. Click "Connect Spotify"
4. ✅ Should work now!
```

## 📋 Your Spotify App Info

```
Client ID:     35ac290b2c2d41688fe2330ac4186b10
Client Secret: e76b8afc04b740d09a77a33686ff1fb3
Redirect URI:  http://localhost:3000/api/spotify/callback ← ADD THIS!
```

## 🎯 What to Add in Spotify Dashboard

Copy and paste this EXACT URL:
```
http://localhost:3000/api/spotify/callback
```

⚠️ **Important**: Must be EXACTLY this (no typos!)
- ✅ `http://localhost:3000/api/spotify/callback`
- ❌ `http://localhost:3000` (missing path)
- ❌ `https://localhost:3000/api/spotify/callback` (wrong protocol)
- ❌ `http://127.0.0.1:3000/api/spotify/callback` (wrong host)

## 🖼️ Visual Guide

```
┌──────────────────────────────────────────────┐
│  Spotify for Developers                      │
├──────────────────────────────────────────────┤
│                                              │
│  Your App Name                               │
│  ┌────────────────────────────────────────┐ │
│  │ Settings                               │ │
│  │                                        │ │
│  │ Redirect URIs                          │ │
│  │ ┌────────────────────────────────────┐│ │
│  │ │ http://localhost:3000/api/spotify/ ││ │
│  │ │ callback                      [Add]││ │
│  │ └────────────────────────────────────┘│ │
│  │                                        │ │
│  │                    [Cancel]  [Save]   │ │
│  └────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

## ✨ After Setup

Once you add the redirect URI, you can:

### 1. Connect Spotify (One Time)
```
Write journal → Click "Create Playlist" → Connect Spotify
```

### 2. Auto-Create Playlists (Every Time)
```
Write journal → Click "Create Playlist" → Done! ✅
```

## 🎵 Features You'll Get

- ✅ One-click playlist creation
- ✅ Auto-add 5 mood-based tracks
- ✅ Save to your Spotify library
- ✅ Private playlists
- ✅ Smart naming (e.g., "Happy Mood - Nov 9, 2025")

## 🐛 Troubleshooting

### Still seeing "Invalid redirect URI"?
1. Make sure you clicked "Save" in Spotify Dashboard
2. Wait 30 seconds for changes to propagate
3. Refresh your browser
4. Try again

### Can't find "Edit Settings"?
1. Make sure you're logged into Spotify Dashboard
2. Click on your app name
3. Look for "Edit Settings" button (top right)

### Don't have a Spotify app?
1. Go to https://developer.spotify.com/dashboard
2. Click "Create app"
3. Fill in:
   - Name: MoodSync
   - Description: AI Mood Journal
   - Redirect URI: `http://localhost:3000/api/spotify/callback`
   - Check "Web API"
4. Click "Save"
5. Copy Client ID and Secret to `.env` file

## 📞 Need Help?

Check these files:
- `SPOTIFY_OAUTH_SETUP.md` - Detailed setup guide
- `SPOTIFY_AUTO_CREATE_GUIDE.md` - Feature documentation
- Server logs - Run `npm start` and check console

## 🎉 You're Almost There!

Just add that redirect URI and you'll be creating playlists automatically! 🚀

---

Made with 💙 by Subharup
