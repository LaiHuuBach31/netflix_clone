import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const GuestRoute:React.FC = () => {

    const {isAuthenticated} = useSelector((state: RootState) => state.auth);
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');

    if (access_token && refresh_token) {
    return <Navigate to="/" replace />;
  }

    return <Outlet />;
};

export default GuestRoute;