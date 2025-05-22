import api from "../../../services/api"

export interface User {
    id: number,
    name: string,
    email: string,
    avatar: string,
    status: boolean,
    roles: Role[];
}

export interface Role {
    id: number;
    name: string;
}

export interface CreatePayload {
    name: string,
    email: string,
    password: string,
    avatar: string,
    status: boolean,
}

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DataResponse {
    current_page: number;
    data: User[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLinks[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface UserResponse {
    status: string,
    message: string,
    data: DataResponse,
}

export interface SingleResponse {
    status: boolean;
    message: string;
    data: User;
}

export interface DeleteResponse {
    status: boolean;
    message: string;
    data: {
        message: string;
    };
}

export interface ErrorResponse {
    status: boolean;
    message: string;
    errors?: {
        [key: string]: string[];
    };
}

const userService = {
    
    getUsers: async (page: number = 1, keyword: string = ''): Promise<UserResponse> => {
        try {
            const response = await api.get<UserResponse>('/users', { params: { page, search: keyword || undefined } });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get users';
        }
    },

    getUserById: async (id: number): Promise<SingleResponse> => {
        try {
            const response = await api.get<SingleResponse>(`/users/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get user by id';
        }
    },

     createUser: async (data: CreatePayload): Promise<SingleResponse> => {
        try {
            const response = await api.post<SingleResponse>('users', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to create user";
        }
    },

    updateUser: async (id: number, data: Partial<User>): Promise<SingleResponse> => {
        try {
            const response = await api.put<SingleResponse>(`/users/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to update user";
        }
    },

    deleteUser: async (id: number): Promise<DeleteResponse> => {
        try {
            const response = await api.delete<DeleteResponse>(`/users/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse;
        }
    },

}

export default userService;