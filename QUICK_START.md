# TaskFlow - Quick Start Deployment Guide

**Status**: ✅ READY FOR RAILWAY DEPLOYMENT  
**Latest Commit**: `8c0ed61`  
**Total Time**: 25-35 minutes

---

## 🚀 Quick Start (5 Steps)

### Step 1: Backend Deployment (8 minutes)

1. Go to: https://railway.app
2. Click: "New Project" → "Deploy from GitHub"
3. Select: Your repository → `/Backend` directory
4. Click: "Deploy"
5. Wait for build to complete (green checkmark)
6. Go to: Backend service → Settings → Variables
7. Add these variables:
   ```
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-secure-random-string
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://your-frontend-url.up.railway.app
   ```
8. Note the backend URL (e.g., `https://task-management-system-v2-production.up.railway.app`)

### Step 2: Frontend Deployment (10 minutes)

1. Go to: Your Railway project
2. Click: "New Service" → "Deploy from GitHub"
3. Select: Your repository → `/Frontend` directory
4. Click: "Deploy"
5. Wait for build to complete (green checkmark)
6. Go to: Frontend service → Settings → Variables
7. Add this variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url/api
   ```
8. Note the frontend URL (e.g., `https://your-frontend.up.railway.app`)

### Step 3: Update Backend CORS (2 minutes)

1. Go to: Backend service → Settings → Variables
2. Update `CORS_ORIGIN` with your frontend URL from Step 2
3. Save (backend will redeploy automatically)

### Step 4: Test Backend (2 minutes)

1. Visit: `https://your-backend-url/api/health`
2. Should see: `{"status":"OK","message":"Server is running"}`

### Step 5: Test Frontend (3 minutes)

1. Visit: `https://your-frontend-url`
2. Signup with new account
3. Login with credentials
4. Create a task
5. All features should work

---

## 📋 Environment Variables

### Backend Variables

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | A secure random string (min 32 chars) |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `CORS_ORIGIN` | Your frontend Railway URL |

### Frontend Variables

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | Your backend Railway URL + `/api` |

---

## 🔗 Important URLs

| Purpose | URL |
|---------|-----|
| Railway Dashboard | https://railway.app |
| GitHub Repository | https://github.com/xsan321x/Task-Management-System-V2 |

---

## ✅ Verification Checklist

- ✅ Backend builds successfully
- ✅ Frontend builds successfully
- ✅ Backend environment variables set
- ✅ Frontend environment variables set
- ✅ Backend health check works
- ✅ Frontend loads
- ✅ Signup works
- ✅ Login works
- ✅ Tasks can be created
- ✅ No console errors

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Build failing | Check Railway logs for error message |
| Can't connect | Verify API URL in frontend variables |
| CORS error | Update backend CORS_ORIGIN variable |
| Signup not working | Check MongoDB connection string |
| Tasks not saving | Verify MongoDB is accessible |

---

## 📞 Need More Help?

See: `RAILWAY_DEPLOYMENT_GUIDE.md` for detailed step-by-step instructions

---

**Status**: ✅ READY FOR DEPLOYMENT

**Next Action**: Follow the 5 steps above to deploy on Railway!

