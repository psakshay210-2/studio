'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  MessageSquare,
  LogOut,
  Settings,
  Handshake,
  Briefcase,
  Ticket,
} from 'lucide-react';
import { Logo } from './icons/logo';
import { useRole } from '@/contexts/role-context';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/types';


const navItemsByRole: Record<Role, { href: string; icon: React.ElementType; label: string }[]> = {
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

export function AppSidebar() {
  const pathname = usePathname();
  const { user, role } = useRole();
  const navItems = navItemsByRole[role];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10" />
          <div className="flex flex-col">
            <h2 className="text-lg font-headline font-semibold text-primary">
              EventFlow
            </h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                    className="font-headline"
                >
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator className="my-2 bg-border/20" />
      <SidebarFooter>
        <div className="flex items-center gap-3">
           <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
                <p className="text-sm font-semibold truncate text-primary-foreground">{user.name}</p>
                <p className="text-xs text-primary-foreground/70 truncate">{user.email}</p>
            </div>
        </div>
      </SidebarFooter>
    </>
  );
}
