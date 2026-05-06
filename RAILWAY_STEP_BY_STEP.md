# 🚂 Railway Deployment - Step by Step with Screenshots

## 📋 Before You Start

**You Need**:
- [ ] Railway account (sign up at https://railway.app)
- [ ] Your code pushed to GitHub
- [ ] MongoDB Atlas account with cluster ready
- [ ] 15-20 minutes of time

---

## 🎬 Part 1: Deploy Backend (10 minutes)

### Step 1: Create New Project

1. Go to https://railway.app/dashboard
2. Click **"New Project"** button (top right)
3. Select **"Deploy from GitHub repo"**
4. If first time: Click **"Configure GitHub App"** and authorize Railway
5. Select your repository from the list
6. Railway will create a new project

**What you'll see**: Railway dashboard with your new project

---

### Step 2: Configure Backend Service

1. Railway will auto-detect your project and create a service
2. Click on the service card (it might say "Deploying..." or show your repo name)
3. Click **"Settings"** tab (top navigation)
4. Scroll down to **"Build & Deploy"** section
5. Find **"Root Directory"** field
6. Enter: `Backend`
7. Find **"Start Command"** field (might be under "Deploy")
8. Enter: `npm run build && npm start`
9. Click **"Save"** or changes auto-save

**Why?**: This tells Railway your backend code is in the `Backend` folder

---

### Step 3: Add Environment Variables (CRITICAL!)

1. Click **"Variables"** tab (top navigation)
2. You'll see an empty list or existing variables
3. Click **"+ New Variable"** button
4. Add each variable one by one:

**Variable 1**:
- Name: `MONGODB_URI`
- Value: `mongodb+srv://mahsan8040_db_user:ES0I9ahvn7rrI8BX@cluster0.ji31qlx.mongodb.net/?appName=Cluster0`
- Click **"Add"**

**Variable 2**:
- Name: `JWT_SECRET`
- Value: `task_management_secret_key_2024_change_this`
- Click **"Add"**

**Variable 3**:
- Name: `PORT`
- Value: `5000`
- Click **"Add"**

**Variable 4**:
- Name: `NODE_ENV`
- Value: `production`
- Click **"Add"**

**Variable 5**:
- Name: `CORS_ORIGIN`
- Value: `*`
- Click **"Add"**

**What you'll see**: 5 variables listed in the Variables tab

**Important**: Railway will automatically redeploy after adding variables!

---

### Step 4: Generate Backend Domain

1. Click **"Settings"** tab
2. Scroll down to **"Networking"** section
3. Find **"Public Networking"** or **"Domains"**
4. Click **"Generate Domain"** button
5. Railway will create a URL like: `backend-production-xxxx.up.railway.app`
6. **COPY THIS URL** - you'll need it for frontend!

**Save this URL**: Write it down or keep the tab open!

Example: `https://backend-production-a1b2.up.railway.app`

---

### Step 5: Wait for Deployment

1. Click **"Deployments"** tab
2. You'll see deployment in progress (blue spinner)
3. Wait 2-5 minutes for build and deploy
4. Status will change to **"Success"** (green checkmark) or **"Failed"** (red X)

**If Failed**:
- Click on the failed deployment
- Read the logs
- Common issues:
  - Missing environment variables → Go back to Step 3
  - Build errors → Check your code
  - MongoDB connection → Check MongoDB Atlas setup

**If Success**: Continue to Step 6!

---

### Step 6: Test Backend

1. Open a new browser tab
2. Go to: `https://YOUR-BACKEND-URL.railway.app/api/health`
   (Replace with your URL from Step 4)
3. You should see:
   ```json
   {"status":"OK","message":"Server is running"}
   ```

**If you see this**: ✅ Backend is working! Continue to Part 2.

**If you see error**:
- "Cannot GET /api/health" → Check Start Command in Settings
- "Application error" → Check deployment logs
- "This site can't be reached" → Wait a bit longer, might still be deploying

---

## 🎨 Part 2: Deploy Frontend (10 minutes)

### Step 7: Add Frontend Service

1. Go back to your Railway project dashboard
2. Click **"+ New"** button (top right)
3. Select **"GitHub Repo"**
4. Select **the same repository** you used for backend
5. Railway will create a second service

**What you'll see**: Two services in your project (Backend and Frontend)

---

### Step 8: Configure Frontend Service

1. Click on the **new service** (not the backend one!)
2. Click **"Settings"** tab
3. Scroll to **"Build & Deploy"** section
4. Find **"Root Directory"** field
5. Enter: `Frontend`
6. Find **"Start Command"** field
7. Enter: `npm run build && npm start`
8. Changes auto-save

**Why?**: This tells Railway your frontend code is in the `Frontend` folder

---

### Step 9: Add Frontend Environment Variable (CRITICAL!)

1. Click **"Variables"** tab
2. Click **"+ New Variable"** button
3. Add this variable:

**Variable**:
- Name: `NEXT_PUBLIC_API_URL`
- Value: `https://YOUR-BACKEND-URL.railway.app/api`
  
  **IMPORTANT**: Replace `YOUR-BACKEND-URL` with the URL from Step 4!
  
  Example: `https://backend-production-a1b2.up.railway.app/api`
  
  **Don't forget `/api` at the end!**

4. Click **"Add"**

**What you'll see**: 1 variable listed in Variables tab

**Railway will automatically redeploy!**

---

### Step 10: Generate Frontend Domain

1. Click **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"** button
4. Railway will create a URL like: `frontend-production-xxxx.up.railway.app`
5. **This is your app URL!**

Example: `https://frontend-production-c3d4.up.railway.app`

---

### Step 11: Wait for Deployment

1. Click **"Deployments"** tab
2. Wait 3-7 minutes (Next.js takes longer to build)
3. Status will change to **"Success"** (green checkmark)

**If Failed**:
- Check deployment logs
- Verify `NEXT_PUBLIC_API_URL` is correct
- Make sure it ends with `/api`

**If Success**: Continue to Step 12!

---

### Step 12: Test Frontend

1. Open a new browser tab
2. Go to your frontend URL from Step 10
3. You should see the login/signup page

**What to test**:
1. Click "Sign Up"
2. Create a new account
3. Log in
4. Create a task
5. Edit the task
6. Delete the task

**If everything works**: 🎉 **SUCCESS!** Your app is deployed!

**If you see errors**: Continue to Troubleshooting section below

---

## 🐛 Troubleshooting

### Issue: "Network Error" or "Failed to fetch"

**Cause**: Frontend can't reach backend

**Fix**:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for the API URL being called
4. Verify it matches your backend URL
5. If wrong:
   - Go to Frontend service → Variables
   - Check `NEXT_PUBLIC_API_URL`
   - Make sure it's: `https://your-backend-url.railway.app/api`
   - Redeploy frontend

---

### Issue: "CORS Error" in Console

**Cause**: Backend is blocking frontend requests

**Fix**:
1. Go to Backend service → Variables
2. Check if `CORS_ORIGIN` is set to `*`
3. If not, add it
4. Wait for automatic redeploy

---

### Issue: "MongoServerError" in Backend Logs

**Cause**: Can't connect to MongoDB

**Fix**:
1. Go to https://cloud.mongodb.com
2. Click "Network Access" (left sidebar)
3. Make sure `0.0.0.0/0` is in the IP Access List
4. If not:
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Enter `0.0.0.0/0`
   - Click "Confirm"
5. Go back to Railway and redeploy backend

---

### Issue: Backend Deployment Failed

**Common Causes**:

**"Missing required environment variables"**
- Go to Variables tab
- Make sure all 5 variables are set
- Check spelling (case-sensitive!)

**"Cannot find module"**
- Go to Settings → Root Directory
- Make sure it's set to `Backend`

**"npm ERR!"**
- Check your `package.json`
- Make sure all dependencies are listed

---

### Issue: Frontend Deployment Failed

**Common Causes**:

**"Module not found"**
- Go to Settings → Root Directory
- Make sure it's set to `Frontend`

**"Build failed"**
- Check deployment logs for specific error
- Verify `NEXT_PUBLIC_API_URL` is set

---

### Issue: Frontend Loads but Shows Old API URL

**Cause**: Next.js environment variables are build-time

**Fix**:
1. Go to Frontend service → Deployments
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for new deployment
5. Clear browser cache (Ctrl+Shift+R)

---

## 🔄 How to Update Your App

### Update Code:
1. Push changes to GitHub
2. Railway automatically detects and redeploys
3. Wait for deployment to complete

### Update Environment Variables:
1. Go to service → Variables tab
2. Click on variable to edit
3. Change value
4. Railway automatically redeploys

### Manual Redeploy:
1. Go to service → Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

---

## 📊 Monitoring Your App

### View Logs:
1. Go to service
2. Click "Deployments" tab
3. Click on a deployment
4. Scroll down to see logs

### View Metrics:
1. Go to service
2. Click "Metrics" tab (if available)
3. See CPU, memory, network usage

### Check Status:
- Green checkmark = Running
- Blue spinner = Deploying
- Red X = Failed
- Gray = Stopped

---

## 💰 Railway Pricing

**Free Tier**:
- $5 credit per month
- Enough for 2 small services
- No credit card required

**Usage**:
- Charged per hour of runtime
- ~$0.01-0.02 per hour per service
- Monitor usage in Railway dashboard

**Upgrade**:
- Add credit card for more usage
- Pay-as-you-go pricing
- Can set spending limits

---

## ✅ Final Checklist

After completing all steps:

- [ ] Backend service created
- [ ] Backend Root Directory set to `Backend`
- [ ] Backend has 5 environment variables
- [ ] Backend domain generated
- [ ] Backend deployment successful (green checkmark)
- [ ] Backend health check returns OK
- [ ] Frontend service created
- [ ] Frontend Root Directory set to `Frontend`
- [ ] Frontend has `NEXT_PUBLIC_API_URL` variable
- [ ] Frontend domain generated
- [ ] Frontend deployment successful (green checkmark)
- [ ] Can sign up new user
- [ ] Can log in
- [ ] Can create/edit/delete tasks
- [ ] No errors in browser console

---

## 🎉 Success!

**Your URLs**:
- **Frontend**: `https://your-frontend-url.railway.app`
- **Backend**: `https://your-backend-url.railway.app`
- **API Health**: `https://your-backend-url.railway.app/api/health`

**Share your app**: Send the frontend URL to anyone!

**Next Steps**:
- Add custom domain (optional)
- Set up monitoring
- Add more features
- Invite users

---

## 📞 Need More Help?

**Documentation**:
- Railway Docs: https://docs.railway.app
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

**Other Guides**:
- `QUICK_FIX_CHECKLIST.md` - Quick troubleshooting
- `ENVIRONMENT_VARIABLES_REFERENCE.md` - All variables explained
- `MONGODB_SETUP.md` - Database configuration

**Railway Support**:
- Discord: https://discord.gg/railway
- Twitter: @Railway

---

## 🎓 What You Learned

- ✅ How to deploy Node.js backend to Railway
- ✅ How to deploy Next.js frontend to Railway
- ✅ How to configure environment variables
- ✅ How to connect to MongoDB Atlas
- ✅ How to troubleshoot deployment issues
- ✅ How to monitor and update your app

**Congratulations!** 🎊 You've successfully deployed a full-stack app to production!
