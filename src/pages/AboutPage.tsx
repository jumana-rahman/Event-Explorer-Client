import { Link } from 'react-router-dom';
import { RiArrowRightLine, RiHeartLine, RiGlobalLine, RiShieldCheckLine, RiRocketLine } from 'react-icons/ri';

const TEAM = [
  { name: 'Priya Nair', role: 'Co-founder & CEO', bio: 'Former product lead at Eventbrite. Passionate about community-driven experiences.', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&auto=format' },
  { name: 'Marcus Osei', role: 'Co-founder & CTO', bio: 'Full-stack engineer with 12 years building event tech. Built platforms used by 2M+ people.', img: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=120&h=120&fit=crop&auto=format' },
  { name: 'Yuki Hayashi', role: 'Head of Design', bio: 'Award-winning UX designer who believes great events start with a great discovery experience.', img: 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?w=120&h=120&fit=crop&auto=format' },
  { name: 'Lucia Fernandez', role: 'Head of Community', bio: 'Event producer turned tech builder. She\'s organized 500+ events across three continents.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format' },
];

const VALUES = [
  { icon: <RiHeartLine />, title: 'Community First', desc: 'Every feature we build starts with a simple question: does this help communities connect more meaningfully?' },
  { icon: <RiGlobalLine />, title: 'Accessible to All', desc: 'Listing events is free for everyone. Great experiences shouldn\'t be gated by platform fees or complicated tools.' },
  { icon: <RiShieldCheckLine />, title: 'Quality Curated', desc: 'Every event is reviewed before going live. No spam, no misleading listings — just real events worth your time.' },
  { icon: <RiRocketLine />, title: 'Built for Growth', desc: 'From a solo meetup host to a 10,000-seat venue — our platform scales with your ambitions.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ padding: 'clamp(4rem, 8vw, 8rem) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />
        <div className="page-container" style={{ textAlign: 'center', position: 'relative' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>Our Story</div>
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '1.25rem', lineHeight: 1.1 }}>
            Built by event-lovers,<br /><span className="gradient-text">for event-lovers</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(240,238,255,0.5)', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto 2rem' }}>
            Event Explorer started in 2023 when two friends couldn't find a single platform that made local event discovery feel as exciting as the events themselves. So they built one.
          </p>
          <Link to="/explore" className="btn-primary" style={{ fontSize: '0.95rem' }}>
            Discover Events <RiArrowRightLine />
          </Link>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '5rem 0', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="section-tag">Mission</div>
              <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.2 }}>
                Making world-class events discoverable for everyone
              </h2>
              <p style={{ color: 'rgba(240,238,255,0.5)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1rem' }}>
                We believe the best moments in life happen when people come together. Whether it's a underground jazz night in Nashville, a React conference in San Francisco, or a watercolor workshop in Austin — those experiences deserve to be found.
              </p>
              <p style={{ color: 'rgba(240,238,255,0.5)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                Event Explorer removes the friction from both sides: attendees get a curated, searchable feed of quality events, and organizers get a free platform to reach their ideal audience without fighting algorithms.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&auto=format"
                alt="Team working together"
                style={{ width: '100%', borderRadius: '1rem', objectFit: 'cover', background: '#0e0e16' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '5rem 0' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>What We Believe</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Our Core Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {VALUES.map((v) => (
              <div key={v.title} className="glass-card" style={{ borderRadius: '1rem', padding: '1.75rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '0.625rem', background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899', fontSize: '20px', marginBottom: '1rem' }}>
                  {v.icon}
                </div>
                <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.625rem' }}>{v.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(240,238,255,0.5)', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '5rem 0', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>The Team</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Who We Are</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {TEAM.map((member) => (
              <div key={member.name} className="glass-card-hover" style={{ borderRadius: '1rem', padding: '2rem 1.5rem', textAlign: 'center' }}>
                <img
                  src={member.img}
                  alt={member.name}
                  style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem', display: 'block', border: '2px solid rgba(236,72,153,0.3)' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=EC4899&color=fff`; }}
                />
                <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{member.name}</h3>
                <div style={{ fontSize: '0.72rem', fontFamily: 'DM Mono, monospace', color: '#F9A8D4', letterSpacing: '0.04em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>{member.role}</div>
                <p style={{ fontSize: '0.82rem', color: 'rgba(240,238,255,0.45)', lineHeight: 1.6 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center' }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Ready to find your next event?
            </h2>
            <p style={{ color: 'rgba(240,238,255,0.4)', marginBottom: '2rem' }}>Join thousands of attendees and organizers already on the platform.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/explore" className="btn-primary">Browse Events <RiArrowRightLine /></Link>
              <Link to="/register" className="btn-secondary">Create an Account</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
