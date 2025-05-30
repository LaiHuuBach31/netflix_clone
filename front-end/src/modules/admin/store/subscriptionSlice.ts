import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import subscriptionService, { CreatePayload, DataResponse, ErrorResponse, Subscription, SingleResponse } from "../services/subscriptionService";

interface SubscriptionState {
    response: DataResponse | null;
    loading: boolean;
    error: ErrorResponse | null;
    selectedSubscription: Subscription | SingleResponse | null;
}

const initialState: SubscriptionState = {
    response: null,
    loading: false,
    error: null,
    selectedSubscription: null,
}

export const fetchSubscriptions = createAsyncThunk<DataResponse, { page?: number, keyword?: string }, { rejectValue: ErrorResponse }>(
    'subscription/fetchSubscriptions',
    async ({ page = 1, keyword = '' }, { rejectWithValue }) => {
        try {
            const response = await subscriptionService.getSubscriptions(page, keyword);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch subscriptions');
        }
    }
)

export const fetchSubscriptionById = createAsyncThunk<Subscription, number, { rejectValue: ErrorResponse }>(
    'subscription/fetchSubscriptionById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await subscriptionService.getSubscriptionById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch subscription by id');
        }
    })

export const createSubscription = createAsyncThunk<SingleResponse, CreatePayload, { rejectValue: ErrorResponse }>(
    'subscription/createSubscription',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await subscriptionService.createSubscription(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const updateSubscription = createAsyncThunk<SingleResponse, { id: number, data: Partial<Subscription> }, { rejectValue: ErrorResponse }>(
    'subscription/updateSubscription',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await subscriptionService.updateSubscription(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const deleteSubscription = createAsyncThunk<number, number, { rejectValue: ErrorResponse }>(
    'subscription/deleteSubscription',
    async (id, { rejectWithValue }) => {
        try {
            const response = await subscriptionService.deleteSubscription(id);
            console.log(response);
            
            return id;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState: initialState,
    reducers: {
        setSelectedSubscription(state, action: { payload: Subscription | null }) {
            state.selectedSubscription = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchSubscriptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptions.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(fetchSubscriptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // fetch by id
            .addCase(fetchSubscriptionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptionById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedSubscription = action.payload;
            })
            .addCase(fetchSubscriptionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // create
            .addCase(createSubscription.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSubscription.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedSubscription = action.payload;
                if (state.response) {
                    state.response.data.push(action.payload.data);
                }
            })
            .addCase(createSubscription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // update
            .addCase(updateSubscription.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSubscription.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedSubscription = action.payload.data;
                if (state.response) {
                    const index = state.response.data.findIndex((Subscription) => Subscription.id === action.payload.data.id);
                    if (index !== -1) state.response.data[index] = action.payload.data;
                }
            })
            .addCase(updateSubscription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // delete
            .addCase(deleteSubscription.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSubscription.fulfilled, (state, action) => {
                state.loading = false;
                if (state.response) {
                    state.response.data = state.response.data.filter((Subscription) => Subscription.id !== action.payload);
                }
            })
            .addCase(deleteSubscription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            });
    }
});

export const { setSelectedSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
