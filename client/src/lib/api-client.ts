import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data;
    // Spring Boot response format check
    if (data && data.code !== undefined && data.code !== 1000) {
      return Promise.reject(new Error(data.message || 'Yêu cầu không hợp lệ.'));
    }
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Redirect to login if unauthorized in client context (except on login page to prevent loop)
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      const data = error.response.data;
      return Promise.reject(new Error(data?.message || 'Có lỗi xảy ra từ máy chủ.'));
    }
    return Promise.reject(error);
  }
);
