/**
 * Card system — standardized card layout for EcoTrack.
 *
 * Usage:
 *   <Card>
 *     <Card.Header title="My Card" action={<Button>Add</Button>} count={5} />
 *     <Card.Body>content</Card.Body>
 *     <Card.Footer>footer</Card.Footer>
 *   </Card>
 */

const Card = ({ children, hover = false, className = '', style }) => (
  <div
    className={`card ${hover ? 'card--hover' : ''} ${className}`}
    style={style}
  >
    {children}
  </div>
);

Card.Header = ({ title, subtitle, action, count, icon }) => (
  <div className="card__header">
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
      <div>
        <div>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 12, fontWeight: 400, color: 'var(--eco-text-muted)', marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {count !== undefined && (
        <span className="chip chip--count">{count}</span>
      )}
      {action}
    </div>
  </div>
);

Card.Body = ({ children, padding = 'default' }) => (
  <div className={padding === 'sm' ? 'card__body-sm' : 'card__body'}>
    {children}
  </div>
);

Card.Footer = ({ children }) => (
  <div className="card__footer">{children}</div>
);

export default Card;
