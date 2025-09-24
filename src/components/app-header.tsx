'use client';

import React from 'react';
import { RoleSwitcher } from './role-switcher';
import { Button } from './ui/button';
import { Bell, Search, Menu, Handshake, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';


const navItemsByRole: Record<
  Role,
  { href: string; icon: React.ElementType; label: string }[]
> = {
  Organizer: [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/events', icon: Calendar, label: 'Events' },
    { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { href: '/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/service-requests', icon: Handshake, label: 'Service Requests' },
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
  const { role, user } = useRole();
  const { logout } = useAuth();
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex flex-col items-start gap-1" disabled>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2" />
                Logout
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
