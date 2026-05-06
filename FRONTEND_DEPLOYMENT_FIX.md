# 🔧 Frontend Deployment Fix - Railway

## 🚨 Issue: Frontend Not Loading/Deploying

### Quick Diagnosis Checklist

Check these in Railway Dashboard → Frontend Service:

1. **Deployment Status**
   - Go to "Deployments" tab
   - Is it showing "Failed", "Building", or "Success"?
   - Click on the latest deployment to see logs

2. **Build Logs**
   - Look for error messages in the build logs
   - Common errors:
     - `npm ERR!` - Dependency issues
     - `Type error` - TypeScript compilation errors
     - `Module not found` - Missing dependencies
     - `Out of memory` - Build needs more RAM

3. **Runtime Logs**
   - After build succeeds, check runtime logs
   - Look for:
     - `ready started server on 0.0.0.0:3000`
     - Any error messages
     - Port binding issues

---

## ✅ Solution Steps

### Step 1: Verify Railway Configuration

**In Railway Dashboard → Frontend Service → Settings:**

1. **Root Directory**: Must be set to `Frontend`
   - If blank or wrong, set it to: `Frontend`
   - Save and redeploy

2. **Build Command** (optional, Railway auto-detects):
   - Should be: `npm run build` or auto-detected
   - Usually you don't need to set this

3. **Start Command** (optional):
   - Should be: `npm start` or auto-detected
   - Usually you don't need to set this

4. **Node Version** (if needed):
   - Add environment variable: `NODE_VERSION=18`
   - Or create `.nvmrc` file with `18`

---

### Step 2: Add Required Environment Variable

**In Railway Dashboard → Frontend Service → Variables:**

Add this variable (CRITICAL!):

```
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.railway.app/api
```

**⚠️ IMPORTANT**: Replace `YOUR-BACKEND-URL` with your actual backend Railway domain!

Example:
```
NEXT_PUBLIC_API_URL=https://task-management-backend-production.up.railway.app/api
```

**How to get your backend URL:**
1. Go to Backend service in Railway
2. Click "Settings" → "Networking"
3. Copy the domain (e.g., `backend-production-xxxx.up.railway.app`)
4. Add `https://` at the start and `/api` at the end

---

### Step 3: Check Package.json Scripts

Your `Frontend/package.json` should have:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

✅ This is correct! No changes needed.

---

### Step 4: Verify Next.js Configuration

Your `Frontend/next.config.js` should be:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

✅ This is correct! No changes needed.

---

### Step 5: Force Redeploy

After making any changes:

1. Go to Railway Dashboard → Frontend Service
2. Click "Deployments" tab
3. Click "..." (three dots) on the latest deployment
4. Click "Redeploy"
5. Wait 3-5 minutes for build to complete

---

## 🐛 Common Issues & Fixes

### Issue 1: "Build Failed" - Out of Memory

**Symptom**: Build logs show `JavaScript heap out of memory`

**Fix**: Add environment variable in Railway:
```
NODE_OPTIONS=--max-old-space-size=4096
```

---

### Issue 2: "Module not found" Error

**Symptom**: Build fails with `Cannot find module 'xyz'`

**Fix**: 
1. Check if dependency is in `package.json`
2. If missing, add it locally and push:
   ```bash
   cd Frontend
   npm install xyz
   git add package.json package-lock.json
   git commit -m "Add missing dependency"
   git push
   ```

---

### Issue 3: TypeScript Errors During Build

**Symptom**: Build fails with `Type error: ...`

**Fix**: 
1. Run locally to see errors:
   ```bash
   cd Frontend
   npm run build
   ```
2. Fix TypeScript errors
3. Push changes

---

### Issue 4: Build Succeeds but App Doesn't Load

**Symptom**: Deployment shows "Success" but visiting URL shows error

**Possible Causes:**

**A. Port Binding Issue**
- Railway expects app to listen on `0.0.0.0` not `localhost`
- Next.js does this by default ✅

**B. Missing Environment Variable**
- Add `NEXT_PUBLIC_API_URL` in Railway Variables
- Must start with `NEXT_PUBLIC_` to work in browser

**C. Start Command Wrong**
- Should be `npm start` or `next start`
- Check in Settings → Deploy section

---

### Issue 5: "Application Error" or 502 Bad Gateway

**Symptom**: Visiting frontend URL shows "Application Error"

**Fix**:
1. Check runtime logs in Railway
2. Look for error messages
3. Common causes:
   - App crashed on startup
   - Port not binding correctly
   - Missing dependencies

**Solution**:
```bash
# In Railway Variables, add:
PORT=3000
```

---

### Issue 6: Deployment Stuck on "Building"

**Symptom**: Deployment stays in "Building" state for >10 minutes

**Fix**:
1. Cancel the deployment
2. Check if there's a `.next` folder in git (shouldn't be)
3. Make sure `.gitignore` includes `.next`
4. Redeploy

---

## 🔍 How to Read Railway Logs

