import { useState, useEffect } from 'react';
import { walletAPI, transactionAPI } from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const WalletPage = () => {
  const [wallet,       setWallet]       = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');

  useEffect(() => {
    Promise.all([walletAPI.getWallet(), transactionAPI.getTransactions()])
      .then(([wRes, tRes]) => { setWallet(wRes.data); setTransactions(tRes.data); })
      .catch(() => setError('Failed to load wallet data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage text="Loading wallet..." />;

  return (
    <div className="page-wrapper">
      <div className="container--lg">

        <div className="page-header">
          <div>
            <h1 className="page-header__title">💰 My Wallet</h1>
            <p className="page-header__subtitle">Your earnings from waste submissions.</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Balance Cards */}
        {wallet && (
          <div className="grid grid--2 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={{ background: 'var(--eco-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6) var(--space-8)', color: 'white' }}>
              <div style={{ fontSize: 'var(--text-sm)', opacity: 0.85, marginBottom: 'var(--space-2)', fontWeight: 500 }}>💵 Total Balance</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700 }}>₹{wallet.totalMoney.toFixed(2)}</div>
              <div style={{ fontSize: 'var(--text-xs)', opacity: 0.7, marginTop: 'var(--space-1)' }}>Simulated eco-rewards</div>
            </div>
            <div className="card" style={{ padding: 'var(--space-6) var(--space-8)', border: '1.5px solid var(--eco-warning)' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--eco-warning)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>🏆 Total Points</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--eco-warning)' }}>
                {wallet.totalPoints.toLocaleString()}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)', marginTop: 'var(--space-1)' }}>1 point per kg submitted</div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <Card>
          <Card.Header
            title="Transaction History"
            count={transactions.length}
          />
          {transactions.length === 0 ? (
            <EmptyState icon="📭" title="No transactions yet" subtitle="Submit waste to earn your first reward." />
          ) : (
            transactions.map(txn => {
              const isCredit = txn.type === 'CREDIT';
              return (
                <div key={txn.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--eco-border)' }}>
                  <div className="flex gap-3" style={{ alignItems: 'center' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-sm)', background: isCredit ? 'var(--eco-success-bg)' : 'var(--eco-error-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
                      {isCredit ? '⬆️' : '⬇️'}
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{txn.description}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)', marginTop: 2 }}>
                        {new Date(txn.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: isCredit ? 'var(--eco-primary)' : 'var(--eco-error)' }}>
                      {isCredit ? '+' : '-'}₹{txn.money.toFixed(2)}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-warning)', marginTop: 2 }}>
                      {isCredit ? '+' : '-'}{txn.points}pts
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </Card>
      </div>
    </div>
  );
};

export default WalletPage;
