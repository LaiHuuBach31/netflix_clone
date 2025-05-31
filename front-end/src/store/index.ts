import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import genreReducer from '../modules/admin/store/genreSlice';
import menuReducer from '../modules/admin/store/menuSlice';
import planReducer from '../modules/admin/store/planSlice';
import uploadReducer from '../modules/admin/store/uploadSlice';
import movieReducer from '../modules/admin/store/movieSlice';
import userReducer from '../modules/admin/store/userSlice';
import roleReducer from '../modules/admin/store/roleSlice';
import userRoleReducer from '../modules/admin/store/userRoleSlice';
import permissionReducer from '../modules/admin/store/permissionSlice';
import rolePermissionReducer from '../modules/admin/store/rolePermissionSlice';
import bannerReducer from '../modules/admin/store/bannerSlice';
import subscriptionReducer from '../modules/admin/store/subscriptionSlice';
import watchHistoryReducer from '../modules/admin/store/watchHistorySlice';
import ratingReducer from '../modules/admin/store/ratingSlice';
import favouriteReducer from '../modules/admin/store/favouriteSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    genre: genreReducer,
    menu: menuReducer,
    plan: planReducer,
    upload: uploadReducer,
    movie: movieReducer,
    user: userReducer,
    role: roleReducer,
    user_role: userRoleReducer,
    permission: permissionReducer,
    role_permission: rolePermissionReducer,
    banner: bannerReducer,
    subscription: subscriptionReducer,
    watchHistory: watchHistoryReducer,
    rating: ratingReducer,
    favourite: favouriteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;