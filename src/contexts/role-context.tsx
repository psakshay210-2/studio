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

  // To allow exploring all views, we make all roles available in the switcher.
  const availableRoles: Role[] = ['Organizer', 'Approver', 'Participant', 'Vendor', 'Sponsor'];

  useEffect(() => {
    // When the authenticated user changes, set the initial role to their primary role.
    if (authUser) {
      setRole(authUser.role);
    }
  }, [authUser]);


  const handleSetRole = (newRole: Role) => {
    setRole(newRole);
    // Persist the selected role view so it's remembered on reload
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
