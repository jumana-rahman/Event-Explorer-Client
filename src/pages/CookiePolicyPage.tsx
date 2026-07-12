import { RiCookieLine, RiMailLine } from 'react-icons/ri';

export default function CookiePolicyPage() {
  return (
    <div>
      <section style={{ padding: 'clamp(4rem, 8vw, 8rem) 0 clamp(3rem, 5vw, 4rem)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />
        <div className="page-container" style={{ textAlign: 'center', position: 'relative' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}><RiCookieLine /> Cookies</div>
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '1rem', lineHeight: 1.1 }}>
            Cookie Policy
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(240,238,255,0.4)' }}>Last updated: January 2025</p>
        </div>
      </section>

      <div className="page-container" style={{ paddingBottom: '6rem', maxWidth: '780px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {[
            {
              title: 'What Are Cookies?',
              body: 'Cookies are small text files stored on your device when you visit a website. They help the platform remember your preferences, maintain your login session, and understand how you interact with the site.',
            },
            {
              title: 'Essential Cookies',
              body: 'These are required for Event Explorer to function. They handle authentication (keeping you logged in), security (CSRF protection), and session management. You cannot opt out of essential cookies as the platform will not work without them.',
            },
            {
              title: 'Analytics Cookies',
              body: 'We may use privacy-respecting analytics tools to understand which pages are visited, how users navigate the site, and where issues occur. This data is aggregated and does not identify individual users. It helps us improve the platform experience.',
            },
            {
              title: 'Preference Cookies',
              body: 'These remember your choices such as theme preferences, sort order, and filter settings so you don\'t have to reconfigure them on every visit. They are purely for convenience and contain no personally identifying information.',
            },
            {
              title: 'Managing Cookies',
              body: 'You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that disabling essential cookies may prevent you from logging in or using core features of the platform.',
            },
            {
              title: 'Third-Party Cookies',
              body: 'Third-party services embedded in the platform (e.g. image hosting) may set their own cookies. We do not control these cookies and recommend reviewing the privacy policies of those third-party services directly.',
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0eeff', marginBottom: '0.75rem' }}>
                {section.title}
              </h2>
              <p style={{ color: 'rgba(240,238,255,0.5)', lineHeight: 1.8, fontSize: '0.925rem' }}>
                {section.body}
              </p>
            </div>
          ))}

          <div style={{ marginTop: '1rem', padding: '1.5rem', borderRadius: '0.75rem', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <p style={{ color: 'rgba(240,238,255,0.5)', fontSize: '0.875rem', lineHeight: 1.7 }}>
              <RiMailLine style={{ display: 'inline', marginRight: '0.4rem', color: '#A78BFA', verticalAlign: '-2px' }} />
              Questions about cookies? Email us at{' '}
              <a href="mailto:privacy@eventexplorer.com" style={{ color: '#A78BFA', textDecoration: 'none' }}>privacy@eventexplorer.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
