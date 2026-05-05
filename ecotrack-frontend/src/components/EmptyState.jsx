import { Link } from 'react-router-dom';

const EmptyState = ({
  icon = '📭',
  title = 'Nothing here yet',
  subtitle,
  actionLabel,
  actionTo,
  onAction,
}) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 32px',
    textAlign: 'center',
  }}>
    <div style={{ fontSize: 52, marginBottom: 16, lineHeight: 1 }}>{icon}</div>
    <h3 style={{
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      fontWeight: 600,
      color: 'var(--eco-text)',
      marginBottom: subtitle ? 8 : 0,
    }}>
      {title}
    </h3>
    {subtitle && (
      <p style={{
        color: 'var(--eco-text-secondary)',
        fontSize: 14,
        maxWidth: 320,
        lineHeight: 1.6,
        marginBottom: actionLabel ? 24 : 0,
      }}>
        {subtitle}
      </p>
    )}
    {actionLabel && actionTo && (
      <Link to={actionTo} className="btn-primary" style={{ padding: '10px 24px', fontSize: 14 }}>
        {actionLabel}
      </Link>
    )}
    {actionLabel && onAction && (
      <button onClick={onAction} className="btn-primary" style={{ padding: '10px 24px', fontSize: 14 }}>
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
