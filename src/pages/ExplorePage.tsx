import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RiSearchLine, RiArrowLeftLine, RiArrowRightLine, RiInboxLine } from 'react-icons/ri';
import EventCard from '../components/EventCard';
import SkeletonCard from '../components/SkeletonCard';
import { eventsAPI, type ApiEvent } from '../services/api';
import type { Event, EventCategory } from '../types';
import { EVENT_CATEGORIES } from '../types';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-asc', label: 'Lowest Price' },
  { value: 'price-desc', label: 'Highest Price' },
  { value: 'alpha', label: 'A–Z' },
];

const PER_PAGE = 8;

function mapEvent(e: ApiEvent): Event {
  return {
    id: (e.id || e._id) as string,
    title: e.title,
    shortDescription: e.shortDescription,
    description: e.description,
    category: e.category as EventCategory,
    eventDate: e.eventDate,
    eventTime: e.eventTime,
    venue: e.venue,
    city: e.city,
    price: e.price,
    bannerImage: e.bannerImage,
    galleryImages: e.galleryImages || [],
    organizerName: e.organizerName,
    createdBy: e.createdBy,
    status: e.status as 'pending' | 'approved' | 'rejected',
    createdAt: e.createdAt,
  };
}

export default function ExplorePage() {
  const [params, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(() => params.get('search') ?? '');
  const [category, setCategory] = useState<EventCategory | ''>(() => (params.get('category') as EventCategory) ?? '');
  const [city, setCity] = useState(() => params.get('city') ?? '');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>(() => (params.get('price') as 'all' | 'free' | 'paid') ?? 'all');
  const [sort, setSort] = useState(() => params.get('sort') ?? 'newest');
  const [page, setPage] = useState(() => Math.max(1, parseInt(params.get('page') ?? '1', 10)));

  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchDebounced, setSearchDebounced] = useState(() => params.get('search') ?? '');

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const syncParams = useCallback(
    (overrides?: { search?: string; category?: string; city?: string; price?: string; sort?: string; page?: string }) => {
      const next: Record<string, string> = {};
      const s = overrides?.search !== undefined ? overrides.search : search;
      const c = overrides?.category !== undefined ? overrides.category : category;
      const ci = overrides?.city !== undefined ? overrides.city : city;
      const p = overrides?.price !== undefined ? overrides.price : priceFilter;
      const so = overrides?.sort !== undefined ? overrides.sort : sort;
      const pa = overrides?.page !== undefined ? overrides.page : String(page);

      if (s) next.search = s;
      if (c) next.category = c;
      if (ci) next.city = ci;
      if (p && p !== 'all') next.price = p;
      if (so && so !== 'newest') next.sort = so;
      if (pa && pa !== '1') next.page = pa;

      setSearchParams(next, { replace: true });
    },
    [search, category, city, priceFilter, sort, page, setSearchParams]
  );

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const query: Record<string, string> = { limit: String(PER_PAGE), page: String(page) };
      if (searchDebounced) query.search = searchDebounced;
      if (category) query.category = category;
      if (city) query.city = city;
      if (priceFilter !== 'all') query.price = priceFilter;
      if (sort) query.sort = sort;

      const data = await eventsAPI.getApproved(query);
      setEvents((data.events || []).map(mapEvent));
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setCities(data.cities || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  }, [searchDebounced, category, city, priceFilter, sort, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const updateSearch = (v: string) => { setSearch(v); setPage(1); syncParams({ search: v, page: '1' }); };
  const updateCategory = (v: EventCategory | '') => { setCategory(v); setPage(1); syncParams({ category: v, page: '1' }); };
  const updateCity = (v: string) => { setCity(v); setPage(1); syncParams({ city: v, page: '1' }); };
  const updatePrice = (v: 'all' | 'free' | 'paid') => { setPriceFilter(v); setPage(1); syncParams({ price: v, page: '1' }); };
  const updateSort = (v: string) => { setSort(v); setPage(1); syncParams({ sort: v, page: '1' }); };
  const updatePage = (p: number) => { setPage(p); syncParams({ page: p > 1 ? String(p) : '' }); };

  const clearFilters = () => {
    setSearch(''); setCategory(''); setCity(''); setPriceFilter('all'); setSort('newest'); setPage(1);
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="page-container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-tag">Explore</div>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          All Events
        </h1>
        <p style={{ color: 'rgba(240,238,255,0.45)', fontSize: '0.9rem' }}>
          {total} events found — search, filter, and discover what's next.
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
            onChange={(e) => updateSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        {/* Category */}
        <div style={{ flex: '0 1 160px', minWidth: '130px' }}>
          <select
            value={category}
            onChange={(e) => updateCategory(e.target.value as EventCategory | '')}
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
            onChange={(e) => updateCity(e.target.value)}
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
              onClick={() => updatePrice(opt)}
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
          <select value={sort} onChange={(e) => updateSort(e.target.value)} className="select-field">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Clear */}
        {(search || category || city || priceFilter !== 'all') && (
          <button
            onClick={clearFilters}
            className="btn-ghost"
            style={{ fontSize: '0.82rem', padding: '0.5rem 0.875rem', whiteSpace: 'nowrap' }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><RiInboxLine style={{ color: 'rgba(240,238,255,0.15)', margin: '0 auto' }} /></div>
          <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No events found</h3>
          <p style={{ color: 'rgba(240,238,255,0.4)', fontSize: '0.875rem' }}>Try adjusting your search or clearing the filters.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {events.map((event) => <EventCard key={event.id} event={event} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => updatePage(Math.max(1, page - 1))}
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
                  onClick={() => updatePage(p)}
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
                onClick={() => updatePage(Math.min(totalPages, page + 1))}
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
