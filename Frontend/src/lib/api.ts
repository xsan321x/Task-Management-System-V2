import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Password APIs
export const passwordAPI = {
  forgotPassword: (email: string) =>
    api.post('/password/forgot-password', { email }),
};

// Task APIs
export const taskAPI = {
  getTasks: (params?: { 
    completed?: boolean; 
    priority?: string | string[]; 
    category?: string | string[];
    dueDate?: string;
    sortBy?: string;
  }) =>
    api.get('/tasks', { params }),
  getTask: (id: string) => api.get(`/tasks/${id}`),
  createTask: (data: {
    title: string;
    description?: string;
    priority: string;
    status?: string;
    dueDate?: string;
    categories?: string[];
  }) => api.post('/tasks', data),
  updateTask: (
    id: string,
    data: {
      title?: string;
      description?: string;
      priority?: string;
      status?: string;
      completed?: boolean;
      dueDate?: string;
      categories?: string[];
    }
  ) => api.put(`/tasks/${id}`, data),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
};

// Category APIs
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  createCategory: (data: { name: string; color: string }) =>
    api.post('/categories', data),
  updateCategory: (id: string, data: { name?: string; color?: string }) =>
    api.put(`/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
};

// Admin APIs removed - no longer needed
// User APIs
export const userAPI = {
  updateProfile: (data: { name?: string; email?: string }) =>
    api.put('/user/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/user/change-password', data),
};

export default api;
