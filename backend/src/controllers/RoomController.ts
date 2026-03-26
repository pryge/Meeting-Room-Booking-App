import { Request, Response } from "express";
import { RoomService } from "../services/RoomService";
import { createRoomSchema, updateRoomSchema } from "../validations/room";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export const getRooms = catchAsync(async (req: Request, res: Response) => {
  const rooms = await RoomService.getAllRooms();
  res.status(200).json({
    status: 'success',
    data: { rooms }
  });
});

export const getRoomById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const room = await RoomService.getRoomById(Number(id));
  res.status(200).json({
    status: 'success',
    data: { room }
  });
});

export const createRoom = catchAsync(async (req: Request, res: Response) => {
  const validation = createRoomSchema.safeParse(req.body);
  if (!validation.success) {
    throw new AppError('Validation failed', 400);
  }

  const room = await RoomService.createRoom(validation.data);
  res.status(201).json({
    status: 'success',
    message: "Room created successfully",
    data: { room }
  });
});

export const updateRoom = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validation = updateRoomSchema.safeParse(req.body);
  if (!validation.success) {
    throw new AppError('Validation failed', 400);
  }

  const room = await RoomService.updateRoom(Number(id), validation.data);
  res.status(200).json({
    status: 'success',
    message: "Room updated successfully",
    data: { room }
  });
});

export const deleteRoom = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await RoomService.deleteRoom(Number(id));
  res.status(200).json({
    status: 'success',
    message: "Room deleted successfully"
  });
});