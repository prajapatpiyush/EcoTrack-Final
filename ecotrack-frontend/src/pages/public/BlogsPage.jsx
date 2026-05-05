import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../../services/api';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';

/**
 * 🇮🇳 IndiaFlag Component
 * Reusable SVG for branding consistency
 */
const IndiaFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="15" viewBox="0 0 301 201" style={{ borderRadius: '2px', display: 'inline-block', verticalAlign: 'middle' }}>
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

const CATEGORIES = ['ALL', 'WASTE_SEGREGATION', 'THREE_R', 'SUSTAINABILITY'];

/**
 * ── BlogCard ──
 * Individual post item using brand variables
 */
const BlogCard = ({ blog }) => (
  <Link to={`/blogs/${blog.slug}`} style={{ textDecoration: 'none' }}>
    <Card hover style={{ border: '1px solid #e2e8f0', height: '100%' }}>
      <Card.Body>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <span className="badge" style={{
            background: 'var(--eco-primary-subtle)',
            color: 'var(--eco-primary)',
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '4px',
            textTransform: 'uppercase'
          }}>
            {blog.category?.replace('_', ' ')}
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>{blog.readTime || '5 min'} read</span>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.15rem',
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: 'var(--space-3)',
          lineHeight: 1.4
        }}>
          {blog.title}
        </h3>

        <p style={{
          fontSize: '14px',
          color: '#64748b',
          lineHeight: 1.6,
          marginBottom: 'var(--space-5)'
        }}>
          {blog.content?.slice(0, 130)}...
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid #f1f5f9'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--eco-primary)',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }}>
            {blog.author?.charAt(0)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{blog.author}</span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  </Link>
);

const BlogsPage = () => {
  // ── State ──
  const [blogs, setBlogs]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory]     = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // ── Data Fetching ──
  useEffect(() => {
    setLoading(true);
    const catParam = category === 'ALL' ? '' : category;

    publicAPI.getBlogs(page, 9, catParam)
      .then(res => {
        setBlogs(res.data.content);
        setTotalPages(res.data.totalPages);
        setError('');
      })
      .catch(() => setError('Unable to connect to the server. Please check your internet.'))
      .finally(() => setLoading(false));
  }, [page, category]);

  // ── Search Logic ──
  const filteredBlogs = useMemo(() => {
    if (!searchTerm) return blogs;
    return blogs.filter(b =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  return (
    <div style={{ background: 'var(--eco-bg)', minHeight: '100vh' }}>

      {/* ── Section 1: Page Header ── */}
      <div className="section-header" style={{ padding: '80px 24px 40px' }}>
        <div style={{ marginBottom: '16px' }}>
          <IndiaFlag />
        </div>
        <h1 className="section-header__title" style={{ color: '#B0C0C0' }}>Knowledge Center</h1>
        <p className="section-header__subtitle" style={{ color: '#B0C0C0' }}>
          Your guide to a cleaner, greener India. Learn about waste management and sustainable living.
        </p>
      </div>

      <div className="container" style={{ padding: '0 var(--space-6) var(--space-20)' }}>

        {/* ── Section 2: Toolbar (Filters & Search) ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '40px',
          padding: '24px',
          background: 'var(--eco-surface)',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div className="flex gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => { setCategory(c); setPage(0); }}
                className={`btn btn--sm ${category === c ? 'btn--primary' : 'btn--ghost'}`}
                style={{ borderRadius: '6px' }}
              >
                {c === 'ALL' ? 'All Guides' : c.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', flex: '1', maxWidth: '300px' }}>
            <input
              type="text"
              placeholder="Search guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* ── Section 3: Content Logic ── */}
        {error && <div className="alert alert-error" style={{ marginBottom: '24px' }}>{error}</div>}

        {loading ? (
          <div style={{ padding: '100px 0' }}>
            <Loader text="Gathering green insights..." />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <EmptyState
            icon="🌿"
            title="No Articles Found"
            subtitle="Try choosing a different category or search term."
          />
        ) : (
          <>
            <div className="grid grid--auto" style={{ gap: '30px' }}>
              {filteredBlogs.map(b => (
                <BlogCard key={b.id} blog={b} />
              ))}
            </div>

            {/* ── Section 4: Pagination ── */}
            {totalPages > 1 && (
              <div className="flex-center gap-2" style={{ marginTop: '60px' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => { setPage(p => p - 1); window.scrollTo(0,0); }}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => { setPage(i); window.scrollTo(0,0); }}
                    className={`btn btn--sm ${page === i ? 'btn--primary' : 'btn--ghost'}`}
                    style={{ minWidth: '40px' }}
                  >
                    {i + 1}
                  </button>
                ))}

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => { setPage(p => p + 1); window.scrollTo(0,0); }}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* ── Section 5: Education / Stats Block (Expansion) ── */}
        <div style={{
          marginTop: '100px',
          padding: '60px 40px',
          background: 'var(--eco-surface-2)',
          borderRadius: '24px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: '#fffff', marginBottom: '16px' }}>
            Swachh Bharat Statistics
          </h2>
          <p style={{ color: '#B0C0C0 ', maxWidth: '600px', margin: '0 auto 48px' }}>
            Small steps by millions of citizens lead to a massive impact. Here is how we are progressing.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px'
          }}>
            <div style={{ padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--eco-primary)', marginBottom: '8px' }}>75%</div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Waste Segregated</div>
            </div>
            <div style={{ padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--eco-primary)', marginBottom: '8px' }}>1.2M</div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Active Citizens</div>
            </div>
            <div style={{ padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--eco-primary)', marginBottom: '8px' }}>500+</div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Clean Cities</div>
            </div>
          </div>
        </div>

        {/* ── Section 6: Mission Callout ── */}
        <div style={{
          marginTop: '80px',
          textAlign: 'center',
          padding: '40px',
          border: '2px dashed var(--eco-accent)',
          borderRadius: '20px'
        }}>
          <span style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--eco-primary-dark)',
            fontWeight: 800,
            display: 'block',
            marginBottom: '12px'
          }}>
            India's Sustainable Future
          </span>
          <p style={{ fontSize: '18px', color: '#B0C0C0', fontStyle: 'italic' }}>
            "Be the change that you wish to see in the world." — Mahatma Gandhi
          </p>
          <div style={{ marginTop: '20px' }}>
            <IndiaFlag />
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogsPage;