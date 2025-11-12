# MoodSync Troubleshooting Guide

## 🔴 Common Authentication Errors

### Error: `auth/invalid-credential` or `auth/user-not-found`

**Problem:** The email/password combination doesn't exist in Firebase.

**Solutions:**
1. **Create a new account first**
   - Click "Create Account" instead of "Sign In"
   - Enter your details and create an account
   - Then you can sign in with those credentials

2. **Check your credentials**
   - Verify email spelling
   - Check password (case-sensitive)
   - Try password reset if forgotten

3. **Verify Firebase is configured**
   - Check `config.js` has correct Firebase settings
   - Ensure Firebase project exists

---

### Error: `auth/unauthorized-domain`

**Problem:** Your current domain is not authorized in Firebase.

**Solution - Add Authorized Domain:**

1. **Go to Firebase Console**
   - Visit [Firebase Console](https://console.firebase.google.com/)
   - Select your MoodSync project

2. **Navigate to Authentication**
   - Click "Authentication" in left sidebar
   - Click "Settings" tab
   - Scroll to "Authorized domains"

3. **Add Your Domain**
   - Click "Add domain"
   - Add one of these:
     - `localhost` (for local development)
     - `127.0.0.1` (alternative local)
     - Your actual domain (for production)
   - Click "Add"

4. **Common Domains to Add:**
   ```
   localhost
   127.0.0.1
   yourdomain.com
   www.yourdomain.com
   ```

5. **Refresh and Try Again**
   - Reload your app
   - Try signing in with Google again

---

### Error: `auth/email-already-in-use`

**Problem:** This email is already registered.

**Solutions:**
1. Click "Sign In" instead of "Create Account"
2. Use "Forgot Password" if you don't remember it
3. Use a different email address

---

### Error: `auth/weak-password`

**Problem:** Password doesn't meet requirements.

**Solution:**
- Use at least 6 characters
- Include letters and numbers
- Consider using special characters

---

### Error: `auth/popup-blocked`

**Problem:** Browser blocked the Google sign-in popup.

**Solutions:**
1. **Allow Pop-ups**
   - Click the popup blocker icon in address bar
   - Allow pop-ups for this site
   - Try again

2. **Check Browser Settings**
   - Go to browser settings
   - Find "Pop-ups and redirects"
   - Add exception for your domain

---

## 🔧 Firebase Setup Issues

### Firebase Not Initialized

**Symptoms:**
- Console shows "Firebase not configured"
- Can't sign in or sign up

**Solution:**
1. Check `config.js` has valid Firebase configuration
2. Verify API key is correct
3. Ensure Firebase project exists
4. See `AUTHENTICATION_SETUP.md` for setup steps

---

### Authentication Not Enabled

**Symptoms:**
- Error: "operation-not-allowed"
- Can't create accounts

**Solution:**
1. Go to Firebase Console → Authentication
2. Click "Sign-in method" tab
3. Enable "Email/Password"
4. Enable "Google" (optional)
5. Click "Save"

---

### Firestore Permission Denied

**Symptoms:**
- Can't save journal entries
- Error: "permission-denied"

**Solution:**
1. Go to Firebase Console → Firestore Database
2. Click "Rules" tab
3. Update rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /journal_entries/{entryId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

4. Click "Publish"

---

## 🌐 Network & Connection Issues

### Can't Connect to Firebase

**Symptoms:**
- Timeout errors
- Network errors

**Solutions:**
1. Check internet connection
2. Verify Firebase is not blocked by firewall
3. Try different network
4. Check Firebase status page

---

### CORS Errors

**Symptoms:**
- Cross-origin errors in console
- API requests blocked

**Solutions:**
1. Use a local server instead of file://
   ```bash
   python3 -m http.server 8080
   ```
2. Add domain to Firebase authorized domains
3. Check browser console for specific CORS errors

---

## 📱 Browser Issues

### Cookies/Storage Disabled

**Symptoms:**
- Can't stay signed in
- Data not saving

**Solutions:**
1. Enable cookies in browser settings
2. Enable local storage
3. Check if in private/incognito mode
4. Try different browser

---

### Cache Issues

**Symptoms:**
- Old version of app loading
- Changes not appearing

**Solutions:**
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Clear site data in browser settings
4. Try incognito/private mode

---

## 🔑 API Key Issues

### Invalid API Key

**Symptoms:**
- Error: "API key not valid"
- Authentication fails

**Solutions:**
1. Verify API key in `config.js` matches Firebase
2. Check for extra spaces or characters
3. Regenerate API key in Firebase Console
4. Ensure API key restrictions allow your domain

---

### Gemini API Not Working

**Symptoms:**
- No AI responses
- Generic template responses only

**Solutions:**
1. Verify Gemini API key in `config.js`
2. Check API key is active at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Verify API quota not exceeded
4. App will use fallback templates if API fails (this is normal)

---

## 📊 Data Issues

### Entries Not Saving

**Symptoms:**
- Journal entries disappear
- Can't see past entries

**Solutions:**
1. Check if signed in (look for user email in header)
2. Verify Firestore rules are correct
3. Check browser console for errors
4. Ensure internet connection for cloud sync

---

### Can't See Old Entries

**Symptoms:**
- Previous entries missing
- Empty journal history

**Solutions:**
1. Verify you're signed in with correct account
2. Check if entries were saved to different account
3. Look in browser console for loading errors
4. Check Firestore database in Firebase Console

---

## 🚀 Quick Fixes Checklist

Before asking for help, try these:

- [ ] Hard refresh the page (Ctrl+Shift+R)
- [ ] Check browser console for errors (F12)
- [ ] Verify Firebase configuration in `config.js`
- [ ] Ensure you're signed in
- [ ] Check internet connection
- [ ] Try different browser
- [ ] Clear browser cache
- [ ] Check Firebase Console for issues
- [ ] Verify authorized domains in Firebase
- [ ] Check Firestore security rules

---

## 🆘 Still Need Help?

### Check Console Logs
1. Press F12 to open browser console
2. Look for red error messages
3. Copy the full error message
4. Search for the error code online

### Firebase Console
1. Check Authentication logs
2. Review Firestore usage
3. Check for quota limits
4. Verify billing status

### Common Error Codes
- `auth/invalid-credential` → Wrong email/password
- `auth/user-not-found` → Account doesn't exist
- `auth/unauthorized-domain` → Add domain to Firebase
- `auth/email-already-in-use` → Use sign in instead
- `auth/weak-password` → Use stronger password
- `permission-denied` → Fix Firestore rules

---

## 📝 Reporting Issues

If you still have problems, provide:
1. Error message from console
2. Steps to reproduce
3. Browser and version
4. What you've already tried
5. Screenshots if helpful

---

## ✅ Success Checklist

Your setup is working correctly if:
- [ ] You can create an account
- [ ] You can sign in with email/password
- [ ] You can sign in with Google (if enabled)
- [ ] You can write and save journal entries
- [ ] You see AI responses to entries
- [ ] Charts display your mood data
- [ ] You can sign out and sign back in
- [ ] Your data persists across sessions