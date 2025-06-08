import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bannerService, { CreatePayload, DataResponse, ErrorResponse, Banner, SingleResponse } from "../services/bannerService";

interface BannerState {
    response: DataResponse | null;
    loading: boolean;
    error: ErrorResponse | null;
    selectedBanner: Banner | null;
}

const initialState: BannerState = {
    response: null,
    loading: false,
    error: null,
    selectedBanner: null,
}

export const fetchBanners = createAsyncThunk<DataResponse, { page?: number, keyword?: string }, { rejectValue: ErrorResponse }>(
    'banner/fetchBanners',
    async ({ page = 1, keyword = '' }, { rejectWithValue }) => {
        try {
            const response = await bannerService.getBanners(page, keyword);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch banners');
        }
    }
)

export const fetchBannerById = createAsyncThunk<Banner, number, { rejectValue: ErrorResponse }>(
    'banner/fetchBannerById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await bannerService.getBannerById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch banner by id');
        }
    })

export const createBanner = createAsyncThunk<SingleResponse, CreatePayload, { rejectValue: ErrorResponse }>(
    'banner/createBanner',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await bannerService.createBanner(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const updateBanner = createAsyncThunk<SingleResponse, { id: number, data: Partial<Banner> }, { rejectValue: ErrorResponse }>(
    'banner/updateBanner',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await bannerService.updateBanner(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const deleteBanner = createAsyncThunk<number, number, { rejectValue: ErrorResponse }>(
    'banner/deleteBanner',
    async (id, { rejectWithValue }) => {
        try {
            const response = await bannerService.deleteBanner(id);
            console.log(response);
            
            return id;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const bannerSlice = createSlice({
    name: 'banner',
    initialState: initialState,
    reducers: {
        setSelectedBanner(state, action: { payload: Banner | null }) {
            state.selectedBanner = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // fetch by id
            .addCase(fetchBannerById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBannerById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedBanner = action.payload;
            })
            .addCase(fetchBannerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // create
            .addCase(createBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedBanner = action.payload.data;
                if (state.response) {
                    state.response.data.push(action.payload.data);
                }
            })
            .addCase(createBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // update
            .addCase(updateBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedBanner = action.payload.data;
                if (state.response) {
                    const index = state.response.data.findIndex((banner) => banner.id === action.payload.data.id);
                    if (index !== -1) state.response.data[index] = action.payload.data;
                }
            })
            .addCase(updateBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // delete
            .addCase(deleteBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.loading = false;
                if (state.response) {
                    state.response.data = state.response.data.filter((banner) => banner.id !== action.payload);
                }
            })
            .addCase(deleteBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            });
    }
});

export const {setSelectedBanner} = bannerSlice.actions;
export default bannerSlice.reducer;
