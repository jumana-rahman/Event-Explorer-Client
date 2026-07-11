import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RiCalendarEventLine, RiMenuLine, RiCloseLine, RiLogoutBoxLine, RiDashboardLine } from 'react-icons/ri';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const guestLinks = [
    { to: '/', label: 'Home' },
    { to: '/explore', label: 'Explore Events' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const userLinks = [
    { to: '/', label: 'Home' },
    { to: '/explore', label: 'Explore Events' },
    { to: '/add-event', label: 'Add Event' },
    { to: '/my-events', label: 'My Events' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const links = user ? userLinks : guestLinks;

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(5, 5, 8, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="page-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RiCalendarEventLine style={{ color: 'white', fontSize: '18px' }} />
            </div>
            <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0eeff' }}>
              Event<span className="gradient-text">Explorer</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                style={{ padding: '0.4rem 0.75rem', borderRadius: '0.4rem' }}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {!user ? (
              <div className="hidden-mobile" style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn-secondary" style={{ fontSize: '0.875rem', padding: '0.45rem 1.1rem' }}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.45rem 1.1rem' }}>
                  Sign Up
                </Link>
              </div>
            ) : (
              <div ref={dropdownRef} style={{ position: 'relative' }} className="hidden-mobile">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '9999px',
                    padding: '0.3rem 0.75rem 0.3rem 0.3rem',
                    cursor: 'pointer',
                    color: '#f0eeff',
                    transition: 'background 0.2s',
                  }}
                >
                  <img
                    src={user.image}
                    alt={user.name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=EC4899&color=fff`; }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '9999px',
                      fontFamily: 'DM Mono, monospace',
                      fontWeight: 500,
                      background: user.role === 'admin' ? 'rgba(236,72,153,0.15)' : 'rgba(139,92,246,0.15)',
                      color: user.role === 'admin' ? '#F9A8D4' : '#C4B5FD',
                      border: `1px solid ${user.role === 'admin' ? 'rgba(236,72,153,0.25)' : 'rgba(139,92,246,0.25)'}`,
                    }}
                  >
                    {user.role}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '180px',
                      background: '#111118',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '0.625rem',
                      overflow: 'hidden',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    }}
                  >
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.7rem 1rem',
                        color: 'rgba(240,238,255,0.8)',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        transition: 'background 0.15s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <RiDashboardLine /> Dashboard
                    </Link>
                    <hr className="divider" />
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.7rem 1rem',
                        color: '#FDA4AF',
                        background: 'transparent',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(244,63,94,0.08)')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <RiLogoutBoxLine /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="show-mobile"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.4rem',
                padding: '0.4rem',
                color: '#f0eeff',
                cursor: 'pointer',
                display: 'none',
              }}
            >
              {menuOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              padding: '1rem 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                style={{ padding: '0.6rem 0.5rem', display: 'block' }}
              >
                {link.label}
              </NavLink>
            ))}
            {!user ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Link to="/login" className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }} onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }} onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            ) : (
              <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <img
                    src={user.image}
                    alt={user.name}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=EC4899&color=fff`; }}
                  />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.5)' }}>{user.email}</div>
                  </div>
                </div>
                <Link to="/dashboard" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem' }} onClick={() => setMenuOpen(false)}>
                  <RiDashboardLine /> Dashboard
                </Link>
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244,63,94,0.1)', color: '#FDA4AF', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '0.5rem', padding: '0.5rem 1rem', width: '100%', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                  <RiLogoutBoxLine /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
