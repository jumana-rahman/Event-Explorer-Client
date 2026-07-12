import { Link } from 'react-router-dom';
import { RiHome4Line } from 'react-icons/ri';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div>
        <div
          className="font-display"
          style={{
            fontSize: '6rem',
            fontWeight: 800,
            lineHeight: 1,
            background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
          }}
        >
          404
        </div>
        <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Page not found
        </h2>
        <p style={{ color: 'rgba(240,238,255,0.4)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RiHome4Line /> Go Home
        </Link>
      </div>
    </div>
  );
}
