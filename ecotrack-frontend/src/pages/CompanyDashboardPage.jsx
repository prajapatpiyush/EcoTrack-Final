import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';

const PLAN_CONFIG = {
  BASIC:   { badge: 'badge--neutral', label: '🥈 Basic Plan',   warnBg: 'var(--eco-surface-2)', warnBorder: 'var(--eco-border)' },
  PREMIUM: { badge: 'badge--warning', label: '🥇 Premium Plan', warnBg: 'var(--eco-warning-bg)', warnBorder: 'var(--eco-warning-border)' },
};

const CompanyDashboardPage = () => {
  const { user }               = useAuth();
  const toast                  = useToast();
  const [profile, setProfile]  = useState(null);
  const [editing, setEditing]  = useState(false);
  const [form,    setForm]     = useState({ companyName: '', subscriptionType: 'BASIC' });
  const [loading, setLoading]  = useState(true);
  const [saving,  setSaving]   = useState(false);

  useEffect(() => {
    companyAPI.getProfile()
      .then(res => {
        setProfile(res.data);
        setForm({ companyName: res.data.companyName, subscriptionType: res.data.subscriptionType });
      })
      .catch(() => toast.error('Failed to load company profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!form.companyName.trim()) { toast.error('Company name is required'); return; }
    setSaving(true);
    try {
      const res = await companyAPI.updateProfile(form);
      setProfile(res.data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed.');
    } finally { setSaving(false); }
  };

  if (loading) return <Loader fullPage text="Loading company profile..." />;

  const planCfg = PLAN_CONFIG[profile?.subscriptionType] || PLAN_CONFIG.BASIC;

  return (
    <div className="page-wrapper">
      <div className="container--lg">

        <div className="page-header">
          <div>
            <h1 className="page-header__title">🏢 Company Dashboard</h1>
            <p className="page-header__subtitle">Welcome, {user?.username}</p>
          </div>
        </div>

        {/* Profile */}
        <Card>
          <Card.Header
            title="Company Profile"
            action={
              !editing
                ? <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit Profile</Button>
                : <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                    <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>Save</Button>
                  </div>
            }
          />
          <Card.Body>
            {editing ? (
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 'var(--space-4)', maxWidth: 560 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Company Name</label>
                  <input className="form-input" value={form.companyName}
                    onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Subscription</label>
                  <select className="form-input" value={form.subscriptionType}
                    onChange={e => setForm(p => ({ ...p, subscriptionType: e.target.value }))}>
                    <option value="BASIC">🥈 Basic</option>
                    <option value="PREMIUM">🥇 Premium</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 'var(--space-4)' }}>
                {[
                  { label: 'Company Name', value: profile.companyName },
                  { label: 'Email',        value: profile.userEmail },
                  { label: 'Member Since', value: new Date(profile.createdAt).toLocaleDateString('en-IN') },
                ].map(item => (
                  <div key={item.label} style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--eco-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--eco-border)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
                <div style={{ padding: 'var(--space-3) var(--space-4)', background: planCfg.warnBg, borderRadius: 'var(--radius-md)', border: `1px solid ${planCfg.warnBorder}` }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase' }}>Subscription</div>
                  <span className={`badge ${planCfg.badge}`}>{planCfg.label}</span>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Quick Actions */}
        <div className="grid mt-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 'var(--space-4)' }}>
          <Link to="/company/pickups" style={{ textDecoration: 'none' }}>
            <div className="card card--hover" style={{ background: 'var(--eco-primary)' }}>
              <div className="card__body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', color: 'white' }}>
                <span style={{ fontSize: 32 }}>🚚</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-md)' }}>Schedule Bulk Pickup</div>
                  <div style={{ fontSize: 'var(--text-sm)', opacity: 0.85, marginTop: 3 }}>Request large-scale waste collection</div>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/company/pickups" style={{ textDecoration: 'none' }}>
            <div className="card card--hover">
              <div className="card__body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <span style={{ fontSize: 32 }}>📋</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--eco-text)' }}>Pickup History</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-muted)', marginTop: 3 }}>View all scheduled pickups</div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboardPage;
