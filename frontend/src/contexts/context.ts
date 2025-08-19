import { createContext } from 'react';
import type { TenantContextType, User } from '../types';

export const TenantContext = createContext<TenantContextType | undefined>(undefined);

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);