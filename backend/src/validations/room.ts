import * as z from 'zod';

export const createRoomSchema = z.object({
  name: z.string().min(2, 'Room name must be at least 2 characters'),
  capacity: z.number().int().positive('Capacity must be a positive integer'),
});

export const updateRoomSchema = z.object({
  name: z.string().min(2, 'Room name must be at least 2 characters').optional(),
  capacity: z.number().int().positive('Capacity must be a positive integer').optional(),
});
