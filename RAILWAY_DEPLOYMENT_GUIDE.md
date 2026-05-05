# TaskFlow - Railway Deployment Guide

**Status**: ✅ READY FOR RAILWAY DEPLOYMENT  
**Date**: May 5, 2026

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

Before deploying, verify:

- ✅ All unnecessary files removed
- ✅ Backend has Procfile and railway.json
- ✅ Frontend has Procfile
- ✅ Backend .env.example updated for production
- ✅ Frontend .env.example has correct API URL
- ✅ All code committed to GitHub
- ✅ No console errors in local build

---

## 🚀 Backend Deployment (Step 1)

### Step 1.1: Go to Railway Dashboard

1. Visit: https://railway.app
2. Login with your account
3. Click: "New Project"

### Step 1.2: Create Backend Service

1. Click: "Deploy from GitHub"
2. Select: Your GitHub repository
3. Select: `/Backend` directory
4. Click: "Deploy"

**Wait**: Railway will start building (2-3 minutes)

### Step 1.3: Set Environment Variables

1. Go to: Backend service → Settings
2. Click: "Variables"
3. Add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-railway-url.up.railway.app
```

**Important**: 
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Replace `JWT_SECRET` with a secure random string
- Replace `CORS_ORIGIN` with your frontend Railway URL (you'll get this after deploying frontend)

### Step 1.4: Verify Backend is Running

1. Go to: Backend service → Deployments
2. Check status is "Success" (green checkmark)
3. Note the backend URL (e.g., `https://task-management-system-v2-production.up.railway.app`)

### Step 1.5: Test Backend API

1. Open browser
2. Visit: `https://your-backend-url/api/health`
3. Should see: `{"status":"OK","message":"Server is running"}`

---

## 🎨 Frontend Deployment (Step 2)

### Step 2.1: Create Frontend Service

1. Go to: Your Railway project
2. Click: "New Service"
3. Click: "Deploy from GitHub"
4. Select: Your GitHub repository
5. Select: `/Frontend` directory
6. Click: "Deploy"

**Wait**: Railway will start building (3-5 minutes)

### Step 2.2: Set Environment Variables

1. Go to: Frontend service → Settings
2. Click: "Variables"
3. Add this variable:

```
NEXT_PUBLIC_API_URL=https://your-backend-railway-url/api
```

**Important**: Replace with your actual backend URL from Step 1.4

### Step 2.3: Configure Domain (Optional)

1. Go to: Frontend service → Settings
2. Click: "Networking"
3. You can add a custom domain here (optional)
4. Or use the Railway-generated URL

### Step 2.4: Verify Frontend is Running

1. Go to: Frontend service → Deployments
2. Check status is "Success" (green checkmark)
3. Note the frontend URL (e.g., `https://your-frontend.up.railway.app`)

### Step 2.5: Update Backend CORS

1. Go to: Backend service → Settings
2. Click: "Variables"
3. Update `CORS_ORIGIN` with your frontend URL from Step 2.4
4. Save changes

**Note**: Backend will automatically redeploy with new CORS setting

---

## 🔐 Environment Variables Setup

### Backend Environment Variables

| Variable | Value | Example |
|----------|-------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0` |
| `JWT_SECRET` | Secure random string | `your-super-secret-key-min-32-chars` |
| `NODE_ENV` | `production` | `production` |
| `PORT` | `5000` | `5000` |
| `CORS_ORIGIN` | Frontend URL | `https://your-frontend.up.railway.app` |

### Frontend Environment Variables

| Variable | Value | Example |
|----------|-------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://your-backend.up.railway.app/api` |

---

## 🧪 Testing (Step 3)

### Test 1: Backend Health Check (2 minutes)

1. Visit: `https://your-backend-url/api/health`
2. Should see: `{"status":"OK","message":"Server is running"}`
3. ✅ Backend is running

### Test 2: Frontend Loads (2 minutes)

1. Visit: `https://your-frontend-url`
2. Should see: Login page
3. ✅ Frontend is running

### Test 3: Signup (3 minutes)

1. Click: "Sign Up"
2. Enter: Name, email, password
3. Click: "Sign Up"
4. Should see: Success message
5. ✅ Frontend can communicate with backend

### Test 4: Login (2 minutes)

1. Enter: Email and password
2. Click: "Login"
3. Should see: Dashboard
4. ✅ Authentication working

### Test 5: Create Task (2 minutes)

1. Click: "New Task"
2. Enter: Title and description
3. Click: "Create"
4. Should see: Task in "Not Started" column
5. ✅ Task creation working

### Test 6: Update Task Status (2 minutes)

1. Click and drag task to "In Progress"
2. Should see: Task move to new column
3. ✅ Task update working

### Test 7: Create Category (2 minutes)

1. Click: "Add Category"
2. Enter: Name and select color
3. Click: "Create"
4. Should see: Category in category section
5. ✅ Category creation working

