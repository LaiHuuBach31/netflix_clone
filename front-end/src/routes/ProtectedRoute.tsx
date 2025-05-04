import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showWarningToast } from '../utils/toast';

const ProtectedRoute: React.FC = () => {  
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const hasAdminRole = user?.roles?.includes('Admin') || false;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isAdminRoute && !hasAdminRole) {
    showWarningToast("You do not have access!!!");
    return <Navigate to="/403" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;

};

export default ProtectedRoute;