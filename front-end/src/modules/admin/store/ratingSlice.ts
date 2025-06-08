import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ratingService, { CreatePayload, DataResponse, ErrorResponse, Rating, SingleResponse } from "../services/ratingService";

interface RatingState {
    response: DataResponse | null;
    loading: boolean;
    error: ErrorResponse | null;
    selectedRating: Rating | null;
}

const initialState: RatingState = {
    response: null,
    loading: false,
    error: null,
    selectedRating: null,
}

export const fetchRatings = createAsyncThunk<DataResponse, { page?: number, keyword?: string }, { rejectValue: ErrorResponse }>(
    'rating/fetchRatings',
    async ({ page = 1, keyword = '' }, { rejectWithValue }) => {
        try {
            const response = await ratingService.getRatings(page, keyword);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch ');
        }
    }
)

export const fetchRatingById = createAsyncThunk<Rating, number, { rejectValue: ErrorResponse }>(
    'rating/fetchRatingById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await ratingService.getRatingById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch by id');
        }
    })

export const createRating = createAsyncThunk<SingleResponse, CreatePayload, { rejectValue: ErrorResponse }>(
    'rating/createRating',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await ratingService.createRating(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const updateRating = createAsyncThunk<SingleResponse, { id: number, data: Partial<Rating> }, { rejectValue: ErrorResponse }>(
    'rating/updateRating',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await ratingService.updateRating(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const deleteRating = createAsyncThunk<number, number, { rejectValue: ErrorResponse }>(
    'rating/deleteRating',
    async (id, { rejectWithValue }) => {
        try {
            const response = await ratingService.deleteRating(id);
            console.log(response);
            
            return id;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const ratingSlice = createSlice({
    name: 'rating',
    initialState: initialState,
    reducers: {
        setSelectedRating(state, action: { payload: Rating | null }) {
            state.selectedRating = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchRatings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRatings.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(fetchRatings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // fetch by id
            .addCase(fetchRatingById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRatingById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRating = action.payload;
            })
            .addCase(fetchRatingById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // create
            .addCase(createRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRating.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRating = action.payload.data;
                if (state.response) {
                    state.response.data.push(action.payload.data);
                }
            })
            .addCase(createRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // update
            .addCase(updateRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRating.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRating = action.payload.data;
                if (state.response) {
                    const index = state.response.data.findIndex((Rating) => Rating.id === action.payload.data.id);
                    if (index !== -1) state.response.data[index] = action.payload.data;
                }
            })
            .addCase(updateRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // delete
            .addCase(deleteRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRating.fulfilled, (state, action) => {
                state.loading = false;
                if (state.response) {
                    state.response.data = state.response.data.filter((Rating) => Rating.id !== action.payload);
                }
            })
            .addCase(deleteRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            });
    }
});

export const {} = ratingSlice.actions;
export default ratingSlice.reducer;
