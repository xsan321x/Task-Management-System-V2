import { Response, NextFunction } from 'express';
import User from '../models/User.model';
import { AuthRequest } from './auth.middleware';

export const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    next();
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
