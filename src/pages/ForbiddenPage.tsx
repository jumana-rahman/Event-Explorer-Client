import { Link } from 'react-router-dom';
import { RiHome4Line, RiArrowLeftLine } from 'react-icons/ri';

export default function ForbiddenPage() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div>
        <div
          className="font-display"
          style={{
            fontSize: '6rem',
            fontWeight: 800,
            lineHeight: 1,
            background: 'linear-gradient(135deg, #F43F5E 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
          }}
        >
          403
        </div>
        <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Access Forbidden
        </h2>
        <p style={{ color: 'rgba(240,238,255,0.4)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          You don't have permission to access this page. Contact an administrator if you believe this is a mistake.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <RiArrowLeftLine /> Go Back
          </button>
          <Link
            to="/"
            className="btn-primary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RiHome4Line /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
