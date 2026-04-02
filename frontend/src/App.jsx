import React, { useMemo, useState } from 'react';

const featureOrder = [
  'Time',
  'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10',
  'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18', 'V19',
  'V20', 'V21', 'V22', 'V23', 'V24', 'V25', 'V26', 'V27', 'V28', 
  'Amount' 
];

const legitSample = {
  Time: 14,
  V1: -5.401257663,
  V2: -5.450147834,
  V3: 1.18630463143652,
  V4: 1.73623880012095,
  V5: 3.04910587764025,
  V6: -1.763405574,
  V7: -1.559737699,
  V8: 0.160841747266769,
  V9: 1.23308974041888,
  V10: 0.345172827050629,
  V11: 0.917229867699146,
  V12: 0.970116716069048,
  V13: -0.266567765,
  V14: -0.479129929,
  V15: -0.526608503,
  V16: 0.47200411177674,
  V17: -0.725480945,
  V18: 0.075081351540202,
  V19: -0.406866573,
  V20: -2.196848025,
  V21: -0.503600329,
  V22: 0.984459785590244,
  V23: 2.45858857639219,
  V24: 0.0421188969891572,
  V25: -0.481630824,
  V26: -0.621272014,
  V27: 0.392053289557744,
  V28: 0.949594245504846,
  Amount: 46.8
};

const fraudSample = {
  Time: 4462,
  V1: -2.303349568,
  V2: 1.75924746,
  V3: -0.359744743,
  V4: 2.33024305053917,
  V5: -0.821628328,
  V6: -0.075787571,
  V7: 0.562319782266954,
  V8: -0.399146578,
  V9: -0.238253368,
  V10: -1.525411627,
  V11: 2.03291215755072,
  V12: -6.560124295,
  V13: 0.0229373234890961,
  V14: -1.470101536,
  V15: -0.698826069,
  V16: -2.282193829,
  V17: -4.781830856,
  V18: -2.615664945,
  V19: -1.334441067,
  V20: -0.430021867,
  V21: -0.294166318,
  V22: -0.932391057,
  V23: 0.172726295799422,
  V24: -0.087329538,
  V25: -0.156114265,
  V26: -0.542627889,
  V27: 0.0395659889264757,
  V28: -0.153028797,
  Amount: 239.93
};

const defaultValues = Object.fromEntries(featureOrder.map((key) => [key, '0']));

defaultValues.Time = '0';
defaultValues.Amount = '0';

function getRiskStyle(level) {
  const normalized = String(level || '').toLowerCase();
  if (normalized === 'high') {
    return {
      background: '#fee2e2',
      color: '#b91c1c',
      border: '1px solid #fecaca',
    };
  }
  if (normalized === 'medium') {
    return {
      background: '#fef3c7',
      color: '#b45309',
      border: '1px solid #fde68a',
    };
  }
  return {
    background: '#dcfce7',
    color: '#15803d',
    border: '1px solid #bbf7d0',
  };
}

