# 📱 Complete PWA Installation Guide

## ⚠️ CRITICAL: Understanding the Difference

**You said:** "Everything loads, but it's all in the internet browser. I want a PWA on my phone."

**The Problem:** You're viewing sqorz in Safari instead of as a standalone PWA app.

**The Solution:** You need to install it to your home screen and launch from there!

---

## 🎯 What You're Getting

Once properly installed, sqorz will be a **true PWA** with:

✅ **Standalone Mode** - Opens like a native app (NO Safari UI)  
✅ **Offline Support** - Works without internet (cached games)  
✅ **Push Notifications** - Get alerts for game updates  
✅ **Fast Loading** - Instant launch from cached assets  
✅ **Home Screen Icon** - Quick access like any app  
✅ **Background Sync** - Updates when you're offline  

---

## 🚨 THE #1 MISTAKE

**❌ WRONG:** Opening sqorz from Safari bookmarks or tabs  
**✅ CORRECT:** Tapping the home screen icon after installation  

**Only the home screen icon launches standalone mode!**

---

## 📋 Complete Installation Steps

### Step 1: Verify Icons Are Working

**Navigate to:** `/test-external-icons.html`

**You should see:**
- ✅ All 3 icons load successfully  
- ✅ Icon previews display correctly  
- ✅ "ALL CHECKS PASSED" message  

**If icons fail**, stop and use `/icon-generator.html` to create them.

---

### Step 2: Delete Old Version

If you already have sqorz on your home screen:

1. **Long press** the sqorz icon  
2. Tap **"Remove App"**  
3. Tap **"Delete App"**  

This ensures a clean installation.

---

### Step 3: Clear Safari Data

1. Open **Settings** on your iPhone  
2. Scroll to **Safari**  
3. Tap **"Clear History and Website Data"**  
4. Tap **"Clear History and Data"** to confirm  

This removes old cached data.

---

### Step 4: Force Close Safari

1. Swipe up from the bottom (or double-click home button)  
2. Swipe Safari app away  

This ensures a fresh start.

---

### Step 5: Navigate to sqorz

1. **Open Safari**  
2. Type/paste your sqorz URL  
3. **Wait 2-3 seconds** for page to fully load  
4. Verify you see the NBA scores interface  

---

### Step 6: Add to Home Screen

1. Tap the **Share button** (square with arrow up)  
2. Scroll down and tap **"Add to Home Screen"**  

**⚠️ CRITICAL CHECK:**

Look at the icon preview at the top of the dialog:

- ✅ **CORRECT:** Shows "sq" in white on dark background  
- ❌ **WRONG:** Shows a webpage screenshot  

**If you see a webpage screenshot, STOP!** The icons aren't loading. Go to `/test-external-icons.html` to debug.

---

### Step 7: Confirm Installation

1. Name should default to **"sqorz"**  
2. Tap **"Add"** in top right  
3. Icon appears on your home screen  

---

### Step 8: Launch as PWA

**🎯 THIS IS THE CRITICAL STEP:**

1. **Close Safari completely** (swipe away)  
2. **Find the sqorz icon** on your home screen  
3. **Tap the icon to launch**  

**DO NOT:**
- ❌ Open Safari and visit the URL  
- ❌ Use Safari bookmarks  
- ❌ Open from Safari tabs  

**ONLY tap the home screen icon!**

---

## ✅ How to Tell It Worked

When you tap the home screen icon:

### ✅ SUCCESS Indicators:
- **No Safari address bar** at the top  
- **No browser controls** at the bottom  
- **Full screen app** experience  
- **Status bar integrated** with app  
- **Feels like a native app**  
- **Offline mode works** (test with airplane mode)  
- **Push notification prompt** appears  

### ❌ FAILURE Indicators:
- Safari UI visible (address bar, toolbar)  
- Opens in Safari browser tab  
- Can see Safari chrome  
- "Add to Home Screen" option still appears  

---

## 🔧 PWA Features You Now Have

### 1. Offline Support

**Test it:**
1. Open sqorz from home screen  
2. Browse some games  
3. Enable airplane mode  
4. Refresh the app  
5. You'll see "Offline - Showing cached data" banner  
6. Previously viewed games still work!  

### 2. Push Notifications

**Enable them:**
1. Open sqorz from home screen  
2. Look for notification prompt in bottom-right  
3. Tap "Enable Notifications"  
4. Grant permission  
5. Tap "Send Test Notification"  

