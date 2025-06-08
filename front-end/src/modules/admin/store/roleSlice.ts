import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import roleService, { CreatePayload, DataResponse, ErrorResponse, Role, SingleResponse } from "../services/roleService";

interface RoleState {
    response: DataResponse | null;
    loading: boolean;
    error: ErrorResponse | null;
    selectedRole: Role | null;
}

const initialState: RoleState = {
    response: null,
    loading: false,
    error: null,
    selectedRole: null,
}

export const fetchRoles = createAsyncThunk<DataResponse, { page?: number, keyword?: string }, { rejectValue: ErrorResponse }>(
    'role/fetchRoles',
    async ({ page = 1, keyword = '' }, { rejectWithValue }) => {
        try {
            const response = await roleService.getRoles(page, keyword);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch roles');
        }
    }
)

export const fetchRoleById = createAsyncThunk<Role, number, { rejectValue: ErrorResponse }>(
    'role/fetchRoleById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await roleService.getRoleById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch role by id');
        }
    })

export const createRole = createAsyncThunk<SingleResponse, CreatePayload, { rejectValue: ErrorResponse }>(
    'role/createRole',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await roleService.createRole(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const updateRole = createAsyncThunk<SingleResponse, { id: number, data: Partial<Role> }, { rejectValue: ErrorResponse }>(
    'role/updateRole',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await roleService.updateRole(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const deleteRole = createAsyncThunk<number, number, { rejectValue: ErrorResponse }>(
    'role/deleteRole',
    async (id, { rejectWithValue }) => {
        try {
            const response = await roleService.deleteRole(id);
            console.log(response);
            
            return id;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const roleSlice = createSlice({
    name: 'role',
    initialState: initialState,
    reducers: {
        setSelectedRole(state, action: { payload: Role | null }) {
            state.selectedRole = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // fetch by id
            .addCase(fetchRoleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoleById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRole = action.payload;
            })
            .addCase(fetchRoleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // create
            .addCase(createRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRole = action.payload.data;
                if (state.response) {
                    state.response.data.push(action.payload.data);
                }
            })
            .addCase(createRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // update
            .addCase(updateRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRole = action.payload.data;
                if (state.response) {
                    const index = state.response.data.findIndex((role) => role.id === action.payload.data.id);
                    if (index !== -1) state.response.data[index] = action.payload.data;
                }
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // delete
            .addCase(deleteRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.loading = false;
                if (state.response) {
                    state.response.data = state.response.data.filter((role) => role.id !== action.payload);
                }
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            });
    }
});

export const {} = roleSlice.actions;
export default roleSlice.reducer;
