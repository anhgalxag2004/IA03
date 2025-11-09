import axios, { type AxiosResponse } from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  UserProfile,
} from "../types/api";

// Token management
let accessToken: string | null = null;
let refreshToken: string | null = localStorage.getItem("refreshToken");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add access token
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newTokens = await refreshAccessToken();
        if (newTokens) {
          accessToken = newTokens.accessToken;
          refreshToken = newTokens.refreshToken;
          localStorage.setItem("refreshToken", refreshToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Token management functions
export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem("refreshToken", refresh);
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem("refreshToken");
};

export const logout = async () => {
  try {
    await apiClient.post(API_ENDPOINTS.LOGOUT);
  } finally {
    clearTokens();
  }
};

const refreshAccessToken = async (): Promise<RefreshTokenResponse | null> => {
  if (!refreshToken) return null;

  const response: AxiosResponse<RefreshTokenResponse> = await axios.post(
    `${API_BASE_URL}${API_ENDPOINTS.REFRESH}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );
  return response.data;
};

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      API_ENDPOINTS.REGISTER,
      data
    );
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.LOGIN,
      data
    );

    // Set tokens after successful login
    setTokens(response.data.accessToken, response.data.refreshToken);

    return response.data;
  },

  logout: async (): Promise<void> => {
    await logout();
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>(API_ENDPOINTS.PROFILE);
    return response.data;
  },

  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.REFRESH
    );
    return response.data;
  },
};
