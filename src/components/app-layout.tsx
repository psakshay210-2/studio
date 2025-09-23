'use client';

import React from 'react';
import { AppHeader } from './app-header';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
        {children}
      </main>
    </div>
  );
}
