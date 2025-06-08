import React from 'react'
import api from '../../../services/api';
import { truncate } from 'fs';
import { showSuccessToast } from '../../../utils/toast';

interface LoginRequest {
    email: string,
    password: string,
}

interface RegisterRequest {
    avatar?: string,
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
        user?: {
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
        // if (access_token && refresh_token) {
        //     localStorage.setItem('access_token', access_token);
        //     localStorage.setItem('refresh_token', refresh_token);
        // }
        return response.data;
    },

    // info 
    getUserInfo: async (): Promise<UserResponse> => {
        const response = await api.get<UserResponse>("/user");
        return response.data;
    },

    // logout 
    logout: async (): Promise<Response> => {        
        try {
            const response = await api.post<Response>('/logout');
            console.log('Response:', response);
            if (response.data.status === true) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }
            showSuccessToast(response.data.message);
            return response.data;
        } catch (error: any) {
            console.error('Logout failed:', error);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
            throw error;
        }
    },

    // refresh token
    refreshToken: async (): Promise<AuthResponse> => {
        const refreshToken = localStorage.getItem('refresh_token');
       
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {            
            const response = await api.post<AuthResponse>('/refresh', {}, {
                headers: { Authorization: `Bearer ${refreshToken}` },
            });
            console.log('Refresh response:', response);

            if (response.data.status === true) {
                const { access_token, refresh_token } = response.data.data;
                if (access_token && refresh_token) {
                    localStorage.setItem('access_token', access_token);
                    localStorage.setItem('refresh_token', refresh_token);
                }
            } else {
                throw new Error(response.data.message || 'Refresh failed');
            }
            return response.data;
        } catch (error: any) {
            console.error('Refresh error:', error);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
            throw error;
        }
    },
}

export default authService