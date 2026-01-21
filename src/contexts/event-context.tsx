'use client';

import type { Event, ServiceRequest } from '@/lib/types';
import React, { createContext, useContext, useState } from 'react';
import { MOCK_EVENTS, MOCK_SERVICE_REQUESTS } from '@/lib/data';

interface EventContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  getEventById: (id: string) => Event | undefined;
  getSubEvents: (parentId: string) => Event[];
  serviceRequests: ServiceRequest[];
  addServiceRequest: (request: ServiceRequest) => void;
  updateServiceRequest: (id: string, updates: Partial<ServiceRequest>) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(MOCK_SERVICE_REQUESTS);

  const addEvent = (event: Event) => {
    setEvents((prev) => [event, ...prev]);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, ...updates } : event
      )
    );
  };

  const getEventById = (id: string) => {
    return events.find((event) => event.id === id);
  };
  
  const getSubEvents = (parentId: string) => {
    return events.filter((event) => event.parentId === parentId);
  }

  const addServiceRequest = (request: ServiceRequest) => {
    setServiceRequests((prev) => [request, ...prev]);
  };

  const updateServiceRequest = (id: string, updates: Partial<ServiceRequest>) => {
    setServiceRequests((prev) =>
        prev.map((req) =>
            req.id === id ? { ...req, ...updates } : req
        )
    );
  };

  const value = { 
    events, 
    addEvent, 
    updateEvent, 
    getEventById, 
    getSubEvents,
    serviceRequests,
    addServiceRequest,
    updateServiceRequest,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
