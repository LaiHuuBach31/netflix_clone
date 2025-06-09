import api from "../../../services/api"
import * as XLSX from 'xlsx';

export interface User {
    id: number,
    name: string,
    email: string,
    avatar: string,
    status: boolean,
    roles: Role[];
    created_at? : string;
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

export interface ExportResponse {
    file: Blob;
}

export interface ImportResponse {
    status: boolean;
    message: string;
    errors?: any[];
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
            const response = await api.patch<SingleResponse>(`/users/${id}`, data);
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

    exportUser: async (): Promise<ExportResponse> => {
        try {
            const response = await api.get('/users/export', {
                responseType: 'blob'
            });
            return { file: response.data };
        } catch (error: any) {
            console.log('error', error);

            throw error.response?.data as ErrorResponse || 'Failed to export users';
        }
    },

    importUser: async (file: File): Promise<ImportResponse> => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await api.post('/users/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'blob',
            });

            const contentType = response.headers['content-type'];

            if (contentType.includes('application/json')) {
                const reader = new FileReader();
                return new Promise((resolve, reject) => {
                    reader.onload = () => {
                        try {
                            const jsonResponse = JSON.parse(reader.result as string);
                            resolve(jsonResponse as ImportResponse);
                        } catch (error) {
                            reject(new Error('Failed to parse JSON response'));
                        }
                    };
                    reader.onerror = () => reject(new Error('Failed to read response as text'));
                    reader.readAsText(response.data);
                });
            } else if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                const arrayBuffer = await response.data.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const errors = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                return Promise.resolve({
                    status: false,
                    message: 'Import failed. Error details parsed from file.',
                    errors: errors,
                });
            } else {
                throw new Error('Unexpected content type');
            }
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to import users';
        }
    }

}

export default userService;