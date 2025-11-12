# 🚨 Quick Fix for Your Current Errors

## Error 1: `auth/invalid-credential`

### What it means:
You're trying to sign in with an email/password that doesn't exist yet.

### ✅ Solution:
**You need to CREATE an account first, not sign in!**

1. On the sign-in screen, click **"Create Account"** at the bottom
2. Enter your name, email, and password
3. Click "Create Account"
4. Now you can sign in with those credentials

---

## Error 2: `auth/unauthorized-domain`

### What it means:
Your current domain (`${window.location.hostname}`) is not authorized in Firebase.

### ✅ Solution:
**Add your domain to Firebase authorized domains:**

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your "moodsync-75abf" project

2. **Navigate to Authentication Settings**
   - Click "Authentication" in the left sidebar
   - Click the "Settings" tab at the top
   - Scroll down to "Authorized domains"

3. **Add Your Domain**
   - Click "Add domain" button
   - Type: `localhost` (if running locally)
   - Or type: `127.0.0.1` (alternative)
   - Or type your actual domain name
   - Click "Add"

4. **Refresh Your App**
   - Go back to your app
   - Refresh the page (Ctrl+R or Cmd+R)
   - Try Google sign-in again

### Common domains to add:
```
localhost
127.0.0.1
file://
```

---

## 🎯 Step-by-Step First Time Setup

### Step 1: Fix Authorized Domain (for Google Sign-In)
1. Firebase Console → Authentication → Settings → Authorized domains
2. Add `localhost` and `127.0.0.1`
3. Click "Add"

### Step 2: Create Your First Account
1. Open your MoodSync app
2. Click **"Create Account"** (not "Sign In")
3. Fill in:
   - Display Name: Your name
   - Email: your@email.com
   - Password: at least 6 characters
4. Click "Create Account"
5. You're now signed in!

### Step 3: Start Journaling
1. Write your first entry
2. Click "Save Entry"
3. See your mood analysis and AI response

---

## 🔍 Verify Your Setup

Run the setup verification tool:
1. Open `verify-setup.html` in your browser
2. Click "Run Setup Checks"
3. Fix any errors shown

---

## 📞 Still Having Issues?

### Check These:
- [ ] Firebase project exists at console.firebase.google.com
- [ ] Email/Password authentication is enabled in Firebase
- [ ] Your domain is in authorized domains list
- [ ] You're creating an account (not signing in) for first time
- [ ] Password is at least 6 characters

### Get More Help:
- See `TROUBLESHOOTING.md` for detailed solutions
- See `AUTHENTICATION_SETUP.md` for complete setup guide
- Check browser console (F12) for detailed error messages

---

## ✅ Success Checklist

You'll know it's working when:
- [ ] You can create an account without errors
- [ ] You can sign in with your email/password
- [ ] You can sign in with Google (if domain is authorized)
- [ ] You see the main app with your name in the header
- [ ] You can write and save journal entries

---

## 🎉 Quick Test

1. **Create Account:**
   - Name: Test User
   - Email: test@example.com
   - Password: test123

2. **Write Entry:**
   - "I'm testing MoodSync and it's working great!"

3. **Check Results:**
   - See mood detected
   - See AI response
   - See entry in history

If all three work, you're all set! 🚀