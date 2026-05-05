import { useState, useEffect } from 'react';
import { recyclerAPI } from '../services/api';
import { useToast } from '../components/Toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const WASTE_TOGGLES = ['DRY', 'WET', 'E_WASTE'];

const AdminRecyclersPage = () => {
  const toast                         = useToast();
  const [recyclers,  setRecyclers]    = useState([]);
  const [loading,    setLoading]      = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [showForm,   setShowForm]     = useState(false);
  const [form,       setForm]         = useState({ name: '', email: '', wasteTypesAccepted: '' });
  const [formErrors, setFormErrors]   = useState({});

  const fetchRecyclers = () => {
    setLoading(true);
    recyclerAPI.getAll()
      .then(res => setRecyclers(res.data))
      .catch(() => toast.error('Failed to load recyclers.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRecyclers(); }, []);

  const toggleType = (type) => {
    const cur = form.wasteTypesAccepted ? form.wasteTypesAccepted.split(',').map(s => s.trim()).filter(Boolean) : [];
    const upd = cur.includes(type) ? cur.filter(t => t !== type) : [...cur, type];
    setForm(p => ({ ...p, wasteTypesAccepted: upd.join(',') }));
  };
  const selected = form.wasteTypesAccepted ? form.wasteTypesAccepted.split(',').map(s => s.trim()).filter(Boolean) : [];

  const validate = () => {
    const e = {};
    if (!form.name.trim())               e.name  = 'Name is required';
    if (!form.email.trim())              e.email = 'Email is required';
    if (selected.length === 0)           e.types = 'Select at least one waste type';
    return e;
  };

  const handleCreate = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      await recyclerAPI.create(form);
      toast.success(`${form.name} added as recycling partner!`);
      setForm({ name: '', email: '', wasteTypesAccepted: '' });
      setFormErrors({}); setShowForm(false); fetchRecyclers();
    } catch (err) {
      const d = err.response?.data;
      toast.error(typeof d === 'object' ? Object.values(d).join(', ') : (d?.error || 'Failed'));
    } finally { setSubmitting(false); }
  };

  const columns = [
    { key: 'id',    label: 'ID',    cellClass: 'table__cell--bold',   render: v => `#${v}` },
    { key: 'name',  label: 'Name',  cellClass: 'table__cell--bold' },
    { key: 'email', label: 'Email', cellClass: 'table__cell--muted' },
    { key: 'wasteTypesAccepted', label: 'Accepts', render: v => (
      <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
        {v.split(',').map(t => (
          <span key={t} className="chip" style={{ color: 'var(--eco-primary)', borderColor: 'var(--eco-border-strong)' }}>
            {t.trim().replace('_', ' ')}
          </span>
        ))}
      </div>
    )},
    { key: 'createdAt', label: 'Since', cellClass: 'table__cell--muted table__cell--nowrap',
      render: v => new Date(v).toLocaleDateString('en-IN') },
  ];

  return (
    <div className="page-wrapper">
      <div className="container--lg">

        <div className="page-header">
          <div>
            <h1 className="page-header__title">♻️ Recycling Partners</h1>
            <p className="page-header__subtitle">Manage registered recyclers for waste batch assignment.</p>
          </div>
          <Button variant={showForm ? 'secondary' : 'primary'} size="md"
            onClick={() => { setShowForm(s => !s); setFormErrors({}); }}>
            {showForm ? '✕ Cancel' : '+ Add Recycler'}
          </Button>
        </div>

        {showForm && (
          <Card>
            <Card.Header title="New Recycling Partner" />
            <Card.Body>
              <form onSubmit={handleCreate}>
                <div className="grid mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 'var(--space-4)' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label form-label--required">Partner Name</label>
                    <input className={`form-input${formErrors.name ? ' error' : ''}`}
                      placeholder="GreenCycle Pvt Ltd" value={form.name}
                      onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setFormErrors(p => ({ ...p, name: undefined })); }} />
                    {formErrors.name && <div className="form-error">{formErrors.name}</div>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label form-label--required">Email</label>
                    <input type="email" className={`form-input${formErrors.email ? ' error' : ''}`}
                      placeholder="partner@greencycle.in" value={form.email}
                      onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setFormErrors(p => ({ ...p, email: undefined })); }} />
                    {formErrors.email && <div className="form-error">{formErrors.email}</div>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label form-label--required">Waste Types Accepted</label>
                  <div className="flex gap-2">
                    {WASTE_TOGGLES.map(type => (
                      <button key={type} type="button" onClick={() => toggleType(type)}
                        className={`btn btn--sm ${selected.includes(type) ? 'btn--primary' : 'btn--ghost'}`}>
                        {type.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                  {formErrors.types && <div className="form-error mt-2">{formErrors.types}</div>}
                </div>
                <Button type="submit" variant="primary" size="md" loading={submitting}
                  disabled={selected.length === 0}>
                  Add Recycler
                </Button>
              </form>
            </Card.Body>
          </Card>
        )}

        <div className="mt-6">
          <Table
            title="Registered Recyclers" count={recyclers.length}
            columns={columns}
            rows={recyclers.map(r => ({ ...r, _key: r.id }))}
            loading={loading}
            empty={{ icon: '🤝', title: 'No recyclers yet', subtitle: 'Add your first recycling partner to start assigning waste batches.', actionLabel: '+ Add Recycler', onAction: () => setShowForm(true) }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminRecyclersPage;
