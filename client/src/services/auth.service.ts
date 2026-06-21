import { apiClient } from '../lib/api-client';
import { AuthResponse } from '../types/auth';

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/log-in', { username, password });
    return res.data.result;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/log-out', {});
  },
};
