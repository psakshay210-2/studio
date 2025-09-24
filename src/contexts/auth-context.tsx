'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_USERS } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/lib/types';
import { useRole } from './role-context';

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
    // This effect should only run in the RoleProvider, after auth is settled.
    // It's a bit of a workaround for the context dependency.
  }, []);


  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('authUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Could not access session storage:', error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, []);
  
  const isAuthenticated = !!user;

  const login = (email: string): boolean => {
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      try {
        sessionStorage.setItem('authUser', JSON.stringify(foundUser));
        // We still store role for initial role setting on reload.
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

export function AuthGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const { setRole } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
        if(!loading && isAuthenticated) {
          try {
            // On load, set the role from session storage if it exists,
            // allowing the "view as" state to persist across reloads.
            const storedRole = sessionStorage.getItem('userRole');
            if (storedRole) {
              setRole(storedRole as any);
            }
          } catch (error) {
            console.error('Could not access session storage:', error);
          }
        }
    }, [isAuthenticated, loading, router, setRole]);


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
