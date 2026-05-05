import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Loader from '../components/Loader';

const WASTE_COLORS = { DRY: 'var(--eco-info)', WET: 'var(--eco-success)', E_WASTE: 'var(--eco-warning)' };
const WASTE_ICONS  = { DRY: '📦', WET: '🍃', E_WASTE: '💻' };

/**
 * 🇮🇳 IndiaFlag Component for Admin Branding
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

const AdminDashboardPage = () => {
  // ── State Management ──
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Local state for dashboard tabs/filters to reduce navigation
  const [activeView, setActiveView] = useState('OVERVIEW');

  // ── Data Fetching ──
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getDashboard();
        setData(res.data);
      } catch (err) {
        setError('Critical: Failed to load admin dashboard. Check backend connectivity.');
        console.error('Admin Dashboard Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  // ── Logic: Derived Data Expansion ──
  const dashboardStats = useMemo(() => {
    if (!data) return [];
    return [
      { icon: "👥", label: "Total Users", value: data.totalUsers, sub: `${data.totalCitizens} citizens · ${data.totalCompanies} companies`, to: null },
      { icon: "⚖️", label: "Waste Collected", value: `${data.totalWasteCollected?.toFixed(1)}kg`, sub: "Across all streams", accent: "var(--eco-primary)", to: null },
      { icon: "💵", label: "Revenue (Est.)", value: `₹${data.totalRevenue?.toFixed(2)}`, sub: "Processed revenue", accent: "var(--eco-success)", to: null },
      { icon: "🚚", label: "Total Pickups", value: data.totalPickups, sub: `${data.pendingPickups} pending`, to: "/admin/pickups" },
      { icon: "♻️", label: "Recyclers", value: data.totalRecyclers, sub: "Verified partners", to: "/admin/recyclers" },
      { icon: "📦", label: "Waste Batches", value: data.totalBatches, sub: "Ready for processing", to: "/admin/batches" }
    ];
  }, [data]);

  if (loading) return <Loader fullPage text="Initializing Admin Environment..." />;

  return (
    <div className="page-wrapper" style={{ background: 'var(--eco-bg)', minHeight: '100vh' }}>
      <div className="container">

        {/* ── Section 1: Header & Global Nav ── */}
        <div className="page-header" style={{ marginBottom: 'var(--space-8)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <IndiaFlag />
              <h1 className="page-header__title" style={{ fontSize: '24px' }}>⚙️ Admin Control</h1>
            </div>
            <p className="page-header__subtitle">Swachh Bharat Platform Management — Full Overview.</p>
          </div>
          <div className="page-header__actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Link to="/admin/pickups"   className="btn btn--ghost btn--sm">Pickups</Link>
            <Link to="/admin/recyclers" className="btn btn--ghost btn--sm">Recyclers</Link>
            <Link to="/admin/batches"   className="btn btn--ghost btn--sm">Batches</Link>
            <Link to="/admin/blogs"     className="btn btn--ghost btn--sm">Blogs</Link>
            <Link to="/admin/campaigns" className="btn btn--ghost btn--sm">Campaigns</Link>
            <Link to="/admin/events"    className="btn btn--primary btn--sm">Events</Link>
          </div>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-6)' }}>{error}</div>}

        {data && (
          <>
            {/* ── Section 2: Global Stats ── */}
            <div className="grid mb-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              {dashboardStats.map((stat, idx) => (
                <StatCard
                  key={idx}
                  icon={stat.icon}
                  label={stat.label}
                  value={stat.value}
                  sub={stat.sub}
                  accent={stat.accent}
                  to={stat.to}
                />
              ))}
            </div>

            {/* ── Section 3: Waste & Inventory Split ── */}
            <div className="grid grid--2 mb-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>

              {/* Waste Breakdown Logic */}
              <Card>
                <Card.Header title="📊 Real-time Waste Stream" />
                <Card.Body>
                  {Object.entries(data.wasteByType || {}).map(([type, kg]) => {
                    const total = Object.values(data.wasteByType).reduce((a, b) => a + b, 0);
                    const pct   = total > 0 ? (kg / total) * 100 : 0;
                    return (
                      <div key={type} className="mb-5">
                        <div className="flex-between mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                          <span style={{ fontWeight: 600 }}>{WASTE_ICONS[type]} {type.replace('_', ' ')}</span>
                          <span style={{ color: WASTE_COLORS[type], fontWeight: 700 }}>
                            {kg.toFixed(2)}kg <span style={{ color: 'var(--eco-text-muted)', fontSize: '10px' }}>({pct.toFixed(1)}%)</span>
                          </span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div className="progress__bar" style={{ width: `${pct}%`, background: WASTE_COLORS[type], transition: 'width 1s' }} />
                        </div>
                      </div>
                    );
                  })}
                </Card.Body>
              </Card>

              {/* Inventory Management Logic */}
              <Card>
                <Card.Header title="🏭 Dispatchable Inventory" />
                <Card.Body>
                  {Object.entries(data.inventoryByType || {}).map(([type, qty]) => (
                    <div key={type} className="flex-between" style={{ padding: 'var(--space-4) 0', borderBottom: '1px solid var(--eco-border)' }}>
                      <div className="flex gap-3" style={{ alignItems: 'center' }}>
                        <span className="dot" style={{ background: WASTE_COLORS[type], width: '10px', height: '10px' }} />
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{WASTE_ICONS[type]} {type.replace('_', ' ')}</span>
                      </div>
                      <span style={{ fontWeight: 800, color: qty > 0 ? 'var(--eco-primary)' : 'var(--eco-text-muted)' }}>
                        {qty.toFixed(2)}kg
                      </span>
                    </div>
                  ))}
                  <div style={{ paddingTop: 'var(--space-5)', textAlign: 'center' }}>
                    <Link to="/admin/batches" className="btn btn--primary btn--sm btn--full">
                      Create Dispatch Batch →
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* ── Section 4: Content & Engagement Overview (New Logic to avoid "Going Back") ── */}
            <div className="grid grid--3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>

              {/* Blogs Quick View */}
              <Card>
                <Card.Header title="📝 Content Hub" />
                <Card.Body>
                  <div className="flex-between mb-4">
                    <span style={{ fontSize: '13px', color: 'var(--eco-text-secondary)' }}>Total Articles</span>
                    <span style={{ fontWeight: 700 }}>{data.totalBlogs || 0}</span>
                  </div>
                  <div style={{ background: 'var(--eco-surface-2)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--eco-text-muted)', marginBottom: '8px' }}>Active Awareness Categories:</p>
                    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                      <span className="badge badge--neutral">Segregation</span>
                      <span className="badge badge--neutral">Circular Economy</span>
                    </div>
                  </div>
                  <Link to="/admin/blogs" className="btn btn--ghost btn--sm btn--full" style={{ textAlign: 'center' }}>Manage Blogs</Link>
                </Card.Body>
              </Card>

              {/* Campaigns Quick View */}
              <Card>
                <Card.Header title="📢 Active Campaigns" />
                <Card.Body>
                  <div className="flex-between mb-4">
                    <span style={{ fontSize: '13px', color: 'var(--eco-text-secondary)' }}>Running Drives</span>
                    <span style={{ fontWeight: 700, color: 'var(--eco-primary)' }}>{data.activeCampaigns || 0}</span>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div className="progress" style={{ height: '4px', marginBottom: '8px' }}>
                      <div className="progress__bar" style={{ width: '65%', background: 'var(--eco-primary)' }} />
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--eco-text-muted)' }}>Campaign Goal Reach: 65% average</span>
                  </div>
                  <Link to="/admin/campaigns" className="btn btn--ghost btn--sm btn--full" style={{ textAlign: 'center' }}>Manage Drives</Link>
                </Card.Body>
              </Card>

              {/* Events Quick View */}
              <Card>
                <Card.Header title="📅 Upcoming Events" />
                <Card.Body>
                  <div className="flex-between mb-4">
                    <span style={{ fontSize: '13px', color: 'var(--eco-text-secondary)' }}>Scheduled Events</span>
                    <span style={{ fontWeight: 700, color: 'var(--eco-info)' }}>{data.upcomingEvents || 0}</span>
                  </div>
                  <div style={{ padding: '12px', border: '1px dashed var(--eco-border)', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--eco-text-muted)' }}>Next Event: Workshop on Plastic Recycling</span>
                  </div>
                  <Link to="/admin/events" className="btn btn--primary btn--sm btn--full" style={{ textAlign: 'center' }}>Event Logs</Link>
                </Card.Body>
              </Card>

            </div>

            {/* ── Section 5: Admin Mission Footer ── */}
            <div style={{
              marginTop: 'var(--space-16)',
              padding: 'var(--space-10)',
              textAlign: 'center',
              borderTop: '1px solid var(--eco-border)',
              opacity: 0.8
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
                <IndiaFlag />
                <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Swachh Bharat Admin Portal
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--eco-text-muted)' }}>
                Managing digital infrastructure for a sustainable and cleaner India.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;