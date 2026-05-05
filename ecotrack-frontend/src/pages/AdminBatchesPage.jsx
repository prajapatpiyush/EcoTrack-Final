import { useState, useEffect, useCallback } from 'react';
import { batchAPI, recyclerAPI } from '../services/api';
import { useToast } from '../components/Toast';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import Table from '../components/Table';
import ConfirmModal from '../components/ConfirmModal';

const WASTE_TYPES = ['DRY', 'WET', 'E_WASTE'];
const minFuture   = () => new Date(Date.now() + 3600000).toISOString().slice(0, 16);

const AdminBatchesPage = () => {
  const toast = useToast();
  const [batches,   setBatches]   = useState([]);
  const [recyclers, setRecyclers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm,  setShowForm]  = useState(false);
  const [actionId,  setActionId]  = useState(null);
  const [processTarget, setProcessTarget] = useState(null);
  const [form, setForm] = useState({ wasteType: 'DRY', quantity: '', recyclerId: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, rRes] = await Promise.all([batchAPI.getAll(), recyclerAPI.getAll()]);
      setBatches(bRes.data);
      setRecyclers(rRes.data);
    } catch {
      toast.error('Failed to load batch data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const qty = parseFloat(form.quantity);
    if (!qty || qty <= 0) { toast.error('Quantity must be greater than 0'); return; }
    setSubmitting(true);
    try {
      await batchAPI.create({ wasteType: form.wasteType, quantity: qty, recyclerId: form.recyclerId ? parseInt(form.recyclerId) : null });
      toast.success('Waste batch created — inventory deducted');
      setForm({ wasteType: 'DRY', quantity: '', recyclerId: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      const d = err.response?.data;
      toast.error(typeof d === 'object' ? Object.values(d).join(', ') : (d?.error || 'Insufficient inventory'));
    } finally { setSubmitting(false); }
  };

  const handleAssign = async (batchId, recyclerId) => {
    if (!recyclerId) return;
    setActionId(batchId);
    try {
      const res = await batchAPI.assignRecycler(batchId, parseInt(recyclerId));
      setBatches(prev => prev.map(b => b.id === batchId ? res.data : b));
      toast.success(`Recycler assigned to batch #${batchId}`);
    } catch { toast.error('Failed to assign recycler'); }
    finally { setActionId(null); }
  };

  const handleProcess = async () => {
    if (!processTarget) return;
    setActionId(processTarget);
    try {
      const res = await batchAPI.markProcessed(processTarget);
      setBatches(prev => prev.map(b => b.id === processTarget ? res.data : b));
      toast.success('Batch marked as processed — revenue generated');
    } catch { toast.error('Failed to process batch'); }
    finally { setActionId(null); setProcessTarget(null); }
  };

  const columns = [
    { key: 'id',        label: 'ID',         cellClass: 'table__cell--bold', render: v => `#${v}` },
    { key: 'wasteType', label: 'Waste Type',  cellClass: 'table__cell--bold', render: v => v.replace('_', ' ') },
    { key: 'quantity',  label: 'Quantity',    cellClass: 'table__cell--primary', render: v => `${v.toFixed(2)}kg` },
    { key: 'status',    label: 'Status',      render: v => <StatusBadge status={v} /> },
    { key: 'recyclerName', label: 'Recycler', cellClass: 'table__cell--muted', render: v => v || <em style={{ color: 'var(--eco-text-muted)', fontSize: 'var(--text-xs)' }}>Unassigned</em> },
    { key: 'createdAt', label: 'Created',     cellClass: 'table__cell--muted table__cell--nowrap', render: v => new Date(v).toLocaleDateString('en-IN') },
    { key: 'actions',   label: 'Actions',     render: (_, row) => {
      if (row.status === 'PROCESSED') return <span style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)', fontStyle: 'italic' }}>Complete</span>;
      if (row.status === 'ASSIGNED')  return (
        <Button size="sm" variant="primary" loading={actionId === row.id} onClick={() => setProcessTarget(row.id)}>✅ Process</Button>
      );
      return (
        <select defaultValue="" disabled={actionId === row.id}
          onChange={e => handleAssign(row.id, e.target.value)}
          className="form-input"
          style={{ padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-xs)', width: 'auto' }}>
          <option value="" disabled>Assign recycler</option>
          {recyclers.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      );
    }},
  ];

  return (
    <div className="page-wrapper">
      <div className="container">

        {processTarget && (
          <ConfirmModal
            title={`Mark batch #${processTarget} as PROCESSED?`}
            message="This will generate revenue and cannot be undone."
            confirmLabel="Mark Processed"
            confirmDanger={false}
            onConfirm={handleProcess}
            onCancel={() => setProcessTarget(null)}
          />
        )}

        <div className="page-header">
          <div>
            <h1 className="page-header__title">📦 Waste Batch Management</h1>
            <p className="page-header__subtitle">Create batches → assign recycler → mark processed.</p>
          </div>
          <Button onClick={() => setShowForm(s => !s)} variant={showForm ? 'secondary' : 'primary'} size="md">
            {showForm ? '✕ Cancel' : '+ Create Batch'}
          </Button>
        </div>

        {/* Flow guide */}
        <div className="flex gap-0 mb-6" style={{ background: 'var(--eco-surface)', border: '1px solid var(--eco-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {[
            { n: '1', label: 'Create Batch',    sub: 'from inventory',   c: 'var(--eco-info)' },
            { n: '→', label: '',                sub: '',                 c: 'var(--eco-border)' },
            { n: '2', label: 'Assign Recycler', sub: 'status: ASSIGNED', c: 'var(--eco-warning)' },
            { n: '→', label: '',                sub: '',                 c: 'var(--eco-border)' },
            { n: '3', label: 'Mark Processed',  sub: 'generates revenue',c: 'var(--eco-primary)' },
          ].map((s, i) => (
            <div key={i} style={{ flex: s.n === '→' ? '0 0 28px' : 1, padding: 'var(--space-4) var(--space-5)', textAlign: 'center', borderRight: '1px solid var(--eco-border)' }}>
              <div style={{ fontSize: s.n === '→' ? 18 : 20, fontWeight: 700, color: s.c }}>{s.n}</div>
              {s.label && <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginTop: 3 }}>{s.label}</div>}
              {s.sub   && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)' }}>{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Create Form */}
        {showForm && (
          <Card>
            <Card.Header title="New Waste Batch" />
            <Card.Body>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-muted)', marginBottom: 'var(--space-4)' }}>
                ⚠️ Creating a batch deducts from inventory. Ensure sufficient stock exists.
              </p>
              <form onSubmit={handleCreate}>
                <div className="grid grid--3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Waste Type</label>
                    <select className="form-input" value={form.wasteType} onChange={e => setForm(p => ({ ...p, wasteType: e.target.value }))}>
                      {WASTE_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Quantity (kg)</label>
                    <input type="number" className="form-input" placeholder="100" min="0.01" step="0.01"
                      value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Assign Recycler (optional)</label>
                    <select className="form-input" value={form.recyclerId} onChange={e => setForm(p => ({ ...p, recyclerId: e.target.value }))}>
                      <option value="">— Assign Later —</option>
                      {recyclers.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                </div>
                <Button type="submit" variant="primary" size="md" loading={submitting}>📦 Create Batch</Button>
              </form>
            </Card.Body>
          </Card>
        )}

        <div className="mt-6">
          <Table
            title="All Batches"
            count={batches.length}
            columns={columns}
            rows={batches.map(b => ({ ...b, _key: b.id }))}
            loading={loading}
            empty={{ icon: '📭', title: 'No batches yet', subtitle: 'Submit waste first, then create a batch from inventory.' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminBatchesPage;
