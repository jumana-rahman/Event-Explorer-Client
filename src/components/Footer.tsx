import { Link } from 'react-router-dom';
import { RiCalendarEventLine, RiTwitterXLine, RiInstagramLine, RiLinkedinBoxLine, RiGithubLine, RiMailLine, RiPhoneLine, RiMapPinLine } from 'react-icons/ri';

export default function Footer() {
  return (
    <footer style={{ background: '#080810', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '6rem' }}>
      <div className="page-container" style={{ paddingTop: '3rem', paddingBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RiCalendarEventLine style={{ color: 'white', fontSize: '18px' }} />
              </div>
              <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0eeff' }}>
                Event<span className="gradient-text">Explorer</span>
              </span>
            </Link>
            <p style={{ color: 'rgba(240,238,255,0.45)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '220px' }}>
              Discover world-class events, connect with your community, and create unforgettable experiences.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              {[
                { icon: <RiTwitterXLine />, href: '#' },
                { icon: <RiInstagramLine />, href: '#' },
                { icon: <RiLinkedinBoxLine />, href: '#' },
                { icon: <RiGithubLine />, href: '#' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  style={{
                    width: '34px', height: '34px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '0.4rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(240,238,255,0.5)',
                    fontSize: '16px',
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

          {/* Quick Links */}
          <div>
            <h4 className="font-display" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0eeff', marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/explore', label: 'Explore Events' },
                { to: '/add-event', label: 'Create Event' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{ color: 'rgba(240,238,255,0.45)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#EC4899')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(240,238,255,0.45)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0eeff', marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['Technology', 'Music', 'Business', 'Sports', 'Education', 'Gaming'].map((cat) => (
                <Link
                  key={cat}
                  to={`/explore?category=${cat}`}
                  style={{ color: 'rgba(240,238,255,0.45)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#EC4899')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(240,238,255,0.45)')}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0eeff', marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { icon: <RiMailLine />, text: 'hello@eventexplorer.com' },
                { icon: <RiPhoneLine />, text: '+1 (415) 555-0192' },
                { icon: <RiMapPinLine />, text: '340 Pine St, San Francisco, CA 94104' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: 'rgba(240,238,255,0.45)', fontSize: '0.875rem' }}>
                  <span style={{ color: '#EC4899', marginTop: '2px', flexShrink: 0 }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="divider" />
        <div style={{ paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ color: 'rgba(240,238,255,0.3)', fontSize: '0.8rem' }}>
            © 2025 Event Explorer. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a
                key={item}
                href="#"
                style={{ color: 'rgba(240,238,255,0.3)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'rgba(240,238,255,0.6)')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(240,238,255,0.3)')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
