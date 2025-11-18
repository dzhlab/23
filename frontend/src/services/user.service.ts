import { apiService } from './api.service';
import { User, RegisterData, LoginData, AuthResult } from '../types/user.types';

class UserService {
  async register(data: RegisterData): Promise<User> {
    return apiService.post<User>('/users/register', data);
  }

  async login(data: LoginData): Promise<AuthResult> {
    const result = await apiService.post<AuthResult>('/users/login', data);
    apiService.setTokens(result.tokens);
    return result;
  }

  async logout(): Promise<void> {
    apiService.clearTokens();
  }

  async getCurrentUser(): Promise<User> {
    return apiService.get<User>('/users/me');
  }

  async getUserById(id: string): Promise<User> {
    return apiService.get<User>(`/users/${id}`);
  }

  async getAllUsers(): Promise<User[]> {
    return apiService.get<User[]>('/users');
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return apiService.patch<User>(`/users/${id}`, data);
  }

  async deleteUser(id: string): Promise<void> {
    return apiService.delete(`/users/${id}`);
  }
}

export const userService = new UserService();
