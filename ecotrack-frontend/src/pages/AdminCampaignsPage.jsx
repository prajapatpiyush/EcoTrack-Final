import { useState, useEffect, useCallback } from 'react';
import { publicAPI, campaignAdminAPI } from '../services/api';
import { useToast } from '../components/Toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

const minFuture = () => new Date(Date.now() + 3600000).toISOString().slice(0, 16);

const AdminCampaignsPage = () => {
  const toast = useToast();
  const [campaigns,    setCampaigns]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [submitting,   setSubmitting]   = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form,         setForm]         = useState({ title: '', description: '', location: '', date: '' });
  const [formErrors,   setFormErrors]   = useState({});

  const fetchCampaigns = useCallback(() => {
    setLoading(true);
    publicAPI.getCampaigns()
      .then(res => setCampaigns(res.data || []))
      .catch(() => toast.error('Failed to load campaigns'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title    = 'Title is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.date)            e.date     = 'Date is required';
    else if (new Date(form.date) <= new Date()) e.date = 'Date must be in the future';
    return e;
  };

  const handleCreate = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      await campaignAdminAPI.create({ ...form, date: new Date(form.date).toISOString().replace('Z', '') });
      toast.success(`Campaign "${form.title}" created!`);
      setForm({ title: '', description: '', location: '', date: '' });
      setFormErrors({}); setShowForm(false); fetchCampaigns();
    } catch (err) {
      const d = err.response?.data;
      toast.error(typeof d === 'object' ? Object.values(d).join(', ') : (d?.error || 'Failed'));
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await campaignAdminAPI.delete(deleteTarget.id);
      setCampaigns(prev => prev.filter(c => c.id !== deleteTarget.id));
      toast.success('Campaign deleted');
    } catch { toast.error('Failed to delete campaign'); }
    setDeleteTarget(null);
  };

  return (
    <div className="page-wrapper">
      <div className="container--lg">

        {deleteTarget && (
          <ConfirmModal title={`Delete "${deleteTarget.title}"?`}
            message="This campaign will be removed from the public site."
            onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
        )}

        <div className="page-header">
          <div>
            <h1 className="page-header__title">🌍 Campaign Management</h1>
            <p className="page-header__subtitle">Create and manage public awareness campaigns.</p>
          </div>
          <Button variant={showForm ? 'secondary' : 'primary'} size="md"
            onClick={() => { setShowForm(s => !s); setFormErrors({}); }}>
            {showForm ? '✕ Cancel' : '+ New Campaign'}
          </Button>
        </div>

        {showForm && (
          <Card>
            <Card.Header title="New Campaign" />
            <Card.Body>
              <form onSubmit={handleCreate}>
                <div className="grid mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                  <div className="form-group" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
                    <label className="form-label form-label--required">Title</label>
                    <input className={`form-input${formErrors.title ? ' error' : ''}`}
                      placeholder="Indore Clean Drive 2026" value={form.title}
                      onChange={e => { setForm(p => ({ ...p, title: e.target.value })); setFormErrors(p => ({ ...p, title: undefined })); }} />
                    {formErrors.title && <div className="form-error">{formErrors.title}</div>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label form-label--required">Location</label>
                    <input className={`form-input${formErrors.location ? ' error' : ''}`}
                      placeholder="Rajwada, Indore" value={form.location}
                      onChange={e => { setForm(p => ({ ...p, location: e.target.value })); setFormErrors(p => ({ ...p, location: undefined })); }} />
                    {formErrors.location && <div className="form-error">{formErrors.location}</div>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label form-label--required">Date &amp; Time</label>
                    <input type="datetime-local" className={`form-input${formErrors.date ? ' error' : ''}`}
                      min={minFuture()} value={form.date}
                      onChange={e => { setForm(p => ({ ...p, date: e.target.value })); setFormErrors(p => ({ ...p, date: undefined })); }} />
                    {formErrors.date && <div className="form-error">{formErrors.date}</div>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
                    <label className="form-label">Description</label>
                    <textarea className="form-input" rows={3} value={form.description}
                      placeholder="Describe what this campaign is about..."
                      onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      style={{ resize: 'vertical' }} />
                  </div>
                </div>
                <Button type="submit" variant="primary" size="md" loading={submitting}>🌍 Create Campaign</Button>
              </form>
            </Card.Body>
          </Card>
        )}

        <div className="mt-6">
          <Card>
            <Card.Header title="All Campaigns" count={campaigns.length} />
            {loading ? <Loader text="Loading campaigns..." /> :
             campaigns.length === 0 ? (
               <EmptyState icon="🌍" title="No campaigns yet"
                 subtitle="Create a campaign to organize clean-up drives and social initiatives."
                 actionLabel="+ Create Campaign" onAction={() => setShowForm(true)} />
             ) : (
               campaigns.map((c, i) => {
                 const upcoming = new Date(c.date) > new Date();
                 return (
                   <div key={c.id} className="flex-between" style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: i < campaigns.length - 1 ? '1px solid var(--eco-border)' : 'none', background: i % 2 === 0 ? 'var(--eco-surface)' : 'var(--eco-surface-2)', gap: 'var(--space-3)' }}>
                     <div>
                       <div className="flex gap-2 mb-1" style={{ alignItems: 'center' }}>
                         <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{c.title}</span>
                         <span className={`badge ${upcoming ? 'badge--success' : 'badge--neutral'}`}>{upcoming ? 'Upcoming' : 'Past'}</span>
                       </div>
                       <div className="flex gap-4" style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)', flexWrap: 'wrap' }}>
                         <span>📍 {c.location}</span>
                         <span>📅 {new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                       </div>
                     </div>
                     <Button variant="danger" size="sm" onClick={() => setDeleteTarget({ id: c.id, title: c.title })}>Delete</Button>
                   </div>
                 );
               })
             )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminCampaignsPage;
