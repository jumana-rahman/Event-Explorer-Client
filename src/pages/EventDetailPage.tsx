import { useParams, Link, useNavigate } from 'react-router-dom';
import { RiCalendarLine, RiMapPinLine, RiUser3Line, RiTimeLine, RiArrowLeftLine, RiTicketLine, RiShareLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useEvents } from '../context/EventsContext';
import EventCard from '../components/EventCard';
import { CATEGORY_COLORS } from '../data/mockData';

function formatDate(d: string) {
  try { return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }); } catch { return d; }
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEventById, getApprovedEvents } = useEvents();

  const event = getEventById(id!);
  const approved = getApprovedEvents();

  if (!event || event.status !== 'approved') {
    return (
      <div className="page-container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Event Not Found</h2>
        <p style={{ color: 'rgba(240,238,255,0.45)', marginBottom: '1.5rem' }}>This event doesn't exist or isn't publicly available.</p>
        <Link to="/explore" className="btn-primary">Back to Explore</Link>
      </div>
    );
  }

  const related = approved.filter((e) => e.category === event.category && e.id !== event.id).slice(0, 4);
  const catColor = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS['Technology'];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    toast.success('Link copied to clipboard!');
  };

  return (
    <div>
      {/* Banner */}
      <div style={{ position: 'relative', height: 'clamp(280px, 45vw, 480px)', background: '#0e0e16' }}>
        <img
          src={event.bannerImage}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,5,8,0.3) 0%, rgba(5,5,8,0.85) 100%)' }} />
        <div className="page-container" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: '2rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(240,238,255,0.8)', borderRadius: '0.5rem', padding: '0.4rem 0.875rem', cursor: 'pointer', fontSize: '0.82rem', marginBottom: '1rem', backdropFilter: 'blur(4px)' }}
          >
            <RiArrowLeftLine /> Back
          </button>
          <div
            style={{
              display: 'inline-flex',
              fontSize: '0.7rem',
              fontFamily: 'DM Mono, monospace',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              background: catColor.bg,
              color: catColor.text,
              border: `1px solid ${catColor.border}`,
              marginBottom: '0.75rem',
            }}
          >
            {event.category}
          </div>
          <h1
            className="font-display"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="page-container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '2.5rem', alignItems: 'start' }}>
          {/* Left: Description */}
          <div>
            <h2 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', color: 'rgba(240,238,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace' }}>About This Event</h2>
            <div
              style={{
                color: 'rgba(240,238,255,0.65)',
                lineHeight: 1.85,
                fontSize: '0.925rem',
                whiteSpace: 'pre-line',
              }}
            >
              {event.description}
            </div>

            {/* Gallery */}
            {event.galleryImages && event.galleryImages.length > 0 && (
              <div style={{ marginTop: '2.5rem' }}>
                <h3 className="font-display" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(240,238,255,0.5)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem' }}>Gallery</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {event.galleryImages.map((img, i) => (
                    <img key={i} src={img} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '0.625rem', background: '#0e0e16' }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Info Panel */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div className="glass-card" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
              {/* Price */}
              <div style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '1rem', background: 'rgba(236,72,153,0.06)', borderRadius: '0.75rem', border: '1px solid rgba(236,72,153,0.12)' }}>
                <div style={{ fontSize: '0.75rem', fontFamily: 'DM Mono, monospace', color: 'rgba(240,238,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Ticket Price</div>
                <div className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: event.price === 0 ? '#A78BFA' : '#f0eeff' }}>
                  {event.price === 0 ? 'Free' : `$${event.price}`}
                </div>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { icon: <RiCalendarLine color="#EC4899" />, label: 'Date', value: formatDate(event.eventDate) },
                  { icon: <RiTimeLine color="#8B5CF6" />, label: 'Time', value: event.eventTime },
                  { icon: <RiMapPinLine color="#F43F5E" />, label: 'Venue', value: `${event.venue}, ${event.city}` },
                  { icon: <RiUser3Line color="#06B6D4" />, label: 'Organizer', value: event.organizerName },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '2px', flexShrink: 0, fontSize: '16px' }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontFamily: 'DM Mono, monospace', color: 'rgba(240,238,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.label}</div>
                      <div style={{ fontSize: '0.875rem', color: '#f0eeff', fontWeight: 500, lineHeight: 1.4 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.625rem', padding: '0.75rem' }}>
                <RiTicketLine /> Get Tickets
              </button>
              <button onClick={handleShare} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.875rem' }}>
                <RiShareLine /> Share Event
              </button>
            </div>
          </div>
        </div>

        {/* Related Events */}
        {related.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
              More in {event.category}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {related.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
