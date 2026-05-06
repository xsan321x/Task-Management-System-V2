# 🚂 Railway Deployment Guide - Task Management App

## 📋 Prerequisites
- Railway account (https://railway.app)
- GitHub repository with your code
- MongoDB Atlas cluster (you have this already)

---

## 🎯 Step-by-Step Deployment

### **STEP 1: Deploy Backend**

1. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Backend Service**
   - Railway will detect your project
   - Click on the service
   - Go to "Settings" tab
   - Set **Root Directory**: `Backend`
   - Set **Start Command**: `npm run build && npm start`

3. **Add Environment Variables** (CRITICAL!)
   - Go to "Variables" tab
   - Add these variables:

   ```
   MONGODB_URI=mongodb+srv://mahsan8040_db_user:ES0I9ahvn7rrI8BX@cluster0.ji31qlx.mongodb.net/?appName=Cluster0
   JWT_SECRET=task_management_secret_key_2024_change_this
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=*
   ```

4. **Generate Domain**
   - Go to "Settings" tab
   - Scroll to "Networking"
   - Click "Generate Domain"
   - **COPY THIS URL** (e.g., `https://backend-production-xxxx.up.railway.app`)
   - This is your **BACKEND_URL**

5. **Deploy**
   - Railway will automatically deploy
   - Wait for deployment to complete (check "Deployments" tab)
   - Test your backend: Visit `https://your-backend-url.railway.app/api/health`
   - You should see: `{"status":"OK","message":"Server is running"}`

---

### **STEP 2: Deploy Frontend**

1. **Add New Service**
   - In your Railway project, click "New"
   - Select "GitHub Repo" (same repo)
   - This creates a second service

2. **Configure Frontend Service**
   - Click on the new service
   - Go to "Settings" tab
   - Set **Root Directory**: `Frontend`
   - Set **Start Command**: `npm run build && npm start`

3. **Add Environment Variables** (CRITICAL!)
   - Go to "Variables" tab
   - Add this variable (use YOUR backend URL from Step 1):

   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
   ```

   **IMPORTANT**: Replace `your-backend-url.railway.app` with the actual domain from Step 1!

4. **Generate Domain**
   - Go to "Settings" tab
   - Scroll to "Networking"
   - Click "Generate Domain"
   - This is your **FRONTEND_URL** (e.g., `https://frontend-production-xxxx.up.railway.app`)

5. **Deploy**
   - Railway will automatically deploy
   - Wait for deployment to complete
   - Visit your frontend URL

---

### **STEP 3: Update CORS (Optional - For Better Security)**

Once both services are deployed:

1. **Get your Frontend URL** from Step 2
2. **Update Backend Environment Variables**:
   - Go to Backend service → Variables tab
   - Change `CORS_ORIGIN` from `*` to your frontend URL:
   ```
   CORS_ORIGIN=https://your-frontend-url.railway.app
   ```
3. **Redeploy Backend** (Railway will auto-redeploy on variable change)

---

## 🧪 Testing Your Deployment

### Test Backend:
```bash
# Health check
curl https://your-backend-url.railway.app/api/health

# Should return: {"status":"OK","message":"Server is running"}
```

### Test Frontend:
1. Visit your frontend URL
2. Try to sign up with a new account
3. Try to log in
4. Create a task

---

## 🐛 Troubleshooting

### Problem: "Network Error" or "Failed to fetch"
**Solution**: 
- Check that `NEXT_PUBLIC_API_URL` in Frontend variables matches your Backend URL exactly
- Make sure Backend URL includes `/api` at the end
- Verify Backend is running (visit `/api/health`)

### Problem: "CORS Error"
**Solution**:
- Make sure `CORS_ORIGIN=*` is set in Backend variables
- Or set it to your exact Frontend URL

### Problem: "Cannot connect to MongoDB"
**Solution**:
- Verify `MONGODB_URI` is correct in Backend variables
- Check MongoDB Atlas → Network Access → Allow access from anywhere (0.0.0.0/0)
- Verify database user credentials are correct

### Problem: "JWT Error" or "Unauthorized"
**Solution**:
- Make sure `JWT_SECRET` is set in Backend variables
- Try logging out and logging in again

### Problem: Backend won't start
**Solution**:
- Check "Deployments" tab for error logs
- Verify all environment variables are set
- Make sure `Root Directory` is set to `Backend`

### Problem: Frontend shows old API URL
**Solution**:
- Environment variables in Next.js are **build-time** variables
- After changing `NEXT_PUBLIC_API_URL`, you MUST redeploy
- Go to Deployments → Click "Redeploy"

---

## 📝 Important Notes

1. **Environment Variables are Build-Time**: 
   - Next.js `NEXT_PUBLIC_*` variables are embedded at build time
   - If you change them, you MUST redeploy the frontend

2. **MongoDB Atlas Network Access**:
   - Make sure your MongoDB cluster allows connections from anywhere
   - Go to MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere

3. **Railway Pricing**:
   - Railway offers $5 free credit per month
   - Monitor your usage in the Railway dashboard

4. **Custom Domains** (Optional):
   - You can add custom domains in Railway Settings → Networking

---

## ✅ Final Checklist

- [ ] Backend deployed with correct environment variables
- [ ] Backend health check returns OK
- [ ] Frontend deployed with correct `NEXT_PUBLIC_API_URL`
- [ ] Frontend can reach backend (no CORS errors)
- [ ] Can sign up new users
- [ ] Can log in
- [ ] Can create/edit/delete tasks
- [ ] MongoDB connection working

---

## 🎉 Success!

If all steps are completed, your app should be fully functional on Railway!

**Your URLs:**
- Frontend: `https://your-frontend-url.railway.app`
- Backend: `https://your-backend-url.railway.app`
- API Health: `https://your-backend-url.railway.app/api/health`
