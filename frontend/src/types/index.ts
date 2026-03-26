export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface Room {
  id: number;
  name: string;
  capacity: number;
  status?: 'available' | 'busy';
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: number;
  roomId: number;
  userId: number;
  startTime: string;
  endTime: string;
  description?: string;
  Room?: Room;
  User?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

export interface LoginResponse {
  token: string;
  user: User;
}
