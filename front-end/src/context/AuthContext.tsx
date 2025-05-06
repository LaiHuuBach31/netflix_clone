import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import authService from '../modules/auth/services/authService';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface AuthContextType {

    isAuthenticated: boolean;

    user: {
        id: number,
        name: string,
        avatar?: string,
        email: string,
        roles: string[]
    } | null;

    login: (accessToken: string, refreshToken: string, user: any) => void;

    logout: () => void;
}

interface UserResponse {
    id: number,
    name: string,
    avatar?: string,
    email: string,
    roles: string[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const isTokenExpired = (token: string): boolean => {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp === undefined) {
                return true;
            }
            return decoded?.exp < currentTime;
        } catch (error) {
            return true;
        }
    }

    const refreshAccessToken = async () => {
        try {
            console.log('refreshAccessToken');
            // logout();
            const response = await authService.refreshToken();
            const { access_token, refresh_token, user: userData } = response.data;  
            login(access_token, refresh_token, userData);
        } catch (error) {
            console.error('Refresh failed:', error);
            logout();
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                const refreshToken = localStorage.getItem('refresh_token');

                if (accessToken && refreshToken) {
                    if (isTokenExpired(accessToken)) {
                        await refreshAccessToken();
                    } else {
                        const decoded = jwtDecode<JwtPayload>(accessToken);
                        const expirestAt = decoded.exp! * 1000;
                        const timeToRefresh = expirestAt - Date.now() - 5 * 60 * 1000;
                        
                        if(timeToRefresh > 0){
                            setTimeout(refreshAccessToken, timeToRefresh);
                        }
                        const response = await authService.getUserInfo();
                        setUser(response.data);
                        setIsAuthenticated(true);
                    }
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setIsAuthenticated(false);
                setUser(null);
            }
            setLoading(false);
        };
        checkAuth();

        const interval = setInterval(() => {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken && isTokenExpired(accessToken)) {
                refreshAccessToken();
            }
        }, 60000); 

        return () => clearInterval(interval);
    }, []);

    const login = (accessToken: string, refreshToken: string, userData: any) => {  
        console.log('login auth');
              
        try {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            localStorage.setItem('user', JSON.stringify(userData));
            setIsAuthenticated(true);
            setUser(userData);
        } catch (error) {
            console.error('Login failed:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
            // toastjs
        }
    };

    const logout = async () => {
        try {
            console.log('logout auth');
            await authService.logout();
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
            
            // window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}