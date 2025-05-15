import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import menuService, { DataResponse, ErrorResponse, Menu, SingleMenuResponse, CreateMenuPayload } from "../services/menuService";

interface MenuState {
    response: DataResponse | null;
    loading: boolean;
    error: ErrorResponse | null;
    selectedMenu: Menu | SingleMenuResponse | null;
}

const initialState: MenuState = {
    response: null,
    loading: false,
    error: null,
    selectedMenu: null,
}

export const fetchMenus = createAsyncThunk<DataResponse, { page?: number, keyword?: string }, { rejectValue: ErrorResponse }>(
    'menu/fetchMenus',
    async ({ page = 1, keyword = '' }, { rejectWithValue }) => {
        try {            
            const response = await menuService.getMenus(page, keyword);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch menus');
        }
    })

export const fetchMenuById = createAsyncThunk<Menu, number, { rejectValue: ErrorResponse }>(
    'menu/fetchMenuById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await menuService.getMenuById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch menu by id');
        }
    })

export const createMenu = createAsyncThunk<SingleMenuResponse, CreateMenuPayload, { rejectValue: ErrorResponse }>(
    'menu/createMenu',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await menuService.createMenu(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const updateMenu = createAsyncThunk<SingleMenuResponse, { id: number, data: Partial<Menu> }, { rejectValue: ErrorResponse }>(
    'menu/updateMenu',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await menuService.updateMenu(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const deleteMenu = createAsyncThunk<number, number, { rejectValue: ErrorResponse }>(
    'menu/deleteMenu',
    async (id, { rejectWithValue }) => {
        try {
            await menuService.deleteMenu(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const menuSlice = createSlice({
    name: 'menu',
    initialState: initialState,
    reducers: {
        setSelectedMenu(state, action: { payload: Menu | null }) {
            state.selectedMenu = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchMenus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenus.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(fetchMenus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // fetch by id
            .addCase(fetchMenuById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenuById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedMenu = action.payload;
            })
            .addCase(fetchMenuById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // create
            .addCase(createMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedMenu = action.payload;
                if (state.response) {
                    state.response.data.push(action.payload.data);
                }
            })
            .addCase(createMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // update
            .addCase(updateMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedMenu = action.payload.data;
                if (state.response) {
                    const index = state.response.data.findIndex((genre) => genre.id === action.payload.data.id);
                    if (index !== -1) state.response.data[index] = action.payload.data;
                }
            })
            .addCase(updateMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // delete
            .addCase(deleteMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMenu.fulfilled, (state, action) => {
                state.loading = false;
                if (state.response) {
                    state.response.data = state.response.data.filter((genre) => genre.id !== action.payload);
                }
            })
            .addCase(deleteMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            });
    }
});

export const { } = menuSlice.actions;
export default menuSlice.reducer;