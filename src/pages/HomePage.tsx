import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { RiArrowRightLine, RiSparklingLine, RiCalendarLine, RiMapPinLine, RiGroupLine, RiMailLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import EventCard from '../components/EventCard';
import SkeletonCard from '../components/SkeletonCard';
import { useEvents } from '../context/EventsContext';
import { TESTIMONIALS, FAQ_ITEMS, CATEGORY_ICONS, CATEGORY_COLORS } from '../data/mockData';
import type { EventCategory } from '../types';

const EVENT_CATEGORIES: EventCategory[] = ['Technology', 'Business', 'Workshop', 'Conference', 'Education', 'Music', 'Gaming', 'Sports'];

const CHART_COLORS = ['#EC4899', '#8B5CF6', '#F43F5E', '#06B6D4', '#10B981', '#F59E0B', '#6366F1', '#FB923C'];
const PIE_COLORS = ['#8B5CF6', '#EC4899'];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${open ? 'rgba(236,72,153,0.25)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '0.75rem',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.125rem 1.25rem',
          background: 'transparent',
          border: 'none',
          color: '#f0eeff',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.95rem',
          fontWeight: 500,
          gap: '1rem',
        }}
      >
        {q}
        <span
          style={{
            flexShrink: 0,
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: open ? 'rgba(236,72,153,0.2)' : 'rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            color: open ? '#EC4899' : 'rgba(240,238,255,0.5)',
            fontSize: '14px',
            transform: open ? 'rotate(45deg)' : 'none',
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 1.25rem 1.125rem', fontSize: '0.875rem', color: 'rgba(240,238,255,0.55)', lineHeight: 1.7 }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const { getApprovedEvents } = useEvents();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const approvedEvents = getApprovedEvents();
  const featured = [...approvedEvents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
  const upcoming = [...approvedEvents]
    .filter((e) => new Date(e.eventDate) >= new Date())
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 6);

  const computedStats = useMemo(() => {
    const byCategory = EVENT_CATEGORIES.map((cat) => ({
      category: cat,
      count: approvedEvents.filter((e) => e.category === cat).length,
    })).filter((c) => c.count > 0);

    const byMonth: Record<string, number> = {};
    approvedEvents.forEach((e) => {
      const d = new Date(e.eventDate);
      const key = d.toLocaleDateString('en-US', { month: 'short' });
      byMonth[key] = (byMonth[key] || 0) + 1;
    });
    const eventsByMonth = Object.entries(byMonth).map(([month, count]) => ({ month, count }));

    const freeCount = approvedEvents.filter((e) => e.price === 0).length;
    const paidCount = approvedEvents.filter((e) => e.price > 0).length;

    return { eventsByCategory: byCategory, eventsByMonth, freeVsPaid: [{ name: 'Free', value: freeCount }, { name: 'Paid', value: paidCount }] };
  }, [approvedEvents]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Subscription failed');
      toast.success(data.message || "You're subscribed! Welcome to the community.", { icon: '🎉' });
      setEmail('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Subscription failed');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background image */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&h=900&fit=crop&auto=format"
            alt="Concert crowd"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #050508 0%, transparent 30%, transparent 70%, #050508 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
        </div>

        <div className="page-container" style={{ position: 'relative', zIndex: 2, paddingTop: '5rem', paddingBottom: '5rem', width: '100%' }}>
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}
          >
            <motion.div variants={fadeUp}>
              <span className="section-tag">
                <RiSparklingLine /> Discover · Explore · Experience
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display"
              style={{
                fontSize: 'clamp(2.4rem, 6vw, 4rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              Discover Events That{' '}
              <span className="gradient-text">Move You</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              style={{
                fontSize: '1.1rem',
                color: 'rgba(240,238,255,0.55)',
                lineHeight: 1.75,
                marginBottom: '2rem',
              }}
            >
              From underground music nights to cutting-edge tech conferences — find, attend, and create events that connect communities worldwide.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/explore" className="btn-primary" style={{ fontSize: '0.95rem', padding: '0.75rem 2rem' }}>
                Explore Events <RiArrowRightLine />
              </Link>
              <Link to="/register" className="btn-secondary" style={{ fontSize: '0.95rem', padding: '0.75rem 2rem' }}>
                Create an Event
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              style={{
                display: 'flex',
                gap: '2rem',
                justifyContent: 'center',
                marginTop: '3rem',
                flexWrap: 'wrap',
              }}
            >
              {[
                { icon: <RiCalendarLine />, value: approvedEvents.length.toString(), label: 'Events Listed' },
                { icon: <RiMapPinLine />, value: new Set(approvedEvents.map((e) => e.city)).size.toString(), label: 'Cities Covered' },
                { icon: <RiGroupLine />, value: new Set(approvedEvents.map((e) => e.createdBy)).size.toString(), label: 'Organizers' },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Bricolage Grotesque, sans-serif', color: '#f0eeff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    <span style={{ color: '#EC4899', fontSize: '1rem' }}>{stat.icon}</span>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(240,238,255,0.4)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em' }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      <section style={{ padding: '5rem 0' }}>
        <div className="page-container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-tag">Featured</div>
              <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Events You'll Love
              </h2>
            </div>
            <Link to="/explore" className="btn-secondary" style={{ fontSize: '0.875rem' }}>
              View All <RiArrowRightLine />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '5rem 0', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>Browse by Category</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Find Your Scene
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
            {EVENT_CATEGORIES.map((cat) => {
              const col = CATEGORY_COLORS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => navigate(`/explore?category=${cat}`)}
                  style={{
                    background: col.bg,
                    border: `1px solid ${col.border}`,
                    borderRadius: '1rem',
                    padding: '1.5rem 1rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.25s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.625rem',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = `0 12px 30px ${col.border}`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{CATEGORY_ICONS[cat]}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: col.text, fontFamily: 'DM Mono, monospace', letterSpacing: '0.02em' }}>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section style={{ padding: '5rem 0' }}>
        <div className="page-container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-tag">Coming Soon</div>
              <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Upcoming Events
              </h2>
            </div>
            <Link to="/explore" className="btn-secondary" style={{ fontSize: '0.875rem' }}>
              See All Upcoming <RiArrowRightLine />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {upcoming.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section style={{ padding: '5rem 0', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>Platform Stats</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Growing Every Day
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            {[
              { value: approvedEvents.length.toString(), label: 'Events Listed', color: '#8B5CF6' },
              { value: computedStats.freeVsPaid[1].value.toString(), label: 'Paid Events', color: '#10B981' },
              { value: computedStats.freeVsPaid[0].value.toString(), label: 'Free Events', color: '#F59E0B' },
              { value: new Set(approvedEvents.map((e) => e.city)).size.toString(), label: 'Cities', color: '#EC4899' },
            ].map((s) => (
              <div key={s.label} className="stat-card" style={{ textAlign: 'center' }}>
                <div className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, color: s.color, marginBottom: '0.25rem' }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(240,238,255,0.4)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Bar: Events by category */}
            <div className="glass-card" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
              <h3 className="font-display" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.25rem', color: 'rgba(240,238,255,0.7)' }}>Events by Category</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={computedStats.eventsByCategory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="category" tick={{ fill: 'rgba(240,238,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(240,238,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f0eeff' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {computedStats.eventsByCategory.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line: Events per month */}
            <div className="glass-card" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
              <h3 className="font-display" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.25rem', color: 'rgba(240,238,255,0.7)' }}>Events per Month</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={computedStats.eventsByMonth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(240,238,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(240,238,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f0eeff' }} />
                  <Line type="monotone" dataKey="count" stroke="#EC4899" strokeWidth={2.5} dot={{ fill: '#EC4899', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie: Free vs Paid */}
            <div className="glass-card" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
              <h3 className="font-display" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.25rem', color: 'rgba(240,238,255,0.7)' }}>Free vs Paid Events</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={computedStats.freeVsPaid} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                    {computedStats.freeVsPaid.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f0eeff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                {computedStats.freeVsPaid.map((item, i) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: PIE_COLORS[i] }} />
                    <span style={{ color: 'rgba(240,238,255,0.6)' }}>{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '5rem 0' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>Community</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Loved by Thousands
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="glass-card" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: '#FBBF24', fontSize: '0.85rem' }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'rgba(240,238,255,0.6)', lineHeight: 1.75, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={t.avatar} alt={t.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=EC4899&color=fff`; }}
                  />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.4)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '5rem 0', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>FAQ</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Common Questions
            </h2>
          </div>

          <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ padding: '5rem 0' }}>
        <div className="page-container">
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(139,92,246,0.12) 100%)',
              border: '1px solid rgba(236,72,153,0.2)',
              borderRadius: '1.5rem',
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              textAlign: 'center',
            }}
          >
            <div className="section-tag" style={{ justifyContent: 'center' }}>
              <RiMailLine /> Newsletter
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Never Miss an Event
            </h2>
            <p style={{ color: 'rgba(240,238,255,0.5)', fontSize: '0.95rem', marginBottom: '2rem', maxWidth: '460px', margin: '0 auto 2rem' }}>
              Get curated event recommendations, early-bird deals, and platform news delivered weekly.
            </p>

            <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '0.75rem', maxWidth: '440px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ flex: 1, minWidth: '200px' }}
                required
              />
              <button type="submit" className="btn-primary" style={{ flexShrink: 0 }}>
                Subscribe <RiArrowRightLine />
              </button>
            </form>
            <p style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.25)', marginTop: '1rem' }}>
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
