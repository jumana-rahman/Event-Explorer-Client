import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RiAddLine, RiCalendarLine, RiMapPinLine, RiTicketLine, RiImageLine, RiInformationLine } from 'react-icons/ri';
import { eventsAPI, uploadImageToImgbb } from '../services/api';
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
}

export default function AddEventPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { price: 0, category: 'Technology' },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10 MB.');
      return;
    }
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const onSubmit = async (data: FormValues) => {
    if (!bannerFile) {
      toast.error('Please upload a banner image.');
      return;
    }
    setSubmitting(true);
    try {
      setUploadingImg(true);
      const bannerImage = await uploadImageToImgbb(bannerFile);
      setUploadingImg(false);

      await eventsAPI.create({
        ...data,
        price: Number(data.price),
        bannerImage,
        galleryImages: [],
      });
      toast.success('Event submitted! It\'s under review and will go live once approved.', { duration: 4000 });
      navigate('/my-events');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create event.');
    } finally {
      setSubmitting(false);
      setUploadingImg(false);
    }
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
            <label className="label-text"><RiImageLine style={{ display: 'inline', marginRight: '0.3rem' }} />Banner Image *</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {bannerPreview ? (
              <div style={{ position: 'relative', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                />
                <button
                  type="button"
                  onClick={removeBanner}
                  style={{
                    position: 'absolute', top: '0.5rem', right: '0.5rem',
                    background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FDA4AF', borderRadius: '0.375rem', padding: '0.3rem 0.7rem',
                    cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'inherit', backdropFilter: 'blur(8px)',
                  }}
                >
                  Remove
                </button>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.5rem 0.75rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>
                  {bannerFile?.name} ({bannerFile ? `${(bannerFile.size / 1024).toFixed(0)} KB` : ''})
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '2px dashed rgba(255,255,255,0.1)',
                  borderRadius: '0.75rem',
                  padding: '2.5rem',
                  cursor: 'pointer',
                  color: 'rgba(240,238,255,0.35)',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(236,72,153,0.3)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                <RiImageLine style={{ fontSize: '2rem' }} />
                <span>Click to upload banner image</span>
                <span style={{ fontSize: '0.72rem', color: 'rgba(240,238,255,0.2)' }}>JPG, PNG, WebP — max 10 MB</span>
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || uploadingImg}
            className="btn-primary"
            style={{ flex: 2, justifyContent: 'center', padding: '0.75rem', opacity: submitting || uploadingImg ? 0.7 : 1 }}
          >
            {uploadingImg ? 'Uploading image…' : submitting ? 'Submitting…' : <><RiAddLine /> Submit for Review</>}
          </button>
        </div>
      </form>
    </div>
  );
}
