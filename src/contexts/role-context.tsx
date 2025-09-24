'use client';

import type { Role, User } from '@/lib/types';
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { MOCK_USERS } from '@/lib/data';
import { useAuth } from './auth-context';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: User;
  availableRoles: Role[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuth(); 
  const [role, setRole] = useState<Role>(authUser?.role || 'Organizer');
  
  // The user is the authenticated user. Role switching only changes the `role` state.
  const user = authUser || MOCK_USERS.find(u => u.role === 'Organizer')!;

  // Available roles are now just the roles the logged-in user has.
  // In our mock data, each user has one role.
  const availableRoles: Role[] = authUser ? [authUser.role] : ['Organizer', 'Approver', 'Participant', 'Vendor', 'Sponsor'];

  useEffect(() => {
    if (authUser) {
      setRole(authUser.role);
    }
  }, [authUser]);


  const value = { role, setRole, user, availableRoles };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
