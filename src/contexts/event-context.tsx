'use client';

import type { Event } from '@/lib/types';
import React, { createContext, useContext, useState, useMemo } from 'react';
import { MOCK_EVENTS } from '@/lib/data';

interface EventContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  getEventById: (id: string) => Event | undefined;
  getSubEvents: (parentId: string) => Event[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);

  const addEvent = (event: Event) => {
    setEvents((prevEvents) => [event, ...prevEvents]);
  };

  const getEventById = (id: string) => {
    return events.find((event) => event.id === id);
  };
  
  const getSubEvents = (parentId: string) => {
    return events.filter((event) => event.parentId === parentId);
  }

  const value = { events, addEvent, getEventById, getSubEvents };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
