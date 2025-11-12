# Spotify Playlist Creation Guide

## 🎵 Overview

MoodSync now generates personalized Spotify playlists based on your mood! While full auto-creation requires OAuth, we provide easy ways to save your mood-based playlists.

## ✨ Features

### What Works Now:
- ✅ **Auto-refreshing Spotify tokens** (no more 401 errors!)
- ✅ **5 curated tracks** per mood
- ✅ **"Create Playlist" button** with multiple options
- ✅ **Track URIs** for easy playlist creation
- ✅ **Direct Spotify links** to open tracks

### Coming Soon:
- 🔜 **Full OAuth integration** for one-click playlist creation
- 🔜 **Save to your Spotify library** automatically
- 🔜 **Playlist history** tracking

## 📝 How to Create a Playlist

### Method 1: Copy Track URIs (Recommended)

1. Write a journal entry and get your mood analysis
2. Scroll to the Spotify section
3. Click **"Create Playlist"** button
4. Click **"Copy URIs"** in the modal
5. Open Spotify Desktop App
6. Create a new playlist
7. Paste the URIs (Spotify will automatically add the tracks)

### Method 2: Manual Search

1. Click **"Create Playlist"** button
2. Click **"Open Spotify Search"**
3. Manually search and add tracks from the list

### Method 3: Direct Links

1. Click on any track in the list
2. Opens directly in Spotify
3. Add to your playlist manually

## 🔧 Technical Details

### How It Works

```javascript
// 1. Server gets Spotify token using Client Credentials
const token = await getSpotifyToken();

// 2. Search for mood-based tracks
const tracks = await searchSpotifyTracks(mood, token);

// 3. Generate track URIs
const trackUris = tracks.map(t => t.uri);
// Example: ['spotify:track:abc123', 'spotify:track:def456', ...]

// 4. User can copy URIs to create playlist
```

### Spotify API Flow

```
Client Credentials Flow (Current):
├── ✅ Search tracks
├── ✅ Get track details
├── ✅ Get album art
└── ❌ Create playlists (requires user auth)

OAuth Flow (Future):
├── ✅ Everything above
├── ✅ Create playlists
├── ✅ Add tracks to playlists
└── ✅ Modify user library
```

## 🎯 Mood-Based Queries

Each mood has a specific Spotify search query:

| Mood | Search Query |
|------|-------------|
| Happy | "happy upbeat positive feel good" |
| Sad | "sad melancholy emotional heartbreak" |
| Angry | "rock metal intense aggressive" |
| Anxious | "calm relaxing meditation peaceful" |
| Calm | "chill ambient peaceful zen" |
| Excited | "energetic dance party celebration" |
| Grateful | "peaceful thankful spiritual uplifting" |
| Lonely | "comfort indie acoustic emotional" |
| Tired | "relaxing sleep calm soothing" |
| Motivated | "workout motivation pump up energetic" |
| In Love | "romantic love songs ballads" |
| Confident | "confident empowering boss anthem" |
| Guilty | "reflective introspective emotional" |
| Confused | "contemplative indie folk introspective" |
| Hopeful | "inspiring uplifting hope optimistic" |
| Overwhelmed | "calming meditation zen relaxing" |
| Bored | "energetic upbeat motivational pump up" |

## 🔐 Why Not Full Auto-Creation?

### Current Limitation:
- **Client Credentials** flow can only search/read
- **Cannot create playlists** or modify user data
- This is a Spotify API security feature

### Solution (Future):
Implement **OAuth 2.0 Authorization Code Flow**:

```javascript
// 1. User clicks "Connect Spotify"
// 2. Redirects to Spotify login
// 3. User authorizes MoodSync
// 4. Get access token with playlist permissions
// 5. Create playlists automatically!
```

## 📋 Track URI Format

Spotify Track URIs look like this:
```
spotify:track:6rqhFgbbKwnb9MLmUQDhG6
```

You can paste multiple URIs at once in Spotify:
```
spotify:track:6rqhFgbbKwnb9MLmUQDhG6
spotify:track:0VjIjW4GlUZAMYd2vXMi3b
spotify:track:3n3Ppam7vgaVa1iaRUc9Lp
```

## 🎨 UI Components

### Create Playlist Button
- Green Spotify-themed button
- Shows loading state while processing
- Opens modal with options

### Playlist Modal
- **Option 1**: Copy track URIs
- **Option 2**: Open Spotify search
- **Option 3**: Info about OAuth

### Track List
- Album artwork
- Track name & artist
- Duration
- Direct Spotify link
- Click anywhere to open in Spotify

## 🚀 Future Enhancements

### Phase 1 (Current): ✅
- [x] Auto-refreshing tokens
- [x] Mood-based track search
- [x] Track URI generation
- [x] Copy-paste workflow

### Phase 2 (Next):
- [ ] OAuth 2.0 integration
- [ ] One-click playlist creation
- [ ] Save to Spotify library
- [ ] Playlist customization

### Phase 3 (Future):
- [ ] Collaborative playlists
- [ ] Share playlists with friends
- [ ] Playlist history & analytics
- [ ] Custom mood queries

## 💡 Tips

1. **Desktop App Works Best**: Spotify desktop app handles URI pasting better than web
2. **Create Playlist First**: Make an empty playlist before pasting URIs
3. **Batch Paste**: You can paste all URIs at once
4. **Save Favorites**: Bookmark playlists you love
5. **Mix Moods**: Combine tracks from different mood entries

## 🐛 Troubleshooting

### "No Spotify recommendations available"
- Check if server is running
- Verify Spotify credentials in `.env`
- Check server logs for errors

### "Failed to create playlist"
- This is expected (OAuth not implemented yet)
- Use the copy URIs method instead

### Tracks won't open in Spotify
- Make sure Spotify app is installed
- Try the web player: https://open.spotify.com

### Token expired errors
- Server auto-refreshes tokens
- Restart server if issues persist

## 📚 Resources

- [Spotify Web API Docs](https://developer.spotify.com/documentation/web-api)
- [OAuth 2.0 Guide](https://developer.spotify.com/documentation/web-api/concepts/authorization)
- [Track URIs Explained](https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids)

---

Made with 💙 by Subharup
