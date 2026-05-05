import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';

const WASTE_COLORS = { DRY: 'var(--eco-info)', WET: 'var(--eco-success)', E_WASTE: 'var(--eco-warning)' };
const WASTE_ICONS  = { DRY: '📦', WET: '🍃', E_WASTE: '💻' };

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    dashboardAPI.getDashboard()
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage text="Loading dashboard..." />;

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Dashboard</h1>
            <p className="page-header__subtitle">
              Welcome back, <strong>{user?.username}</strong> 👋&nbsp;
              <StatusBadge status={user?.role} size="sm" />
            </p>
          </div>
          <div className="page-header__actions">
            <Link to="/submit-waste" className="btn btn--primary btn--md">♻️ Submit Waste</Link>
            <Button variant="secondary" size="md" onClick={() => { logout(); navigate('/'); }}>Logout</Button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {data && (
          <>
            {/* Stats */}
            <div className="grid grid--4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <StatCard icon="💵" label="Total Earned"      value={`₹${data.totalMoney.toFixed(2)}`}  sub="Simulated rewards"   accent="var(--eco-primary)" />
              <StatCard icon="🏆" label="Total Points"      value={data.totalPoints}                  sub="1 point per kg"      accent="var(--eco-warning)" />
              <StatCard icon="⚖️"  label="Waste Submitted"  value={`${data.totalWasteKg.toFixed(1)}kg`} sub="Total logged"                                />
              <StatCard icon="📦" label="Submissions"       value={data.totalSubmissions}             sub="Total waste logs"                               />
            </div>

            {/* Quick Actions */}
            <div className="grid grid--2 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
              <Link to="/submit-waste" style={{ textDecoration: 'none' }}>
                <div className="card card--hover" style={{ background: 'var(--eco-primary)' }}>
                  <div className="card__body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', color: 'white' }}>
                    <span style={{ fontSize: 32 }}>♻️</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-md)' }}>Submit Waste</div>
                      <div style={{ fontSize: 'var(--text-sm)', opacity: 0.85, marginTop: 3 }}>Earn rewards instantly</div>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/wallet" style={{ textDecoration: 'none' }}>
                <div className="card card--hover">
                  <div className="card__body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <span style={{ fontSize: 32 }}>💰</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--eco-text)' }}>My Wallet</div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-muted)', marginTop: 3 }}>View balance &amp; history</div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Recent Submissions + Transactions */}
            <div className="grid grid--2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

              <Card>
                <Card.Header title="Recent Submissions" action={<Link to="/submit-waste" style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-primary)' }}>+ New</Link>} />
                {data.recentSubmissions.length === 0 ? (
                  <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--eco-text-muted)', fontSize: 'var(--text-sm)' }}>No submissions yet</div>
                ) : (
                  data.recentSubmissions.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--eco-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span className="dot" style={{ background: WASTE_COLORS[s.wasteType] }} />
                        <div>
                          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{WASTE_ICONS[s.wasteType]} {s.wasteType.replace('_', ' ')} — {s.weight}kg</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)' }}>{new Date(s.createdAt).toLocaleDateString('en-IN')}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--eco-primary)' }}>+₹{s.rewardMoney.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </Card>

              <Card>
                <Card.Header title="Recent Transactions" action={<Link to="/wallet" style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-primary)' }}>View All</Link>} />
                {data.recentTransactions.length === 0 ? (
                  <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--eco-text-muted)', fontSize: 'var(--text-sm)' }}>No transactions yet</div>
                ) : (
                  data.recentTransactions.map(txn => (
                    <div key={txn.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--eco-border)' }}>
                      <div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{txn.description}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)' }}>{new Date(txn.createdAt).toLocaleDateString('en-IN')}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: txn.type === 'CREDIT' ? 'var(--eco-primary)' : 'var(--eco-error)' }}>
                          {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.money.toFixed(2)}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-warning)' }}>{txn.type === 'CREDIT' ? '+' : '-'}{txn.points}pts</div>
                      </div>
                    </div>
                  ))
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
