import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { showWarningToast } from '../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store';

const ProtectedRoute: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);
  const access_token = localStorage.getItem('access_token');
  const refresh_token = localStorage.getItem('refresh_token');
  const location = useLocation();
  console.log('isAuthenticated', isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated && !user && !loading) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated, user]);


  const isAdminRoute = location.pathname.startsWith('/admin');

  const hasAdminRole = user?.roles?.includes('Admin') || false;

  if (isAdminRoute && !hasAdminRole) {
    showWarningToast("You do not have access!!!");
    return <Navigate to="/403" state={{ from: location.pathname }} replace />;
  }

  if (!access_token && !refresh_token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  console.log('isAdminRoute', isAdminRoute);
  console.log('!hasAdminRole', !hasAdminRole);

  return <Outlet />;

};

export default ProtectedRoute;