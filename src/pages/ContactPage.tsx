import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RiMailLine, RiPhoneLine, RiMapPinLine, RiTwitterXLine, RiInstagramLine, RiLinkedinBoxLine, RiSendPlaneLine } from 'react-icons/ri';

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  const onSubmit = async (_data: FormValues) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message sent! We'll get back to you within 24 hours.", { duration: 4000 });
    reset();
    setSubmitting(false);
  };

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) 0 3rem', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 40% at 70% 30%, rgba(236,72,153,0.07) 0%, transparent 70%)' }} />
        <div className="page-container" style={{ position: 'relative' }}>
          <div className="section-tag">Contact</div>
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.75rem', lineHeight: 1.1 }}>
            Get in touch
          </h1>
          <p style={{ color: 'rgba(240,238,255,0.45)', fontSize: '0.975rem', lineHeight: 1.75, maxWidth: '520px' }}>
            Have a question, a partnership idea, or feedback on the platform? We'd love to hear from you. Our team typically responds within one business day.
          </p>
        </div>
      </section>

      <div className="page-container" style={{ paddingBottom: '5rem' }}>
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '3rem', alignItems: 'start' }}>
          {/* Form */}
          <div className="glass-card" style={{ borderRadius: '1.25rem', padding: '2rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.75rem' }}>Send us a message</h2>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label-text">Full Name</label>
                  <input
                    type="text"
                    placeholder="Alex Rivera"
                    className="input-field"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <div className="error-text">{errors.name.message}</div>}
                </div>
                <div>
                  <label className="label-text">Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="input-field"
                    {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })}
                  />
                  {errors.email && <div className="error-text">{errors.email.message}</div>}
                </div>
              </div>

              <div>
                <label className="label-text">Subject</label>
                <input
                  type="text"
                  placeholder="What's this about?"
                  className="input-field"
                  {...register('subject', { required: 'Subject is required' })}
                />
                {errors.subject && <div className="error-text">{errors.subject.message}</div>}
              </div>

              <div>
                <label className="label-text">Message</label>
                <textarea
                  placeholder="Tell us what's on your mind…"
                  className="input-field"
                  rows={6}
                  style={{ resize: 'vertical' }}
                  {...register('message', { required: 'Message is required', minLength: { value: 20, message: 'Message must be at least 20 characters' } })}
                />
                {errors.message && <div className="error-text">{errors.message.message}</div>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{ justifyContent: 'center', padding: '0.75rem', opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? 'Sending…' : <><RiSendPlaneLine /> Send Message</>}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
              <h3 className="font-display" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.25rem', color: 'rgba(240,238,255,0.5)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Contact Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: <RiMailLine />, label: 'Email', value: 'hello@eventexplorer.com', color: '#EC4899' },
                  { icon: <RiPhoneLine />, label: 'Phone', value: '+1 (415) 555-0192', color: '#8B5CF6' },
                  { icon: <RiMapPinLine />, label: 'Address', value: '340 Pine St, Suite 1100\nSan Francisco, CA 94104', color: '#F43F5E' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, fontSize: '16px', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontFamily: 'DM Mono', color: 'rgba(240,238,255,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>{item.label}</div>
                      <div style={{ fontSize: '0.85rem', color: '#f0eeff', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
              <h3 className="font-display" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', color: 'rgba(240,238,255,0.5)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Social Media</h3>
              <div style={{ display: 'flex', gap: '0.625rem' }}>
                {[
                  { icon: <RiTwitterXLine />, label: 'Twitter' },
                  { icon: <RiInstagramLine />, label: 'Instagram' },
                  { icon: <RiLinkedinBoxLine />, label: 'LinkedIn' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    title={s.label}
                    style={{
                      flex: 1, height: '44px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '0.5rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      color: 'rgba(240,238,255,0.5)',
                      fontSize: '18px',
                      transition: 'all 0.2s',
                      textDecoration: 'none',
                    }}
                    onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#EC4899'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(236,72,153,0.3)'; }}
                    onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(240,238,255,0.5)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ borderRadius: '1rem', padding: '1.5rem', background: 'rgba(236,72,153,0.05)', borderColor: 'rgba(236,72,153,0.12)' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>⚡ Response Time</h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(240,238,255,0.5)', lineHeight: 1.6 }}>
                We respond to all inquiries within <strong style={{ color: '#F9A8D4' }}>24 hours</strong> on weekdays. For urgent matters, DM us on Twitter.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
