import { useState, useEffect, useCallback } from 'react';
import { publicAPI, eventAdminAPI } from '../services/api';
import { useToast } from '../components/Toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

const minFuture = () => new Date(Date.now() + 3600000).toISOString().slice(0, 16);

const AdminEventsPage = () => {
  const toast = useToast();
  const [events,       setEvents]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [submitting,   setSubmitting]   = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', location: '', date: '', maxParticipants: '' });
  const [formErrors, setFormErrors] = useState({});

  const fetchEvents = useCallback(() => {
    setLoading(true);
    publicAPI.getEvents()
      .then(res => setEvents(res.data || []))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title    = 'Title is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.date)            e.date     = 'Date is required';
    else if (new Date(form.date) <= new Date()) e.date = 'Date must be in the future';
    const max = parseInt(form.maxParticipants);
    if (!max || max < 1)       e.maxParticipants = 'Must be at least 1';
    return e;
  };

  const handleCreate = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      await eventAdminAPI.create({ ...form, maxParticipants: parseInt(form.maxParticipants), date: new Date(form.date).toISOString().replace('Z', '') });
      toast.success(`Event "${form.title}" created!`);
      setForm({ title: '', description: '', location: '', date: '', maxParticipants: '' });
      setFormErrors({}); setShowForm(false); fetchEvents();
    } catch (err) {
      const d = err.response?.data;
      toast.error(typeof d === 'object' ? Object.values(d).join(', ') : (d?.error || 'Failed'));
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await eventAdminAPI.delete(deleteTarget.id);
      setEvents(prev => prev.filter(e => e.id !== deleteTarget.id));
      toast.success('Event deleted');
    } catch { toast.error('Failed to delete event'); }
    setDeleteTarget(null);
  };

  const columns = [
    { key: 'id',       label: 'ID',       cellClass: 'table__cell--bold',   render: v => `#${v}` },
    { key: 'title',    label: 'Title',     cellClass: 'table__cell--truncate' },
    { key: 'location', label: 'Location',  cellClass: 'table__cell--muted' },
    { key: 'date',     label: 'Date',      cellClass: 'table__cell--nowrap', render: v => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
    { key: 'participants', label: 'Participants', render: (_, row) => {
        const pct = (row.currentParticipants / row.maxParticipants) * 100;
        return (
          <div className="flex gap-2" style={{ alignItems: 'center', minWidth: 100 }}>
            <div className="progress" style={{ flex: 1 }}>
              <div className="progress__bar" style={{ width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? 'var(--eco-error)' : 'var(--eco-primary)' }} />
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)', whiteSpace: 'nowrap' }}>
              {row.currentParticipants}/{row.maxParticipants}
            </span>
          </div>
        );
    }},
    { key: 'status', label: 'Status', render: (_, row) => {
        const upcoming = new Date(row.date) > new Date();
        return <span className={`badge ${upcoming ? 'badge--success' : 'badge--neutral'}`}>{upcoming ? 'Upcoming' : 'Past'}</span>;
    }},
    { key: 'actions', label: 'Action', render: (_, row) => (
      <Button variant="danger" size="sm" onClick={() => setDeleteTarget({ id: row.id, title: row.title })}>Delete</Button>
    )},
  ];

  return (
    <div className="page-wrapper">
      <div className="container">

        {deleteTarget && (
          <ConfirmModal title={`Delete "${deleteTarget.title}"?`}
            message="This event and all registrations will be permanently removed."
            onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
        )}

        <div className="page-header">
          <div>
            <h1 className="page-header__title">📅 Event Management</h1>
            <p className="page-header__subtitle">Create and manage public events with participant tracking.</p>
          </div>
          <Button variant={showForm ? 'secondary' : 'primary'} size="md"
            onClick={() => { setShowForm(s => !s); setFormErrors({}); }}>
            {showForm ? '✕ Cancel' : '+ New Event'}
          </Button>
        </div>

        {showForm && (
          <Card>
            <Card.Header title="New Event" />
            <Card.Body>
              <form onSubmit={handleCreate}>
                <div className="grid mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                  <div className="form-group" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
                    <label className="form-label form-label--required">Title</label>
                    <input className={`form-input${formErrors.title ? ' error' : ''}`}
                      placeholder="Recycling Workshop" value={form.title}
                      onChange={e => { setForm(p => ({ ...p, title: e.target.value })); setFormErrors(p => ({ ...p, title: undefined })); }} />
                    {formErrors.title && <div className="form-error">{formErrors.title}</div>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label form-label--required">Location</label>
                    <input className={`form-input${formErrors.location ? ' error' : ''}`}
                      placeholder="IIT Indore" value={form.location}
                      onChange={e => { setForm(p => ({ ...p, location: e.target.value })); setFormErrors(p => ({ ...p, location: undefined })); }} />
                    {formErrors.location && <div className="form-error">{formErrors.location}</div>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label form-label--required">Max Participants</label>
                    <input type="number" className={`form-input${formErrors.maxParticipants ? ' error' : ''}`}
                      placeholder="50" min="1" value={form.maxParticipants}
                      onChange={e => { setForm(p => ({ ...p, maxParticipants: e.target.value })); setFormErrors(p => ({ ...p, maxParticipants: undefined })); }} />
                    {formErrors.maxParticipants && <div className="form-error">{formErrors.maxParticipants}</div>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
                    <label className="form-label form-label--required">Date &amp; Time</label>
                    <input type="datetime-local" className={`form-input${formErrors.date ? ' error' : ''}`}
                      min={minFuture()} value={form.date}
                      onChange={e => { setForm(p => ({ ...p, date: e.target.value })); setFormErrors(p => ({ ...p, date: undefined })); }} />
                    {formErrors.date && <div className="form-error">{formErrors.date}</div>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
                    <label className="form-label">Description</label>
                    <textarea className="form-input" rows={3} value={form.description}
                      placeholder="Describe the event objectives..."
                      onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} />
                  </div>
                </div>
                <Button type="submit" variant="primary" size="md" loading={submitting}>📅 Create Event</Button>
              </form>
            </Card.Body>
          </Card>
        )}

        <div className="mt-6">
          <Table
            title="All Events" count={events.length}
            columns={columns}
            rows={events.map(e => ({ ...e, _key: e.id }))}
            loading={loading}
            empty={{ icon: '📅', title: 'No events yet', subtitle: 'Create an event to engage users with sustainability activities.', actionLabel: '+ Create Event', onAction: () => setShowForm(true) }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminEventsPage;
