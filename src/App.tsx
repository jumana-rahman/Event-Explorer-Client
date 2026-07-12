import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import type { ReactNode } from 'react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { EventsProvider } from './context/EventsContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddEventPage from './pages/AddEventPage';
import MyEventsPage from './pages/MyEventsPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ForbiddenPage from './pages/ForbiddenPage';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.08)',
              borderTopColor: '#EC4899',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ color: 'rgba(240,238,255,0.4)', fontSize: '0.875rem' }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>{children}</main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/explore" element={<Layout><ExplorePage /></Layout>} />
      <Route path="/events/:id" element={<Layout><ProtectedRoute><EventDetailPage /></ProtectedRoute></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

      {/* Auth routes */}
      <Route path="/login" element={<Layout><LoginPage /></Layout>} />
      <Route path="/register" element={<Layout><RegisterPage /></Layout>} />

      {/* Protected routes */}
      <Route path="/add-event" element={<Layout><ProtectedRoute><AddEventPage /></ProtectedRoute></Layout>} />
      <Route path="/my-events" element={<Layout><ProtectedRoute><MyEventsPage /></ProtectedRoute></Layout>} />
      <Route path="/dashboard" element={<Layout><ProtectedRoute><DashboardPage /></ProtectedRoute></Layout>} />
      <Route path="/dashboard/*" element={<Layout><ProtectedRoute><DashboardPage /></ProtectedRoute></Layout>} />

      {/* Error pages */}
      <Route path="/unauthorized" element={<Layout><UnauthorizedPage /></Layout>} />
      <Route path="/forbidden" element={<Layout><ForbiddenPage /></Layout>} />

      {/* Fallback */}
      <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EventsProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#111118',
                color: '#f0eeff',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.625rem',
                fontSize: '0.875rem',
                fontFamily: 'DM Sans, sans-serif',
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: '#111118' },
              },
              error: {
                iconTheme: { primary: '#F43F5E', secondary: '#111118' },
              },
            }}
          />
        </EventsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
