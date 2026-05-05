const Loader = ({ text = 'Loading...', size = 36, fullPage = false }) => {
  const content = (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: size,
        height: size,
        border: `3px solid var(--eco-border)`,
        borderTopColor: 'var(--eco-primary)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        margin: '0 auto',
      }} />
      {text && (
        <div style={{
          color: 'var(--eco-text-secondary)',
          fontSize: 14,
          marginTop: 12,
          fontFamily: 'var(--font-body)',
        }}>
          {text}
        </div>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 64px)',
        background: 'var(--eco-bg)',
      }}>
        {content}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px 24px',
    }}>
      {content}
    </div>
  );
};

export default Loader;
