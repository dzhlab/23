import { create } from 'zustand';
import { User, LoginData, RegisterData } from '../types/user.types';
import { userService } from '../services/user.service';
import { toast } from 'react-toastify';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  login: async (data: LoginData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await userService.login(data);
      set({ user: result.user, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Ошибка входа';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      await userService.register(data);
      set({ isLoading: false });
      toast.success('Регистрация успешна! Теперь вы можете войти.');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message || 'Ошибка регистрации';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    userService.logout();
    set({ user: null, error: null });
    toast.info('Вы вышли из системы');
  },

  fetchCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const user = await userService.getCurrentUser();
      set({ user, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },

  initialize: async () => {
    await get().fetchCurrentUser();
    set({ isInitialized: true });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Subscribe to logout events
window.addEventListener('auth:logout', () => {
  useAuthStore.getState().logout();
});
