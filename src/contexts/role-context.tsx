'use client';

import type { Role, User } from '@/lib/types';
import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { MOCK_USERS } from '@/lib/data';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: User;
  availableRoles: Role[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// We pass the authenticated user from a parent provider (AuthProvider via AuthGuard)
// This avoids a direct dependency from RoleProvider -> AuthProvider, which was causing HMR issues.
export function RoleProvider({ children, authUser }: { children: ReactNode, authUser: User | null }) {
  
  const [role, setRole] = useState<Role>(authUser?.role || 'Organizer');
  
  // The user is the authenticated user, defaulting to a mock organizer if none is provided.
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
