import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import movieService, { CreatePayload, DataResponse, ErrorResponse, Movie, MovieApiResponse, MovieDetail, MovieDetailResponse, SingleResponse } from "../services/movieService";

interface MovieState {
    response: DataResponse | null;
    oResponse: MovieApiResponse | null;
    loading: boolean;
    error: ErrorResponse | null;
    selectedMovie: Movie | null;
    selectedOMovie: MovieDetail | null;
    fetchingSlug: string | null;
}

const initialState: MovieState = {
    response: null,
    oResponse: null,
    loading: false,
    error: null,
    selectedMovie: null,
    selectedOMovie: null,
    fetchingSlug: null,
}

export const getAllMovies = createAsyncThunk<MovieApiResponse, { page?: number }, { rejectValue: ErrorResponse }>(
    'movie/getAllMovies',
    async ({ page = 1 }, { rejectWithValue }) => {
        try {
            const response = await movieService.getAllMovies(page);
            return response;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to get all movies');

        }
    })

export const showMovieDetail = createAsyncThunk<MovieDetailResponse, string, { rejectValue: ErrorResponse }>(
    'movie/showMovieDetail',
    async (slug, { rejectWithValue }) => {
        try {
            const response = await movieService.showMovieDetail(slug);            
            return response;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to show movie detail');
        }
    })

export const fetchMovies = createAsyncThunk<DataResponse, { page?: number, keyword?: string }, { rejectValue: ErrorResponse }>(
    'movie/fetchMovies',
    async ({ page = 1, keyword = '' }, { rejectWithValue }) => {
        try {
            const response = await movieService.getMovies(page, keyword);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch movies');
        }
    }
)

export const fetchMovieById = createAsyncThunk<Movie, number, { rejectValue: ErrorResponse }>(
    'movie/fetchMovieById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await movieService.getMovieById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch movie by id');
        }
    })

export const createMovie = createAsyncThunk<SingleResponse, CreatePayload, { rejectValue: ErrorResponse }>(
    'movie/createMovie',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await movieService.createMovie(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const updateMovie = createAsyncThunk<SingleResponse, { id: number, data: Partial<Movie> }, { rejectValue: ErrorResponse }>(
    'movie/updateMovie',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await movieService.updateMovie(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const deleteMovie = createAsyncThunk<number, number, { rejectValue: ErrorResponse }>(
    'movie/deleteMovie',
    async (id, { rejectWithValue }) => {
        try {
            const response = await movieService.deleteMovie(id);
            console.log(response);

            return id;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const movieSlice = createSlice({
    name: 'movie',
    initialState: initialState,
    reducers: {
        setSelectedMovie(state, action: { payload: Movie | null }) {
            state.selectedMovie = action.payload;
        },
        setSelectedOMovie(state, action: { payload: MovieDetail | null }) {
            state.selectedOMovie = action.payload;
        },
        setFetchingId(state, action: { payload: string | null }) {
            state.fetchingSlug = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder
            // get all
            .addCase(getAllMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.oResponse = action.payload;
                state.error = null;
            })
            .addCase(getAllMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            // show movie detail
            .addCase(showMovieDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedMovie = null;
            })
            .addCase(showMovieDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedOMovie = action.payload.data.item;
            })
            .addCase(showMovieDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
                state.selectedMovie = null;
            })
            // fetch
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // fetch by id
            .addCase(fetchMovieById.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                state.selectedMovie = null;
                state.fetchingSlug = action.meta.requestId;
            })
            .addCase(fetchMovieById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedMovie = action.payload;
                state.fetchingSlug = null;
            })
            .addCase(fetchMovieById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
                state.fetchingSlug = null;
            })

            // create
            .addCase(createMovie.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMovie.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedMovie = action.payload.data;
                if (state.response) {
                    state.response.data.push(action.payload.data);
                }
            })
            .addCase(createMovie.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // update
            .addCase(updateMovie.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMovie.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedMovie = action.payload.data;
                if (state.response) {
                    const index = state.response.data.findIndex((genre) => genre.id === action.payload.data.id);
                    if (index !== -1) state.response.data[index] = action.payload.data;
                }
            })
            .addCase(updateMovie.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // delete
            .addCase(deleteMovie.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMovie.fulfilled, (state, action) => {
                state.loading = false;
                if (state.response) {
                    state.response.data = state.response.data.filter((movie) => movie.id !== action.payload);
                }
            })
            .addCase(deleteMovie.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            });
    }
});

export const { setSelectedMovie, setSelectedOMovie,  setFetchingId } = movieSlice.actions;
export default movieSlice.reducer;
