# 🏗️ Application Architecture

## 🌐 Production Architecture (Railway)

```
┌─────────────────────────────────────────────────────────────────────┐
│                           INTERNET                                   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
        ┌───────────────────────┐   ┌───────────────────────┐
        │   Frontend Service    │   │   Backend Service     │
        │   (Railway)           │   │   (Railway)           │
        ├───────────────────────┤   ├───────────────────────┤
        │ Next.js 14            │   │ Express + TypeScript  │
        │ React 18              │   │ Node.js               │
        │ TailwindCSS           │   │ JWT Authentication    │
        │                       │   │ RESTful API           │
        ├───────────────────────┤   ├───────────────────────┤
        │ Domain:               │   │ Domain:               │
        │ frontend-xxx.         │   │ backend-xxx.          │
        │ railway.app           │   │ railway.app           │
        ├───────────────────────┤   ├───────────────────────┤
        │ Environment:          │   │ Environment:          │
        │ NEXT_PUBLIC_API_URL ──┼───┤ MONGODB_URI           │
        │                       │   │ JWT_SECRET            │
        │                       │   │ CORS_ORIGIN           │
        │                       │   │ NODE_ENV=production   │
        └───────────────────────┘   └───────────┬───────────┘
                                                 │
                                                 │ Mongoose ODM
                                                 │
                                                 ▼
                                    ┌────────────────────────┐
                                    │  MongoDB Atlas         │
                                    │  (Cloud Database)      │
                                    ├────────────────────────┤
                                    │ Cluster: cluster0      │
                                    │ Region: Auto           │
                                    │ Tier: Free (M0)        │
                                    ├────────────────────────┤
                                    │ Collections:           │
                                    │ • users                │
                                    │ • tasks                │
                                    │ • categories           │
                                    └────────────────────────┘
```

---

## 🔄 Request Flow

### 1. User Sign Up Flow

```
┌──────┐     1. Visit Site      ┌──────────┐
│ User │ ───────────────────────▶│ Frontend │
└──────┘                         └──────────┘
                                      │
                                      │ 2. Fill form
                                      │    Click "Sign Up"
                                      │
                                      ▼
                                 ┌──────────┐
                                 │ Frontend │
                                 │ (React)  │
                                 └──────────┘
                                      │
                                      │ 3. POST /api/auth/signup
                                      │    { name, email, password }
                                      │
                                      ▼
                                 ┌──────────┐
                                 │ Backend  │
                                 │ (Express)│
                                 └──────────┘
                                      │
                                      │ 4. Validate data
                                      │    Hash password
                                      │
                                      ▼
                                 ┌──────────┐
                                 │ MongoDB  │
                                 │ (users)  │
                                 └──────────┘
                                      │
                                      │ 5. Save user
                                      │    Generate JWT
                                      │
                                      ▼
                                 ┌──────────┐
                                 │ Backend  │
                                 │ Response │
                                 └──────────┘
                                      │
                                      │ 6. Return token
                                      │    { token, user }
                                      │
                                      ▼
                                 ┌──────────┐
                                 │ Frontend │
                                 │ (React)  │
                                 └──────────┘
                                      │
                                      │ 7. Store token
                                      │    Redirect to dashboard
                                      │
                                      ▼
                                 ┌──────┐
                                 │ User │
                                 │ Home │
                                 └──────┘
```

---

### 2. Create Task Flow

