import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import Category from '../models/Category.model';
import { handleError, AppError } from '../utils/errorHandler';

// Default categories for new users
const DEFAULT_CATEGORIES = [
  { name: 'Work', color: '#FF6B6B' },
  { name: 'Personal', color: '#4ECDC4' },
  { name: 'Family', color: '#45B7D1' },
  { name: 'Health', color: '#FFA07A' },
  { name: 'Finance', color: '#98D8C8' },
  { name: 'Education', color: '#F7DC6F' },
  { name: 'Shopping', color: '#BB8FCE' },
  { name: 'Travel', color: '#85C1E2' },
];

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ name, email, password, role: 'user' });
    await user.save();

    // Create default categories for the new user
    const defaultCategories = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      userId: user._id,
    }));
    await Category.insertMany(defaultCategories);

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    handleError(error, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Clear temp password if exists
    if (user.tempPassword) {
      user.tempPassword = undefined;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    handleError(error, res);
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error: any) {
    handleError(error, res);
  }
};
