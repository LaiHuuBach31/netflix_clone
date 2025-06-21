import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import API_CONFIG from "../config/api";
import authService from "../modules/auth/services/authService";

const EXCLUDED_TOKEN_URLS = [
    '/login',         
    '/refresh',     
    '/plans',      
];

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
};

const api: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIME_OUT,
    headers: {
        "Content-Type": "application/json"
    }
});

// Add token in header
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (config.url && !EXCLUDED_TOKEN_URLS.includes(config.url)) {
            let token: string | null = localStorage.getItem('access_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
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

        if (error.response?.status === 401 && !originalRequest._retry && !EXCLUDED_TOKEN_URLS.includes(originalRequest.url || '')) {
            if (!isRefreshing) {
                isRefreshing = true;
                originalRequest._retry = true;

                try {
                    const response = await authService.refreshToken();
                    const newToken = response.data?.access_token || response.data?.access_token;
                    if (newToken) {
                        localStorage.setItem('access_token', newToken);
                        api.defaults.headers.Authorization = `Bearer ${newToken}`;
                        onRefreshed(newToken);

                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return api(originalRequest);
                    } else {
                        throw new Error('No access token in refresh response');
                    }
                } catch (refreshError) {
                    console.error('Refresh token failed:', refreshError);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    // return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }
        }

        return Promise.reject(error);
    }
);

export default api;