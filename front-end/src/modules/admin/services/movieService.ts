import api from "../../../services/api";
import { Genre } from "./genreService";

export interface Movie {
    id: number;
    title: string;
    thumbnail: string;
    video_url: string;
    release_year: number;
    is_featured: boolean;
    description: string;
    genre_id: number
    genre: Genre
}

export interface CreatePayload {
   title: string;
    thumbnail: string;
    video_url: string;
    release_year: number;
    is_featured: boolean;
    description: string;
    genre_id: number;
}

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DataResponse {
    current_page: number;
    data: Movie[];
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

export interface MovieResponse {
    status: boolean;
    message: string;
    data: DataResponse;
}

export interface SingleResponse {
    status: boolean;
    message: string;
    data: Movie;
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

const movieService = {

    getMovies: async (page: number = 1, keyword: string = ''): Promise<MovieResponse> => {
        try {
            const response = await api.get<MovieResponse>('/movies', { params: { page, search: keyword || undefined } });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get movies';
        }
    },

    getMovieById: async (id: number): Promise<SingleResponse> => {
        try {
            const response = await api.get<SingleResponse>(`/movies/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get movie by id';
        }
    },

    createMovie: async (data: CreatePayload): Promise<SingleResponse> => {
        try {
            const response = await api.post<SingleResponse>('movies', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to create movie";
        }
    },

    updateMovie: async (id: number, data: Partial<Movie>): Promise<SingleResponse> => {
        try {
            const response = await api.put<SingleResponse>(`/movies/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to update movie";
        }
    },

    deleteMovie: async (id: number): Promise<DeleteResponse> => {
        try {
            const response = await api.delete<DeleteResponse>(`/movies/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse;
        }
    },
}

export default movieService;