### Test 8: Verify No Errors (2 minutes)

1. Open: Developer Tools (F12)
2. Go to: Console tab
3. Should see: NO red errors
4. ✅ No console errors

---

## 🐛 Troubleshooting

### Issue: Backend Build Failing

**Symptoms**: Red X on backend deployment

**Solution**:
1. Go to: Backend service → Logs
2. Read error message
3. Common issues:
   - Missing environment variables
   - MongoDB connection error
   - TypeScript compilation error

**Fix**:
1. Check all environment variables are set
2. Verify MongoDB connection string
3. Check Backend/package.json has build script

### Issue: Frontend Build Failing

**Symptoms**: Red X on frontend deployment

**Solution**:
1. Go to: Frontend service → Logs
2. Read error message
3. Common issues:
   - Missing environment variables
   - API URL not set
   - Build error

**Fix**:
1. Check `NEXT_PUBLIC_API_URL` is set
2. Verify API URL is correct
3. Check Frontend/package.json has build script

### Issue: Frontend Can't Connect to Backend

**Symptoms**: Console shows "Failed to fetch" or CORS error

**Solution**:
1. Check browser console (F12)
2. Go to: Network tab
3. Look for failed API requests
4. Check error message

**Fix**:
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Verify backend URL is accessible
3. Check backend `CORS_ORIGIN` matches frontend URL
4. Verify backend is running

### Issue: Signup/Login Not Working

**Symptoms**: Error message when trying to signup/login

**Solution**:
1. Check browser console (F12)
2. Check Network tab for API response
3. Look for error message

**Fix**:
1. Verify MongoDB connection is working
2. Check JWT_SECRET is set
3. Verify backend is running
4. Check database has users table

### Issue: Tasks Not Saving

**Symptoms**: Tasks disappear after refresh

**Solution**:
1. Check browser console (F12)
2. Check Network tab for API response
3. Look for error message

**Fix**:
1. Verify MongoDB connection is working
2. Check backend is running
3. Verify database has tasks table
4. Check API response status code

### Issue: CORS Error

**Symptoms**: Console shows "CORS error" or "Access-Control-Allow-Origin"

**Solution**:
1. Go to: Backend service → Settings
2. Click: "Variables"
3. Check `CORS_ORIGIN` matches frontend URL exactly
4. Save changes (backend will redeploy)

**Fix**:
1. Verify frontend URL is correct
2. Verify CORS_ORIGIN includes https://
3. Verify no trailing slashes
4. Wait for backend to redeploy

---

## 📊 Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| Backend | ⏳ Deploying | https://your-backend.up.railway.app |
| Frontend | ⏳ Deploying | https://your-frontend.up.railway.app |
| Database | ✅ Connected | MongoDB Atlas |

---

## ⏱️ Timeline

```
Step 1: Backend Deployment
├─ Create service (1 min)
├─ Set environment variables (2 min)
├─ Build and deploy (3-5 min)
└─ Total: 6-8 minutes

Step 2: Frontend Deployment
├─ Create service (1 min)
├─ Set environment variables (2 min)
├─ Build and deploy (5-7 min)
└─ Total: 8-10 minutes

Step 3: Testing
├─ Test backend (2 min)
├─ Test frontend (2 min)
├─ Test features (5-10 min)
└─ Total: 9-14 minutes

TOTAL TIME: 23-32 minutes
```

---

## 🎯 Expected Results

After successful deployment:

✅ Backend builds and starts successfully  
✅ Frontend builds and starts successfully  
✅ Frontend can connect to backend  
✅ Signup works  
✅ Login works  
✅ Tasks can be created  
✅ Tasks can be updated  
✅ Tasks can be deleted  
✅ Categories can be created  
✅ Categories can be assigned to tasks  
✅ All features working smoothly  
✅ No console errors  
✅ No network errors  

---

## 📝 Important Notes

1. **Environment Variables**: Must be set BEFORE deployment or after deployment
2. **CORS_ORIGIN**: Must match frontend URL exactly (including https://)
3. **MongoDB**: Must be accessible from Railway (check IP whitelist)
4. **JWT_SECRET**: Should be a long random string (min 32 characters)
5. **Ports**: Railway automatically assigns ports, don't hardcode

---

## 🔗 Useful Links

| Purpose | URL |
|---------|-----|
| Railway Dashboard | https://railway.app |
| Railway Docs | https://docs.railway.app |
| GitHub Repository | https://github.com/xsan321x/Task-Management-System-V2 |

---

## 🎉 Summary

Your TaskFlow application is ready for Railway deployment. Follow the steps above to deploy both backend and frontend.

**Total Time**: 23-32 minutes  
**Difficulty**: Easy  
**Success Rate**: High (if all steps followed correctly)

---

**Status**: ✅ READY FOR RAILWAY DEPLOYMENT

**Next Action**: Follow the step-by-step guide above to deploy on Railway!

