import { Link } from 'react-router-dom';
import { RiLoginBoxLine, RiHome4Line } from 'react-icons/ri';

export default function UnauthorizedPage() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div>
        <div
          className="font-display"
          style={{
            fontSize: '6rem',
            fontWeight: 800,
            lineHeight: 1,
            background: 'linear-gradient(135deg, #F59E0B 0%, #F43F5E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
          }}
        >
          401
        </div>
        <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Unauthorized
        </h2>
        <p style={{ color: 'rgba(240,238,255,0.4)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          You need to be signed in to access this page.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/login"
            className="btn-primary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RiLoginBoxLine /> Sign In
          </Link>
          <Link
            to="/"
            className="btn-secondary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RiHome4Line /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