### Build Logs (during deployment):

**Good signs:**
```
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
Route (app)                              Size
┌ ○ /                                    ...
└ ○ /login                               ...
```

**Bad signs:**
```
npm ERR! code ELIFECYCLE
Type error: ...
Error: Cannot find module ...
FATAL ERROR: ... JavaScript heap out of memory
```

### Runtime Logs (after deployment):

**Good signs:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

**Bad signs:**
```
Error: listen EADDRINUSE: address already in use
Unhandled rejection
Application error
```

---

## 📋 Complete Troubleshooting Checklist

Go through these in order:

- [ ] Root Directory is set to `Frontend`
- [ ] `NEXT_PUBLIC_API_URL` environment variable is set
- [ ] Backend URL in variable is correct (with `https://` and `/api`)
- [ ] Deployment shows "Success" (green checkmark)
- [ ] Build logs show no errors
- [ ] Runtime logs show "ready - started server"
- [ ] Domain is generated in Settings → Networking
- [ ] Visiting domain doesn't show Railway error page

---

## 🚀 Step-by-Step Fix Process

### 1. Check Current Status

```
Railway Dashboard → Frontend Service → Deployments
```

- If "Failed": Read build logs, fix errors, redeploy
- If "Success" but not loading: Check runtime logs
- If "Building" for >10 min: Cancel and redeploy

### 2. Verify Configuration

```
Railway Dashboard → Frontend Service → Settings
```

- Root Directory: `Frontend` ✅
- No custom build/start commands needed (Railway auto-detects)

### 3. Add Environment Variable

```
Railway Dashboard → Frontend Service → Variables
```

Add:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

### 4. Redeploy

```
Railway Dashboard → Frontend Service → Deployments → ... → Redeploy
```

Wait 3-5 minutes.

### 5. Test

Visit your frontend URL:
```
https://your-frontend-url.railway.app
```

Should redirect to `/login` page.

---

## 🎯 What Should Happen

### Successful Deployment:

1. **Build Phase** (2-3 minutes):
   - Install dependencies
   - Build Next.js app
   - Generate static pages
   - Optimize bundles

2. **Deploy Phase** (30 seconds):
   - Start Next.js server
   - Bind to port 3000
   - Server ready

3. **Runtime**:
   - App accessible at Railway URL
   - Redirects to login page
   - No errors in browser console

---

## 💡 Pro Tips

1. **Check Backend First**: Make sure backend is working before debugging frontend
   - Test: `https://your-backend-url.railway.app/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Use Railway CLI** (optional):
   ```bash
   npm i -g @railway/cli
   railway login
   railway logs
   ```

3. **Local Build Test**:
   ```bash
   cd Frontend
   npm run build
   npm start
   ```
   If it works locally but not on Railway, it's a Railway config issue.

4. **Clear Railway Cache** (if needed):
   - Delete the service
   - Create new service
   - Set Root Directory and variables again

5. **Check Railway Status**:
   - Visit: https://status.railway.app
   - Make sure Railway isn't having issues

---

## 📞 Still Not Working?

### Get Detailed Logs:

1. Railway Dashboard → Frontend Service → Deployments
2. Click on latest deployment
3. Copy all logs
4. Look for the first error message

### Common Error Messages:

**"Cannot find module"**
→ Missing dependency in package.json

**"Type error"**
→ TypeScript compilation error

**"ELIFECYCLE"**
→ Build script failed

**"heap out of memory"**
→ Add `NODE_OPTIONS=--max-old-space-size=4096`

**"EADDRINUSE"**
→ Port conflict (shouldn't happen on Railway)

**"Application error"**
→ App crashed, check runtime logs

---

## ✅ Success Indicators

When everything is working:

- ✅ Deployment status: "Success" (green checkmark)
- ✅ Build logs: No errors, shows "Finalizing page optimization"
- ✅ Runtime logs: "ready - started server on 0.0.0.0:3000"
- ✅ Visiting URL: Shows login page (not Railway error)
- ✅ Browser console: No errors
- ✅ Can navigate to signup page

---

## 🔄 Quick Reset (Last Resort)

If nothing works:

1. **Delete Frontend Service** in Railway
2. **Create New Service**:
   - New → GitHub Repo → Select same repo
3. **Configure**:
   - Settings → Root Directory: `Frontend`
   - Variables → Add `NEXT_PUBLIC_API_URL`
   - Settings → Networking → Generate Domain
4. **Wait for Deployment**
5. **Test**

---

## 📝 What to Share if You Need Help

If you need to ask for help, provide:

1. **Deployment Status**: Failed/Success/Building
2. **Build Logs**: Copy the last 50 lines
3. **Runtime Logs**: Copy the last 20 lines
4. **Configuration**:
   - Root Directory setting
   - Environment variables (hide sensitive values)
5. **Error Message**: The exact error you're seeing

---

**Most Common Fix**: Add `NEXT_PUBLIC_API_URL` environment variable with your backend URL! 🎯
