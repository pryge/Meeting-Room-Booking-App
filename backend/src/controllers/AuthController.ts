import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { loginSchema, registerSchema } from "../validations/auth";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export const register = catchAsync(async (req: Request, res: Response) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    throw new AppError('Validation failed', 400);
  }

  const user = await AuthService.register(validation.data);
  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: { user }
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    throw new AppError('Validation failed', 400);
  }

  const { token, user } = await AuthService.login(validation.data);
  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: { token, user }
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Logout successful'
  });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await AuthService.getMe(req.user.id);
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

