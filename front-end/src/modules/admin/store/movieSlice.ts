import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import movieService, { CreatePayload, DataResponse, ErrorResponse, Movie, SingleResponse } from "../services/movieService";

interface MovieState {
    response: DataResponse | null;
    loading: boolean;
    error: ErrorResponse | null;
    selectedMovie: Movie | null;
    fetchingId: number | null;
}

const initialState: MovieState = {
    response: null,
    loading: false,
    error: null,
    selectedMovie: null,
    fetchingId: null
}

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
        setFetchingId(state, action: { payload: number | null }) {
            state.fetchingId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
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
                state.fetchingId = action.meta.arg;
            })
            .addCase(fetchMovieById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedMovie = action.payload;
                state.fetchingId = null;
            })
            .addCase(fetchMovieById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
                state.fetchingId = null;
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

export const { setSelectedMovie, setFetchingId } = movieSlice.actions;
export default movieSlice.reducer;
