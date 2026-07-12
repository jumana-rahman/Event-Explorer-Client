import { RiFileTextLine, RiMailLine } from 'react-icons/ri';

export default function TermsPage() {
  return (
    <div>
      <section style={{ padding: 'clamp(4rem, 8vw, 8rem) 0 clamp(3rem, 5vw, 4rem)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />
        <div className="page-container" style={{ textAlign: 'center', position: 'relative' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}><RiFileTextLine /> Legal</div>
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '1rem', lineHeight: 1.1 }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(240,238,255,0.4)' }}>Last updated: January 2025</p>
        </div>
      </section>

      <div className="page-container" style={{ paddingBottom: '6rem', maxWidth: '780px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {[
            {
              title: '1. Acceptance of Terms',
              body: 'By accessing or using Event Explorer, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform. We reserve the right to modify these terms at any time, and continued use constitutes acceptance of any changes.',
            },
            {
              title: '2. Account Responsibilities',
              body: 'You are responsible for maintaining the security of your account credentials. You must provide accurate information during registration and keep your profile up to date. You are liable for all activity that occurs under your account.',
            },
            {
              title: '3. Event Listings',
              body: 'Event organizers are solely responsible for the accuracy and legality of their event listings. All events are reviewed by our team before going live. We reserve the right to remove any listing that violates our guidelines, contains misleading information, or is otherwise objectionable.',
            },
            {
              title: '4. Prohibited Conduct',
              body: 'You may not: use the platform for illegal purposes, post false or misleading event information, attempt to circumvent security measures, harass other users, or use automated tools to scrape or access the platform without written permission.',
            },
            {
              title: '5. Intellectual Property',
              body: 'All content on Event Explorer — including design, code, logos, and branding — is the intellectual property of Event Explorer. Event organizers retain ownership of their event content but grant us a non-exclusive license to display it on the platform.',
            },
            {
              title: '6. Payments & Refunds',
              body: 'Event Explorer does not process payments between attendees and organizers. Ticket pricing and refund policies are set entirely by event organizers. We are not responsible for any disputes between event organizers and attendees.',
            },
            {
              title: '7. Limitation of Liability',
              body: 'Event Explorer is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid us in the past 12 months.',
            },
            {
              title: '8. Termination',
              body: 'We may suspend or terminate your account at any time for violation of these terms. You may also delete your account at any time through your dashboard settings or by contacting support.',
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
              Questions about these terms? Email us at{' '}
              <a href="mailto:legal@eventexplorer.com" style={{ color: '#A78BFA', textDecoration: 'none' }}>legal@eventexplorer.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
