// features/auth/types.ts
// Adapted from web app types

export interface SimpleUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'user' | 'manager';
    avatar?: string;
}

export interface AuthState {
    user: SimpleUser | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}
