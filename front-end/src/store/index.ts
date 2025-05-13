import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import genreReducer from '../modules/admin/store/genreSlice';
import menuReducer from '../modules/admin/store/menuSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    genre: genreReducer,
    menu: menuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;