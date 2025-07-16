"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    const refreshToken = async () => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
        });
        if (!response.ok) {
          console.error('Failed to refresh token');
          logout(); // Force logout if refresh fails
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        logout();
      }
    };

    checkAuthStatus();

    // Set up an interval to refresh token periodically (e.g., every 15 minutes)
    const refreshInterval = setInterval(refreshToken, 15 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        // Handle login error (e.g., display error message)
        console.error('Login failed:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Optionally, log the user in directly after successful registration
        // or redirect them to the login page.
        return true;
      } else {
        console.error('Registration failed:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    // In a real application, you would invalidate the token on the server
    setUser(null);
    setIsAuthenticated(false);
    // Optionally, redirect to login page or home
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
