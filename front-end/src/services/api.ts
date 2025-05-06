import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import API_CONFIG from "../config/api";
import authService from "../modules/auth/services/authService";

const api: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIME_OUT,
    headers: {
        "Content-Type": "application/json"
    }
})

// Add token in header
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        let token: string | null = null;
        if (config.url?.endsWith('/refresh')) {
            token = localStorage.getItem('refresh_token');
        } else {
            token = localStorage.getItem('access_token');
        }

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle error response
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        originalRequest._retry = originalRequest._retry || false; 
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await authService.refreshToken();
                const newToken = localStorage.getItem('access_token');
                if (newToken) {
                    api.defaults.headers.Authorization = `Bearer ${newToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } else {
                    throw new Error('Failed to retrieve new access token');
                }
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;