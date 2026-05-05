import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { pickupAPI } from '../services/api';
import { useToast } from '../components/Toast';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import StatCard from '../components/StatCard';

const STATUSES = ['PENDING', 'ASSIGNED', 'COMPLETED', 'CANCELLED'];

const AdminPickupPage = () => {
  const { user, isAdmin }  = useAuth();
  const navigate           = useNavigate();
  const toast              = useToast();
  const [pickups, setPickups]       = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage]             = useState(0);
  const [loading, setLoading]       = useState(true);
  const [updating, setUpdating]     = useState(null);
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (!isAdmin) navigate('/dashboard', { replace: true });
  }, [isAdmin, navigate]);

  const fetchPickups = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pickupAPI.getAllPickups(page, PAGE_SIZE);
      setPickups(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalElements);
    } catch {
      toast.error('Failed to load pickups.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchPickups(); }, [fetchPickups]);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(id);
    try {
      await pickupAPI.updatePickupStatus(id, newStatus);
      setPickups(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
      toast.success(`Pickup #${id} updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to update pickup #${id}`);
    } finally {
      setUpdating(null);
    }
  };

  const columns = [
    { key: 'id',     label: 'ID',     cellClass: 'table__cell--bold',   render: v => `#${v}` },
    { key: 'user',   label: 'User',   render: (_, row) => (
      <div>
        <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{row.userName}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)' }}>{row.userEmail}</div>
      </div>
    )},
    { key: 'address', label: 'Address', cellClass: 'table__cell--truncate' },
    { key: 'pickupDate', label: 'Pickup Date', cellClass: 'table__cell--nowrap', render: v =>
      new Date(v).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    },
    { key: 'createdAt', label: 'Requested', cellClass: 'table__cell--muted table__cell--nowrap', render: v =>
      new Date(v).toLocaleDateString('en-IN')
    },
    { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
    { key: 'actions', label: 'Update', render: (_, row) => (
      <select
        value={row.status}
        disabled={updating === row.id}
        onChange={e => handleStatusUpdate(row.id, e.target.value)}
        className="form-input"
        style={{ padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-xs)', width: 'auto' }}
      >
        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    )},
  ];

  const rows = pickups.map(p => ({ ...p, _key: p.id }));

  const pendingCount = pickups.filter(p => p.status === 'PENDING').length;

  return (
    <div className="page-wrapper">
      <div className="container">

        <div className="page-header">
          <div>
            <h1 className="page-header__title">⚙️ Pickup Management</h1>
            <p className="page-header__subtitle">Manage all user pickup requests.</p>
          </div>
          <span className="badge badge--error" style={{ alignSelf: 'flex-start' }}>🔐 ADMIN</span>
        </div>

        {/* Quick stats */}
        <div className="grid mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-4)' }}>
          <StatCard icon="📋" label="Total Pickups" value={totalItems} />
          <StatCard icon="⏳" label="Pending"       value={pendingCount} accent="var(--eco-warning)" />
          <StatCard icon="📄" label="This Page"     value={pickups.length} />
          <StatCard icon="📑" label="Page"          value={`${page + 1} / ${totalPages || 1}`} />
        </div>

        <Table
          title="All Pickup Requests"
          count={totalItems}
          columns={columns}
          rows={rows}
          loading={loading}
          empty={{ icon: '🚛', title: 'No pickup requests yet', subtitle: 'They will appear here as users schedule pickups.' }}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex-center gap-2 mt-6">
            <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>← Prev</Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)} className={`btn btn--sm ${page === i ? 'btn--primary' : 'btn--ghost'}`}>{i + 1}</button>
            ))}
            <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next →</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPickupPage;
