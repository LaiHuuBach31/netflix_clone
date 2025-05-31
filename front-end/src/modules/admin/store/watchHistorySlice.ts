import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import watchHistoryService, { CreatePayload, DataResponse, ErrorResponse, WatchHistory, SingleResponse } from "../services/watchHistoryService";

interface WatchHistoryState {
    response: DataResponse | null;
    loading: boolean;
    error: ErrorResponse | null;
    selectedWatchHistory: WatchHistory | SingleResponse | null;
}

const initialState: WatchHistoryState = {
    response: null,
    loading: false,
    error: null,
    selectedWatchHistory: null,
}

export const fetchWatchHistorys = createAsyncThunk<DataResponse, { page?: number, keyword?: string }, { rejectValue: ErrorResponse }>(
    'watchHistory/fetchWatchHistorys',
    async ({ page = 1, keyword = '' }, { rejectWithValue }) => {
        try {
            const response = await watchHistoryService.getWatchHistorys(page, keyword);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch');
        }
    }
)

export const fetchWatchHistoryById = createAsyncThunk<WatchHistory, number, { rejectValue: ErrorResponse }>(
    'watchHistory/fetchWatchHistoryById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await watchHistoryService.getWatchHistoryById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch by id');
        }
    })

export const createWatchHistory = createAsyncThunk<SingleResponse, CreatePayload, { rejectValue: ErrorResponse }>(
    'watchHistory/createWatchHistory',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await watchHistoryService.createWatchHistory(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const updateWatchHistory = createAsyncThunk<SingleResponse, { id: number, data: Partial<WatchHistory> }, { rejectValue: ErrorResponse }>(
    'watchHistory/updateWatchHistory',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await watchHistoryService.updateWatchHistory(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const deleteWatchHistory = createAsyncThunk<number, number, { rejectValue: ErrorResponse }>(
    'watchHistory/deleteWatchHistory',
    async (id, { rejectWithValue }) => {
        try {
            const response = await watchHistoryService.deleteWatchHistory(id);
            console.log(response);
            
            return id;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const watchHistorySlice = createSlice({
    name: 'watchHistory',
    initialState: initialState,
    reducers: {
        setSelectedWatchHistory(state, action: { payload: WatchHistory | null }) {
            state.selectedWatchHistory = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchWatchHistorys.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWatchHistorys.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(fetchWatchHistorys.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // fetch by id
            .addCase(fetchWatchHistoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWatchHistoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedWatchHistory = action.payload;
            })
            .addCase(fetchWatchHistoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // create
            .addCase(createWatchHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWatchHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedWatchHistory = action.payload;
                if (state.response) {
                    state.response.data.push(action.payload.data);
                }
            })
            .addCase(createWatchHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // update
            .addCase(updateWatchHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWatchHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedWatchHistory = action.payload.data;
                if (state.response) {
                    const index = state.response.data.findIndex((watchHistory) => watchHistory.id === action.payload.data.id);
                    if (index !== -1) state.response.data[index] = action.payload.data;
                }
            })
            .addCase(updateWatchHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // delete
            .addCase(deleteWatchHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWatchHistory.fulfilled, (state, action) => {
                state.loading = false;
                if (state.response) {
                    state.response.data = state.response.data.filter((watchHistory) => watchHistory.id !== action.payload);
                }
            })
            .addCase(deleteWatchHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            });
    }
});

export const {} = watchHistorySlice.actions;
export default watchHistorySlice.reducer;
