import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Event, EventStatus, EventCategory } from '../types';
import { eventsAPI, adminAPI } from '../services/api';

interface EventsContextType {
  events: Event[];
  isLoading: boolean;
  addEvent: (data: Omit<Event, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  updateEventStatus: (id: string, status: EventStatus) => Promise<void>;
  getApprovedEvents: () => Event[];
  getMyEvents: (userId: string) => Event[];
  getEventById: (id: string) => Event | undefined;
  fetchApprovedEvents: () => Promise<void>;
  fetchAllEvents: () => Promise<void>;
}

const EventsContext = createContext<EventsContextType | null>(null);

function mapEvent(e: any): Event {
  return {
    id: e.id || e._id?.toString?.() || e._id,
    title: e.title,
    shortDescription: e.shortDescription,
    description: e.description,
    category: e.category as EventCategory,
    eventDate: e.eventDate,
    eventTime: e.eventTime,
    venue: e.venue,
    city: e.city,
    price: e.price,
    bannerImage: e.bannerImage,
    galleryImages: e.galleryImages || [],
    organizerName: e.organizerName,
    createdBy: e.createdBy,
    status: e.status as EventStatus,
    createdAt: e.createdAt,
  };
}

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApprovedEvents = useCallback(async () => {
    try {
      const data = await eventsAPI.getApproved({ limit: '100' });
      setEvents((data.events || []).map(mapEvent));
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  }, []);

  const fetchAllEvents = useCallback(async () => {
    try {
      const data = await adminAPI.getAllEvents();
      setEvents((data.events || []).map(mapEvent));
    } catch (err) {
      console.error('Failed to fetch all events:', err);
    }
  }, []);

  useEffect(() => {
    fetchApprovedEvents().finally(() => setIsLoading(false));
  }, [fetchApprovedEvents]);

  const addEvent = useCallback(async (eventData: Omit<Event, 'id' | 'status' | 'createdAt'>) => {
    const data = await eventsAPI.create({
      title: eventData.title,
      shortDescription: eventData.shortDescription,
      description: eventData.description,
      category: eventData.category,
      eventDate: eventData.eventDate,
      eventTime: eventData.eventTime,
      venue: eventData.venue,
      city: eventData.city,
      price: eventData.price,
      bannerImage: eventData.bannerImage,
      galleryImages: eventData.galleryImages,
    });
    if (data?.event) {
      setEvents((prev) => [...prev, mapEvent(data.event)]);
    }
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    await eventsAPI.delete(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateEventStatus = useCallback(async (id: string, status: EventStatus) => {
    if (status === 'approved') {
      await adminAPI.approveEvent(id);
    } else if (status === 'rejected') {
      await adminAPI.rejectEvent(id);
    }
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  }, []);

  const getApprovedEvents = useCallback(() => events.filter((e) => e.status === 'approved'), [events]);
  const getMyEvents = useCallback((userId: string) => events.filter((e) => e.createdBy === userId), [events]);
  const getEventById = useCallback((id: string) => events.find((e) => e.id === id), [events]);

  return (
    <EventsContext.Provider value={{ events, isLoading, addEvent, deleteEvent, updateEventStatus, getApprovedEvents, getMyEvents, getEventById, fetchApprovedEvents, fetchAllEvents }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents must be used inside EventsProvider');
  return ctx;
}
