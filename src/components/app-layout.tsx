'use client';

import React, { useState, useEffect } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    const cookieValue = document.cookie.includes('sidebar_state=true');
    setIsSidebarOpen(cookieValue);
    setHasHydrated(true);
  }, []);

  // We need to ensure we don't cause a layout shift or hydration error.
  // We will render with the default state on the server and during the initial client render.
  // The useEffect will then update the state on the client, which is safe.
  if (!hasHydrated) {
      // You can return a loading skeleton here if you prefer
      return (
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen">
            <Sidebar>
              <AppSidebar />
            </Sidebar>
            <SidebarInset className="flex-1 flex flex-col">
              <AppHeader />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      );
  }
    
  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <div className="flex min-h-screen">
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
