import { useState } from 'react';
import { wasteAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';

const WASTE_TYPES = [
  { value: 'DRY',     label: '📦 Dry Waste',  rate: 2, desc: 'Paper, plastic, metal, glass',         color: 'var(--eco-info)' },
  { value: 'WET',     label: '🍃 Wet Waste',  rate: 1, desc: 'Food scraps, organic matter',           color: 'var(--eco-primary)' },
  { value: 'E_WASTE', label: '💻 E-Waste',     rate: 5, desc: 'Electronics, batteries, wires',        color: 'var(--eco-warning)' },
];

const WasteSubmissionPage = () => {
  const [wasteType,   setWasteType]   = useState('DRY');
  const [weight,      setWeight]      = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [successData, setSuccessData] = useState(null);

  const selected     = WASTE_TYPES.find(t => t.value === wasteType);
  const previewMoney  = weight > 0 ? (parseFloat(weight) * selected.rate).toFixed(2) : '0.00';
  const previewPoints = weight > 0 ? Math.round(parseFloat(weight)) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight || parseFloat(weight) <= 0) { setError('Weight must be greater than 0'); return; }
    if (parseFloat(weight) >= 1000)          { setError('Weight must be less than 1000 kg'); return; }
    setLoading(true); setError(''); setSuccessData(null);
    try {
      const res = await wasteAPI.submit({ wasteType, weight: parseFloat(weight) });
      setSuccessData(res.data);
      setWeight('');
    } catch (err) {
      const d = err.response?.data;
      setError(typeof d === 'object' ? Object.values(d).join(', ') : (d?.error || 'Submission failed.'));
    } finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper">
      <div className="container--md">

        <div className="page-header">
          <div>
            <h1 className="page-header__title">♻️ Submit Waste</h1>
            <p className="page-header__subtitle">Log your waste and earn instant rewards to your wallet.</p>
          </div>
        </div>

        {/* Success */}
        {successData && (
          <Card>
            <Card.Body>
              <div style={{ fontSize: 28, marginBottom: 'var(--space-2)' }}>🎉</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--eco-primary)', marginBottom: 'var(--space-4)' }}>
                Submission Successful!
              </div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
                {[
                  { label: 'Waste Type',   value: successData.wasteType },
                  { label: 'Weight',       value: `${successData.weight}kg` },
                  { label: 'Points Earned',value: `+${successData.rewardPoints}pts` },
                  { label: 'Money Earned', value: `₹${successData.rewardMoney.toFixed(2)}`, hi: true },
                ].map(item => (
                  <div key={item.label} style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--eco-bg)', borderRadius: 'var(--radius-md)', border: item.hi ? '1.5px solid var(--eco-primary)' : '1px solid var(--eco-border)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)', marginBottom: 3, textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontWeight: 600, color: item.hi ? 'var(--eco-primary)' : 'var(--eco-text)' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="action-row">
                <Button variant="primary" size="md" onClick={() => setSuccessData(null)}>Submit Another</Button>
              </div>
            </Card.Body>
          </Card>
        )}

        {!successData && (
          <>
            <Card>
              <Card.Body>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleSubmit}>

                  {/* Waste Type */}
                  <div className="form-group mb-6">
                    <label className="form-label">Select Waste Type</label>
                    <div className="flex-col gap-2">
                      {WASTE_TYPES.map(type => (
                        <button key={type.value} type="button"
                          onClick={() => setWasteType(type.value)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4) var(--space-5)', borderRadius: 'var(--radius-md)', border: `2px solid ${wasteType === type.value ? type.color : 'var(--eco-border)'}`, background: wasteType === type.value ? type.color + '12' : 'var(--eco-surface)', cursor: 'pointer', transition: 'all var(--transition)', textAlign: 'left' }}>
                          <div>
                            <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: wasteType === type.value ? type.color : 'var(--eco-text)' }}>{type.label}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)', marginTop: 2 }}>{type.desc}</div>
                          </div>
                          <span className="badge" style={{ background: type.color + '20', color: type.color, fontSize: 'var(--text-sm)', fontWeight: 700, padding: '4px 12px' }}>
                            ₹{type.rate}/kg
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weight */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="weight">Weight (kg)</label>
                    <input id="weight" type="number" className="form-input" placeholder="e.g. 2.5" min="0.01" max="999" step="0.01"
                      value={weight} onChange={e => { setWeight(e.target.value); setError(''); }} />
                  </div>

                  {/* Preview */}
                  {weight > 0 && (
                    <div className="grid grid--2 mb-5" style={{ gap: 'var(--space-3)', background: 'var(--eco-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--eco-border)' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>You'll Earn</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--eco-primary)' }}>₹{previewMoney}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--eco-text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>Points</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--eco-warning)' }}>+{previewPoints}</div>
                      </div>
                    </div>
                  )}

                  <Button type="submit" variant="primary" size="lg" full loading={loading}>♻️ Submit & Earn Rewards</Button>
                </form>
              </Card.Body>
            </Card>

            {/* Rate Table */}
            <Card>
              <Card.Header title="📊 Reward Rate Table" />
              {WASTE_TYPES.map(type => (
                <div key={type.value} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--eco-border)' }}>
                  <span style={{ fontSize: 'var(--text-sm)' }}>{type.label}</span>
                  <span style={{ fontWeight: 600, color: type.color }}>₹{type.rate} per kg</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-5)' }}>
                <span style={{ fontSize: 'var(--text-sm)' }}>🏆 Points</span>
                <span style={{ fontWeight: 600, color: 'var(--eco-warning)' }}>1 point per kg (all types)</span>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default WasteSubmissionPage;
