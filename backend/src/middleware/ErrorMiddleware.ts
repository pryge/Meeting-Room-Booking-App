import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Sequelize Unique Constraint Error handling
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      status: 'error',
      message: 'Resource already exists.',
    });
  }

  // Zod Validation Error (if implemented)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: (err as any).errors,
    });
  }

  console.error('ERROR 💥', err);

  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};
