'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRole } from '@/contexts/role-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Role } from '@/lib/types';

export function AuthGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, user, loading } = useAuth();
    const { setRole } = useRole();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else {
                 try {
                    const storedRole = sessionStorage.getItem('userRole') as Role;
                    if (storedRole) {
                        setRole(storedRole);
                    } else if (user) {
                        setRole(user.role);
                    }
                } catch (error) {
                    console.error('Could not access session storage:', error);
                }
            }
        }
    }, [isAuthenticated, loading, router, pathname, setRole, user]);


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
