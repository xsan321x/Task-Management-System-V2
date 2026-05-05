# Environment Variables Setup Guide

**Status**: ✅ FIXED  
**Date**: May 5, 2026

---

## ❌ What Was Wrong

The original `.env.example` had a **hardcoded production URL**:
```
NEXT_PUBLIC_API_URL=https://task-management-system-v2-production.up.railway.app/api
```

**Problem**: This URL is from your **old Railway backend**. When you deploy on Railway, you'll get a **new backend URL**, and this hardcoded URL will break your deployment.

---

## ✅ What's Fixed Now

Both files now use a **placeholder URL**:
```
NEXT_PUBLIC_API_URL=https://your-backend-railway-url.up.railway.app/api
```

**Benefit**: This makes it clear that you need to replace it with your actual backend URL.

---

## 📋 How to Set Environment Variables

### Step 1: Deploy Backend on Railway

1. Go to Railway dashboard
2. Deploy backend from `/Backend` directory
3. Get the backend URL (e.g., `https://task-management-system-v2-production.up.railway.app`)

### Step 2: Deploy Frontend on Railway

1. Go to Railway dashboard
2. Deploy frontend from `/Frontend` directory
3. Go to Frontend service → Settings → Variables
4. Add variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url/api
   ```
   Replace `your-backend-url` with your actual backend URL from Step 1

### Step 3: Update .env.local (Local Development)

If you want to test locally:

1. Open `Frontend/.env.local`
2. Replace the placeholder with your actual backend URL:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url/api
   ```
3. Save the file

---

## 📝 Environment Files Explained

### Frontend/.env.example
- **Purpose**: Template for environment variables
- **Usage**: Shows what variables are needed
- **Content**: Placeholder values (not real URLs)
- **Git**: Committed to GitHub (safe to share)

### Frontend/.env.local
- **Purpose**: Local development environment variables
- **Usage**: Used when running `npm run dev` locally
- **Content**: Your actual backend URL
- **Git**: NOT committed (in .gitignore for security)

### Railway Environment Variables
- **Purpose**: Production environment variables
- **Usage**: Set in Railway dashboard
- **Content**: Your actual backend URL
- **Git**: NOT in git (set in Railway dashboard)

---

## 🔄 Workflow

### Local Development
```
Frontend/.env.local
    ↓
npm run dev
    ↓
Uses local backend URL
```

### Railway Production
```
Railway Dashboard → Variables
    ↓
NEXT_PUBLIC_API_URL=https://your-backend-url/api
    ↓
npm run build && npm start
    ↓
Uses production backend URL
```

---

## ✅ Correct Values

### Backend URL Format
```
https://your-backend-service-name.up.railway.app
```

### Frontend API URL Format
```
https://your-backend-service-name.up.railway.app/api
```

### Example
If your backend URL is:
```
https://task-management-system-v2-production.up.railway.app
```

Then your frontend API URL should be:
```
https://task-management-system-v2-production.up.railway.app/api
```

---

## 🚀 Deployment Checklist

- ✅ Backend deployed on Railway
- ✅ Backend URL obtained
- ✅ Frontend deployed on Railway
- ✅ Frontend NEXT_PUBLIC_API_URL set in Railway
- ✅ Backend CORS_ORIGIN updated with frontend URL
- ✅ Both services redeployed
- ✅ Test backend health check
- ✅ Test frontend loads
- ✅ Test signup/login works

---

## 🐛 Troubleshooting

### Issue: Frontend can't connect to backend

**Symptoms**: Console shows "Failed to fetch" or CORS error

**Solution**:
1. Check `NEXT_PUBLIC_API_URL` in Railway variables
2. Verify it matches your backend URL exactly
3. Include `/api` at the end
4. Use `https://` (not `http://`)

### Issue: Wrong URL in .env.local

**Symptoms**: Local development doesn't work

**Solution**:
1. Open `Frontend/.env.local`
2. Replace placeholder with actual backend URL
3. Save file
4. Restart `npm run dev`

### Issue: CORS error

**Symptoms**: Console shows CORS error

**Solution**:
1. Go to Backend service → Settings → Variables
2. Check `CORS_ORIGIN` value
3. Update to match frontend URL exactly
4. Save and wait for backend to redeploy

---

## 📊 Summary

| File | Purpose | Git | Content |
|------|---------|-----|---------|
| `.env.example` | Template | ✅ Committed | Placeholder values |
| `.env.local` | Local dev | ❌ Ignored | Actual backend URL |
| Railway Variables | Production | N/A | Actual backend URL |

---

## 🎯 Key Points

1. **Never hardcode production URLs** in `.env.example`
2. **Always use placeholders** in `.env.example`
3. **Set actual URLs** in `.env.local` (local) or Railway dashboard (production)
4. **Include `/api`** in the frontend API URL
5. **Use `https://`** for production URLs

---

**Status**: ✅ FIXED AND READY

**Next Action**: Follow the deployment guide and set environment variables correctly!

