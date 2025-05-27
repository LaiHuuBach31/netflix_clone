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
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;