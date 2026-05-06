import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../src/config/database';
import authRoutes from '../src/routes/auth.routes';
import taskRoutes from '../src/routes/task.routes';
import categoryRoutes from '../src/routes/category.routes';
import passwordRoutes from '../src/routes/password.routes';
import userRoutes from '../src/routes/user.routes';
import adminRoutes from '../src/routes/admin.routes';
import { loggerMiddleware } from '../src/middleware/logger.middleware';
import { createRateLimiter } from '../src/middleware/rateLimiter.middleware';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const app = express();

// CORS configuration - allow all origins in production (Railway)
// In production, you can restrict this to your specific frontend URL
const corsOptions = {
  origin: process.env.CORS_ORIGIN === '*' 
    ? '*' 
    : (process.env.CORS_ORIGIN || 'http://localhost:3000'),
  credentials: process.env.CORS_ORIGIN === '*' ? false : true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(loggerMiddleware);

// Rate limiting for auth endpoints (5 requests per 15 minutes)
const authLimiter = createRateLimiter(15 * 60 * 1000, 5);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/password/forgot', authLimiter);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
