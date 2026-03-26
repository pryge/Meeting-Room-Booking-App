import api from '../api';
import { Booking, ApiResponse } from '../types';

export const BookingService = {
  getMyBookings: async (): Promise<ApiResponse<{ bookings: Booking[] }>> => {
    const response = await api.get('/bookings/me');
    return response.data;
  },

  getBookingsByRoomId: async (roomId: number): Promise<ApiResponse<{ bookings: Booking[] }>> => {
    const response = await api.get(`/bookings?roomId=${roomId}`);
    return response.data;
  },

  createBooking: async (bookingData: any): Promise<ApiResponse<{ booking: Booking }>> => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  updateBooking: async (id: number, bookingData: any): Promise<ApiResponse<{ booking: Booking }>> => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  cancelBooking: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  }
};
