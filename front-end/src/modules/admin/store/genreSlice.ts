import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import genreService, { ErrorResponseO, GenreItem, GenreItemResponse } from "../services/genreService";
import { Genre, DataResponse, SingleGenreResponse, ErrorResponse } from "../services/genreService";
import { MovieApiResponse } from "../services/movieService";
import { ac } from "react-router/dist/development/route-data-5OzAzQtT";

interface CreateGenrePayload {
    name: string;
    status: boolean;
}

interface GenreState {
    response: DataResponse | null;
    loading: boolean;
    error: ErrorResponse | string | null;
    selectedGenre: Genre | null;
    oResponse: GenreItemResponse | null;
    oMovieResponse: { [slug: string]: MovieApiResponse } | null;
}

const initialState: GenreState = {
    response: null,
    loading: false,
    error: null,
    selectedGenre: null,
    oResponse: null,
    oMovieResponse: null
};

export const getAllGenres = createAsyncThunk<GenreItemResponse>(
    'genre/getAllGenres',
    async () => {
        try {
            const response = await genreService.getAllGenres();
            return response;
        } catch (error) {
            throw error || 'Failed to get all genres';
        }
    }
)

export const getMovieByGenre = createAsyncThunk<MovieApiResponse, { slug: string, page: number }, { rejectValue: ErrorResponseO }>(
    'genre/getMovieByGenre',
    async ({ slug, page = 1 }, { rejectWithValue }) => {
        try {
            const response = await genreService.getMovieByGenre(slug, page);
            return response;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch genres by keyword');
        }
    }
);

export const fetchGenres = createAsyncThunk<DataResponse, { page?: number, keyword?: string }, { rejectValue: ErrorResponse }>(
    'genre/fetchGenres',
    async ({ page = 1, keyword = '' }, { rejectWithValue }) => {
        try {
            const response = await genreService.getGenres(page, keyword);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch genres');
        }
    })

export const fetchGenreById = createAsyncThunk<Genre, number, { rejectValue: ErrorResponse }>(
    'genre/fetchGenreById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await genreService.getGenreById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch genre by id');
        }
    })

export const createGenre = createAsyncThunk<SingleGenreResponse, CreateGenrePayload, { rejectValue: ErrorResponse }>(
    'genre/createGenre',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await genreService.createGenre(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const updateGenre = createAsyncThunk<SingleGenreResponse, { id: number, data: Partial<Genre> }, { rejectValue: ErrorResponse }>(
    'genre/updateGenre',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await genreService.updateGenre(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const deleteGenre = createAsyncThunk<number, number, { rejectValue: ErrorResponse }>(
    'genre/deleteGenre',
    async (id, { rejectWithValue }) => {
        try {
            await genreService.deleteGenre(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);


const genreSlice = createSlice({
    name: 'genre',
    initialState,
    reducers: {
        setSelectedGenre(state, action: { payload: Genre | null }) {
            state.selectedGenre = action.payload;
        },
        // setOGenres(state, action: { payload: GenreItem[] | null }) {
        //     state.selectedOGenre = action.payload;            
        // }
    },
    extraReducers: (builder) => {
        builder
            // get all genres
            .addCase(getAllGenres.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllGenres.fulfilled, (state, action) => {
                state.loading = false;
                state.oResponse = action.payload;
            })
            .addCase(getAllGenres.rejected, (state, action) => {
                state.loading = false;
            })
            // fetch movie by genre
            .addCase(getMovieByGenre.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMovieByGenre.fulfilled, (state, action) => {
                state.loading = false;
                state.oMovieResponse = {
                    ...state.oMovieResponse,
                    [action.meta.arg.slug]: action.payload,
                };
                state.error = null;
            })
            .addCase(getMovieByGenre.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.msg ?? null;
            })
            // fetch
            .addCase(fetchGenres.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGenres.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(fetchGenres.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // fetch by id
            .addCase(fetchGenreById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGenreById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedGenre = action.payload;
            })
            .addCase(fetchGenreById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // create
            .addCase(createGenre.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGenre.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedGenre = action.payload.data;
                if (state.response) {
                    state.response.data.push(action.payload.data);
                }
            })
            .addCase(createGenre.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // update
            .addCase(updateGenre.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGenre.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedGenre = action.payload.data;
                if (state.response) {
                    const index = state.response.data.findIndex((genre) => genre.id === action.payload.data.id);
                    if (index !== -1) state.response.data[index] = action.payload.data;
                }
            })
            .addCase(updateGenre.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // delete
            .addCase(deleteGenre.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGenre.fulfilled, (state, action) => {
                state.loading = false;
                if (state.response) {
                    console.log("Before delete:", state.response.data);
                    state.response.data = state.response.data.filter((genre) => genre.id !== action.payload);
                    console.log("After delete:", state.response.data);
                }
            })
            .addCase(deleteGenre.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            });
    }
});

export const { setSelectedGenre } = genreSlice.actions;
export default genreSlice.reducer;