# Firebase Setup Guide for MoodSync

## Quick Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "MoodSync" (or any name you prefer)
4. Enable Google Analytics (optional)

### 2. Setup Firestore Database
1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to you

### 3. Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add a web app
4. Register app with name "MoodSync"
5. Copy the configuration object

### 4. Update config.js
Replace the firebase section in `config.js` with your configuration:

```javascript
firebase: {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
}
```

### 5. Setup Security Rules (Optional)
In Firestore Database > Rules, you can use these basic rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /journal_entries/{document} {
      allow read, write: if true; // For development only
    }
  }
}
```

**Note:** These rules allow anyone to read/write. For production, implement proper authentication and security rules.

## Features Enabled
- ✅ Cloud storage of journal entries
- ✅ Cross-device synchronization
- ✅ Automatic backup
- ✅ Real-time updates

## Fallback
If Firebase is not configured, the app will automatically use local storage only.