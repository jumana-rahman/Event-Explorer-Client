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

function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;
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

function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/explore" element={<Layout><ExplorePage /></Layout>} />
      <Route path="/events/:id" element={<Layout><EventDetailPage /></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

      {/* Auth routes */}
      <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

      {/* Protected routes */}
      <Route path="/add-event" element={<Layout><ProtectedRoute><AddEventPage /></ProtectedRoute></Layout>} />
      <Route path="/my-events" element={<Layout><ProtectedRoute><MyEventsPage /></ProtectedRoute></Layout>} />
      <Route path="/dashboard" element={<Layout><ProtectedRoute><DashboardPage /></ProtectedRoute></Layout>} />

      {/* Fallback */}
      <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
    </Routes>
  );
}

function NotFoundPage() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div>
        <div className="font-display" style={{ fontSize: '6rem', fontWeight: 800, lineHeight: 1, background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '1rem' }}>404</div>
        <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Page not found</h2>
        <p style={{ color: 'rgba(240,238,255,0.4)', marginBottom: '2rem', fontSize: '0.9rem' }}>The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" className="btn-primary" style={{ textDecoration: 'none' }}>Go Home</a>
      </div>
    </div>
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
