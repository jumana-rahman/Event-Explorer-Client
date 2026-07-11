export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended';
export type EventStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: EventCategory;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  price: number;
  bannerImage: string;
  galleryImages: string[];
  organizerName: string;
  createdBy: string;
  status: EventStatus;
  createdAt: string;
}

export type EventCategory =
  | 'Technology'
  | 'Business'
  | 'Workshop'
  | 'Conference'
  | 'Education'
  | 'Music'
  | 'Gaming'
  | 'Sports';

export const EVENT_CATEGORIES: EventCategory[] = [
  'Technology',
  'Business',
  'Workshop',
  'Conference',
  'Education',
  'Music',
  'Gaming',
  'Sports',
];

export interface StatsData {
  totalUsers: number;
  totalEvents: number;
  pendingEvents: number;
  approvedEvents: number;
  eventsByCategory: { category: string; count: number }[];
  eventsByMonth: { month: string; count: number }[];
  freeVsPaid: { name: string; value: number }[];
}
