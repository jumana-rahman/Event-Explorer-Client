export default function SkeletonCard() {
  return (
    <div className="glass-card" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
      <div className="skeleton-pulse" style={{ height: '200px' }} />
      <div style={{ padding: '1.125rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="skeleton-pulse" style={{ height: '14px', borderRadius: '4px', width: '35%' }} />
        <div className="skeleton-pulse" style={{ height: '20px', borderRadius: '4px', width: '85%' }} />
        <div className="skeleton-pulse" style={{ height: '14px', borderRadius: '4px' }} />
        <div className="skeleton-pulse" style={{ height: '14px', borderRadius: '4px', width: '70%' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
          <div className="skeleton-pulse" style={{ height: '12px', borderRadius: '4px', width: '60%' }} />
          <div className="skeleton-pulse" style={{ height: '12px', borderRadius: '4px', width: '50%' }} />
        </div>
        <div className="skeleton-pulse" style={{ height: '38px', borderRadius: '0.5rem', marginTop: '0.25rem' }} />
      </div>
    </div>
  );
}
