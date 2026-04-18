import api from '../lib/axios';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role: 'POSTULANTE' | 'EMPRESA';
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: 'POSTULANTE' | 'EMPRESA' | 'SUPERADMIN';
  };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};