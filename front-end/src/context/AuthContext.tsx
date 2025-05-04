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

    login: (token: string, user: any) => void;

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

    useEffect(() => {

        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');

                if (token) {
                    if (isTokenExpired(token)) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setIsAuthenticated(false);
                        setUser(null);
                    } else {
                        const response = await authService.getUserInfo();
                        setUser(response.data);
                        setIsAuthenticated(true);

                        const interval = setInterval(() => {
                            const currentToken = localStorage.getItem('token');
                            if (currentToken && isTokenExpired(currentToken)) {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                setIsAuthenticated(false);
                                setUser(null);
                                window.location.href = '/login';
                                clearInterval(interval);
                            }
                        }, 60000);
                    }
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsAuthenticated(false);
                setUser(null);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (token: string, userData: any) => {
        console.log('login in auth');
        
        try {
            localStorage.setItem('token', token);
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
            await authService.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
            
            window.location.href = '/login';
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