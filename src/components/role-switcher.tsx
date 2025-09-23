'use client';

import { useRole } from '@/contexts/role-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Role } from '@/lib/types';
import { Users } from 'lucide-react';

export function RoleSwitcher() {
  const { role, setRole, availableRoles } = useRole();

  const handleValueChange = (value: string) => {
    setRole(value as Role);
  };

  return (
    <div className="flex items-center gap-2">
      <Users className="h-5 w-5 text-muted-foreground" />
      <Select value={role} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px] font-medium">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          {availableRoles.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
