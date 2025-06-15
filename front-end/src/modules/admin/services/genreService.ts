import axios from "axios";
import api from "../../../services/api";
import { MovieApiResponse } from "./movieService";

export interface Genre {
    id: number;
    name: string;
    status: boolean;
}

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}


export interface DataResponse {
    current_page: number;
    data: Genre[];
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

export interface GenreResponse {
    status: boolean;
    message: string;
    data: DataResponse;
}

export interface SingleGenreResponse {
    status: boolean;
    message: string;
    data: Genre;
}

export interface DeleteGenreResponse {
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

// api genre from ophim1
export interface GenreItem {
    id: string;
    name: string;
    slug: string;
}

export interface GenreItemResponse {
  status: string; 
  message: string;
  data: {
    items: GenreItem[];
  };
}

export interface ErrorResponseO {
  status: boolean;  
    msg: string;
}

const genreService = {

    getAllGenres: async (): Promise<GenreItemResponse> => {
        try {
            const response = await axios.get<GenreItemResponse>('https://ophim1.com/v1/api/the-loai');
            return response.data;
        } catch (error:any) {
            throw error.response?.data as ErrorResponse || 'Failed to get all genres';
        }
    },

    getMovieByGenre: async (slug: string, page: number = 1): Promise<MovieApiResponse> => { 
        try {
            const response = await axios.get<MovieApiResponse>(`https://ophim1.com/v1/api/the-loai/${slug}`, { params: { page } });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get movies by genre';
        }
    },

    getGenres: async (page: number = 1, keyword: string = ''): Promise<GenreResponse> => {
        try {
            const response = await api.get<GenreResponse>('/genres', { params: { page, search: keyword || undefined } });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get genres';
        }
    },

    getGenreById: async (id: number): Promise<SingleGenreResponse> => {
        try {
            const response = await api.get<SingleGenreResponse>(`/genres/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get genres by id';
        }
    },

    createGenre: async (data: { name: string, status: boolean }): Promise<SingleGenreResponse> => {
        try {
            const response = await api.post<SingleGenreResponse>('genres', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to create genre";
        }
    },

    updateGenre: async (id: number, data: Partial<Genre>): Promise<SingleGenreResponse> => {
        try {
            const response = await api.put<SingleGenreResponse>(`/genres/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to update genre";
        }
    },

    deleteGenre: async (id: number) : Promise<DeleteGenreResponse> => {
        try {
            const response = await api.delete<DeleteGenreResponse>(`/genres/${id}`);            
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse;
        }
    },
}

export default genreService;