**Note:** iOS push notifications have limitations. Full push requires iOS 16.4+ and may not work in all regions.

### 3. Standalone Mode

**You're now in standalone mode if:**
- No Safari UI visible  
- App runs independently  
- Can see app switcher shows "sqorz" separately from Safari  

---

## 🐛 Troubleshooting

### "It still opens in Safari!"

**You're probably doing one of these:**
- ❌ Opening from Safari bookmark  
- ❌ Opening from Safari tab  
- ❌ Typing URL in Safari  
- ❌ Using Siri to open "sqorz website"  

**Fix:**  
Tap the **HOME SCREEN ICON** only!

---

### "The icon preview showed a webpage screenshot"

**Problem:** Icons aren't loading  

**Fix:**
1. Go to `/test-external-icons.html`  
2. If icons fail, use `/icon-generator.html`  
3. Download the 3 icons  
4. Upload to Imgur.com  
5. Send me the URLs  
6. I'll update the manifest  

---

### "I don't see the offline banner"

**Problem:** Service worker not activated  

**Fix:**
1. Go to `/debug.html`  
2. Check "Service Worker Status"  
3. If not "activated", unregister and reload  
4. Try fresh installation  

---

### "Push notifications don't work"

**Possible reasons:**
- iOS version < 16.4  
- Not in standalone mode  
- Notifications blocked in Settings  
- Corporate/School device restrictions  

**Fix:**
1. Check iOS version (Settings → General → About)  
2. Verify standalone mode (`/?diagnostic=true`)  
3. Settings → Safari → sqorz → Allow Notifications  

---

## 📊 Verification Checklist

Before claiming "it doesn't work":

- [ ] Deleted old app from home screen  
- [ ] Cleared Safari website data  
- [ ] Force closed Safari  
- [ ] Icons passed test at `/test-external-icons.html`  
- [ ] Icon preview showed "sq" (not webpage screenshot)  
- [ ] Tapped home screen icon (not Safari bookmark)  
- [ ] App opened without Safari UI  
- [ ] Tested offline mode (airplane mode)  

---

## 🎯 Quick Tests

### Test 1: Standalone Mode Check

**Navigate to:** `/?diagnostic=true`

Look for:
- ✅ "Standalone Mode: PWA Installed"  

If it says "Running in Browser", you're not in standalone mode.

---

### Test 2: Installation Guide

**Navigate to:** `/install-guide.html`

This page:
- Detects if you're in standalone mode  
- Shows step-by-step instructions  
- Auto-updates when you switch modes  

---

### Test 3: Offline Mode

1. Open sqorz from home screen  
2. Enable airplane mode  
3. Refresh the app  
4. Should show "Offline - Showing cached data" banner  
5. Previously viewed games should still work  

---

## 💡 Understanding PWAs on iOS

### What iOS Supports:
- ✅ Standalone mode (no browser UI)  
- ✅ Offline caching via Service Worker  
- ✅ Home screen installation  
- ✅ Push notifications (iOS 16.4+)  
- ✅ Background sync  

### What iOS Doesn't Support (Yet):
- ❌ Install prompt (must manually "Add to Home Screen")  
- ❌ Push notifications before iOS 16.4  
- ❌ Advanced PWA features (share target, file handling, etc.)  

### iOS PWA Quirks:
- Must launch from home screen icon for standalone mode  
- Safari bookmarks always open in Safari  
- Service worker has storage limits  
- Push notifications require user interaction  

---

## 🚀 Final Steps

**RIGHT NOW:**

1. **Open Safari** on your iPhone  
2. **Navigate to:** `/install-guide.html`  
3. **Follow the installation steps**  
4. **Launch from home screen**  
5. **Report back:**  
   - Did you tap the home screen icon?  
   - Do you see Safari UI or full screen?  
   - Does offline mode work?  
   - Did you get the push notification prompt?  

---

## ✅ Success Criteria

You'll know it worked when:

1. **Tapping home screen icon** opens full-screen app  
2. **No Safari UI** visible (no address bar, no toolbar)  
3. **Airplane mode** shows "Offline" banner but app still works  
4. **Push notification prompt** appears in bottom-right  
5. **App switcher** shows "sqorz" separately from Safari  

---

**The key is:** You MUST tap the home screen icon. No other method will give you standalone mode!

**Test it now:** `/install-guide.html` 🚀
