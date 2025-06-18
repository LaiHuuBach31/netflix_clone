import api from "../../../services/api";
import { Movie } from "./movieService";
import { User } from "./userService";

export interface WatchHistory {
    id: number;
    user_id: number;
    movie_id: any;
    watched_at: string;
    progress: number;
    user: User;
    movie: any
}

export interface CreatePayload {
    user_id: number;
    movie_id: any;
    watched_at: string;
    progress: number;
}

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DataResponse {
    current_page: number;
    data: WatchHistory[];
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

export interface WatchHistoryResponse {
    status: boolean;
    message: string;
    data: DataResponse;
}

export interface SingleResponse {
    status: boolean;
    message: string;
    data: WatchHistory;
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

const watchHistoryService = {

    getWatchHistorys: async (page: number = 1, keyword: string = ''): Promise<WatchHistoryResponse> => {
        try {
            const response = await api.get<WatchHistoryResponse>('/watch-history', { params: { page, search: keyword || undefined } });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get';
        }
    },

    getWatchHistoryById: async (id: number): Promise<SingleResponse> => {
        try {
            const response = await api.get<SingleResponse>(`/watch-history/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get by id';
        }
    },

    createWatchHistory: async (data: CreatePayload): Promise<SingleResponse> => {
        try {
            const response = await api.post<SingleResponse>('watch-history', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to create ";
        }
    },

    updateWatchHistory: async (id: number, data: Partial<WatchHistory>): Promise<SingleResponse> => {
        try {
            const response = await api.put<SingleResponse>(`/watch-history/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to update";
        }
    },

    deleteWatchHistory: async (id: number): Promise<DeleteResponse> => {
        try {
            const response = await api.delete<DeleteResponse>(`/watch-history/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse;
        }
    },
}

export default watchHistoryService;