import React, { createContext, ReactNode, useContext } from 'react'
import { useAuth as useAuthHook } from '../hooks/useAuth';


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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const auth = useAuthHook();

    if (auth.loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated: auth.isAuthenticated, 
            user: auth.user, 
            login: auth.login, 
            logout: auth.logout 
        }}>
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