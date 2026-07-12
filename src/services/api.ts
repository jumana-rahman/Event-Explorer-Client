const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface FetchOptions extends RequestInit {
  body?: any;
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { body, ...rest } = options;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...rest.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

// ─── Image Upload (imgbb) ────────────────────────────────────────

export async function uploadImageToImgbb(file: File): Promise<string> {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  if (!apiKey) throw new Error('imgbb API key is not configured. Set VITE_IMGBB_API_KEY in your .env file.');

  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || 'Image upload failed.');
  return data.data.url as string;
}

// ─── Auth API ────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface SessionResponse {
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: string;
  };
  user: AuthUser;
}

export interface SignUpResponse {
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: string;
  };
  user: AuthUser;
}

export const authAPI = {
  signUp: (data: { name: string; email: string; password: string; image?: string }) =>
    request<SignUpResponse>('/api/auth/sign-up/email', { method: 'POST', body: data }),

  signIn: (data: { email: string; password: string }) =>
    request<SessionResponse>('/api/auth/sign-in/email', { method: 'POST', body: data }),

  signOut: () =>
    request<{ message: string }>('/api/auth/sign-out', { method: 'POST' }),

  getSession: () =>
    request<SessionResponse>('/api/auth/get-session'),
};

// ─── Events API ──────────────────────────────────────────────────

export interface ApiEvent {
  id?: string;
  _id?: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  price: number;
  bannerImage: string;
  galleryImages: string[];
  organizerName: string;
  createdBy: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface EventsResponse {
  events: ApiEvent[];
  total: number;
  page: number;
  totalPages: number;
  cities: string[];
}

export interface EventDetailResponse {
  event: ApiEvent;
  related: ApiEvent[];
}

export interface CreateEventBody {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  price: number;
  bannerImage: string;
  galleryImages?: string[];
}

export const eventsAPI = {
  getApproved: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<EventsResponse>(`/api/events${query}`);
  },

  getById: (id: string) =>
    request<EventDetailResponse>(`/api/events/${id}`),

  getMyEvents: () =>
    request<{ events: ApiEvent[] }>('/api/events/my-events'),

  create: (data: CreateEventBody) =>
    request<{ event: ApiEvent; message: string }>('/api/events', { method: 'POST', body: data }),

  delete: (id: string) =>
    request<{ message: string }>(`/api/events/${id}`, { method: 'DELETE' }),
};

// ─── Admin API ───────────────────────────────────────────────────

export interface AdminEventsResponse {
  events: ApiEvent[];
}

export interface AdminUsersResponse {
  users: AuthUser[];
}

export interface AdminStatsResponse {
  totalUsers: number;
  totalEvents: number;
  pendingEvents: number;
  approvedEvents: number;
  rejectedEvents: number;
  eventsByCategory: { category: string; count: number }[];
  eventsByMonth: { month: string; count: number }[];
  freeVsPaid: { name: string; value: number }[];
}

export const adminAPI = {
  getAllEvents: () =>
    request<AdminEventsResponse>('/api/admin/events'),

  approveEvent: (id: string) =>
    request<{ event: ApiEvent; message: string }>(`/api/admin/events/${id}/approve`, { method: 'PATCH' }),

  rejectEvent: (id: string) =>
    request<{ event: ApiEvent; message: string }>(`/api/admin/events/${id}/reject`, { method: 'PATCH' }),

  deleteEvent: (id: string) =>
    request<{ message: string }>(`/api/admin/events/${id}`, { method: 'DELETE' }),

  getUsers: () =>
    request<AdminUsersResponse>('/api/admin/users'),

  updateRole: (id: string, role: string) =>
    request<{ user: AuthUser; message: string }>(`/api/admin/users/${id}/role`, { method: 'PATCH', body: { role } }),

  updateStatus: (id: string, status: string) =>
    request<{ user: AuthUser; message: string }>(`/api/admin/users/${id}/status`, { method: 'PATCH', body: { status } }),

  getStats: () =>
    request<AdminStatsResponse>('/api/admin/stats'),
};
