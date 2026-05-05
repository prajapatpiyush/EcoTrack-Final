import { useState, useEffect, useCallback } from 'react';
import { publicAPI, blogAdminAPI } from '../services/api';
import { useToast } from '../components/Toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

const CATEGORIES = ['SUSTAINABILITY', 'WASTE_SEGREGATION', 'THREE_R'];

const AdminBlogsPage = () => {
  const toast = useToast();
  const [blogs,       setBlogs]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [showForm,    setShowForm]    = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form,        setForm]        = useState({ title: '', content: '', author: '', category: 'SUSTAINABILITY' });
  const [formErrors,  setFormErrors]  = useState({});

  const fetchBlogs = useCallback(() => {
    setLoading(true);
    publicAPI.getBlogs(0, 100)
      .then(res => setBlogs(res.data.content || []))
      .catch(() => toast.error('Failed to load blogs'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const validate = () => {
    const e = {};
    if (!form.title.trim())   e.title   = 'Title is required';
    if (!form.content.trim()) e.content = 'Content is required';
    if (!form.author.trim())  e.author  = 'Author is required';
    return e;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      await blogAdminAPI.create(form);
      toast.success(`"${form.title}" published!`);
      setForm({ title: '', content: '', author: '', category: 'SUSTAINABILITY' });
      setFormErrors({});
      setShowForm(false);
      fetchBlogs();
    } catch (err) {
      const d = err.response?.data;
      toast.error(typeof d === 'object' ? Object.values(d).join(', ') : (d?.error || 'Failed to create blog'));
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await blogAdminAPI.delete(deleteTarget.id);
      setBlogs(prev => prev.filter(b => b.id !== deleteTarget.id));
      toast.success('Blog deleted');
    } catch { toast.error('Failed to delete blog'); }
    setDeleteTarget(null);
  };

  const field = (key, label, props = {}) => (
    <div className="form-group" style={{ marginBottom: 0, ...props.wrap }}>
      <label className="form-label form-label--required">{label}</label>
      <input className={`form-input${formErrors[key] ? ' error' : ''}`}
        value={form[key]}
        onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setFormErrors(p => ({ ...p, [key]: undefined })); }}
        {...props} wrap={undefined} />
      {formErrors[key] && <div className="form-error">{formErrors[key]}</div>}
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="container--lg">

        {deleteTarget && (
          <ConfirmModal title={`Delete "${deleteTarget.title}"?`}
            message="This blog post will be permanently removed from the public site."
            onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
        )}

        <div className="page-header">
          <div>
            <h1 className="page-header__title">📰 Blog Management</h1>
            <p className="page-header__subtitle">Create and manage public blog posts.</p>
          </div>
          <Button variant={showForm ? 'secondary' : 'primary'} size="md"
            onClick={() => { setShowForm(s => !s); setFormErrors({}); }}>
            {showForm ? '✕ Cancel' : '+ New Blog'}
          </Button>
        </div>

        {showForm && (
          <Card>
            <Card.Header title="New Blog Post" />
            <Card.Body>
              <form onSubmit={handleCreate}>
                <div className="grid mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                  <div className="form-group" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
                    <label className="form-label form-label--required">Title</label>
                    <input className={`form-input${formErrors.title ? ' error' : ''}`}
                      placeholder="How to Segregate Waste at Home"
                      value={form.title}
                      onChange={e => { setForm(p => ({ ...p, title: e.target.value })); setFormErrors(p => ({ ...p, title: undefined })); }} />
                    {formErrors.title && <div className="form-error">{formErrors.title}</div>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label form-label--required">Author</label>
                    <input className={`form-input${formErrors.author ? ' error' : ''}`}
                      placeholder="EcoTrack Team"
                      value={form.author}
                      onChange={e => { setForm(p => ({ ...p, author: e.target.value })); setFormErrors(p => ({ ...p, author: undefined })); }} />
                    {formErrors.author && <div className="form-error">{formErrors.author}</div>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Category</label>
                    <select className="form-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
                    <label className="form-label form-label--required">Content</label>
                    <textarea className={`form-input${formErrors.content ? ' error' : ''}`} rows={7}
                      placeholder="Write your blog post content here..."
                      value={form.content}
                      onChange={e => { setForm(p => ({ ...p, content: e.target.value })); setFormErrors(p => ({ ...p, content: undefined })); }}
                      style={{ resize: 'vertical', minHeight: 140 }} />
                    {formErrors.content && <div className="form-error">{formErrors.content}</div>}
                    <div className="form-help" style={{ textAlign: 'right' }}>{form.content.length} characters</div>
                  </div>
                </div>
                <Button type="submit" variant="primary" size="md" loading={submitting}>📢 Publish Blog</Button>
              </form>
            </Card.Body>
          </Card>
        )}

        <div className="mt-6">
          <Card>
            <Card.Header title="All Posts" count={blogs.length} />
            {loading ? <Loader text="Loading blogs..." /> :
             blogs.length === 0 ? (
               <EmptyState icon="📝" title="No blogs yet"
                 subtitle="Create your first blog post to share sustainability tips with users."
                 actionLabel="+ Write First Post" onAction={() => setShowForm(true)} />
             ) : (
               blogs.map((b, i) => (
                 <div key={b.id} className="flex-between" style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: i < blogs.length - 1 ? '1px solid var(--eco-border)' : 'none', background: i % 2 === 0 ? 'var(--eco-surface)' : 'var(--eco-surface-2)', gap: 'var(--space-3)' }}>
                   <div style={{ flex: 1, minWidth: 0 }}>
                     <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>{b.title}</div>
                     <div className="flex gap-4" style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)', flexWrap: 'wrap' }}>
                       <span>🔗 /{b.slug}</span>
                       <span>🏷️ {b.category?.replace(/_/g, ' ')}</span>
                       <span>✍️ {b.author}</span>
                       <span>📅 {new Date(b.createdAt).toLocaleDateString('en-IN')}</span>
                     </div>
                   </div>
                   <Button variant="danger" size="sm" onClick={() => setDeleteTarget({ id: b.id, title: b.title })}>Delete</Button>
                 </div>
               ))
             )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogsPage;
