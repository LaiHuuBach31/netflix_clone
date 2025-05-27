import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import rolePermissionService, { CreatePayload, DataResponse, ErrorResponse, RolePermission, SingleResponse } from "../services/rolePermissionService";

interface RolePermissionState {
    response: DataResponse | null;
    loading: boolean;
    error: ErrorResponse | null;
    selectedRolePermission: RolePermission | SingleResponse | null;
}

const initialState: RolePermissionState = {
    response: null,
    loading: false,
    error: null,
    selectedRolePermission: null,
}

export const fetchRolePermissions = createAsyncThunk<DataResponse, { page?: number, keyword?: string }, { rejectValue: ErrorResponse }>(
    'role-permission/fetchRolePermissions',
    async ({ page = 1, keyword = '' }, { rejectWithValue }) => {
        try {
            const response = await rolePermissionService.getRolePermissions(page, keyword);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch');
        }
    }
)

export const fetchRolePermissionById = createAsyncThunk<RolePermission, number, { rejectValue: ErrorResponse }>(
    'role-permission/fetchRolePermissionById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await rolePermissionService.getRolePermissionById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch by id');
        }
    })

export const createRolePermission = createAsyncThunk<SingleResponse, CreatePayload, { rejectValue: ErrorResponse }>(
    'role-permission/createRolePermission',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await rolePermissionService.createRolePermission(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const updateRolePermission = createAsyncThunk<SingleResponse, { id: number, data: Partial<RolePermission> }, { rejectValue: ErrorResponse }>(
    'role-permission/updateRolePermission',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await rolePermissionService.updateRolePermission(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const deleteRolePermission = createAsyncThunk<number, number, { rejectValue: ErrorResponse }>(
    'role-permission/deleteRolePermission',
    async (id, { rejectWithValue }) => {
        try {
            const response = await rolePermissionService.deleteRolePermission(id);
            console.log(response);
            
            return id;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const rolePermissionSlice = createSlice({
    name: 'role-permission',
    initialState: initialState,
    reducers: {
        setSelectedRole(state, action: { payload: RolePermission | null }) {
            state.selectedRolePermission = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchRolePermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRolePermissions.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(fetchRolePermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // fetch by id
            .addCase(fetchRolePermissionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRolePermissionById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRolePermission = action.payload;
            })
            .addCase(fetchRolePermissionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // create
            .addCase(createRolePermission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRolePermission.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRolePermission = action.payload;
                if (state.response) {
                    state.response.data.push(action.payload.data);
                }
            })
            .addCase(createRolePermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // update
            .addCase(updateRolePermission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRolePermission.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRolePermission = action.payload.data;
                if (state.response) {
                    const index = state.response.data.findIndex((user_role) => user_role.id === action.payload.data.id);
                    if (index !== -1) state.response.data[index] = action.payload.data;
                }
            })
            .addCase(updateRolePermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // delete
            .addCase(deleteRolePermission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRolePermission.fulfilled, (state, action) => {
                state.loading = false;
                if (state.response) {
                    state.response.data = state.response.data.filter((user_role) => user_role.id !== action.payload);
                }
            })
            .addCase(deleteRolePermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            });
    }
});

export const {} = rolePermissionSlice.actions;
export default rolePermissionSlice.reducer;
