import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { authAPI, adminAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, image?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => Promise<void>;
  getAllUsers: () => Promise<User[]>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapUser(u: any): User {
  return {
    id: u.id || u._id?.toString?.() || u._id,
    name: u.name,
    email: u.email,
    image: u.image || '',
    role: u.role as UserRole,
    status: u.status as 'active' | 'suspended',
    createdAt: u.createdAt || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authAPI.getSession()
      .then((data) => {
        if (data?.user) setUser(mapUser(data.user));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authAPI.signIn({ email, password });
    if (data?.user) {
      // Check if user is suspended
      const statusRes = await fetch(`${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '')}/api/auth/check-status`, {
        method: 'POST',
        credentials: 'include',
      });
      const statusData = await statusRes.json();
      if (statusData.suspended) {
        await authAPI.signOut();
        throw new Error(statusData.message || 'Your account has been suspended.');
      }
      setUser(mapUser(data.user));
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, image = '') => {
    const data = await authAPI.signUp({ name, email, password, image });
    if (data?.user) setUser(mapUser(data.user));
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.signOut();
    } catch {}
    setUser(null);
  }, []);

  const updateUserRole = useCallback(async (userId: string, role: UserRole) => {
    await adminAPI.updateRole(userId, role);
  }, []);

  const updateUserStatus = useCallback(async (userId: string, status: 'active' | 'suspended') => {
    await adminAPI.updateStatus(userId, status);
  }, []);

  const getAllUsers = useCallback(async (): Promise<User[]> => {
    const data = await adminAPI.getUsers();
    return (data.users || []).map(mapUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUserRole, updateUserStatus, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
