import api from '../api';
import { User, ApiResponse } from '../types';

export const AuthService = {
  login: async (credentials: any): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: any): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};
