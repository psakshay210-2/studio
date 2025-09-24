'use client';

import type { Role, User } from '@/lib/types';
import React, { createContext, useContext, useState, useMemo } from 'react';
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
  const [role, setRole] = useState<Role>('Organizer');
  const { user: authUser } = useAuth(); // Get user from AuthContext
  const availableRoles: Role[] = ['Organizer', 'Approver', 'Participant', 'Vendor', 'Sponsor'];

  // The user is now the authenticated user. Role switching only changes the `role` state.
  const user = authUser || MOCK_USERS[0];

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
