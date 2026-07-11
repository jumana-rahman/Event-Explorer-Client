import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Event, EventStatus } from '../types';
import { MOCK_EVENTS } from '../data/mockData';

interface EventsContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'status' | 'createdAt'>) => void;
  deleteEvent: (id: string) => void;
  updateEventStatus: (id: string, status: EventStatus) => void;
  getApprovedEvents: () => Event[];
  getMyEvents: (userId: string) => Event[];
  getEventById: (id: string) => Event | undefined;
}

const EventsContext = createContext<EventsContextType | null>(null);

const EVENTS_KEY = 'ee_events';

function getStoredEvents(): Event[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw) : MOCK_EVENTS;
  } catch {
    return MOCK_EVENTS;
  }
}

function saveEvents(events: Event[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setEvents(getStoredEvents());
  }, []);

  const persist = (updated: Event[]) => {
    setEvents(updated);
    saveEvents(updated);
  };

  const addEvent = (data: Omit<Event, 'id' | 'status' | 'createdAt'>) => {
    const newEvent: Event = {
      ...data,
      id: `evt-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    persist([...events, newEvent]);
  };

  const deleteEvent = (id: string) => {
    persist(events.filter((e) => e.id !== id));
  };

  const updateEventStatus = (id: string, status: EventStatus) => {
    persist(events.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const getApprovedEvents = () => events.filter((e) => e.status === 'approved');

  const getMyEvents = (userId: string) => events.filter((e) => e.createdBy === userId);

  const getEventById = (id: string) => events.find((e) => e.id === id);

  return (
    <EventsContext.Provider value={{ events, addEvent, deleteEvent, updateEventStatus, getApprovedEvents, getMyEvents, getEventById }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents must be used inside EventsProvider');
  return ctx;
}
