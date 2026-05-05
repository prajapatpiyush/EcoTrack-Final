const ConfirmModal = ({
  icon = '🗑️',
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  confirmDanger = true,
  onConfirm,
  onCancel,
}) => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 24,
  }}>
    <div style={{
      background: 'var(--eco-surface)',
      borderRadius: 16,
      padding: '32px 28px',
      maxWidth: 400,
      width: '100%',
      boxShadow: 'var(--shadow-lg)',
      animation: 'fadeIn 0.15s ease',
    }}>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.95) } to { opacity:1; transform:scale(1) } }`}</style>
      <div style={{ fontSize: 36, marginBottom: 12, textAlign: 'center' }}>{icon}</div>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
        color: 'var(--eco-text)',
      }}>
        {title}
      </h3>
      <p style={{
        color: 'var(--eco-text-secondary)',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 1.6,
      }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onCancel}
          className="btn-secondary"
          style={{ flex: 1, height: 42, fontSize: 14 }}
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            height: 42,
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            background: confirmDanger ? '#dc2626' : 'var(--eco-primary)',
            color: 'white',
            fontFamily: 'var(--font-body)',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
