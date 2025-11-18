import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiSuccessResponse } from '../types/api.types';
import { AuthTokens } from '../types/user.types';

class ApiService {
  private api: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

    this.api = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.loadTokensFromStorage();
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private loadTokensFromStorage(): void {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  private setupRequestInterceptor(): void {
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  private setupResponseInterceptor(): void {
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.api(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const response = await axios.post<ApiSuccessResponse<AuthTokens>>(
              `${this.api.defaults.baseURL}/users/refresh-token`,
              { refreshToken: this.refreshToken }
            );

            const { accessToken, refreshToken } = response.data.data;
            this.setTokens({ accessToken, refreshToken });
            this.processQueue(null);

            return this.api(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            this.clearTokens();
            window.dispatchEvent(new Event('auth:logout'));
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    this.failedQueue = [];
  }

  setTokens(tokens: AuthTokens): void {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async get<T = any>(url: string): Promise<T> {
    const response = await this.api.get<ApiResponse<T>>(url);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error.message);
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.api.post<ApiResponse<T>>(url, data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error.message);
  }

  async patch<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.api.patch<ApiResponse<T>>(url, data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error.message);
  }

  async delete<T = any>(url: string): Promise<T> {
    const response = await this.api.delete<ApiResponse<T>>(url);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error.message);
  }
}

export const apiService = new ApiService();
