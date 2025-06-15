import axios from "axios";
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
  genre_id: number;
  genre: Genre;
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

// Interface API ophim1
interface TmdbData {
  type: string;
  id: string;
  season: number | null;
  vote_average: number;
  vote_count: number;
}

interface ImdbData {
  vote_average: number;
  vote_count: number;
  id: string | null;
}

interface TimeData {
  time: string;
}

interface CategoryOrCountry {
  id: string;
  name: string;
  slug: string;
}

interface EpisodeData {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

interface EpisodeServer {
  server_name: string;
  server_data: EpisodeData[];
}

export interface MovieDetail {
  tmdb: TmdbData;
  imdb: ImdbData;
  created: TimeData;
  modified: TimeData;
  _id: string;
  name: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  thumb_url: string;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  slug: string;
  year: number;
  view: number;
  views: string;
  actor: string[];
  director: string[];
  category: CategoryOrCountry[];
  country: CategoryOrCountry[];
  is_copyright: boolean;
  chieurap: boolean;
  poster_url: string;
  sub_docquyen: boolean;
  episodes: EpisodeServer[];
}

interface SeoSchema {
  "@context": string;
  "@type": string;
  name: string;
  dateModified: string;
  dateCreated: string;
  url: string;
  datePublished: string;
  image: string;
  director: string;
}

interface SeoOnPage {
  og_type: string;
  titleHead: string;
  seoSchema: SeoSchema;
  descriptionHead: string;
  og_image: string[];
  updated_time: number;
  og_url: string;
}

interface BreadCrumb {
  name: string;
  slug: string | null;
  position: number;
  isCurrent?: boolean;
}

interface Params {
  slug: string;
}

export interface MovieDetailResponse {
  status: string;
  message: string;
  data: {
    seoOnPage: SeoOnPage;
    breadCrumb: BreadCrumb[];
    params: Params;
    item: MovieDetail;
  };
}

export interface MovieItem {
  tmdb: TmdbData;
  imdb: ImdbData;
  modified: TimeData;
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  type: string;
  thumb_url: string;
  poster_url: string;
  sub_docquyen: boolean;
  chieurap: boolean;
  time: string;
  episode_current: string;
  quality: string;
  lang: string;
  year: number;
  category: CategoryOrCountry[];
  country: CategoryOrCountry[];
}

export interface MovieApiResponse {
  status: string;
  message: string;
  data: {
    seoOnPage: SeoOnPage;
    breadCrumb: BreadCrumb[];
    titlePage: string;
    items: MovieItem[];
  };
}

const movieService = {

  getAllMovies: async (page: number = 1): Promise<MovieApiResponse> => {
    try {
      const response = await axios.get<MovieApiResponse>('https://ophim1.com/v1/api/danh-sach/phim-moi-cap-nhat', { params: { page } });
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ErrorResponse || 'Failed to get all movies';
    }
  },

  showMovieDetail: async (slug: string): Promise<MovieDetailResponse> => {
    try {
      const response = await axios.get<MovieDetailResponse>(`https://ophim1.com/v1/api/phim/${slug}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data as ErrorResponse || 'Failed to show movie detail';
    }
  },

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