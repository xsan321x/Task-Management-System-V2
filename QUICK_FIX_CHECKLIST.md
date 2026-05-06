# ⚡ Quick Fix Checklist - Railway Deployment

## 🎯 The 3 Most Common Issues (and fixes!)

### 1️⃣ Frontend Can't Reach Backend
**Symptom**: "Network Error", "Failed to fetch", or infinite loading

**Fix**:
```
Railway → Frontend Service → Variables → Add:
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.railway.app/api
```
⚠️ Replace `YOUR-BACKEND-URL` with your actual backend domain!
⚠️ Don't forget `/api` at the end!
⚠️ After adding, redeploy frontend!

---

### 2️⃣ CORS Error
**Symptom**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Fix**:
```
Railway → Backend Service → Variables → Add:
CORS_ORIGIN=*
```
(Or set to your frontend URL for better security)

---

### 3️⃣ MongoDB Connection Failed
**Symptom**: "MongoServerError", "Authentication failed"

**Fix**:
```
Railway → Backend Service → Variables → Add:
MONGODB_URI=mongodb+srv://mahsan8040_db_user:ES0I9ahvn7rrI8BX@cluster0.ji31qlx.mongodb.net/?appName=Cluster0
```

**Also check**:
- MongoDB Atlas → Network Access → Allow 0.0.0.0/0
- Verify username/password are correct

---

## ✅ Complete Railway Setup (5 Minutes)

### Backend Service:
1. Root Directory: `Backend`
2. Start Command: `npm run build && npm start`
3. Variables:
   ```
   MONGODB_URI=mongodb+srv://mahsan8040_db_user:ES0I9ahvn7rrI8BX@cluster0.ji31qlx.mongodb.net/?appName=Cluster0
   JWT_SECRET=task_management_secret_key_2024_change_this
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=*
   ```
4. Generate Domain → Copy URL

### Frontend Service:
1. Root Directory: `Frontend`
2. Start Command: `npm run build && npm start`
3. Variables:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.railway.app/api
   ```
   (Use the URL from Backend step 4!)
4. Generate Domain

---

## 🧪 Test Your Deployment

### 1. Test Backend Health:
Visit: `https://your-backend-url.railway.app/api/health`

Expected: `{"status":"OK","message":"Server is running"}`

### 2. Test Frontend:
Visit: `https://your-frontend-url.railway.app`

Expected: Login/Signup page loads

### 3. Test Full Flow:
1. Sign up with new account
2. Log in
3. Create a task
4. Edit/delete task

---

## 🐛 Still Not Working?

### Check Deployment Logs:
1. Railway Dashboard → Service → Deployments
2. Click on latest deployment
3. Check logs for errors

### Common Log Errors:

**"Missing required environment variables"**
→ Add missing variables in Variables tab

**"ECONNREFUSED" or "MongoServerError"**
→ Check MongoDB URI and Network Access

**"Cannot find module"**
→ Check Root Directory is set correctly

**"Port already in use"**
→ Ignore this, Railway handles ports automatically

---

## 🔄 Force Redeploy

Sometimes you just need to redeploy:

1. Railway Dashboard → Service
2. Deployments tab
3. Click "..." on latest deployment
4. Click "Redeploy"

---

## 📱 Get Your URLs

### Backend URL:
Railway → Backend Service → Settings → Networking → Domain

### Frontend URL:
Railway → Frontend Service → Settings → Networking → Domain

---

## 🎉 Success Indicators

✅ Backend health check returns OK
✅ Frontend loads without errors
✅ Can sign up new users
✅ Can log in
✅ Can create tasks
✅ No CORS errors in browser console

---

## 📞 Emergency Checklist

If nothing works, verify these in order:

1. [ ] MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
2. [ ] Backend has all 5 environment variables set
3. [ ] Backend health check works (`/api/health`)
4. [ ] Frontend has `NEXT_PUBLIC_API_URL` set to backend URL
5. [ ] Frontend `NEXT_PUBLIC_API_URL` ends with `/api`
6. [ ] Both services have "Root Directory" set correctly
7. [ ] Both services deployed successfully (green checkmark)
8. [ ] Browser cache cleared (Ctrl+Shift+R)

---

## 💡 Pro Tips

- **Environment variables are case-sensitive!**
- **Next.js variables MUST start with `NEXT_PUBLIC_`**
- **Changing frontend env vars requires redeploy**
- **Railway auto-deploys on git push**
- **Check logs first when debugging**

---

## 🔗 Useful Links

- Railway Dashboard: https://railway.app/dashboard
- MongoDB Atlas: https://cloud.mongodb.com
- Full Guide: See `RAILWAY_DEPLOYMENT_GUIDE.md`
- Variables Reference: See `ENVIRONMENT_VARIABLES_REFERENCE.md`
