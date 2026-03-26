import api from '../api';
import { Room, ApiResponse } from '../types';

export const RoomService = {
  getRooms: async (): Promise<ApiResponse<{ rooms: Room[] }>> => {
    const response = await api.get('/rooms');
    return response.data;
  },

  getRoomById: async (id: number): Promise<ApiResponse<{ room: Room }>> => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  createRoom: async (roomData: Partial<Room>): Promise<ApiResponse<{ room: Room }>> => {
    const response = await api.post('/rooms', roomData);
    return response.data;
  },

  updateRoom: async (id: number, roomData: Partial<Room>): Promise<ApiResponse<{ room: Room }>> => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  deleteRoom: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  }
};
