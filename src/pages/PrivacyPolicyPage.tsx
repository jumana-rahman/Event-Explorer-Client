import { Link } from 'react-router-dom';
import { RiShieldCheckLine, RiMailLine } from 'react-icons/ri';

export default function PrivacyPolicyPage() {
  return (
    <div>
      <section style={{ padding: 'clamp(4rem, 8vw, 8rem) 0 clamp(3rem, 5vw, 4rem)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />
        <div className="page-container" style={{ textAlign: 'center', position: 'relative' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}><RiShieldCheckLine /> Privacy</div>
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '1rem', lineHeight: 1.1 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(240,238,255,0.4)' }}>Last updated: January 2025</p>
        </div>
      </section>

      <div className="page-container" style={{ paddingBottom: '6rem', maxWidth: '780px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {[
            {
              title: '1. Information We Collect',
              body: 'We collect information you provide directly: your name, email address, profile photo (optional), and any content you submit through event listings or contact forms. We also collect usage data such as pages visited, search queries, and device/browser information to improve the platform.',
            },
            {
              title: '2. How We Use Your Information',
              body: 'We use your information to operate and improve Event Explorer, display your events and profile, send transactional emails (e.g. account verification, event status updates), respond to support inquiries, and analyze platform usage to enhance the user experience.',
            },
            {
              title: '3. Sharing Your Information',
              body: 'We do not sell or rent your personal information to third parties. We may share data with trusted service providers (e.g. hosting, analytics, email delivery) strictly for the purpose of operating the platform. We may also disclose information if required by law or to protect the safety of our users.',
            },
            {
              title: '4. Cookies & Tracking',
              body: 'Event Explorer uses essential cookies to maintain your session and preferences. We may use analytics tools to understand how visitors interact with the site. You can control cookie settings through your browser preferences.',
            },
            {
              title: '5. Data Security',
              body: 'We implement industry-standard security measures including HTTPS encryption, secure password hashing (via Better Auth), and regular security audits. While no system is 100% secure, we take reasonable steps to protect your personal data.',
            },
            {
              title: '6. Data Retention',
              body: 'We retain your account data for as long as your account is active. You may delete your account at any time by contacting us, and we will remove your personal data within 30 days.',
            },
            {
              title: '7. Your Rights',
              body: 'You have the right to access, correct, or delete your personal data. You may also request a copy of all data we hold about you. Contact us at privacy@eventexplorer.com to exercise these rights.',
            },
            {
              title: '8. Changes to This Policy',
              body: 'We may update this Privacy Policy from time to time. Material changes will be communicated via email or a prominent notice on the platform. The "Last updated" date at the top reflects the most recent revision.',
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
              Questions about this policy? Email us at{' '}
              <a href="mailto:privacy@eventexplorer.com" style={{ color: '#A78BFA', textDecoration: 'none' }}>privacy@eventexplorer.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
