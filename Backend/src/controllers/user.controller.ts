import { Response } from 'express';
import User from '../models/User.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { handleError } from '../utils/errorHandler';

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    await user.save();
    res.json({
      message: 'Profile updated successfully',
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

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    handleError(error, res);
  }
};
