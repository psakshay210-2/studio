'use client';

import React from 'react';
import { RoleSwitcher } from './role-switcher';
import { Button } from './ui/button';
import { Bell, Search, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  MessageSquare,
} from 'lucide-react';
import { useRole } from '@/contexts/role-context';
import type { Role } from '@/lib/types';
import { Logo } from './icons/logo';

const navItemsByRole: Record<
  Role,
  { href: string; icon: React.ElementType; label: string }[]
> = {
  Organizer: [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/events', icon: Calendar, label: 'Events' },
    { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { href: '/messages', icon: MessageSquare, label: 'Messages' },
  ],
  Approver: [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/events', icon: Calendar, label: 'Events' },
  ],
  Participant: [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/events', icon: Calendar, label: 'Events' },
  ],
  Vendor: [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/events', icon: Calendar, label: 'Events' },
    { href: '/messages', icon: MessageSquare, label: 'Messages' },
  ],
  Sponsor: [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/events', icon: Calendar, label: 'Events' },
  ],
};

export function AppHeader() {
  const { role } = useRole();
  const navItems = navItemsByRole[role];

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Logo className="w-8 h-8" />
        <h1 className="text-xl font-semibold font-headline text-primary">EventFlow</h1>
      </div>

      <nav className="hidden md:flex items-center gap-2 mx-auto">
        {navItems.map((item) => (
          <Button key={item.href} variant="ghost" asChild>
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>

      <div className="flex items-center gap-2 ml-auto">
        <RoleSwitcher />
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
