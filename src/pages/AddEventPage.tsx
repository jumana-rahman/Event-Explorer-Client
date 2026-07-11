import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RiAddLine, RiCalendarLine, RiMapPinLine, RiTicketLine, RiImageLine, RiInformationLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';
import { EVENT_CATEGORIES } from '../types';
import type { EventCategory } from '../types';

interface FormValues {
  title: string;
  shortDescription: string;
  description: string;
  category: EventCategory;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  price: number;
  bannerImage: string;
}

export default function AddEventPage() {
  const { user } = useAuth();
  const { addEvent } = useEvents();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { price: 0, category: 'Technology' },
  });

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 500));
    addEvent({
      ...data,
      price: Number(data.price),
      galleryImages: [],
      organizerName: user!.name,
      createdBy: user!.id,
    });
    toast.success('Event submitted! It\'s under review and will go live once approved.', { duration: 4000 });
    navigate('/my-events');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page-container" style={{ paddingTop: '3rem', paddingBottom: '4rem', maxWidth: '760px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-tag">
          <RiAddLine /> Create Event
        </div>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Add a New Event
        </h1>
        <p style={{ color: 'rgba(240,238,255,0.4)', fontSize: '0.875rem' }}>
          Fill in the details below. Your event will be reviewed by our team within 24–48 hours.
        </p>
      </div>

      {/* Info banner */}
      <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '0.75rem', padding: '0.875rem 1.125rem', marginBottom: '2rem' }}>
        <RiInformationLine style={{ color: '#A78BFA', flexShrink: 0, marginTop: '1px' }} />
        <p style={{ fontSize: '0.82rem', color: 'rgba(240,238,255,0.5)', lineHeight: 1.6 }}>
          Events are set to <strong style={{ color: '#FBBF24' }}>Pending</strong> after submission. Once an admin approves your event, it will appear on the public Explore page.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="glass-card" style={{ borderRadius: '1rem', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 className="font-display" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(240,238,255,0.4)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Basic Information
          </h2>

          <div>
            <label className="label-text">Event Title *</label>
            <input
              type="text"
              placeholder="e.g., React Summit 2025"
              className="input-field"
              {...register('title', { required: 'Event title is required', minLength: { value: 5, message: 'Title must be at least 5 characters' } })}
            />
            {errors.title && <div className="error-text">{errors.title.message}</div>}
          </div>

          <div>
            <label className="label-text">Short Description *</label>
            <textarea
              placeholder="A one or two sentence summary shown on event cards…"
              className="input-field"
              rows={2}
              style={{ resize: 'vertical' }}
              {...register('shortDescription', { required: 'Short description is required', maxLength: { value: 200, message: 'Max 200 characters' } })}
            />
            {errors.shortDescription && <div className="error-text">{errors.shortDescription.message}</div>}
          </div>

          <div>
            <label className="label-text">Full Description *</label>
            <textarea
              placeholder="Detailed description of what attendees can expect — agenda, speakers, format, etc."
              className="input-field"
              rows={6}
              style={{ resize: 'vertical' }}
              {...register('description', { required: 'Full description is required', minLength: { value: 50, message: 'Description must be at least 50 characters' } })}
            />
            {errors.description && <div className="error-text">{errors.description.message}</div>}
          </div>

          <div>
            <label className="label-text">Category *</label>
            <select className="select-field" {...register('category', { required: 'Please select a category' })}>
              {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <div className="error-text">{errors.category.message}</div>}
          </div>
        </div>

        <div className="glass-card" style={{ borderRadius: '1rem', padding: '1.75rem', marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 className="font-display" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(240,238,255,0.4)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Date, Time & Location
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label-text"><RiCalendarLine style={{ display: 'inline', marginRight: '0.3rem' }} />Event Date *</label>
              <input
                type="date"
                min={today}
                className="input-field"
                {...register('eventDate', { required: 'Event date is required', validate: (v) => new Date(v) >= new Date(today) || 'Date must be in the future' })}
              />
              {errors.eventDate && <div className="error-text">{errors.eventDate.message}</div>}
            </div>

            <div>
              <label className="label-text">Event Time *</label>
              <input
                type="time"
                className="input-field"
                {...register('eventTime', { required: 'Event time is required' })}
              />
              {errors.eventTime && <div className="error-text">{errors.eventTime.message}</div>}
            </div>
          </div>

          <div>
            <label className="label-text"><RiMapPinLine style={{ display: 'inline', marginRight: '0.3rem' }} />Venue *</label>
            <input
              type="text"
              placeholder="e.g., Moscone Center"
              className="input-field"
              {...register('venue', { required: 'Venue is required' })}
            />
            {errors.venue && <div className="error-text">{errors.venue.message}</div>}
          </div>

          <div>
            <label className="label-text">City *</label>
            <input
              type="text"
              placeholder="e.g., San Francisco"
              className="input-field"
              {...register('city', { required: 'City is required' })}
            />
            {errors.city && <div className="error-text">{errors.city.message}</div>}
          </div>
        </div>

        <div className="glass-card" style={{ borderRadius: '1rem', padding: '1.75rem', marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 className="font-display" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(240,238,255,0.4)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Pricing & Media
          </h2>

          <div>
            <label className="label-text"><RiTicketLine style={{ display: 'inline', marginRight: '0.3rem' }} />Ticket Price (USD)</label>
            <input
              type="number"
              min={0}
              step={1}
              placeholder="0 for free events"
              className="input-field"
              {...register('price', { min: { value: 0, message: 'Price cannot be negative' } })}
            />
            <p style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.25)', marginTop: '0.3rem' }}>Enter 0 for free events.</p>
            {errors.price && <div className="error-text">{errors.price.message}</div>}
          </div>

          <div>
            <label className="label-text"><RiImageLine style={{ display: 'inline', marginRight: '0.3rem' }} />Banner Image URL *</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              className="input-field"
              {...register('bannerImage', { required: 'Banner image URL is required', pattern: { value: /^https?:\/\/.+/, message: 'Enter a valid URL starting with http/https' } })}
            />
            {errors.bannerImage && <div className="error-text">{errors.bannerImage.message}</div>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ flex: 2, justifyContent: 'center', padding: '0.75rem', opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? 'Submitting…' : <><RiAddLine /> Submit for Review</>}
          </button>
        </div>
      </form>
    </div>
  );
}
