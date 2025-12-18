export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterFormData) => Promise<void>;
  checkAuth: () => Promise<void>;
}