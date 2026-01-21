'use client';

import type { Role, User } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MOCK_USERS } from '@/lib/data';
import { useAuth } from './auth-context';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: User;
  availableRoles: Role[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();
  
  const [role, setRole] = useState<Role>(authUser?.role || 'Organizer');
  
  const user = authUser || MOCK_USERS.find(u => u.role === 'Organizer')!;

  const availableRoles: Role[] = ['Organizer', 'Approver', 'Participant', 'Vendor', 'Sponsor'];

  useEffect(() => {
    if (authUser) {
      // On initial auth load or user change, check session storage first, then default to user's primary role.
      try {
        const storedRole = sessionStorage.getItem('userRole') as Role;
        if (storedRole && availableRoles.includes(storedRole)) {
            setRole(storedRole);
        } else {
            setRole(authUser.role);
        }
      } catch (error) {
        setRole(authUser.role);
      }
    }
  }, [authUser]);


  const handleSetRole = (newRole: Role) => {
    setRole(newRole);
    try {
        sessionStorage.setItem('userRole', newRole);
    } catch (error) {
        console.error('Could not access session storage:', error);
    }
  };


  const value = { role, setRole: handleSetRole, user, availableRoles };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
