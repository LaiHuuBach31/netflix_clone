import api from "../../../services/api";

export interface Menu {
    id: number;
    title: string;
    parent_id: number;
    order: number;
    is_active: boolean;
    children?: Menu[];
}

export interface CreateMenuPayload {
    title: string,
    parent_id: number,
    order: number,
    is_active: boolean,
}

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DataResponse {
    current_page: number;
    data: Menu[];
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

export interface MenuResponse {
    status: boolean;
    message: string;
    data: DataResponse;
}

export interface SingleMenuResponse {
    status: boolean;
    message: string;
    data: Menu;
}

export interface DeleteMenuResponse {
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

const menuService = {

    getMenus: async (page: number = 1, keyword: string = ''): Promise<MenuResponse> => {
        try {
            const response = await api.get<MenuResponse>('/menus', { params: { page, search: keyword || undefined } });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get menus';
        }
    },

    getMenuById: async (id: number): Promise<SingleMenuResponse> => {
        try {
            const response = await api.get<SingleMenuResponse>(`/menus/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get menus by id';
        }
    },

    createMenu: async (data: CreateMenuPayload): Promise<SingleMenuResponse> => {
        try {
            const response = await api.post<SingleMenuResponse>('menus', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to create menu";
        }
    },

    updateMenu: async (id: number, data: Partial<Menu>): Promise<SingleMenuResponse> => {
        try {
            const response = await api.put<SingleMenuResponse>(`/menus/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to update menu";
        }
    },

     deleteMenu: async (id: number) : Promise<SingleMenuResponse> => {
        try {
            const response = await api.delete<SingleMenuResponse>(`/menus/${id}`);            
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse;
        }
    },
}

export default menuService;