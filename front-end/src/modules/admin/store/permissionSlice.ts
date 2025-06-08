import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreatePayload, DataResponse, ErrorResponse, Permission, SingleResponse } from "../services/permissionService";
import permissionService from "../services/permissionService";

interface PermissionState {
    response: DataResponse | null;
    loading: boolean;
    error: ErrorResponse | null;
    selectedPermission: Permission | null;
}

const initialState: PermissionState = {
    response: null,
    loading: false,
    error: null,
    selectedPermission: null,
}

export const fetchPermissions = createAsyncThunk<DataResponse, { page?: number, keyword?: string, limit?: number }, { rejectValue: ErrorResponse }>(
    'permission/fetchPermissions',
    async ({ page = 1, keyword = '', limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await permissionService.getPermissions(page, keyword, limit);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch permissions');
        }
    }
)

export const fetchPermissionById = createAsyncThunk<Permission, number, { rejectValue: ErrorResponse }>(
    'permission/fetchPermissionById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await permissionService.getPermissionById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch permission by id');
        }
    }
)

export const createPermission = createAsyncThunk<SingleResponse, CreatePayload, { rejectValue: ErrorResponse }>(
    'permission/createPermission',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await permissionService.createPermission(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const updatePermission = createAsyncThunk<SingleResponse, { id: number, data: Partial<Permission> }, { rejectValue: ErrorResponse }>(
    'permission/updatePermission',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await permissionService.updatePermission(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const deletePermission = createAsyncThunk<number, number, { rejectValue: ErrorResponse }>(
    'permission/deletePermission',
    async (id, { rejectWithValue }) => {
        try {
            const response = await permissionService.deletePermission(id);
            console.log(response);
            return id;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const permissionSlice = createSlice({
    name: 'permission',
    initialState: initialState,
    reducers: {
        setSelectedPermission(state, action: { payload: Permission | null }) {
            state.selectedPermission = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchPermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPermissions.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(fetchPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // fetch by id
            .addCase(fetchPermissionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPermissionById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPermission = action.payload;
            })
            .addCase(fetchPermissionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // create
            .addCase(createPermission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPermission.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPermission = action.payload.data;
                if (state.response && state.response.data) {
                    state.response.data.push(action.payload.data);
                }
            })
            .addCase(createPermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // update
            .addCase(updatePermission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePermission.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPermission = action.payload.data;
                if (state.response && state.response.data) {
                    const index = state.response.data.findIndex((permission) => permission.id === action.payload.data.id);
                    if (index !== -1) state.response.data[index] = action.payload.data;
                }
            })
            .addCase(updatePermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // delete
            .addCase(deletePermission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePermission.fulfilled, (state, action) => {
                state.loading = false;
                if (state.response && state.response.data) {
                    state.response.data = state.response.data.filter((permission) => permission.id !== action.payload);
                }
            })
            .addCase(deletePermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            });
    }
});

export const { setSelectedPermission } = permissionSlice.actions; 
export default permissionSlice.reducer;