```
┌──────┐     1. Click "New Task"  ┌──────────┐
│ User │ ───────────────────────▶│ Frontend │
└──────┘                          └──────────┘
                                       │
                                       │ 2. Open modal
                                       │    Fill form
                                       │
                                       ▼
                                  ┌──────────┐
                                  │ Frontend │
                                  │ (React)  │
                                  └──────────┘
                                       │
                                       │ 3. POST /api/tasks
                                       │    Authorization: Bearer <token>
                                       │    { title, description, priority, ... }
                                       │
                                       ▼
                                  ┌──────────┐
                                  │ Backend  │
                                  │ (Express)│
                                  └──────────┘
                                       │
                                       │ 4. Verify JWT token
                                       │    Extract user ID
                                       │
                                       ▼
                                  ┌──────────┐
                                  │ Auth     │
                                  │ Middleware│
                                  └──────────┘
                                       │
                                       │ 5. Validate task data
                                       │    Add user reference
                                       │
                                       ▼
                                  ┌──────────┐
                                  │ MongoDB  │
                                  │ (tasks)  │
                                  └──────────┘
                                       │
                                       │ 6. Save task
                                       │    Return created task
                                       │
                                       ▼
                                  ┌──────────┐
                                  │ Backend  │
                                  │ Response │
                                  └──────────┘
                                       │
                                       │ 7. Return task
                                       │    { task }
                                       │
                                       ▼
                                  ┌──────────┐
                                  │ Frontend │
                                  │ (React)  │
                                  └──────────┘
                                       │
                                       │ 8. Update UI
                                       │    Show new task
                                       │
                                       ▼
                                  ┌──────┐
                                  │ User │
                                  │ Sees │
                                  │ Task │
                                  └──────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Authentication System                        │
└─────────────────────────────────────────────────────────────────┘

1. User Login
   ┌──────┐
   │ User │ ──▶ POST /api/auth/login { email, password }
   └──────┘
      │
      ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Backend: auth.controller.ts                              │
   │ 1. Find user by email                                    │
   │ 2. Compare password with bcrypt                          │
   │ 3. Generate JWT token (expires in 7 days)               │
   │ 4. Return { token, user }                                │
   └──────────────────────────────────────────────────────────┘
      │
      ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Frontend: localStorage                                   │
   │ Store token: localStorage.setItem('token', token)        │
   └──────────────────────────────────────────────────────────┘

2. Authenticated Requests
   ┌──────┐
   │ User │ ──▶ GET /api/tasks
   └──────┘
      │
      ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Frontend: api.ts (Axios Interceptor)                     │
   │ Add header: Authorization: Bearer <token>                │
   └──────────────────────────────────────────────────────────┘
      │
      ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Backend: auth.middleware.ts                              │
   │ 1. Extract token from header                             │
   │ 2. Verify token with JWT_SECRET                          │
   │ 3. Decode user ID from token                             │
   │ 4. Attach user to request: req.user = decoded            │
   └──────────────────────────────────────────────────────────┘
      │
      ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Backend: Controller                                      │
   │ Access user: req.user.userId                             │
   │ Query tasks for this user only                           │
   └──────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                        MongoDB Collections                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ users                                                         │
├──────────────────────────────────────────────────────────────┤
│ _id          : ObjectId (auto)                               │
│ name         : String (required)                             │
│ email        : String (required, unique, lowercase)          │
│ password     : String (required, hashed with bcrypt)         │
│ role         : String (default: 'user')                      │
│ createdAt    : Date (auto)                                   │
│ updatedAt    : Date (auto)                                   │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ Referenced by
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ tasks                                                         │
├──────────────────────────────────────────────────────────────┤
│ _id          : ObjectId (auto)                               │
│ title        : String (required)                             │
│ description  : String                                        │
│ priority     : String (low/medium/high, default: medium)     │
│ status       : String (todo/in-progress/done, default: todo) │
│ completed    : Boolean (default: false)                      │
│ dueDate      : Date                                          │
│ user         : ObjectId (ref: 'User', required)              │
│ categories   : [ObjectId] (ref: 'Category')                  │
│ createdAt    : Date (auto)                                   │
│ updatedAt    : Date (auto)                                   │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ References
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ categories                                                    │
├──────────────────────────────────────────────────────────────┤
│ _id          : ObjectId (auto)                               │
│ name         : String (required)                             │
│ color        : String (required, hex color)                  │
│ user         : ObjectId (ref: 'User', required)              │
│ createdAt    : Date (auto)                                   │
│ updatedAt    : Date (auto)                                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛣️ API Routes

```
┌─────────────────────────────────────────────────────────────────┐
│                          API Endpoints                           │
└─────────────────────────────────────────────────────────────────┘

Authentication (Public)
├─ POST   /api/auth/signup          Create new user
├─ POST   /api/auth/login           Login user
└─ GET    /api/auth/me              Get current user (protected)

Password (Public)
└─ POST   /api/password/forgot      Send password reset email

Tasks (Protected - Requires JWT)
├─ GET    /api/tasks                Get all user's tasks
├─ GET    /api/tasks/:id            Get single task
├─ POST   /api/tasks                Create new task
├─ PUT    /api/tasks/:id            Update task
└─ DELETE /api/tasks/:id            Delete task

Categories (Protected - Requires JWT)
├─ GET    /api/categories           Get all user's categories
├─ POST   /api/categories           Create new category
├─ PUT    /api/categories/:id       Update category
└─ DELETE /api/categories/:id       Delete category

User (Protected - Requires JWT)
├─ PUT    /api/user/profile         Update user profile
└─ PUT    /api/user/change-password Change password

Admin (Protected - Requires JWT + Admin Role)
├─ GET    /api/admin/users          Get all users
├─ GET    /api/admin/stats          Get system statistics
└─ DELETE /api/admin/users/:id      Delete user

Health Check (Public)
└─ GET    /api/health               Server health status
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                        Security Architecture                     │
└─────────────────────────────────────────────────────────────────┘

Layer 1: CORS Protection
┌──────────────────────────────────────────────────────────────┐
│ Backend: CORS Middleware                                     │
│ • Only allows requests from specified origins                │
│ • Production: Set to frontend URL                            │
│ • Development: Set to localhost:3000                         │
└──────────────────────────────────────────────────────────────┘

Layer 2: Rate Limiting
┌──────────────────────────────────────────────────────────────┐
│ Backend: Rate Limiter Middleware                             │
│ • Auth endpoints: 5 requests per 15 minutes                  │
│ • Prevents brute force attacks                               │
│ • IP-based tracking                                          │
└──────────────────────────────────────────────────────────────┘

