# TaskFlow - Step-by-Step Railway Deployment Guide

**Status**: ✅ READY FOR RAILWAY DEPLOYMENT  
**Total Time**: 25-35 minutes  
**Difficulty**: Easy

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before starting, make sure you have:

- ✅ Railway account (https://railway.app)
- ✅ GitHub account with repository pushed
- ✅ MongoDB Atlas account with connection string
- ✅ A secure JWT secret (random string, min 32 characters)

---

## 🚀 Backend Deployment

### Step 1: Go to Railway Dashboard

**Action**: 
1. Open browser
2. Visit: https://railway.app
3. Login with your account

**Expected**: You see the Railway dashboard with your projects

---

### Step 2: Create New Project

**Action**:
1. Click: "New Project" button (top right)
2. Select: "Deploy from GitHub"

**Expected**: You see GitHub repository selection screen

---

### Step 3: Select Repository and Backend Directory

**Action**:
1. Select: Your repository (`Task-Management-System-V2`)
2. Click: "Deploy"
3. Select: `/Backend` directory (if prompted)
4. Click: "Deploy"

**Expected**: Railway starts building the backend (you see "Building..." status)

**Wait**: 3-5 minutes for build to complete

---

### Step 4: Verify Backend Build

**Action**:
1. Go to: Backend service → Deployments tab
2. Check status

**Expected**: Status shows "Success" with green checkmark

**If Failed**: 
- Click: Logs tab
- Read error message
- Fix the issue and redeploy

---

### Step 5: Set Environment Variables

**Action**:
1. Go to: Backend service → Settings
2. Click: "Variables" tab
3. Add each variable by clicking "Add Variable":

**Variable 1: MONGODB_URI**
- Key: `MONGODB_URI`
- Value: Your MongoDB connection string
- Example: `mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0`
- Click: "Add"

**Variable 2: JWT_SECRET**
- Key: `JWT_SECRET`
- Value: A secure random string (min 32 characters)
- Example: `your-super-secret-jwt-key-change-this-in-production-12345`
- Click: "Add"

**Variable 3: NODE_ENV**
- Key: `NODE_ENV`
- Value: `production`
- Click: "Add"

**Variable 4: PORT**
- Key: `PORT`
- Value: `5000`
- Click: "Add"

**Variable 5: CORS_ORIGIN**
- Key: `CORS_ORIGIN`
- Value: `https://your-frontend-url.up.railway.app` (you'll update this after frontend deployment)
- For now, use: `http://localhost:3000`
- Click: "Add"

**Expected**: All 5 variables are listed

---

### Step 6: Get Backend URL

**Action**:
1. Go to: Backend service → Settings
2. Look for: "Networking" section
3. Find: Public URL (e.g., `https://task-management-system-v2-production.up.railway.app`)
4. Copy and save this URL

**Expected**: You have the backend URL saved

---

### Step 7: Test Backend Health

**Action**:
1. Open browser
2. Visit: `https://your-backend-url/api/health`
3. Replace `your-backend-url` with your actual URL

**Expected**: You see JSON response:
```json
{"status":"OK","message":"Server is running"}
```

**If Error**: 
- Check backend logs for error
- Verify all environment variables are set
- Check MongoDB connection string is correct

---

## 🎨 Frontend Deployment

### Step 8: Create Frontend Service

**Action**:
1. Go to: Your Railway project
2. Click: "New Service" button
3. Select: "Deploy from GitHub"
4. Select: Your repository
5. Select: `/Frontend` directory
6. Click: "Deploy"

**Expected**: Railway starts building the frontend (you see "Building..." status)

**Wait**: 5-7 minutes for build to complete

---

### Step 9: Verify Frontend Build

**Action**:
1. Go to: Frontend service → Deployments tab
2. Check status

**Expected**: Status shows "Success" with green checkmark

**If Failed**: 
- Click: Logs tab
- Read error message
- Fix the issue and redeploy

---

### Step 10: Set Frontend Environment Variables

**Action**:
1. Go to: Frontend service → Settings
2. Click: "Variables" tab
3. Add variable:

**Variable: NEXT_PUBLIC_API_URL**
- Key: `NEXT_PUBLIC_API_URL`
- Value: `https://your-backend-url/api`
- Replace `your-backend-url` with your actual backend URL from Step 6
- Example: `https://task-management-system-v2-production.up.railway.app/api`
- Click: "Add"

**Expected**: Variable is listed

---

### Step 11: Get Frontend URL

**Action**:
1. Go to: Frontend service → Settings
2. Look for: "Networking" section
3. Find: Public URL (e.g., `https://your-frontend.up.railway.app`)
4. Copy and save this URL

**Expected**: You have the frontend URL saved

---

### Step 12: Update Backend CORS

**Action**:
1. Go to: Backend service → Settings
2. Click: "Variables" tab
3. Find: `CORS_ORIGIN` variable
4. Click: Edit (pencil icon)
5. Change value to: `https://your-frontend-url.up.railway.app`
6. Replace `your-frontend-url` with your actual frontend URL from Step 11
7. Click: "Save"

**Expected**: Backend automatically redeploys with new CORS setting

**Wait**: 1-2 minutes for backend to redeploy

---

## 🧪 Testing

### Test 1: Backend Health Check

**Action**:
1. Visit: `https://your-backend-url/api/health`
2. Check response

**Expected**: 
```json
{"status":"OK","message":"Server is running"}
```

**Result**: ✅ Backend is running

---

### Test 2: Frontend Loads

**Action**:
1. Visit: `https://your-frontend-url`
2. Wait for page to load

**Expected**: You see the login page

**Result**: ✅ Frontend is running

---

### Test 3: Signup

**Action**:
1. Click: "Sign Up" link
2. Enter:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPassword123`
3. Click: "Sign Up"

**Expected**: 
- Success message appears
- Redirected to login page

**Result**: ✅ Signup works

---

### Test 4: Login

**Action**:
1. Enter:
   - Email: `test@example.com`
   - Password: `TestPassword123`
2. Click: "Login"

**Expected**: 
- Redirected to dashboard
- See "Welcome" message
- See task columns

**Result**: ✅ Login works

---

### Test 5: Create Task

**Action**:
1. Click: "New Task" button
2. Enter:
   - Title: `Test Task`
   - Description: `This is a test task`
   - Priority: `High`
   - Due Date: Tomorrow
3. Click: "Create"

**Expected**: 
- Task appears in "Not Started" column
- No errors in console

**Result**: ✅ Task creation works

---

### Test 6: Update Task Status

**Action**:
1. Click and drag task to "In Progress" column
2. Release mouse

**Expected**: 
- Task moves to "In Progress" column
- No errors in console

**Result**: ✅ Task update works

---

### Test 7: Create Category

**Action**:
1. Click: "Add Category" button
2. Enter:
   - Name: `Work`
   - Color: `Blue`
3. Click: "Create"

**Expected**: 
- Category appears in category section
- No errors in console

**Result**: ✅ Category creation works

---

### Test 8: Check Console for Errors

**Action**:
1. Press: F12 (Developer Tools)
2. Go to: Console tab
3. Look for red errors

**Expected**: 
- No red error messages
- Only normal logs

**Result**: ✅ No console errors

---

### Test 9: Check Network Requests

**Action**:
1. Press: F12 (Developer Tools)
2. Go to: Network tab
3. Perform an action (login, create task)
4. Look at API requests

**Expected**: 
- All requests go to: `https://your-backend-url/api`
- Status codes are 200, 201, or 204
- No 404 or 500 errors

**Result**: ✅ API communication working

---

## 🐛 Troubleshooting

### Issue: Backend Build Failing

**Symptoms**: Red X on backend deployment

**Solution**:
1. Go to: Backend service → Logs
2. Read error message
3. Common errors:
   - `Cannot find module` → Missing dependency
   - `TypeScript error` → Code error
   - `Port already in use` → Port conflict

**Fix**:
1. Check Backend/package.json has all dependencies
2. Check Backend/src/server.ts for syntax errors
3. Verify PORT variable is set to 5000

---

### Issue: Frontend Build Failing

**Symptoms**: Red X on frontend deployment

**Solution**:
1. Go to: Frontend service → Logs
2. Read error message
3. Common errors:
   - `Cannot find module` → Missing dependency
   - `Build error` → Code error
   - `NEXT_PUBLIC_API_URL not set` → Missing variable

**Fix**:
1. Check Frontend/package.json has all dependencies
2. Check Frontend/src files for syntax errors
3. Verify NEXT_PUBLIC_API_URL variable is set

---

### Issue: Frontend Can't Connect to Backend

**Symptoms**: Console shows "Failed to fetch" or CORS error

**Solution**:
1. Open: Developer Tools (F12)
2. Go to: Console tab
3. Look for error message
4. Go to: Network tab
5. Look for failed API requests

**Fix**:
1. Verify NEXT_PUBLIC_API_URL is correct
2. Verify backend URL is accessible
3. Check backend CORS_ORIGIN matches frontend URL
4. Verify backend is running

---

### Issue: Signup/Login Not Working

**Symptoms**: Error message when trying to signup/login

**Solution**:
1. Check browser console (F12)
2. Check Network tab for API response
3. Look for error message

**Fix**:
1. Verify MongoDB connection string is correct
2. Check JWT_SECRET is set
3. Verify backend is running
4. Check MongoDB has users table

---

### Issue: Tasks Not Saving

**Symptoms**: Tasks disappear after refresh

**Solution**:
1. Check browser console (F12)
2. Check Network tab for API response
3. Look for error message

**Fix**:
1. Verify MongoDB connection string is correct
2. Check backend is running
3. Verify MongoDB has tasks table
4. Check API response status code

---

### Issue: CORS Error

**Symptoms**: Console shows "CORS error" or "Access-Control-Allow-Origin"

**Solution**:
1. Go to: Backend service → Settings → Variables
2. Check CORS_ORIGIN value
3. Verify it matches frontend URL exactly

**Fix**:
1. Update CORS_ORIGIN to match frontend URL
2. Include https:// in the URL
3. No trailing slashes
4. Save and wait for backend to redeploy

---

## ✅ Final Checklist

- ✅ Backend deployed successfully
- ✅ Frontend deployed successfully
- ✅ Backend environment variables set
- ✅ Frontend environment variables set
- ✅ Backend health check works
- ✅ Frontend loads
- ✅ Signup works
- ✅ Login works
- ✅ Tasks can be created
- ✅ Tasks can be updated
- ✅ Categories can be created
- ✅ No console errors
- ✅ API requests to correct URL

---

## 🎉 Success!

Your TaskFlow application is now deployed on Railway!

**Backend URL**: `https://your-backend-url`  
**Frontend URL**: `https://your-frontend-url`  
**Status**: ✅ Production Ready

---

## 📞 Need Help?

- Check Railway logs for error messages
- Verify all environment variables are set
- Check browser console (F12) for errors
- Check Network tab (F12) for API requests

---

**Total Time**: 25-35 minutes  
**Difficulty**: Easy  
**Success Rate**: High (if all steps followed correctly)

