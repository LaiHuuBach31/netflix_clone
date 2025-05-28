import api from "../../../services/api";
import { Movie } from "./movieService";

export interface Banner {
    id: number;
    title: string;
    image: string;
    movie_id: number;
    is_active: boolean;
    movie: Movie; 
}

export interface CreatePayload {
    title: string;
    image: string;
    movie_id: number;
    is_active: boolean;
}

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DataResponse {
    current_page: number;
    data: Banner[];
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

export interface BannerResponse {
    status: boolean;
    message: string;
    data: DataResponse;
}

export interface SingleResponse {
    status: boolean;
    message: string;
    data: Banner;
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

const bannerService = {

    getBanners: async (page: number = 1, keyword: string = ''): Promise<BannerResponse> => {
        try {
            const response = await api.get<BannerResponse>('/banners', { params: { page, search: keyword || undefined } });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get banner';
        }
    },

    getBannerById: async (id: number): Promise<SingleResponse> => {
        try {
            const response = await api.get<SingleResponse>(`/banners/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get banner by id';
        }
    },

    createBanner: async (data: CreatePayload): Promise<SingleResponse> => {
        try {
            const response = await api.post<SingleResponse>('banners', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to create banner";
        }
    },

    updateBanner: async (id: number, data: Partial<Banner>): Promise<SingleResponse> => {
        try {
            const response = await api.put<SingleResponse>(`/banners/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to update banner";
        }
    },

    deleteBanner: async (id: number): Promise<DeleteResponse> => {
        try {
            const response = await api.delete<DeleteResponse>(`/banners/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse;
        }
    },
}

export default bannerService;