Layer 3: Authentication
┌──────────────────────────────────────────────────────────────┐
│ Backend: JWT Authentication                                  │
│ • Tokens expire after 7 days                                 │
│ • Signed with JWT_SECRET                                     │
│ • Verified on every protected route                          │
└──────────────────────────────────────────────────────────────┘

Layer 4: Password Security
┌──────────────────────────────────────────────────────────────┐
│ Backend: Bcrypt Hashing                                      │
│ • Passwords hashed with bcrypt (10 rounds)                   │
│ • Never stored in plain text                                 │
│ • Compared securely during login                             │
└──────────────────────────────────────────────────────────────┘

Layer 5: Input Validation
┌──────────────────────────────────────────────────────────────┐
│ Backend: Express Validator                                   │
│ • Validates all input data                                   │
│ • Sanitizes user input                                       │
│ • Prevents injection attacks                                 │
└──────────────────────────────────────────────────────────────┘

Layer 6: Authorization
┌──────────────────────────────────────────────────────────────┐
│ Backend: User-Based Access Control                           │
│ • Users can only access their own data                       │
│ • Admin role for privileged operations                       │
│ • Resource ownership verification                            │
└──────────────────────────────────────────────────────────────┘

Layer 7: HTTPS
┌──────────────────────────────────────────────────────────────┐
│ Railway: Automatic HTTPS                                     │
│ • All traffic encrypted with TLS                             │
│ • Certificates managed by Railway                            │
│ • HTTP automatically redirects to HTTPS                      │
└──────────────────────────────────────────────────────────────┘
```

---

## 📦 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Railway Deployment                          │
└─────────────────────────────────────────────────────────────────┘

GitHub Repository
       │
       │ Push code
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│ Railway Platform                                             │
│                                                              │
│  ┌────────────────────────┐    ┌────────────────────────┐  │
│  │ Frontend Service       │    │ Backend Service        │  │
│  ├────────────────────────┤    ├────────────────────────┤  │
│  │ 1. Detect changes      │    │ 1. Detect changes      │  │
│  │ 2. Install deps        │    │ 2. Install deps        │  │
│  │ 3. Build Next.js       │    │ 3. Compile TypeScript  │  │
│  │ 4. Start server        │    │ 4. Start Express       │  │
│  │ 5. Generate domain     │    │ 5. Generate domain     │  │
│  └────────────────────────┘    └────────────────────────┘  │
│           │                              │                  │
│           │                              │                  │
│           ▼                              ▼                  │
│  ┌────────────────────────┐    ┌────────────────────────┐  │
│  │ frontend-xxx.          │    │ backend-xxx.           │  │
│  │ railway.app            │    │ railway.app            │  │
│  └────────────────────────┘    └────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Summary

```
User Action → Frontend (React)
                │
                │ HTTP Request (with JWT)
                │
                ▼
            Backend (Express)
                │
                ├─▶ Auth Middleware (verify JWT)
                │
                ├─▶ Rate Limiter (check limits)
                │
                ├─▶ Validation (validate input)
                │
                ├─▶ Controller (business logic)
                │
                ▼
            MongoDB (data storage)
                │
                │ Query result
                │
                ▼
            Backend (Express)
                │
                │ JSON Response
                │
                ▼
            Frontend (React)
                │
                │ Update UI
                │
                ▼
            User sees result
```

---

## 🎯 Key Architectural Decisions

### 1. **Separation of Concerns**
- Frontend and Backend are separate services
- Each can be scaled independently
- Clear API contract between them

### 2. **Stateless Authentication**
- JWT tokens (no server-side sessions)
- Scalable across multiple instances
- Token stored in browser localStorage

### 3. **RESTful API Design**
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Resource-based URLs
- JSON request/response format

### 4. **User Data Isolation**
- Each user can only access their own data
- User ID embedded in JWT token
- Database queries filtered by user

### 5. **Environment-Based Configuration**
- Different configs for dev/prod
- Secrets stored in environment variables
- No hardcoded credentials

---

## 📊 Technology Stack

```
Frontend
├─ Framework: Next.js 14 (React 18)
├─ Styling: TailwindCSS
├─ HTTP Client: Axios
├─ State: React Hooks
└─ Deployment: Railway

Backend
├─ Runtime: Node.js
├─ Framework: Express
├─ Language: TypeScript
├─ Database: MongoDB (Mongoose ODM)
├─ Auth: JWT + Bcrypt
└─ Deployment: Railway

Database
├─ Provider: MongoDB Atlas
├─ Tier: Free (M0)
├─ Storage: 512 MB
└─ Region: Auto-selected

Infrastructure
├─ Hosting: Railway
├─ HTTPS: Automatic (Railway)
├─ DNS: Railway domains
└─ CI/CD: Automatic (GitHub integration)
```

---

This architecture provides:
- ✅ Scalability (separate services)
- ✅ Security (multiple layers)
- ✅ Maintainability (clear separation)
- ✅ Performance (optimized stack)
- ✅ Cost-effectiveness (free tiers)
