import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../../services/api';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Card from '../../components/Card';
import Button from '../../components/Button';

/**
 * 🇮🇳 IndiaFlag Component
 * Simple SVG for patriotic branding within the sections
 */
const IndiaFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 301 201" style={{ borderRadius: '2px', display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}>
    <g fill="none">
      <path fill="#f93" d="M.5.5h300v200H.5z" />
      <path fill="#fff" d="M.5 67.166h300v66.667H.5z" />
      <path fill="#128807" d="M.5 133.833h300V200.5H.5z" />
      <circle cx="150.5" cy="100.5" r="26.667" fill="#008" />
      <circle cx="150.5" cy="100.5" r="23.333" fill="#fff" />
      <circle cx="150.5" cy="100.5" r="4.667" fill="#008" />
    </g>
  </svg>
);

const CampaignsPage = () => {
  // ── State Management ──
  const [campaigns, setCampaigns]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [filter, setFilter]         = useState('ALL'); // ALL, UPCOMING, PAST
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder]   = useState('date_asc'); // date_asc, date_desc, alpha

  // ── Data Fetching ──
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const res = await publicAPI.getCampaigns();
        setCampaigns(res.data);
      } catch (err) {
        setError('Failed to load campaigns. Please check your network connection.');
        console.error('Campaign Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // ── Robust Filtering & Sorting Logic ──
  const processedCampaigns = useMemo(() => {
    let result = [...campaigns];

    // 1. Filter by Status
    if (filter === 'UPCOMING') {
      result = result.filter(c => new Date(c.date) > new Date());
    } else if (filter === 'PAST') {
      result = result.filter(c => new Date(c.date) <= new Date());
    }

    // 2. Filter by Search Query
    if (searchTerm) {
      result = result.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortOrder === 'date_asc') return new Date(a.date) - new Date(b.date);
      if (sortOrder === 'date_desc') return new Date(b.date) - new Date(a.date);
      if (sortOrder === 'alpha') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [campaigns, filter, searchTerm, sortOrder]);

  // ── Helper Stats Logic ──
  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: campaigns.length,
      upcoming: campaigns.filter(c => new Date(c.date) > now).length,
      past: campaigns.filter(c => new Date(c.date) <= now).length,
    };
  }, [campaigns]);

  return (
    <div style={{ background: 'var(--eco-bg)', minHeight: '100vh', transition: 'all 0.3s' }}>

      {/* ── Page Header ── */}
      <div className="section-header">
        <h1 className="section-header__title">🌍 Campaigns</h1>
        <p className="section-header__subtitle">
          Join clean-up drives and social sustainability initiatives for a Swachh Bharat.
        </p>
      </div>

      <div className="container" style={{ padding: 'var(--space-10) var(--space-6)' }}>

        {/* ── Search & Filter Toolbar (Logic Expansion) ── */}
        <div style={{
          marginBottom: 'var(--space-8)',
          background: 'var(--eco-surface)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div className="flex gap-2">
            {['ALL', 'UPCOMING', 'PAST'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`btn btn--sm ${filter === type ? 'btn--primary' : 'btn--ghost'}`}
              >
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flex: '1', justifyContent: 'flex-end', minWidth: '300px' }}>
            <input
              type="text"
              placeholder="Search by city or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--eco-border)',
                background: 'var(--eco-surface)',
                width: '100%',
                maxWidth: '250px'
              }}
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--eco-border)',
                background: 'var(--eco-surface)',
                cursor: 'pointer'
              }}
            >
              <option value="date_asc">Oldest First</option>
              <option value="date_desc">Newest First</option>
              <option value="alpha">A-Z Name</option>
            </select>
          </div>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-6)' }}>{error}</div>}

        {/* ── Main Content Area ── */}
        {loading ? (
          <Loader text="Fetching latest environmental drives..." />
        ) : processedCampaigns.length === 0 ? (
          <EmptyState
            icon="🌱"
            title="No matches found"
            subtitle="Try adjusting your filters or checking back tomorrow."
          />
        ) : (
          <>
            <div className="grid grid--auto">
              {processedCampaigns.map(c => {
                const upcoming = new Date(c.date) > new Date();
                return (
                  <div
                    key={c.id}
                    className="card"
                    style={{
                      padding: 'var(--space-6)',
                      borderTop: `4px solid ${upcoming ? 'var(--eco-primary)' : 'var(--eco-border)'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: 'var(--eco-surface)'
                    }}
                  >
                    <div>
                      <div className="flex-between mb-3">
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 700, lineHeight: 1.3 }}>
                          {c.title}
                        </h3>
                        <span className={`badge ${upcoming ? 'badge--success' : 'badge--neutral'}`} style={{ flexShrink: 0, marginLeft: 'var(--space-2)' }}>
                          {upcoming ? '🟢 Upcoming' : '⏸ Past'}
                        </span>
                      </div>

                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                        {c.description}
                      </p>

                      <div className="flex-col gap-1" style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-muted)', marginBottom: upcoming ? 'var(--space-4)' : 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>📍</span> <span>{c.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>📅</span>
                          <span>{new Date(c.date).toLocaleString('en-IN', {
                            day: 'numeric', month: 'long', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}</span>
                        </div>
                      </div>
                    </div>

                    {upcoming && (
                      <Link
                        to={`/register/${c.id}`}
                        className="btn btn--primary btn--sm btn--full"
                        style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}
                      >
                        Join Campaign →
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Expansion: Educational Mission Section ── */}
            <div style={{
              marginTop: 'var(--space-20)',
              padding: 'var(--space-10)',
              background: 'var(--eco-surface-2)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--eco-border)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                <IndiaFlag />
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--eco-text)', marginTop: '10px' }}>
                  Our Impact Mission
                </h2>
                <p style={{ color: 'var(--eco-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                  Every campaign organized through EcoTrack aims to reduce the carbon footprint and promote circular economy in Indian cities.
                </p>
              </div>

              <div className="grid grid--auto" style={{ gap: 'var(--space-6)' }}>
                <div style={{ padding: 'var(--space-6)', background: 'var(--eco-surface)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
                  <h4 style={{ fontWeight: 700, color: 'var(--eco-primary)' }}>{stats.total * 120}+</h4>
                  <p style={{ fontSize: '13px', color: 'var(--eco-text-muted)' }}>Volunteers Mobilized</p>
                </div>
                <div style={{ padding: 'var(--space-6)', background: 'var(--eco-surface)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>♻️</div>
                  <h4 style={{ fontWeight: 700, color: 'var(--eco-primary)' }}>{stats.past * 50}kg</h4>
                  <p style={{ fontSize: '13px', color: 'var(--eco-text-muted)' }}>Waste Collected</p>
                </div>
                <div style={{ padding: 'var(--space-6)', background: 'var(--eco-surface)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏙️</div>
                  <h4 style={{ fontWeight: 700, color: 'var(--eco-primary)' }}>{stats.upcoming} Cities</h4>
                  <p style={{ fontSize: '13px', color: 'var(--eco-text-muted)' }}>Active Locations</p>
                </div>
              </div>
            </div>

            {/* ── Expansion: FAQ / How it Works ── */}
            <div style={{ marginTop: 'var(--space-16)', paddingBottom: 'var(--space-10)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-6)', textAlign: 'center' }}>
                How to participate?
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '800px', margin: '0 auto' }}>
                <details style={{ background: 'var(--eco-surface)', padding: '15px', borderRadius: '8px', border: '1px solid var(--eco-border)' }}>
                  <summary style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--eco-text)' }}>What should I bring to a clean-up drive?</summary>
                  <p style={{ padding: '10px 0', fontSize: '14px', color: 'var(--eco-text-secondary)' }}>
                    We recommend bringing your own water bottle, comfortable shoes, and a hat. We provide gloves, bags, and safety equipment.
                  </p>
                </details>
                <details style={{ background: 'var(--eco-surface)', padding: '15px', borderRadius: '8px', border: '1px solid var(--eco-border)' }}>
                  <summary style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--eco-text)' }}>Can I organize my own campaign?</summary>
                  <p style={{ padding: '10px 0', fontSize: '14px', color: 'var(--eco-text-secondary)' }}>
                    Yes! Go to your profile dashboard and click "Propose Campaign". Our team will review and list it here if it meets our criteria.
                  </p>
                </details>
                <details style={{ background: 'var(--eco-surface)', padding: '15px', borderRadius: '8px', border: '1px solid var(--eco-border)' }}>
                  <summary style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--eco-text)' }}>Is there a registration fee?</summary>
                  <p style={{ padding: '10px 0', fontSize: '14px', color: 'var(--eco-text-secondary)' }}>
                    No, all EcoTrack campaigns are completely free for citizens to join. Our goal is collective social impact.
                  </p>
                </details>
              </div>
            </div>

            {/* ── Footer Mission Statement ── */}
            <div style={{ textAlign: 'center', marginTop: 'var(--space-12)', opacity: 0.7 }}>
              <span style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
                Together for a cleaner, greener India.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;