import { Link } from 'react-router-dom';
import { RiCalendarLine, RiMapPinLine, RiArrowRightLine } from 'react-icons/ri';
import type { Event } from '../types';
import { CATEGORY_COLORS } from '../data/mockData';

interface Props {
  event: Event;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function EventCard({ event }: Props) {
  const catColor = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS['Technology'];

  return (
    <div
      className="glass-card-hover"
      style={{
        borderRadius: '1rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Banner */}
      <div style={{ position: 'relative', height: '200px', flexShrink: 0, background: '#0e0e16' }}>
        <img
          src={event.bannerImage}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,8,0.6) 0%, transparent 60%)' }} />

        {/* Category badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            fontSize: '0.68rem',
            fontFamily: 'DM Mono, monospace',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            background: catColor.bg,
            color: catColor.text,
            border: `1px solid ${catColor.border}`,
          }}
        >
          {event.category}
        </div>

        {/* Price badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            fontSize: '0.75rem',
            fontFamily: 'DM Mono, monospace',
            fontWeight: 600,
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            background: event.price === 0 ? 'rgba(139,92,246,0.9)' : 'rgba(5,5,8,0.85)',
            color: event.price === 0 ? 'white' : 'rgba(240,238,255,0.9)',
            border: event.price === 0 ? 'none' : '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {event.price === 0 ? 'Free' : `$${event.price}`}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.125rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3
          className="font-display"
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#f0eeff',
            marginBottom: '0.5rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.title}
        </h3>

        <p
          style={{
            fontSize: '0.82rem',
            color: 'rgba(240,238,255,0.45)',
            lineHeight: 1.6,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {event.shortDescription}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'rgba(240,238,255,0.5)' }}>
            <RiCalendarLine style={{ color: '#EC4899', flexShrink: 0 }} />
            <span>{formatDate(event.eventDate)} · {event.eventTime}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'rgba(240,238,255,0.5)' }}>
            <RiMapPinLine style={{ color: '#8B5CF6', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.venue}, {event.city}</span>
          </div>
        </div>

        <Link
          to={`/events/${event.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            padding: '0.55rem',
            borderRadius: '0.5rem',
            background: 'rgba(236,72,153,0.1)',
            border: '1px solid rgba(236,72,153,0.2)',
            color: '#F9A8D4',
            fontSize: '0.82rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.2s',
            marginTop: 'auto',
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(236,72,153,0.18)'; e.currentTarget.style.borderColor = 'rgba(236,72,153,0.4)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(236,72,153,0.1)'; e.currentTarget.style.borderColor = 'rgba(236,72,153,0.2)'; }}
        >
          View Details <RiArrowRightLine />
        </Link>
      </div>
    </div>
  );
}
