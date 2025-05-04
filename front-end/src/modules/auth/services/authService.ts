import React from 'react'
import api from '../../../services/api';
import { truncate } from 'fs';

interface LoginRequest {
    email: string,
    password: string,
}

interface RegisterRequest {
    name: string,
    email: string,
    password: string,
}

interface AuthResponse {
    status: boolean,
    message: string,
    data: {
        access_token: string,
        refresh_token: string,
        token_type: string,
        expires_in: number;
        user: {
            id: number;
            name: string;
            avatar?: string;
            email: string;
            roles: string[];
        };
    },

}

interface UserResponse {
    status: boolean;
    message: string;
    data: {
        id: number;
        name: string;
        avatar?: string;
        email: string;
        roles: string[];
    };
}

interface Response {
    status: boolean;
    message: string;
    data: []
}

const authService = {
    // login
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/login', data);

        const { access_token, refresh_token } = response.data.data;
        if (access_token && refresh_token) {
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
        }

        return response.data;
    },

    // register
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/register', data);
        const { access_token, refresh_token } = response.data.data;
        if (access_token && refresh_token) {
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
        }
        return response.data;
    },

    // info 
    getUserInfo: async (): Promise<UserResponse> => {
        const response = await api.get<UserResponse>("/user");
        return response.data;
    },

    // logout 
    logout: async (): Promise<Response> => {
        const response = await api.post<Response>('/logout');
        if (response.data.status === true) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
        return response.data;
    },

    // refresh token
    refreshToken: async (): Promise<AuthResponse> => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await api.post<AuthResponse>('/refresh', {}, {
            headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const { access_token, refresh_token } = response.data.data;
        if (access_token && refresh_token) {
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
        }
        return response.data;
    }
}

export default authService