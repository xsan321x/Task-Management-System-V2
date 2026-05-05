# TaskFlow - Task Management Application

A modern, full-stack task management application built with Next.js, Express, and MongoDB. Features a beautiful dark-themed Kanban board with drag-and-drop functionality, real-time progress tracking, and comprehensive task management capabilities.

## 🎯 Features

- **Kanban Board:** 4-column layout (Not Started, In Progress, Review, Completed)
- **Drag & Drop:** Seamlessly move tasks between columns
- **Real-time Updates:** Progress changes reflect instantly
- **Task Management:** Create, edit, delete, and duplicate tasks
- **Search & Filter:** Find tasks by name, category, priority, or due date
- **Categories:** Organize tasks with custom categories
- **Calendar Integration:** View tasks by date
- **Bulk Operations:** Select and manage multiple tasks at once
- **Dark Theme:** Beautiful, modern dark interface
- **Responsive Design:** Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14.2.35
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **HTTP Client:** Axios
- **Date Handling:** date-fns
- **Notifications:** react-hot-toast

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
- **Password Hashing:** bcrypt
- **Validation:** express-validator

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- MongoDB
- npm or yarn

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd Backend
npm install
npm run dev
```

The backend will be available at `http://localhost:5000`

### Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend (.env):**
```
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

## 🚀 Deployment

### Deploy to Vercel

1. **Frontend:**
   ```bash
   cd Frontend
   npm run build
   vercel deploy
   ```

2. **Backend:**
   ```bash
   cd Backend
   npm run build
   vercel deploy
   ```

3. **Set Environment Variables:**
   - Go to Vercel Dashboard
   - Add environment variables for both projects
   - Redeploy

## 📖 Usage

### Creating a Task
1. Click "Add Task" button
2. Fill in task details (title, description, priority, due date, categories)
3. Click "Create Task"

### Managing Tasks
- **Edit:** Click "Edit" button on task card or in detail modal
- **Delete:** Click delete icon on task card
- **Duplicate:** Click duplicate icon to create a copy
- **Change Status:** Click progress buttons in detail modal or drag between columns

### Organizing Tasks
- **Search:** Use search bar to find tasks
- **Filter:** Use filter panel to filter by priority, status, or due date
- **Categories:** Click categories to filter by category
- **Calendar:** Click dates to view tasks for that day

## 🎨 UI Components

- **Kanban Board:** Main task display with 4 columns
- **Task Card:** Compact task display with quick actions
- **Task Detail Modal:** Full task information with progress slider
- **Task Modal:** Create/edit task form
- **Category Modal:** Manage task categories
- **Settings Modal:** User profile management
- **Calendar:** Date picker with task indicators
- **Filter Panel:** Advanced filtering options

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- Secure HTTP headers

## 📊 Database Schema

### Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Tasks
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  priority: String (high, medium, low),
  status: String (not-started, in-progress, review, completed),
  categories: [String],
  dueDate: Date,
  completed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Categories
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  color: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🐛 Troubleshooting

### Frontend won't connect to backend
- Check `NEXT_PUBLIC_API_URL` environment variable
- Ensure backend is running on correct port
- Check CORS configuration in backend

### MongoDB connection error
- Verify MongoDB is running
- Check `MONGODB_URI` connection string
- Ensure database credentials are correct

### Build errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf .next` (Frontend) or `rm -rf dist` (Backend)
- Check Node.js version compatibility

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `DELETE /api/categories/:id` - Delete category

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ for efficient task management.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Status:** Production Ready ✅  
**Last Updated:** May 5, 2026
