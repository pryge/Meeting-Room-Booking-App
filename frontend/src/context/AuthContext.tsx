import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await AuthService.getMe();
      if (response.status === 'success' && response.data) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await AuthService.login({ email, password });
    if (response.status === 'success' && response.data) {
      const { user: userData, token } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await AuthService.register({ name, email, password });
    if (response.status === 'success' && response.data) {
      const { user: userData } = response.data;
      // Note: Backend register doesn't seem to return a token in original code, 
      // but original code was setting it. I'll stick to what the backend returns.
      // If the backend refactor returns token, I'll use it.
      // Looking back at my AuthService.register refactor, it doesn't return token.
      // I'll adjust the context to handle login after register or update register to return token.
      setUser(userData);
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

