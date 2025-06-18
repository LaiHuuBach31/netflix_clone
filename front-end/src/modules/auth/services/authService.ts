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

interface UpdateProfileRequest {
    name: string;
    email: string;
    avatar?: string;
    roles?: string[];
}

interface ChangePasswordRequest {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
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
            console.log('Attempting to refresh token...');     
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

    updateProfile: async (data: UpdateProfileRequest): Promise<UserResponse> => {
        try {
            const response = await api.patch<UserResponse>('/auth/profile', data);
            if (response.data.status === true) {
                const { name, email, avatar } = response.data.data;
                const updatedUser = { id: response.data.data.id, name, email, avatar };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            return response.data;
        } catch (error: any) {
            console.error('Update profile error:', error);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
            throw error;
        }
    },

    changePassword: async (data: ChangePasswordRequest): Promise<AuthResponse> => {
        try {
            const response = await api.post<AuthResponse>('/auth/change-password', data);
            if (response.data.status === true) {
                const { access_token, refresh_token, user } = response.data.data;
                if (access_token && refresh_token) {
                    localStorage.setItem('access_token', access_token);
                    localStorage.setItem('refresh_token', refresh_token);
                    localStorage.setItem('user', JSON.stringify(user));
                }
            }
            return response.data;
        } catch (error: any) {
            console.error('Change password error:', error);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
            throw error;
        }
    },
}

export default authService