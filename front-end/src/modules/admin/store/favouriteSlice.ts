import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import favouriteService, { CreatePayload, DataResponse, ErrorResponse, Favourite, SingleResponse } from "../services/favouriteService";

interface FavouriteState {
    response: DataResponse | null;
    loading: boolean;
    error: ErrorResponse | null;
    selectedFavourite: Favourite | null;
}

const initialState: FavouriteState = {
    response: null,
    loading: false,
    error: null,
    selectedFavourite: null,
}

export const fetchFavourites = createAsyncThunk<DataResponse, { page?: number, keyword?: string }, { rejectValue: ErrorResponse }>(
    'favourite/fetchFavourites',
    async ({ page = 1, keyword = '' }, { rejectWithValue }) => {
        try {
            const response = await favouriteService.getFavourites(page, keyword);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch ');
        }
    }
)

export const fetchFavouriteById = createAsyncThunk<Favourite, number, { rejectValue: ErrorResponse }>(
    'favourite/fetchFavouriteById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await favouriteService.getFavouriteById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch by id');
        }
    })

export const createFavourite = createAsyncThunk<SingleResponse, CreatePayload, { rejectValue: ErrorResponse }>(
    'favourite/createFavourite',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await favouriteService.createFavourite(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const updateFavourite = createAsyncThunk<SingleResponse, { id: number, data: Partial<Favourite> }, { rejectValue: ErrorResponse }>(
    'favourite/updateFavourite',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await favouriteService.updateFavourite(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const deleteFavourite = createAsyncThunk<number, number, { rejectValue: ErrorResponse }>(
    'favourite/deleteFavourite',
    async (id, { rejectWithValue }) => {
        try {
            const response = await favouriteService.deleteFavourite(id);
            console.log(response);
            
            return id;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const favouriteSlice = createSlice({
    name: 'favourite',
    initialState: initialState,
    reducers: {
        setSelectedFavourite(state, action: { payload: Favourite | null }) {
            state.selectedFavourite = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchFavourites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavourites.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(fetchFavourites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // fetch by id
            .addCase(fetchFavouriteById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavouriteById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedFavourite = action.payload;
            })
            .addCase(fetchFavouriteById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // create
            .addCase(createFavourite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFavourite.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedFavourite = action.payload.data;
                if (state.response) {
                    state.response.data.push(action.payload.data);
                }
            })
            .addCase(createFavourite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // update
            .addCase(updateFavourite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFavourite.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedFavourite = action.payload.data;
                if (state.response) {
                    const index = state.response.data.findIndex((Favourite) => Favourite.id === action.payload.data.id);
                    if (index !== -1) state.response.data[index] = action.payload.data;
                }
            })
            .addCase(updateFavourite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // delete
            .addCase(deleteFavourite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFavourite.fulfilled, (state, action) => {
                state.loading = false;
                if (state.response) {
                    state.response.data = state.response.data.filter((Favourite) => Favourite.id !== action.payload);
                }
            })
            .addCase(deleteFavourite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            });
    }
});

export const {} = favouriteSlice.actions;
export default favouriteSlice.reducer;
