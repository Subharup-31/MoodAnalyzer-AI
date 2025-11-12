# Firebase Authentication Setup Guide

## Overview
MoodSync now includes complete user authentication, allowing users to:
- ✅ Create accounts with email/password
- ✅ Sign in with Google
- ✅ Reset forgotten passwords
- ✅ Access personalized dashboards
- ✅ Sync data across devices
- ✅ Keep journals private and secure

## Setup Steps

### 1. Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your MoodSync project
3. Click "Authentication" in the left sidebar
4. Click "Get Started"

### 2. Enable Sign-In Methods

#### Email/Password Authentication:
1. Go to "Sign-in method" tab
2. Click "Email/Password"
3. Enable the first toggle (Email/Password)
4. Click "Save"

#### Google Sign-In (Optional but Recommended):
1. In "Sign-in method" tab
2. Click "Google"
3. Enable the toggle
4. Select a support email
5. Click "Save"

### 3. Configure Authorized Domains

1. In "Sign-in method" tab, scroll to "Authorized domains"
2. Add your domain (e.g., `localhost` for development)
3. For production, add your actual domain

### 4. Update Firestore Security Rules

Go to Firestore Database > Rules and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Journal entries - users can only access their own
    match /journal_entries/{entryId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 5. Test Authentication

1. Open your app in a browser
2. You should see the sign-in screen
3. Try creating an account
4. Try signing in with Google
5. Verify you can access the main app

## Features

### User Registration
- Email and password with display name
- Password must be at least 6 characters
- Automatic profile creation

### Sign In Options
- Email/password authentication
- Google OAuth (one-click sign in)
- Password reset via email

### Security Features
- User-specific data isolation
- Secure authentication tokens
- Automatic session management
- Protected API endpoints

### Data Privacy
- Each user only sees their own journal entries
- Data is encrypted in transit
- Firebase security rules enforce access control
- Local storage is user-specific

## User Experience

### First Time Users
1. Click "Create Account"
2. Enter name, email, and password
3. Automatically signed in
4. Start journaling immediately

### Returning Users
1. Enter email and password
2. Click "Sign In"
3. Access all previous entries
4. Continue journaling

### Forgot Password
1. Click "Forgot Password?"
2. Enter email address
3. Check email for reset link
4. Create new password

## Troubleshooting

### "Email already in use"
- This email is already registered
- Try signing in instead
- Use password reset if forgotten

### "Invalid email or password"
- Check email spelling
- Verify password is correct
- Use password reset if needed

### "Google sign-in failed"
- Ensure Google sign-in is enabled in Firebase
- Check authorized domains
- Try clearing browser cache

### "Permission denied"
- Firestore security rules may be incorrect
- Verify user is authenticated
- Check console for detailed errors

## Development vs Production

### Development (localhost)
- Firebase automatically allows localhost
- No additional configuration needed
- Test all features locally

### Production
1. Add your domain to authorized domains
2. Update CORS settings if needed
3. Enable production security rules
4. Test thoroughly before launch

## Best Practices

### Security
- Never share Firebase config publicly (use environment variables in production)
- Implement rate limiting for authentication
- Monitor authentication logs
- Use strong password requirements

### User Experience
- Provide clear error messages
- Auto-save journal entries
- Implement offline support
- Show loading states

### Data Management
- Regular backups
- Data export functionality
- Account deletion option
- Privacy policy compliance

## Next Steps

After authentication is working:
1. Test with multiple users
2. Verify data isolation
3. Test password reset flow
4. Test Google sign-in
5. Monitor Firebase usage
6. Set up billing alerts

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify Firebase configuration
3. Check Firestore security rules
4. Review Firebase Authentication logs
5. Test with different browsers

## Privacy & Compliance

- Users own their data
- Data is stored securely in Firebase
- Implement GDPR compliance if needed
- Provide data export/deletion options
- Create privacy policy and terms of service