export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  status: 'not-started' | 'in-progress' | 'review' | 'completed';
  dueDate?: string;
  categories: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
