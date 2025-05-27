import api from "../../../services/api";

export interface Permission {
    id: number;
    name: string;
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
    data: Permission[];
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

export interface PermissionResponse {
    status: boolean;
    message: string;
    data: DataResponse;
}

export interface SingleResponse {
    status: boolean;
    message: string;
    data: Permission;
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

const permissionService = {

    getPermissions: async (page: number = 1, keyword: string = '', limit: number): Promise<PermissionResponse> => {
        try {
            const response = await api.get<PermissionResponse>('/permissions', { params: { page: page, search: keyword , limit: limit|| undefined } });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get permissions';
        }
    },

    getPermissionById: async (id: number): Promise<SingleResponse> => {
        try {
            const response = await api.get<SingleResponse>(`/permissions/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get permission by id';
        }
    },

    createPermission: async (data: CreatePayload): Promise<SingleResponse> => {
        try {
            const response = await api.post<SingleResponse>('permissions', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to create permission";
        }
    },

    updatePermission: async (id: number, data: Partial<Permission>): Promise<SingleResponse> => {
        try {
            const response = await api.put<SingleResponse>(`/permissions/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to update permission";
        }
    },

    deletePermission: async (id: number): Promise<DeleteResponse> => {
        try {
            const response = await api.delete<DeleteResponse>(`/permissions/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse;
        }
    },
}

export default permissionService;