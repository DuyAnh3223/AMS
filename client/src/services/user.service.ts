import { apiClient } from '../lib/api-client';
import { User } from '../types/user';

export const userService = {
  getMyInfo: async (): Promise<User> => {
    const res = await apiClient.get('/users/my-info');
    return res.data.result;
  },

  getUsers: async (): Promise<User[]> => {
    const res = await apiClient.get('/users');
    return res.data.result;
  },

  createUser: async (user: any): Promise<User> => {
    const res = await apiClient.post('/users', user);
    return res.data.result;
  },

  updateUser: async (userId: string, user: any): Promise<User> => {
    const res = await apiClient.put(`/users/${userId}`, user);
    return res.data.result;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/users/${userId}`);
  },
};
