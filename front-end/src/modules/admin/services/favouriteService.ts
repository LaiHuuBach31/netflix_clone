import api from "../../../services/api";
import { Movie } from "./movieService";
import { User } from "./userService";

export interface Favourite {
    id: number;
    user_id: number;
    movie_id: number;
    user: User;
    movie: Movie
}

export interface CreatePayload {
    user_id: number;
    movie_id: number;
}

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DataResponse {
    current_page: number;
    data: Favourite[];
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

export interface FavouriteResponse {
    status: boolean;
    message: string;
    data: DataResponse;
}

export interface SingleResponse {
    status: boolean;
    message: string;
    data: Favourite;
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

const favouriteService = {

    getFavourites: async (page: number = 1, keyword: string = ''): Promise<FavouriteResponse> => {
        try {
            const response = await api.get<FavouriteResponse>('/favourites', { params: { page, search: keyword || undefined } });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get';
        }
    },

    getFavouriteById: async (id: number): Promise<SingleResponse> => {
        try {
            const response = await api.get<SingleResponse>(`/favourites/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get  by id';
        }
    },

    createFavourite: async (data: CreatePayload): Promise<SingleResponse> => {
        try {
            const response = await api.post<SingleResponse>('favourites', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to create";
        }
    },

    updateFavourite: async (id: number, data: Partial<Favourite>): Promise<SingleResponse> => {
        try {
            const response = await api.put<SingleResponse>(`/favourites/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to update ";
        }
    },

    deleteFavourite: async (id: number): Promise<DeleteResponse> => {
        try {
            const response = await api.delete<DeleteResponse>(`/favourites/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse;
        }
    },
}

export default favouriteService;