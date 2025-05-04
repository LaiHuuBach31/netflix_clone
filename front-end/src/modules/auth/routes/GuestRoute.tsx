import React from 'react'
import { useAuth } from '../../../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom';

const GuestRoute:React.FC = () => {
    const {isAuthenticated} = useAuth();

    if(isAuthenticated){
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default GuestRoute