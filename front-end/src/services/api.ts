import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import API_CONFIG from "../config/api";

const api: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout:  API_CONFIG.TIME_OUT,
    headers: {
        "Content-Type" : "application/json"
    }
})

// add token in header
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig ) => {
        const token = localStorage.getItem('token');
        if(token && config.headers){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// handle error response
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if(error.response?.status === 401){
            localStorage.removeItem('token');
            localStorage.removeItem("user");
            // window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;