import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { MOCK_USERS, ADMIN_CREDENTIALS, DEMO_CREDENTIALS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, image?: string) => Promise<void>;
  logout: () => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => void;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'ee_current_user';
const USERS_STORAGE_KEY = 'ee_users';

function getStoredUsers(): User[] {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_USERS;
  } catch {
    return MOCK_USERS;
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        const users = getStoredUsers();
        const fresh = users.find((u) => u.id === parsed.id);
        if (fresh && fresh.status === 'active') {
          setUser(fresh);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const users = getStoredUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!found) throw new Error('No account found with that email address.');
    if (found.status === 'suspended') throw new Error('Your account has been suspended. Please contact support.');

    const validPasswords: Record<string, string> = {
      [ADMIN_CREDENTIALS.email]: ADMIN_CREDENTIALS.password,
      [DEMO_CREDENTIALS.email]: DEMO_CREDENTIALS.password,
    };

    const expectedPassword = validPasswords[found.email.toLowerCase()] ?? found.id;

    const knownDemoPasswords: Record<string, string> = {};
    try {
      const raw = localStorage.getItem('ee_passwords');
      if (raw) Object.assign(knownDemoPasswords, JSON.parse(raw));
    } catch {}

    const storedPassword = knownDemoPasswords[found.email.toLowerCase()];
    const actualPassword = storedPassword ?? expectedPassword;

    if (password !== actualPassword && password !== 'demo123' && password !== 'admin123') {
      if (password !== actualPassword) throw new Error('Incorrect password. Please try again.');
    }

    if (password !== actualPassword && !(found.email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) && !(found.email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password)) {
      throw new Error('Incorrect password. Please try again.');
    }

    setUser(found);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  };

  const register = async (name: string, email: string, password: string, image = '') => {
    await new Promise((r) => setTimeout(r, 600));
    const users = getStoredUsers();
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error('An account with this email already exists.');

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      image: image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format`,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const updated = [...users, newUser];
    saveUsers(updated);

    try {
      const raw = localStorage.getItem('ee_passwords') ?? '{}';
      const passwords = JSON.parse(raw);
      passwords[email.toLowerCase()] = password;
      localStorage.setItem('ee_passwords', JSON.stringify(passwords));
    } catch {}

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    const users = getStoredUsers();
    const updated = users.map((u) => (u.id === userId ? { ...u, role } : u));
    saveUsers(updated);
    if (user?.id === userId) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  const updateUserStatus = (userId: string, status: 'active' | 'suspended') => {
    const users = getStoredUsers();
    const updated = users.map((u) => (u.id === userId ? { ...u, status } : u));
    saveUsers(updated);
  };

  const getAllUsers = () => getStoredUsers();

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
