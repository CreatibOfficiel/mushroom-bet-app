'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { User, userSchema } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  makeAuthenticatedRequest: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper function to make authenticated requests with automatic token refresh
  const makeAuthenticatedRequest = async (
    url: string,
    options: RequestInit = {},
  ): Promise<Response> => {
    // First attempt
    let response = await fetch(url, {
      ...options,
      credentials: 'include',
    });

    // If 401 (token expired), try to refresh
    if (response.status === 401) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          // Refresh successful, retry the original request
          response = await fetch(url, {
            ...options,
            credentials: 'include',
          });
        } else {
          // Refresh failed, user needs to login again
          setUser(null);
          setIsAuthenticated(false);
          toast.error('Session expired. Please login again.');
          throw new Error('Session expired');
        }
      } catch (refreshError) {
        // Refresh request failed
        console.error('Token refresh failed:', refreshError);
        setUser(null);
        setIsAuthenticated(false);
        toast.error('Session expired. Please login again.');
        throw new Error('Session expired');
      }
    }

    return response;
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/me`);

        if (response.ok) {
          const data = await response.json();
          const validatedUser = userSchema.parse(data);
          setUser(validatedUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login response data:', data);
        const validatedUser = userSchema.parse(data.user);
        setUser(validatedUser);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      toast.error('Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast.success('Registration successful! Please login.');
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await makeAuthenticatedRequest(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    }
  };

  const contextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    makeAuthenticatedRequest, // Export this for other components to use
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Helper hook to make authenticated API calls with automatic token refresh
 *
 * Usage example:
 * ```tsx
 * const { makeAuthenticatedRequest } = useAuth();
 *
 * const fetchRaces = async () => {
 *   try {
 *     const response = await makeAuthenticatedRequest(`${API_BASE_URL}/races`);
 *     if (response.ok) {
 *       const races = await response.json();
 *       setRaces(races);
 *     }
 *   } catch (error) {
 *     // Token refresh failed, user redirected to login
 *     console.error('Failed to fetch races:', error);
 *   }
 * };
 * ```
 */
export const useAuthenticatedRequest = () => {
  const { makeAuthenticatedRequest } = useAuth();
  return makeAuthenticatedRequest;
};
