import { Room } from '../models';
import { AppError } from '../utils/AppError';

export class RoomService {
  static async getAllRooms() {
    return await Room.findAll();
  }

  static async getRoomById(id: number) {
    const room = await Room.findByPk(id);
    if (!room) {
      throw new AppError('Room not found', 404);
    }
    return room;
  }

  static async createRoom(data: { name: string; capacity: number }) {
    return await Room.create(data);
  }

  static async updateRoom(id: number, data: { name?: string; capacity?: number }) {
    const room = await Room.findByPk(id);
    if (!room) {
      throw new AppError('Room not found', 404);
    }

    if (data.name) room.name = data.name;
    if (data.capacity) room.capacity = data.capacity;

    await room.save();
    return room;
  }

  static async deleteRoom(id: number) {
    const room = await Room.findByPk(id);
    if (!room) {
      throw new AppError('Room not found', 404);
    }
    await room.destroy();
    return true;
  }
}
