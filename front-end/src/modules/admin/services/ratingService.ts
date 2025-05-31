import api from "../../../services/api";
import { Movie } from "./movieService";
import { User } from "./userService";

export interface Rating {
    id: number;
    user_id: number;
    movie_id: number;
    rating: number;
    comment: string;
    user: User;
    movie: Movie;
}

export interface CreatePayload {
    user_id: number;
    movie_id: number;
    rating: number;
    comment: string;
}

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DataResponse {
    current_page: number;
    data: Rating[];
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

export interface RatingResponse {
    status: boolean;
    message: string;
    data: DataResponse;
}

export interface SingleResponse {
    status: boolean;
    message: string;
    data: Rating;
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

const ratingService = {

    getRatings: async (page: number = 1, keyword: string = ''): Promise<RatingResponse> => {
        try {
            const response = await api.get<RatingResponse>('/ratings', { params: { page, search: keyword || undefined } });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get';
        }
    },

    getRatingById: async (id: number): Promise<SingleResponse> => {
        try {
            const response = await api.get<SingleResponse>(`/ratings/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get  by id';
        }
    },

    createRating: async (data: CreatePayload): Promise<SingleResponse> => {
        try {
            const response = await api.post<SingleResponse>('ratings', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to create";
        }
    },

    updateRating: async (id: number, data: Partial<Rating>): Promise<SingleResponse> => {
        try {
            const response = await api.put<SingleResponse>(`/ratings/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to update ";
        }
    },

    deleteRating: async (id: number): Promise<DeleteResponse> => {
        try {
            const response = await api.delete<DeleteResponse>(`/ratings/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse;
        }
    },
}

export default ratingService;