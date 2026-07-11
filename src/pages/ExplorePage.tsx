import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RiSearchLine, RiArrowLeftLine, RiArrowRightLine, RiInboxLine } from 'react-icons/ri';
import EventCard from '../components/EventCard';
import SkeletonCard from '../components/SkeletonCard';
import { useEvents } from '../context/EventsContext';
import type { EventCategory } from '../types';
import { EVENT_CATEGORIES } from '../types';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-asc', label: 'Lowest Price' },
  { value: 'price-desc', label: 'Highest Price' },
  { value: 'alpha', label: 'A–Z' },
];

const PER_PAGE = 8;

export default function ExplorePage() {
  const [params] = useSearchParams();
  const { getApprovedEvents } = useEvents();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<EventCategory | ''>((params.get('category') as EventCategory) ?? '');
  const [city, setCity] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const allApproved = getApprovedEvents();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const cities = useMemo(() => [...new Set(allApproved.map((e) => e.city))].sort(), [allApproved]);

  const filtered = useMemo(() => {
    let result = [...allApproved];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.organizerName.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q)
      );
    }

    if (category) result = result.filter((e) => e.category === category);
    if (city) result = result.filter((e) => e.city === city);
    if (priceFilter === 'free') result = result.filter((e) => e.price === 0);
    if (priceFilter === 'paid') result = result.filter((e) => e.price > 0);

    switch (sort) {
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'oldest': result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'alpha': result.sort((a, b) => a.title.localeCompare(b.title)); break;
    }

    return result;
  }, [allApproved, search, category, city, priceFilter, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetPage = () => setPage(1);

  return (
    <div className="page-container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-tag">Explore</div>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          All Events
        </h1>
        <p style={{ color: 'rgba(240,238,255,0.45)', fontSize: '0.9rem' }}>
          {filtered.length} events found — search, filter, and discover what's next.
        </p>
      </div>

      {/* Search + Filters */}
      <div
        className="glass-card"
        style={{ borderRadius: '1rem', padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 220px', minWidth: '180px', position: 'relative' }}>
          <RiSearchLine style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,238,255,0.3)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search events, organizers, cities…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            className="input-field"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        {/* Category */}
        <div style={{ flex: '0 1 160px', minWidth: '130px' }}>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value as EventCategory | ''); resetPage(); }}
            className="select-field"
          >
            <option value="">All Categories</option>
            {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* City */}
        <div style={{ flex: '0 1 150px', minWidth: '120px' }}>
          <select
            value={city}
            onChange={(e) => { setCity(e.target.value); resetPage(); }}
            className="select-field"
          >
            <option value="">All Cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Price Filter */}
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {(['all', 'free', 'paid'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => { setPriceFilter(opt); resetPage(); }}
              style={{
                padding: '0.5rem 0.875rem',
                borderRadius: '0.5rem',
                border: `1px solid ${priceFilter === opt ? 'rgba(236,72,153,0.4)' : 'rgba(255,255,255,0.08)'}`,
                background: priceFilter === opt ? 'rgba(236,72,153,0.12)' : 'transparent',
                color: priceFilter === opt ? '#F9A8D4' : 'rgba(240,238,255,0.5)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}
            >
              {opt === 'all' ? 'All' : opt === 'free' ? 'Free' : 'Paid'}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ flex: '0 1 160px', minWidth: '140px' }}>
          <select value={sort} onChange={(e) => { setSort(e.target.value); resetPage(); }} className="select-field">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Clear */}
        {(search || category || city || priceFilter !== 'all') && (
          <button
            onClick={() => { setSearch(''); setCategory(''); setCity(''); setPriceFilter('all'); resetPage(); }}
            className="btn-ghost"
            style={{ fontSize: '0.82rem', padding: '0.5rem 0.875rem', whiteSpace: 'nowrap' }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><RiInboxLine style={{ color: 'rgba(240,238,255,0.15)', margin: '0 auto' }} /></div>
          <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No events found</h3>
          <p style={{ color: 'rgba(240,238,255,0.4)', fontSize: '0.875rem' }}>Try adjusting your search or clearing the filters.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {paginated.map((event) => <EventCard key={event.id} event={event} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.5rem 1rem', borderRadius: '0.5rem',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  color: page === 1 ? 'rgba(240,238,255,0.2)' : 'rgba(240,238,255,0.7)',
                  cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '0.85rem', transition: 'all 0.2s',
                }}
              >
                <RiArrowLeftLine /> Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '0.5rem',
                    border: `1px solid ${p === page ? 'rgba(236,72,153,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    background: p === page ? 'rgba(236,72,153,0.12)' : 'rgba(255,255,255,0.04)',
                    color: p === page ? '#F9A8D4' : 'rgba(240,238,255,0.5)',
                    cursor: 'pointer', fontSize: '0.85rem', fontWeight: p === page ? 600 : 400,
                    transition: 'all 0.2s',
                  }}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.5rem 1rem', borderRadius: '0.5rem',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  color: page === totalPages ? 'rgba(240,238,255,0.2)' : 'rgba(240,238,255,0.7)',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.85rem', transition: 'all 0.2s',
                }}
              >
                Next <RiArrowRightLine />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
