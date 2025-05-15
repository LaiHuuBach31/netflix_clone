import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import planService, { CreatePayload, DataResponse, ErrorResponse, Plan, SingleResponse } from "../services/planService";

interface PlanState {
    response: DataResponse | null;
    loading: boolean;
    error: ErrorResponse | null;
    selectedPlan: Plan | SingleResponse | null;
}

const initialState: PlanState = {
    response: null,
    loading: false,
    error: null,
    selectedPlan: null,
}

export const fetchPlans = createAsyncThunk<DataResponse, { page?: number, keyword?: string }, { rejectValue: ErrorResponse }>(
    'genre/fetchPlans',
    async ({ page = 1, keyword = '' }, { rejectWithValue }) => {
        try {
            const response = await planService.getPlans(page, keyword);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch plans');
        }
    }
)

export const fetchPlanById = createAsyncThunk<Plan, number, { rejectValue: ErrorResponse }>(
    'plan/fetchPlanById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await planService.getPlanById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch plan by id');
        }
    })

export const createPlan = createAsyncThunk<SingleResponse, CreatePayload, { rejectValue: ErrorResponse }>(
    'plan/createPlan',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await planService.createPlan(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const updatePlan = createAsyncThunk<SingleResponse, { id: number, data: Partial<Plan> }, { rejectValue: ErrorResponse }>(
    'plan/updatePlan',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await planService.updatePlan(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const deletePlan = createAsyncThunk<number, number, { rejectValue: ErrorResponse }>(
    'plan/deletePlan',
    async (id, { rejectWithValue }) => {
        try {
            const response = await planService.deletePlan(id);
            console.log(response);
            
            return id;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const planSlice = createSlice({
    name: 'plan',
    initialState: initialState,
    reducers: {
        setSelectedPlan(state, action: { payload: Plan | null }) {
            state.selectedPlan = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(fetchPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // fetch by id
            .addCase(fetchPlanById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlanById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPlan = action.payload;
            })
            .addCase(fetchPlanById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // create
            .addCase(createPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPlan.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPlan = action.payload;
                if (state.response) {
                    state.response.data.push(action.payload.data);
                }
            })
            .addCase(createPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // update
            .addCase(updatePlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePlan.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPlan = action.payload.data;
                if (state.response) {
                    const index = state.response.data.findIndex((genre) => genre.id === action.payload.data.id);
                    if (index !== -1) state.response.data[index] = action.payload.data;
                }
            })
            .addCase(updatePlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // delete
            .addCase(deletePlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePlan.fulfilled, (state, action) => {
                state.loading = false;
                if (state.response) {
                    state.response.data = state.response.data.filter((plan) => plan.id !== action.payload);
                }
            })
            .addCase(deletePlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            });
    }
});

export const {} = planSlice.actions;
export default planSlice.reducer;
