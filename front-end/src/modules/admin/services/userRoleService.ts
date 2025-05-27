import api from "../../../services/api";

export interface UserRole {
    id: number;
    user_id: number;
    role_id: number;
}

export interface CreatePayload {
    user_id: number;
    role_id: number;
}

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DataResponse {
    current_page: number;
    data: UserRole[];
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

export interface UserRoleResponse {
    status: boolean;
    message: string;
    data: DataResponse;
}

export interface SingleResponse {
    status: boolean;
    message: string;
    data: UserRole;
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

const userRoleService = {

    getUserRole: async (page: number = 1, keyword: string = ''): Promise<UserRoleResponse> => {
        try {
            const response = await api.get<UserRoleResponse>('/user-role', { params: { page, search: keyword || undefined } });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get';
        }
    },

    getUserRoleById: async (id: number): Promise<SingleResponse> => {
        try {
            const response = await api.get<SingleResponse>(`/user-role/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get by id';
        }
    },

    createUserRole: async (data: CreatePayload): Promise<SingleResponse> => {
        try {
            const response = await api.post<SingleResponse>('user-role', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to create";
        }
    },

    updateUserRole: async (id: number, data: Partial<UserRole>): Promise<SingleResponse> => {
        try {
            const response = await api.put<SingleResponse>(`/user-role/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to update";
        }
    },

    deleteUserRole: async (id: number): Promise<DeleteResponse> => {
        try {
            const response = await api.delete<DeleteResponse>(`/user-role/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse;
        }
    },
}

export default userRoleService;