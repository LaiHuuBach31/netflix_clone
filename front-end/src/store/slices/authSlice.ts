import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode, JwtPayload } from "jwt-decode";
import authService from "../../modules/auth/services/authService";
import { ac } from "react-router/dist/development/route-data-5OzAzQtT";
import subscriptionService from "../../modules/admin/services/subscriptionService";
import { updateSubscription } from "../../modules/admin/store/subscriptionSlice";

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
    error: ErrorResponse | null;
    subscriptionExpiry: number | null;
    subscriptionId: number | null;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    avatar: string;
    name: string;
    email: string;
    password: string;
}

interface ChangePasswordPayload {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

interface ErrorResponse {
    status: boolean;
    message: string;
    errors: any;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    subscriptionExpiry: null,
    subscriptionId: null,
};

const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp === undefined || decoded.exp < currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
};

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
    try {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const userLocal = localStorage.getItem('user');

        if (!accessToken || !refreshToken) {
            throw new Error('No token found');
        }

        const isExpired = isTokenExpired(accessToken);
        const userData = JSON.parse(userLocal || '{}');
        const isAdmin = userData?.roles?.includes('Admin') || false;
        // console.log(isAdmin);


        if (isExpired) {
            const response = await authService.refreshToken();
            const responseData = response.data;

            localStorage.setItem('access_token', responseData.access_token);
            localStorage.setItem('refresh_token', responseData.refresh_token);

            const userId = responseData.user?.id;
            if (!isAdmin) {
                const subscriptionResponse = await subscriptionService.getSubscriptionByUser(Number(userId));
                const subscription = subscriptionResponse.data;

                if (!subscription || !subscription.end_date) {
                    throw new Error('No active subscription found');
                }

                const endDate = new Date(subscription.end_date).getTime();

                return {
                    user: responseData.user,
                    accessToken: responseData.access_token || accessToken,
                    refreshToken: responseData.refresh_token || refreshToken,
                    subscriptionExpiry: endDate,
                    subscriptionId: subscription.id,
                };
            } else {
                return {
                    user: responseData.user,
                    accessToken: responseData.access_token || accessToken,
                    refreshToken: responseData.refresh_token || refreshToken,
                };
            }

        } else {
            const response = await authService.getUserInfo();
            const responseData = response.data;

            if (!isAdmin) {
                const userId = responseData.id;
                const subscriptionResponse = await subscriptionService.getSubscriptionByUser(userId);
                const subscription = subscriptionResponse.data;

                if (!subscription || !subscription.end_date) {
                    throw new Error('No active subscription found');
                }

                const endDate = new Date(subscription.end_date).getTime();

                return {
                    user: responseData,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    subscriptionExpiry: endDate,
                    subscriptionId: subscription.id,
                };
            } else {
                return {
                    user: responseData,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };
            }

        }



    } catch (error: any) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        return rejectWithValue(error.response?.data?.message || 'Auth check failed');
    }
});

export const refreshAccessToken = createAsyncThunk('auth/refreshAccessToken', async (_, { rejectWithValue }) => {
    try {
        const response = await authService.refreshToken();
        const { access_token, refresh_token, user } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
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
        const { access_token, refresh_token, user } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        if (!user) {
            throw new Error('User data not found in response');
        }

        return {
            user,
            accessToken: access_token,
            refreshToken: refresh_token
        };
    } catch (error: any) {
        console.log('error', error);

        return rejectWithValue(error.response.data || 'Login failed');
    }
});

export const registerAsync = createAsyncThunk('auth/register', async (credentials: RegisterPayload, { rejectWithValue }) => {
    try {
        const response = await authService.register(credentials);
        const { access_token, refresh_token, user } = response.data;

        if (!user) {
            throw new Error('User data not found in response');
        }

        return {
            user,
            accessToken: access_token,
            refreshToken: refresh_token
        };

    } catch (error: any) {
        console.log('Register error:', error.response.data);
        return rejectWithValue(error.response.data || 'Login failed');
    }
});

export const logoutAsync = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await authService.logout();
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        return true;
    } catch (error: any) {
        return rejectWithValue(error.response.data.errors || 'Logout failed');
    }
});

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (data: { name: string; email: string; avatar?: string }, { rejectWithValue }) => {
        try {
            const response = await authService.updateProfile(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response.data || 'Update failed');
        }
    }
);

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (data: ChangePasswordPayload, { rejectWithValue }) => {
        try {
            const response = await authService.changePassword(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response.data || 'Password change failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<{ user: AuthState['user'], accessToken: string, refreshToken: string, subscriptionExpiry?: number }>) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.loading = false;
            state.error = null;
            state.subscriptionExpiry = action.payload.subscriptionExpiry || null;
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
                state.subscriptionExpiry = action.payload.subscriptionExpiry || null;
                state.subscriptionId = action.payload.subscriptionId || null;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.user = null;
                state.loading = false;
                state.error = action.payload as ErrorResponse;
                state.subscriptionExpiry = null;
                state.subscriptionId = null;
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
                state.error = action.payload as ErrorResponse;
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
                state.error = action.payload as ErrorResponse;
            })
            .addCase(registerAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerAsync.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.loading = false;
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(registerAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ErrorResponse;
                localStorage.removeItem('user');
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
                state.error = action.payload as ErrorResponse;
            }).addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { ...state.user, ...action.payload.data };
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ErrorResponse;
            })
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data.user as AuthState['user'];
                localStorage.setItem('user', JSON.stringify(state.user));
                localStorage.setItem('access_token', action.payload.data.access_token);
                localStorage.setItem('refresh_token', action.payload.data.refresh_token);
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ErrorResponse;
            });
    },
});

export const { loginSuccess } = authSlice.actions;
export default authSlice.reducer;