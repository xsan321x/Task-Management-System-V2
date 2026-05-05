import { Response } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const handleError = (error: any, res: Response) => {
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors)
      .map((err: any) => err.message)
      .join(', ');
    return res.status(400).json({
      message: 'Validation error',
      details: messages,
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res.status(400).json({
      message: `${field} already exists`,
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token has expired',
    });
  }

  // Custom AppError
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  // Generic error
  console.error('Unhandled error:', error);
  return res.status(500).json({
    message: 'Internal server error',
  });
};

export const asyncHandler = (fn: Function) => {
  return (...args: any[]) => Promise.resolve(fn(...args)).catch(args[2]);
};
