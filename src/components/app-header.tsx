'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { RoleSwitcher } from './role-switcher';
import { Button } from './ui/button';
import { Bell, Search } from 'lucide-react';

export function AppHeader() {
  const pathname = usePathname();
  const getTitle = () => {
    const segment = pathname.split('/').pop() || 'dashboard';
    if (segment === 'create') return 'Create Event';
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="flex-1 text-xl font-semibold font-headline">{getTitle()}</h1>
      <div className="flex items-center gap-2">
        <RoleSwitcher />
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
}
