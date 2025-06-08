import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import roleService, { CreatePayload, DataResponse, ErrorResponse, SingleResponse } from "../services/userRoleService";
import userRoleService, { UserRole } from "../services/userRoleService";

interface UserRoleState {
    response: DataResponse | null;
    loading: boolean;
    error: ErrorResponse | null;
    selectedUserRole: UserRole | null;
}

const initialState: UserRoleState = {
    response: null,
    loading: false,
    error: null,
    selectedUserRole: null,
}

export const fetchUserRoles = createAsyncThunk<DataResponse, { page?: number, keyword?: string }, { rejectValue: ErrorResponse }>(
    'user-role/fetchUserRoles',
    async ({ page = 1, keyword = '' }, { rejectWithValue }) => {
        try {
            const response = await userRoleService.getUserRole(page, keyword);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch');
        }
    }
)

export const fetchUserRoleById = createAsyncThunk<UserRole, number, { rejectValue: ErrorResponse }>(
    'user-role/fetchUserRoleById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await roleService.getUserRoleById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch by id');
        }
    })

export const createUserRole = createAsyncThunk<SingleResponse, CreatePayload, { rejectValue: ErrorResponse }>(
    'user-role/createUserRole',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await userRoleService.createUserRole(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const updateUserRole = createAsyncThunk<SingleResponse, { id: number, data: Partial<UserRole> }, { rejectValue: ErrorResponse }>(
    'user-role/updateUserRole',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await userRoleService.updateUserRole(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const deleteUserRole = createAsyncThunk<number, number, { rejectValue: ErrorResponse }>(
    'user-role/deleteUserRole',
    async (id, { rejectWithValue }) => {
        try {
            const response = await userRoleService.deleteUserRole(id);
            console.log(response);
            
            return id;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const userRoleSlice = createSlice({
    name: 'user-role',
    initialState: initialState,
    reducers: {
        setSelectedRole(state, action: { payload: UserRole | null }) {
            state.selectedUserRole = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchUserRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(fetchUserRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // fetch by id
            .addCase(fetchUserRoleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserRoleById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUserRole = action.payload;
            })
            .addCase(fetchUserRoleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // create
            .addCase(createUserRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUserRole.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUserRole = action.payload.data;
                if (state.response) {
                    state.response.data.push(action.payload.data);
                }
            })
            .addCase(createUserRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // update
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUserRole = action.payload.data;
                if (state.response) {
                    const index = state.response.data.findIndex((user_role) => user_role.id === action.payload.data.id);
                    if (index !== -1) state.response.data[index] = action.payload.data;
                }
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // delete
            .addCase(deleteUserRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUserRole.fulfilled, (state, action) => {
                state.loading = false;
                if (state.response) {
                    state.response.data = state.response.data.filter((user_role) => user_role.id !== action.payload);
                }
            })
            .addCase(deleteUserRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            });
    }
});

export const {} = userRoleSlice.actions;
export default userRoleSlice.reducer;
