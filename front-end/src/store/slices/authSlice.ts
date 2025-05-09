import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode, JwtPayload } from "jwt-decode";
import authService from "../../modules/auth/services/authService";

interface AuthState {
    isAuthenticated: boolean;
    user: {
        id: number;
        name: string;
        avatar?: string;
        email: string;
        roles: string[];
    } | null;
    loading: boolean;
    error: string | null;
}

interface LoginPayload {
    email: string;
    password: string;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
};

const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp === undefined || decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
    try {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (!accessToken || !refreshToken) {
            throw new Error('No token found');
        }

        const isExpired = isTokenExpired(accessToken);

        if (isExpired) {
            const response = await authService.refreshToken();
            const { access_token, refresh_token, user } = response.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            return {
                user,
                accessToken: access_token,
                refreshToken: refresh_token
            };
        } else {
            const response = await authService.getUserInfo();
            return {
                user: response.data,
                accessToken,
                refreshToken
            };
        }
    } catch (error: any) {
        console.log('CheckAuth error:', error); 
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return rejectWithValue(error.response?.data?.message || 'Auth check failed');
    }
});

export const refreshAccessToken = createAsyncThunk('auth/refreshAccessToken', async (_, { rejectWithValue }) => {
    try {
        const response = await authService.refreshToken();
        const { access_token, refresh_token, user } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        return {
            user,
            accessToken: access_token,
            refreshToken: refresh_token
        };
    } catch (error: any) {
        console.log('RefreshAccessToken error:', error); 
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return rejectWithValue('Unauthorized');
        }
        return rejectWithValue(error.response?.data?.message || 'Refresh failed');
    }
});

export const loginAsync = createAsyncThunk('auth/login', async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
        const response = await authService.login(credentials);
        console.log('API Response:', response);
        const { access_token, refresh_token, user } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        console.log('User from API:', user);

        if (!user) {
            throw new Error('User data not found in response');
        }

        return {
            user,
            accessToken: access_token,
            refreshToken: refresh_token
        };
    } catch (error: any) {
        console.log('Login error:', error);
        return rejectWithValue(error.message || error.response?.data?.message || 'Login failed');
    }
});

export const logoutAsync = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await authService.logout();
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return true;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<{ user: AuthState['user'], accessToken: string, refreshToken: string }>) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.loading = false;
            state.error = null;
            localStorage.setItem('access_token', action.payload.accessToken);
            localStorage.setItem('refresh_token', action.payload.refreshToken);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload.user || null;
                state.loading = false;
                state.error = null;
                localStorage.setItem('access_token', action.payload.accessToken);
                localStorage.setItem('refresh_token', action.payload.refreshToken);
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.user = null;
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(refreshAccessToken.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload.user || null;
                state.loading = false;
                state.error = null;
                localStorage.setItem('access_token', action.payload.accessToken);
                localStorage.setItem('refresh_token', action.payload.refreshToken);
            })
            .addCase(refreshAccessToken.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.user = null;
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(loginAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.isAuthenticated = !!action.payload.user;
                state.user = action.payload.user;
                state.loading = false;
                state.error = null;
                localStorage.setItem('access_token', action.payload.accessToken);
                localStorage.setItem('refresh_token', action.payload.refreshToken);
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.user = null;
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.loading = false;
                state.error = null;
            })
            .addCase(logoutAsync.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.user = null;
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { loginSuccess } = authSlice.actions;
export default authSlice.reducer;