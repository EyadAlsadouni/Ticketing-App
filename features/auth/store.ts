// features/auth/store.ts
import { create } from 'zustand';
import { AuthState, SimpleUser } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
// Mock user for demo
const MOCK_USER: SimpleUser = {
    id: 1,
    email: 'admin@ticktraq.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=2563EB&color=fff',
};

export const useAuthStore = create<AuthState>((set, get) => ({
    user: MOCK_USER, // Default to logged in user
    token: 'mock_token',
    refreshToken: 'mock_refresh',
    isAuthenticated: true, // Default to true
    isLoading: false,
    error: null,

    login: async (email, password) => {
        // No-op for now
        return true;
    },

    logout: async () => {
        // Just reset state but basic auth guard is disabled in layout anyway
        set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
        });
    },

    checkAuth: async () => {
        // Always say yes
        set({
            user: MOCK_USER,
            isAuthenticated: true,
            isLoading: false,
        });
    },
}));
