import React, { ReactNode, useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { showWarningToast } from '../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { updateSubscription } from '../modules/admin/store/subscriptionSlice';

const ProtectedRoute: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading, subscriptionExpiry, subscriptionId } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const currentTime = new Date().getTime();

  const access_token = localStorage.getItem('access_token');
  const refresh_token = localStorage.getItem('refresh_token');
  const user_localStorage = localStorage.getItem('user');

  const isAdminRoute = location.pathname.startsWith('/admin');
  const userCurent = JSON.parse(user_localStorage || '{}');
  const hasAdminRole = userCurent?.roles?.includes('Admin') || false;

  useEffect(() => {
    if (!access_token && !refresh_token) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }

    if (isAdminRoute && !hasAdminRole) {
      showWarningToast('You do not have access!!!');
      navigate('/403', { state: { from: location.pathname } });
      return;
    }

    if (!loading && isAuthenticated && !hasAdminRole && subscriptionExpiry && currentTime > subscriptionExpiry) {
      if (subscriptionId) {
        dispatch(updateSubscription({ id: subscriptionId, data: { status: false } }));
      }
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      showWarningToast('Your subscription has expired. Please purchase a new plan.');
      navigate('/subscription-extension', { replace: true, state: { from: location } });
    }
  }, [dispatch, loading, isAuthenticated, hasAdminRole, subscriptionExpiry, currentTime, navigate, access_token, refresh_token, isAdminRoute, subscriptionId, location]);

  if (!access_token && !refresh_token) return null;
  if (isAdminRoute && !hasAdminRole) return null;

  return <Outlet />;
};

export default ProtectedRoute;