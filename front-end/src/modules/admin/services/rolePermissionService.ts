import api from "../../../services/api";

export interface RolePermission {
    id: number;
    role_id: number;
    permission_id: number;
}

export interface CreatePayload {
    role_id: number;
    permission_id: number;
}

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DataResponse {
    current_page: number;
    data: RolePermission[];
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

export interface RolePermissionResponse {
    status: boolean;
    message: string;
    data: DataResponse;
}

export interface SingleResponse {
    status: boolean;
    message: string;
    data: RolePermission;
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

const rolePermissionService = {

    getRolePermissions: async (page: number = 1, keyword: string = ''): Promise<RolePermissionResponse> => {
        try {
            const response = await api.get<RolePermissionResponse>('/role-permission', { params: { page, search: keyword || undefined } });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get';
        }
    },

    getRolePermissionById: async (id: number): Promise<SingleResponse> => {
        try {
            const response = await api.get<SingleResponse>(`/role-permission/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get by id';
        }
    },

    createRolePermission: async (data: CreatePayload): Promise<SingleResponse> => {
        try {
            const response = await api.post<SingleResponse>('role-permission', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to create";
        }
    },

    updateRolePermission: async (id: number, data: Partial<RolePermission>): Promise<SingleResponse> => {
        try {
            const response = await api.put<SingleResponse>(`/role-permission/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to update";
        }
    },

    deleteRolePermission: async (id: number): Promise<DeleteResponse> => {
        try {
            const response = await api.delete<DeleteResponse>(`/role-permission/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse;
        }
    },
}

export default rolePermissionService;