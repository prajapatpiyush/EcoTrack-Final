import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicAPI } from '../../services/api';
import Loader from '../../components/Loader';
import Card from '../../components/Card';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog,    setBlog]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    publicAPI.getBlogBySlug(slug)
      .then(res => setBlog(res.data))
      .catch(() => setError('Blog not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader fullPage text="Loading blog..." />;

  if (error) return (
    <div className="page-wrapper flex-center">
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 'var(--space-4)' }}>📭</div>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-3)' }}>Blog Not Found</h2>
        <Link to="/blogs" className="btn btn--primary btn--md">← Back to Blogs</Link>
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--eco-bg)', minHeight: '100vh', paddingBottom: 'var(--space-20)' }}>
      {/* Header */}
      <div className="section-header" style={{ textAlign: 'left', padding: 'var(--space-12) var(--space-6)' }}>
        <div className="container--md">
          <Link to="/blogs" style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-primary)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 'var(--space-5)', textDecoration: 'none' }}>
            ← Back to Blogs
          </Link>
          <span className="badge badge--neutral" style={{ marginBottom: 'var(--space-4)', textTransform: 'uppercase', color: 'var(--eco-primary)' }}>
            {blog.category?.replace('_', ' ')}
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,38px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 'var(--space-5)' }}>
            {blog.title}
          </h1>
          <div className="flex gap-6" style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-text-muted)', flexWrap: 'wrap' }}>
            <span>✍️ {blog.author}</span>
            <span>📅 {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container--md" style={{ padding: 'var(--space-10) var(--space-6)' }}>
        <Card>
          <Card.Body>
            <div style={{ fontSize: 'var(--text-md)', lineHeight: 1.85, color: 'var(--eco-text)', whiteSpace: 'pre-wrap' }}>
              {blog.content}
            </div>
          </Card.Body>
          <Card.Footer>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <Link to="/blogs" className="btn btn--secondary btn--md">← All Blogs</Link>
              <Link to="/register" className="btn btn--primary btn--md">Join EcoTrack 🌱</Link>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default BlogDetailPage;