function ScoreBar({ label, value }) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: '#475569', fontSize: 14 }}>{label}</span>
        <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{safeValue.toFixed(6)}</span>
      </div>
      <div style={{ height: 10, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
        <div
          style={{
            width: `${safeValue * 100}%`,
            height: '100%',
            background: '#0f172a',
            borderRadius: 9999,
            transition: 'width 0.35s ease',
          }}
        />
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 20,
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
        border: '1px solid #e2e8f0',
        padding: 24,
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, color: '#0f172a' }}>{title}</h2>
        {subtitle ? (
          <p style={{ margin: '8px 0 0', color: '#475569', lineHeight: 1.6 }}>{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default function FraudDetectionFrontend() {
  const [apiUrl, setApiUrl] = useState(
    import.meta.env.VITE_API_URL ||
    "https://credit-card-fraud-and-anomaly-detection.onrender.com/predict"
  );
  const [formData, setFormData] = useState(defaultValues);
  const [jsonInput, setJsonInput] = useState(JSON.stringify(legitSample, null, 2));
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState('form');

  const payloadFromForm = useMemo(() => {
    const payload = {};
    for (const key of featureOrder) {
      payload[key] = Number(formData[key]);
    }
    return payload;
  }, [formData]);

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const loadSample = (sample) => {
    const filled = { ...defaultValues };
    for (const key of featureOrder) {
      filled[key] = String(sample[key] ?? 0);
    }
    setFormData(filled);
    setJsonInput(JSON.stringify(sample, null, 2));
    setError('');
    setResult(null);
  };

  const resetAll = () => {
    setFormData(defaultValues);
    setJsonInput(JSON.stringify(legitSample, null, 2));
    setError('');
    setResult(null);
  };

  const submitPayload = async (payload) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail ? JSON.stringify(data.detail) : 'Prediction failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await submitPayload(payloadFromForm);
  };

  const handleJsonSubmit = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      await submitPayload(parsed);
    } catch {
      setError('Invalid JSON payload');
      setResult(null);
    }
  };

  const riskBadgeStyle = getRiskStyle(result?.risk_level);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '24px 16px 48px',
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gap: 24 }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1.4fr 0.9fr' }}>
          <SectionCard
            title="Fraud & Anomaly Detection Engine"
            subtitle="Submit transaction features to your FastAPI backend and receive fraud probability, anomaly score, final risk score, risk level, and fraud flag."
          >
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', marginBottom: 20 }}>
              {[
                ['Model Stack', 'Random Forest + Isolation Forest'],
                ['Output', 'Risk score + flag'],
                ['Endpoint', apiUrl],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontWeight: 600, color: '#0f172a', wordBreak: 'break-word' }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#334155', fontWeight: 600 }}>
                API URL
              </label>
              <input
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  fontSize: 14,
                }}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <button onClick={() => loadSample(legitSample)} style={buttonSecondaryStyle}>Load Legit Sample</button>
              <button onClick={() => loadSample(fraudSample)} style={buttonSecondaryStyle}>Load Fraud Sample</button>
              <button onClick={resetAll} style={buttonSecondaryStyle}>Reset</button>
            </div>
          </SectionCard>

          <SectionCard title="Prediction Result" subtitle="Live response from the fraud scoring backend.">
            {result ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ color: '#64748b', fontSize: 14 }}>Risk level</span>
                  <span style={{ ...riskBadgeStyle, borderRadius: 9999, padding: '6px 14px', fontWeight: 700, fontSize: 14 }}>
                    {result.risk_level}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Fraud flag</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a' }}>{result.fraud_flag}</div>
                  </div>
                  <div style={{ fontSize: 32 }}>🛡️</div>
                </div>

                <ScoreBar label="Fraud probability" value={result.fraud_probability} />
                <ScoreBar label="Anomaly score" value={result.anomaly_score} />
                <ScoreBar label="Final risk score" value={result.final_risk_score} />

                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 16,
                    padding: 16,
                    marginTop: 12,
                  }}
                >
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#334155', fontSize: 13 }}>
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </>
            ) : (
              <div
                style={{
                  border: '1px dashed #cbd5e1',
                  borderRadius: 16,
                  padding: 20,
                  color: '#64748b',
                  fontSize: 14,
                }}
              >
                No prediction yet. Submit a transaction from the form or paste a raw JSON payload.
              </div>
            )}

            {error ? (
              <div
                style={{
                  marginTop: 16,
                  background: '#fef2f2',
                  color: '#b91c1c',
                  border: '1px solid #fecaca',
                  borderRadius: 16,
                  padding: 14,
                  fontSize: 14,
                }}
              >
                {error}
              </div>
            ) : null}
          </SectionCard>
        </div>

        <SectionCard title="Submit Transaction" subtitle="Use the full input form or paste raw JSON directly.">
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <button
              onClick={() => setInputMode('form')}
              style={inputMode === 'form' ? buttonPrimaryStyle : buttonSecondaryStyle}
            >
              Form Input
            </button>
            <button
              onClick={() => setInputMode('json')}
              style={inputMode === 'json' ? buttonPrimaryStyle : buttonSecondaryStyle}
            >
              Raw JSON
            </button>
          </div>

          {inputMode === 'form' ? (
            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
                {featureOrder.map((key) => (
                  <div key={key}>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#334155', fontWeight: 600 }}>
                      {key}
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 12,
                        border: '1px solid #cbd5e1',
                        outline: 'none',
                        fontSize: 14,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20 }}>
                <button type="submit" disabled={loading} style={buttonPrimaryStyle}>
                  {loading ? 'Scoring...' : 'Predict from Form'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#334155', fontWeight: 600 }}>
                Transaction JSON
              </label>
              <textarea
                rows={20}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 16,
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: 13,
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ marginTop: 20 }}>
                <button onClick={handleJsonSubmit} disabled={loading} style={buttonPrimaryStyle}>
                  {loading ? 'Scoring...' : 'Predict from JSON'}
                </button>
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

const buttonPrimaryStyle = {
  background: '#0f172a',
  color: '#ffffff',
  border: 'none',
  borderRadius: 14,
  padding: '12px 18px',
  fontWeight: 600,
  cursor: 'pointer',
};

const buttonSecondaryStyle = {
  background: '#ffffff',
  color: '#0f172a',
  border: '1px solid #cbd5e1',
  borderRadius: 14,
  padding: '12px 18px',
  fontWeight: 600,
  cursor: 'pointer',
};
