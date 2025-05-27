import api from "../../../services/api";
import { Permission } from "./permissionService";

export interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

export interface CreatePayload {
    name: string;
}

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DataResponse {
    current_page: number;
    data: Role[];
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

export interface RoleResponse {
    status: boolean;
    message: string;
    data: DataResponse;
}

export interface SingleResponse {
    status: boolean;
    message: string;
    data: Role;
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

const roleService = {

    getRoles: async (page: number = 1, keyword: string = ''): Promise<RoleResponse> => {
        try {
            const response = await api.get<RoleResponse>('/roles', { params: { page, search: keyword || undefined } });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get roles';
        }
    },

    getRoleById: async (id: number): Promise<SingleResponse> => {
        try {
            const response = await api.get<SingleResponse>(`/roles/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get role by id';
        }
    },

    createRole: async (data: CreatePayload): Promise<SingleResponse> => {
        try {
            const response = await api.post<SingleResponse>('roles', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to create role";
        }
    },

    updateRole: async (id: number, data: Partial<Role>): Promise<SingleResponse> => {
        try {
            const response = await api.put<SingleResponse>(`/roles/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to update role";
        }
    },

    deleteRole: async (id: number): Promise<DeleteResponse> => {
        try {
            const response = await api.delete<DeleteResponse>(`/roles/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse;
        }
    },
}

export default roleService;