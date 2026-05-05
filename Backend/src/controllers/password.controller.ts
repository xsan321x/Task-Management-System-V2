import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User.model';

// Generate cryptographically secure temporary password
const generateTempPassword = (): string => {
  // Generate 12 random bytes and convert to base64, then take first 12 characters
  return crypto.randomBytes(12).toString('base64').slice(0, 12);
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // Generate temporary password
    const tempPassword = generateTempPassword();
    user.tempPassword = tempPassword;
    user.password = tempPassword; // This will be hashed by the pre-save hook
    await user.save();

    res.json({
      message: 'Temporary password generated',
      tempPassword,
      warning: 'Please change this password after logging in',
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
