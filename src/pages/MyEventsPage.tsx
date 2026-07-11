import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { RiAddLine, RiDeleteBinLine, RiEyeLine, RiCalendarLine, RiInboxLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';

function formatDate(d: string) {
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); } catch { return d; }
}

export default function MyEventsPage() {
  const { user } = useAuth();
  const { getMyEvents, deleteEvent } = useEvents();

  const myEvents = getMyEvents(user!.id);

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: 'Delete Event?',
      html: `<p style="color:rgba(240,238,255,0.55);font-size:0.9rem">This will permanently delete <strong style="color:#f0eeff">${title}</strong>. This action cannot be undone.</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      background: '#111118',
      color: '#f0eeff',
      confirmButtonColor: '#F43F5E',
      cancelButtonColor: 'rgba(255,255,255,0.08)',
      customClass: {
        popup: 'swal-dark-popup',
        cancelButton: 'swal-cancel-btn',
      },
    });

    if (result.isConfirmed) {
      deleteEvent(id);
      toast.success('Event deleted successfully.');
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' };
    return <span className={`badge ${map[status] ?? ''}`}>{status}</span>;
  };

  return (
    <div className="page-container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-tag">My Events</div>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Your Events
          </h1>
          <p style={{ color: 'rgba(240,238,255,0.4)', fontSize: '0.875rem' }}>
            {myEvents.length} event{myEvents.length !== 1 ? 's' : ''} created
          </p>
        </div>
        <Link to="/add-event" className="btn-primary" style={{ flexShrink: 0 }}>
          <RiAddLine /> Create New Event
        </Link>
      </div>

      {myEvents.length === 0 ? (
        <div
          className="glass-card"
          style={{ borderRadius: '1rem', padding: '5rem 2rem', textAlign: 'center' }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📅</div>
          <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No events yet</h3>
          <p style={{ color: 'rgba(240,238,255,0.4)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            You haven't created any events. Start by adding your first event!
          </p>
          <Link to="/add-event" className="btn-primary">
            <RiAddLine /> Add Your First Event
          </Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0 0.625rem',
            }}
          >
            <thead>
              <tr>
                {['Event', 'Category', 'Date', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: h === 'Actions' ? 'right' : 'left',
                      padding: '0 1rem 0.75rem',
                      fontSize: '0.72rem',
                      fontFamily: 'DM Mono, monospace',
                      fontWeight: 500,
                      color: 'rgba(240,238,255,0.35)',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myEvents.map((event) => (
                <tr key={event.id}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '0.75rem',
                        padding: '0.875rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.875rem',
                      }}
                    >
                      <img
                        src={event.bannerImage}
                        alt={event.title}
                        style={{ width: '52px', height: '40px', borderRadius: '0.375rem', objectFit: 'cover', flexShrink: 0, background: '#1a1a24' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0eeff', marginBottom: '0.15rem' }}>{event.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.35)' }}>{event.venue}, {event.city}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(240,238,255,0.5)' }}>{event.category}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.78rem', color: 'rgba(240,238,255,0.5)' }}>
                      <RiCalendarLine style={{ color: '#EC4899' }} /> {formatDate(event.eventDate)}
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                    {statusBadge(event.status)}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {event.status === 'approved' && (
                        <Link
                          to={`/events/${event.id}`}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                            padding: '0.4rem 0.75rem', borderRadius: '0.4rem',
                            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                            color: '#C4B5FD', fontSize: '0.78rem', fontWeight: 500, textDecoration: 'none',
                            transition: 'all 0.2s',
                          }}
                        >
                          <RiEyeLine /> View
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.3rem',
                          padding: '0.4rem 0.75rem', borderRadius: '0.4rem',
                          background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
                          color: '#FDA4AF', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(244,63,94,0.15)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
                      >
                        <RiDeleteBinLine /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
