import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService, { CreatePayload, DataResponse, ErrorResponse, SingleResponse, User } from "../services/userService";

interface UserState {
    response: DataResponse | null;
    loading: boolean;
    error: ErrorResponse | null;
    selectedUser: User | SingleResponse | null;
}

const initialState: UserState = {
    response: null,
    loading: false,
    error: null,
    selectedUser: null,
}

export const fetchUsers = createAsyncThunk<DataResponse, { page?: number, keyword?: string }, { rejectValue: ErrorResponse }>(
    'user/fetchUsers',
    async ({ page = 1, keyword = '' }, { rejectWithValue }) => {
        try {
            const response = await userService.getUsers(page, keyword);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch users');
        }
    }
)

export const fetchUserById = createAsyncThunk<User, number, { rejectValue: ErrorResponse }>(
    'user/fetchUserById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await userService.getUserById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to fetch user by id');
        }
    })

export const createUser = createAsyncThunk<SingleResponse, CreatePayload, { rejectValue: ErrorResponse }>(
    'user/createUser',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await userService.createUser(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const updateUser = createAsyncThunk<SingleResponse, { id: number, data: Partial<User> }, { rejectValue: ErrorResponse }>(
    'user/updateUser',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await userService.updateUser(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const deleteUser = createAsyncThunk<number, number, { rejectValue: ErrorResponse }>(
    'user/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            const response = await userService.deleteUser(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setSelectedUser(state, action: { payload: User | null }) {
            state.selectedUser = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // fetch by id
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // create
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
                if (state.response) {
                    state.response.data.push(action.payload.data);
                }
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // update
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload.data;
                if (state.response) {
                    const index = state.response.data.findIndex((genre) => genre.id === action.payload.data.id);
                    if (index !== -1) state.response.data[index] = action.payload.data;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })

            // delete
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                if (state.response) {
                    state.response.data = state.response.data.filter((user) => user.id !== action.payload);
                }
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            });
    }
})

export const {} = userSlice.actions;
export default userSlice.reducer;