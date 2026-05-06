# 🍃 MongoDB Atlas Setup Guide

## Your MongoDB Credentials

**Connection String**:
```
mongodb+srv://mahsan8040_db_user:ES0I9ahvn7rrI8BX@cluster0.ji31qlx.mongodb.net/?appName=Cluster0
```

**Username**: `mahsan8040_db_user`  
**Password**: `ES0I9ahvn7rrI8BX`  
**Cluster**: `cluster0.ji31qlx.mongodb.net`

---

## ✅ Required MongoDB Atlas Configuration

### 1. Network Access (CRITICAL!)

Railway servers need to connect to your MongoDB cluster.

**Steps**:
1. Go to https://cloud.mongodb.com
2. Click on your project
3. Click "Network Access" in left sidebar
4. Click "Add IP Address"
5. Click "Allow Access from Anywhere"
6. Enter `0.0.0.0/0` in the IP Address field
7. Click "Confirm"

**Why?**: Railway uses dynamic IPs, so we need to allow all IPs.

---

### 2. Database User (Already Done ✅)

You already have a user: `mahsan8040_db_user`

**To verify**:
1. Go to MongoDB Atlas
2. Click "Database Access" in left sidebar
3. You should see `mahsan8040_db_user` listed
4. Make sure it has "Read and write to any database" role

**If you need to create a new user**:
1. Click "Add New Database User"
2. Choose "Password" authentication
3. Enter username and password
4. Select "Read and write to any database"
5. Click "Add User"

---

### 3. Database Name

Your app will automatically create a database called `task_management` (or similar).

**To view your data**:
1. Go to MongoDB Atlas
2. Click "Database" in left sidebar
3. Click "Browse Collections" on your cluster
4. You'll see databases and collections created by your app

---

## 🧪 Test MongoDB Connection

### Option 1: Using MongoDB Compass (GUI)
1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Open Compass
3. Paste your connection string:
   ```
   mongodb+srv://mahsan8040_db_user:ES0I9ahvn7rrI8BX@cluster0.ji31qlx.mongodb.net/?appName=Cluster0
   ```
4. Click "Connect"
5. You should see your databases

### Option 2: Using Backend Health Check
1. Deploy your backend to Railway
2. Visit: `https://your-backend-url.railway.app/api/health`
3. Check Railway logs for MongoDB connection messages

---

## 🔒 Security Best Practices

### 1. Rotate Password (Recommended)
Your password is now in this document. Consider changing it:

1. MongoDB Atlas → Database Access
2. Click "Edit" on `mahsan8040_db_user`
3. Click "Edit Password"
4. Generate new password
5. Update `MONGODB_URI` in Railway with new password

### 2. Create Separate Users (Optional)
For better security, create separate users for dev/prod:

**Development User**:
- Username: `dev_user`
- Password: (generate secure password)
- Role: Read and write to any database

**Production User**:
- Username: `prod_user`
- Password: (generate secure password)
- Role: Read and write to any database

### 3. IP Whitelist (Advanced)
Instead of `0.0.0.0/0`, you can whitelist specific Railway IPs:
- This is more secure but requires maintenance
- Railway IPs can change
- For now, `0.0.0.0/0` is fine for development

---

## 📊 MongoDB Atlas Free Tier Limits

Your free tier includes:
- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: 500 concurrent
- **Backups**: None (upgrade for backups)

**Monitor Usage**:
1. MongoDB Atlas → Metrics
2. Check storage and connection usage
3. Upgrade if you exceed limits

---

## 🗄️ Database Structure

Your app will create these collections:

### `users`
- Stores user accounts
- Fields: name, email, password (hashed), role, createdAt

### `tasks`
- Stores tasks
- Fields: title, description, priority, status, dueDate, categories, user, completed, createdAt

### `categories`
- Stores task categories
- Fields: name, color, user, createdAt

---

## 🐛 Troubleshooting

### Error: "Authentication failed"
**Causes**:
- Wrong username or password
- User doesn't exist
- User doesn't have correct permissions

**Fix**:
1. Verify username/password in connection string
2. Check Database Access in MongoDB Atlas
3. Make sure user has "Read and write" role

---

### Error: "Connection timeout" or "ECONNREFUSED"
**Causes**:
- Network Access not configured
- IP not whitelisted
- Cluster is paused (free tier)

**Fix**:
1. Add `0.0.0.0/0` to Network Access
2. Make sure cluster is running (not paused)
3. Check MongoDB Atlas status page

---

### Error: "MongoServerError: bad auth"
**Causes**:
- Special characters in password not URL-encoded
- Wrong database name in connection string

**Fix**:
1. If password has special characters, URL-encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`
2. Your current password `ES0I9ahvn7rrI8BX` has no special chars ✅

---

### Error: "Cluster is paused"
**Cause**: Free tier clusters pause after 60 days of inactivity

**Fix**:
1. Go to MongoDB Atlas
2. Click "Resume" on your cluster
3. Wait a few minutes for it to start

---

## 🔄 Connection String Format

```
mongodb+srv://<username>:<password>@<cluster>/<database>?<options>
```

**Your connection string breakdown**:
- Protocol: `mongodb+srv://`
- Username: `mahsan8040_db_user`
- Password: `ES0I9ahvn7rrI8BX`
- Cluster: `cluster0.ji31qlx.mongodb.net`
- Database: (auto-created by app)
- Options: `?appName=Cluster0`

---

## 📝 Environment Variable Format

### For Railway (Backend):
```env
MONGODB_URI=mongodb+srv://mahsan8040_db_user:ES0I9ahvn7rrI8BX@cluster0.ji31qlx.mongodb.net/?appName=Cluster0
```

### For Local Development:
Same as above! Use the same connection string locally and on Railway.

---

## ✅ MongoDB Setup Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created (Cluster0)
- [ ] Database user created (`mahsan8040_db_user`)
- [ ] Network Access allows `0.0.0.0/0`
- [ ] Connection string copied
- [ ] Connection string added to Railway Backend variables
- [ ] Connection tested (via Compass or health check)

---

## 🎉 You're All Set!

Your MongoDB is ready to use. The app will automatically:
- Connect to MongoDB on startup
- Create database and collections
- Store users, tasks, and categories

**Next Steps**:
1. Deploy backend to Railway with `MONGODB_URI`
2. Test health check endpoint
3. Sign up a user to test database writes
4. Check MongoDB Atlas → Browse Collections to see data

---

## 📞 Need Help?

**MongoDB Atlas Support**:
- Documentation: https://docs.atlas.mongodb.com
- Community Forums: https://www.mongodb.com/community/forums

**Common Issues**:
- Network Access not configured → Add 0.0.0.0/0
- Wrong credentials → Check Database Access
- Connection timeout → Check cluster status
