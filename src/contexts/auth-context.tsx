'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_USERS } from '@/lib/data';
import { useRole } from './role-context';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setRole } = useRole();
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for a stored session
    try {
      const storedAuth = sessionStorage.getItem('isAuthenticated');
      if (storedAuth === 'true') {
        const storedRole = sessionStorage.getItem('userRole');
        if (storedRole) {
            setRole(storedRole as any);
        }
        setIsAuthenticated(true);
      }
    } catch (error) {
        console.error('Could not access session storage:', error);
    } finally {
        setTimeout(() => setLoading(false), 500); // Simulate loading delay
    }
  }, [setRole]);

  const login = (email: string): boolean => {
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setIsAuthenticated(true);
      setRole(user.role);
       try {
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userRole', user.role);
       } catch (error) {
        console.error('Could not access session storage:', error);
       }
      router.push('/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userRole');
    } catch (error) {
        console.error('Could not access session storage:', error);
    }
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
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

export function AuthGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);


    if (loading || !isAuthenticated) {
       return (
         <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6">
                <Skeleton className="w-24 h-8" />
                <div className="hidden md:flex items-center gap-2 mx-auto">
                    <Skeleton className="w-24 h-8" />
                    <Skeleton className="w-24 h-8" />
                    <Skeleton className="w-24 h-8" />
                </div>
                <div className="flex items-center gap-2 ml-auto">
                   <Skeleton className="w-32 h-8" />
                   <Skeleton className="w-8 h-8 rounded-full" />
                </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
                <Skeleton className="h-10 w-1/3 mb-8" />
                <Skeleton className="w-full h-96" />
            </main>
         </div>
       )
    }

    return <>{children}</>;
}
