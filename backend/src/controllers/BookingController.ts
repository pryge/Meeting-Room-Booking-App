import { Request, Response } from 'express';
import { BookingService } from '../services/BookingService';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const bookings = await BookingService.getMyBookings(req.user.id);
  res.status(200).json({
    status: 'success',
    message: 'My bookings fetched successfully',
    data: { bookings }
  });
});

export const getBookings = catchAsync(async (req: Request, res: Response) => {
  const { roomId } = req.query;
  if (!roomId) {
    throw new AppError('Room ID is required', 400);
  }

  const bookings = await BookingService.getBookingsByRoomId(Number(roomId));
  res.status(200).json({
    status: 'success',
    message: 'Bookings fetched successfully',
    data: { bookings }
  });
});

export const createBooking = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const booking = await BookingService.createBooking({
    ...req.body,
    userId: req.user.id
  });

  res.status(201).json({
    status: 'success',
    message: 'Booking created successfully',
    data: { booking }
  });
});

export const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const { id } = req.params;
  await BookingService.cancelBooking(Number(id), req.user.id, req.user.role);

  res.status(200).json({
    status: 'success',
    message: 'Booking cancelled successfully'
  });
});

export const updateBooking = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const { id } = req.params;
  const booking = await BookingService.updateBooking(
    Number(id),
    req.user.id,
    req.user.role,
    req.body
  );

  res.status(200).json({
    status: 'success',
    message: 'Booking updated successfully',
    data: { booking }
  });
});

