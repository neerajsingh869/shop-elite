// User object that backend returns
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
}

// API interface for /api/auth/refresh route
export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Shape of login form data
export interface LoginFormData {
  email: string;
  password: string;
}

// Shape of register form data
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
