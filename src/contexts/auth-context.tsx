'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_USERS } from '@/lib/data';
import type { User } from '@/lib/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for user in session storage on initial load
    try {
      const storedUser = sessionStorage.getItem('authUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Could not access session storage:', error);
    } finally {
        // Use a small delay to prevent screen flicker
        setTimeout(() => setLoading(false), 300);
    }
  }, []);
  
  const isAuthenticated = !!user;

  const login = (email: string): boolean => {
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      try {
        sessionStorage.setItem('authUser', JSON.stringify(foundUser));
        sessionStorage.setItem('userRole', foundUser.role);
      } catch (error) {
        console.error('Could not access session storage:', error);
      }
      router.push('/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    try {
        sessionStorage.removeItem('authUser');
        sessionStorage.removeItem('userRole');
    } catch (error) {
        console.error('Could not access session storage:', error);
    }
    router.push('/login');
  };
  
  const value = { isAuthenticated, user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
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
