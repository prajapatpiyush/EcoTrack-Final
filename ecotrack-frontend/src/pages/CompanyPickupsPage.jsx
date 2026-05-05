import { useState, useEffect } from 'react';
import { companyAPI } from '../services/api';
import { useToast } from '../components/Toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const WASTE_TYPES = [
  { value: 'DRY',     label: '📦 Dry Waste',  rate: 2 },
  { value: 'WET',     label: '🍃 Wet Waste',  rate: 1 },
  { value: 'E_WASTE', label: '💻 E-Waste',     rate: 5 },
];

const STATUS_BADGE = {
  PENDING:   'badge--pending',
  ASSIGNED:  'badge--assigned',
  COMPLETED: 'badge--completed',
  CANCELLED: 'badge--cancelled',
};

const minFuture = () => new Date(Date.now() + 3600000).toISOString().slice(0, 16);

const CompanyPickupsPage = () => {
  const toast                        = useToast();
  const [pickups,    setPickups]     = useState([]);
  const [loading,    setLoading]     = useState(true);
  const [submitting, setSubmitting]  = useState(false);
  const [showForm,   setShowForm]    = useState(false);
  const [formErr,    setFormErr]     = useState('');
  const [form, setForm] = useState({ wasteType: 'DRY', weight: '', pickupDate: '' });

  const fetchPickups = () => {
    setLoading(true);
    companyAPI.getPickups()
      .then(res => setPickups(res.data))
      .catch(() => toast.error('Failed to load pickups.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPickups(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErr('');
    const w = parseFloat(form.weight);
    if (!w || w <= 0 || w >= 1000) { setFormErr('Weight must be between 0 and 1000 kg'); return; }
    if (!form.pickupDate || new Date(form.pickupDate) <= new Date()) { setFormErr('Pickup date must be in the future'); return; }
    setSubmitting(true);
    try {
      await companyAPI.schedulePickup({
        wasteType: form.wasteType, weight: w,
        pickupDate: new Date(form.pickupDate).toISOString().replace('Z', ''),
      });
      toast.success('Pickup scheduled!');
      setForm({ wasteType: 'DRY', weight: '', pickupDate: '' });
      setShowForm(false);
      fetchPickups();
    } catch (err) {
      const d = err.response?.data;
      setFormErr(typeof d === 'object' ? Object.values(d).join(', ') : (d?.error || 'Failed'));
    } finally { setSubmitting(false); }
  };

  return (
    <div className="page-wrapper">
      <div className="container--lg">

        <div className="page-header">
          <div>
            <h1 className="page-header__title">🚚 Company Pickups</h1>
            <p className="page-header__subtitle">Schedule and track your bulk waste pickups.</p>
          </div>
          <Button variant={showForm ? 'secondary' : 'primary'} size="md"
            onClick={() => { setShowForm(s => !s); setFormErr(''); }}>
            {showForm ? '✕ Cancel' : '+ Schedule Pickup'}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card>
            <Card.Header title="New Bulk Pickup Request" />
            <Card.Body>
              {formErr && <div className="alert alert-error">{formErr}</div>}
              <form onSubmit={handleSubmit}>
                <div className="grid mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 'var(--space-4)' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Waste Type</label>
                    <select className="form-input" value={form.wasteType}
                      onChange={e => setForm(p => ({ ...p, wasteType: e.target.value }))}>
                      {WASTE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label} (₹{t.rate}/kg)</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Weight (kg)</label>
                    <input type="number" className="form-input" placeholder="e.g. 50"
                      min="0.01" max="999.99" step="0.01"
                      value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
                    <label className="form-label">Preferred Date &amp; Time</label>
                    <input type="datetime-local" className="form-input" min={minFuture()}
                      value={form.pickupDate} onChange={e => setForm(p => ({ ...p, pickupDate: e.target.value }))} />
                  </div>
                </div>
                <Button type="submit" variant="primary" size="md" loading={submitting}>🚚 Schedule Pickup</Button>
              </form>
            </Card.Body>
          </Card>
        )}

        {/* List */}
        <div className="mt-6">
          {loading ? <Loader text="Loading pickups..." /> :
           pickups.length === 0 ? (
             <Card>
               <EmptyState icon="🚛" title="No pickups yet"
                 subtitle="Schedule your first bulk pickup above."
                 actionLabel="+ Schedule Pickup" onAction={() => setShowForm(true)} />
             </Card>
           ) : (
             <div className="flex-col gap-4">
               {pickups.map(p => {
                 const wt = WASTE_TYPES.find(t => t.value === p.wasteType);
                 return (
                   <Card key={p.id}>
                     <Card.Body>
                       <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                         <div className="flex gap-3" style={{ alignItems: 'center' }}>
                           <span style={{ fontSize: 24 }}>{wt?.label.split(' ')[0]}</span>
                           <div>
                             <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--eco-text)' }}>
                               {p.wasteType.replace('_', ' ')} — {p.weight} kg
                             </div>
                             <div style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-muted)', marginTop: 2 }}>
                               📅 {new Date(p.pickupDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                             </div>
                           </div>
                         </div>
                         <div className="flex gap-3" style={{ alignItems: 'center' }}>
                           <span style={{ fontWeight: 600, color: 'var(--eco-primary)', fontSize: 'var(--text-sm)' }}>
                             ₹{(p.weight * (wt?.rate || 1)).toFixed(2)} est.
                           </span>
                           <span className={`badge ${STATUS_BADGE[p.status] || 'badge--neutral'}`}>
                             {p.status}
                           </span>
                         </div>
                       </div>
                     </Card.Body>
                   </Card>
                 );
               })}
             </div>
           )
          }
        </div>
      </div>
    </div>
  );
};

export default CompanyPickupsPage;
