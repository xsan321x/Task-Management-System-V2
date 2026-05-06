# 🔐 Environment Variables Reference

## Backend Environment Variables (Railway)

Set these in Railway Dashboard → Backend Service → Variables tab:

```env
# Database Connection
MONGODB_URI=mongodb+srv://mahsan8040_db_user:ES0I9ahvn7rrI8BX@cluster0.ji31qlx.mongodb.net/?appName=Cluster0

# JWT Secret (change this to something secure!)
JWT_SECRET=task_management_secret_key_2024_change_this

# Server Port (Railway will override this automatically)
PORT=5000

# Environment
NODE_ENV=production

# CORS Configuration
# Option 1: Allow all origins (easier, less secure)
CORS_ORIGIN=*

# Option 2: Restrict to your frontend URL (more secure)
# CORS_ORIGIN=https://your-frontend-url.railway.app
```

---

## Frontend Environment Variables (Railway)

Set these in Railway Dashboard → Frontend Service → Variables tab:

```env
# Backend API URL (MUST match your Railway backend URL!)
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

**⚠️ CRITICAL**: Replace `your-backend-url.railway.app` with your actual Railway backend domain!

---

## Local Development Environment Variables

### Backend (`Backend/.env`)
```env
MONGODB_URI=mongodb+srv://mahsan8040_db_user:ES0I9ahvn7rrI8BX@cluster0.ji31qlx.mongodb.net/?appName=Cluster0
JWT_SECRET=task_management_secret_key_2024_change_this
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`Frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🔍 Variable Explanations

### `MONGODB_URI`
- Your MongoDB Atlas connection string
- Includes username, password, and cluster address
- Make sure MongoDB Atlas Network Access allows connections from anywhere (0.0.0.0/0)

### `JWT_SECRET`
- Secret key used to sign JWT tokens
- **IMPORTANT**: Change this to a random, secure string in production!
- Generate a secure secret: `openssl rand -base64 32`

### `PORT`
- Port the backend server listens on
- Railway automatically assigns a port, but this is the fallback
- Default: 5000

### `NODE_ENV`
- Environment mode: `development` or `production`
- Affects logging and error handling
- Use `production` on Railway

### `CORS_ORIGIN`
- Controls which domains can access your API
- `*` = Allow all origins (easier for testing, less secure)
- Specific URL = Only allow that domain (more secure)
- For production, set to your frontend URL

### `NEXT_PUBLIC_API_URL`
- **Frontend only**: URL of your backend API
- **MUST** start with `NEXT_PUBLIC_` to be accessible in browser
- **MUST** include `/api` at the end
- This is a **build-time** variable - changes require redeployment!

---

## 🚨 Common Mistakes

### ❌ Wrong: Frontend .env.local on Railway
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
**Problem**: This points to localhost, which doesn't exist on Railway!

### ✅ Correct: Frontend Railway Variables
```env
NEXT_PUBLIC_API_URL=https://backend-production-xxxx.up.railway.app/api
```

---

### ❌ Wrong: Missing `/api` in URL
```env
NEXT_PUBLIC_API_URL=https://backend-production-xxxx.up.railway.app
```
**Problem**: All API routes need `/api` prefix!

### ✅ Correct: Include `/api`
```env
NEXT_PUBLIC_API_URL=https://backend-production-xxxx.up.railway.app/api
```

---

### ❌ Wrong: CORS blocking frontend
```env
CORS_ORIGIN=http://localhost:3000
```
**Problem**: Railway frontend URL is different!

### ✅ Correct: Allow Railway frontend
```env
CORS_ORIGIN=*
# or
CORS_ORIGIN=https://frontend-production-xxxx.up.railway.app
```

---

## 🔄 How to Update Variables on Railway

1. Go to Railway Dashboard
2. Click on your service (Backend or Frontend)
3. Click "Variables" tab
4. Click "+ New Variable"
5. Enter variable name and value
6. Click "Add"
7. Railway will automatically redeploy

**Note**: For Next.js frontend, changing `NEXT_PUBLIC_*` variables requires a full rebuild!

---

## 🧪 Testing Variables

### Test Backend Variables:
```bash
# SSH into Railway backend (if needed)
# Or check deployment logs

# Verify MongoDB connection
curl https://your-backend-url.railway.app/api/health

# Should return: {"status":"OK","message":"Server is running"}
```

### Test Frontend Variables:
```bash
# Open browser console on your frontend
console.log(process.env.NEXT_PUBLIC_API_URL)

# Should show: https://your-backend-url.railway.app/api
```

---

## 📋 Deployment Checklist

Before deploying, verify:

- [ ] Backend `MONGODB_URI` is set correctly
- [ ] Backend `JWT_SECRET` is set (and changed from default!)
- [ ] Backend `CORS_ORIGIN` allows your frontend
- [ ] Frontend `NEXT_PUBLIC_API_URL` points to Railway backend
- [ ] MongoDB Atlas allows connections from anywhere
- [ ] All variables are set in Railway Dashboard (not just local files!)

---

## 🔒 Security Best Practices

1. **Change JWT_SECRET**: Don't use the default!
   ```bash
   # Generate a secure secret
   openssl rand -base64 32
   ```

2. **Restrict CORS**: After testing, change from `*` to specific URL
   ```env
   CORS_ORIGIN=https://your-frontend-url.railway.app
   ```

3. **MongoDB IP Whitelist**: Consider restricting to Railway IPs (advanced)

4. **Environment Variables**: Never commit `.env` files to Git!
   - Already in `.gitignore` ✅

---

## 📞 Need Help?

If variables aren't working:
1. Check Railway deployment logs
2. Verify variable names are exact (case-sensitive!)
3. For Next.js variables, make sure they start with `NEXT_PUBLIC_`
4. After changing variables, wait for automatic redeploy
5. Clear browser cache and hard refresh (Ctrl+Shift+R)
