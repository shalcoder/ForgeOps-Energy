import React, { useState } from 'react';
import {
  ActivityIcon,
  ZapIcon,
  GaugeIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  FilterIcon,
  SearchIcon,
} from '../components/Icons';

type LiveOperationsProps = {
  onNavigate: (view: string, detailId?: string) => void;
};

export function LiveOperationsView({ onNavigate }: LiveOperationsProps) {
  const [selectedArea, setSelectedArea] = useState('Line 2');
  const [activeTab, setActiveTab] = useState<'profile' | 'process_graph'>('profile');

  const processNodes = [
    { id: 'n1', label: 'Raw Material Charge', status: 'normal', power: '24 kW', temp: 'Ambient', anomaly: null },
    { id: 'n2', label: 'Induction Melting (F-01)', status: 'normal', power: '440 kW', temp: '1,420°C', anomaly: null },
    { id: 'n3', label: 'Screw Compressor (CMP-01)', status: 'alert', power: '61 kW', temp: '68°C', anomaly: 'Power +16.8% over baseline' },
    { id: 'n4', label: 'Moulding & Pouring Bank', status: 'normal', power: '38 kW', temp: '32°C', anomaly: null },
    { id: 'n5', label: 'Final Quality Inspection', status: 'normal', power: '12 kW', temp: 'Ambient', anomaly: null },
  ];

  const assetStates = [
    { id: 'CMP-01', name: '75 kW Screw Compressor', state: 'alert', label: 'Power elevated (61 kW)', power: 61, nominal: 49, line: 'Line 2' },
    { id: 'FURN-02', name: '350 kW Holding Furnace', state: 'warning', label: 'Holding idle loss', power: 110, nominal: 98, line: 'Line 2' },
    { id: 'FURN-01', name: '500 kW Melting Furnace', state: 'normal', label: 'Nominal melting cycle', power: 440, nominal: 445, line: 'Line 1' },
    { id: 'MULL-01', name: '45 kW Green Sand Muller', state: 'normal', label: 'Batch cycling', power: 38, nominal: 38, line: 'Line 2' },
    { id: 'PUMP-03', name: '30 kW Cooling Pump', state: 'normal', label: 'Continuous flow', power: 24, nominal: 24, line: 'Utilities' },
  ];

  return (
    <div className="page-container">
      {/* ── Page Header ── */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">OPERATIONS</span>
            <span>Demonstration telemetry workspace</span>
          </div>
          <h1 className="page-title">Operations Demo</h1>
          <p className="page-subtitle">
            Synthetic Belgaum foundry telemetry for exploring the workflow. No live meters, PLCs, or plant controls are connected.
          </p>
        </div>

        <div className="header-controls-group">
          <div className="live-status-pill">
            <span className="pulsing-indicator" />
            <strong style={{ color: '#b7791f', fontSize: '11.5px' }}>DEMO PLAYBACK · NOT LIVE TELEMETRY</strong>
          </div>
        </div>
      </header>

      {/* ── Scope & View Controls Bar ── */}
      <div className="card-clean" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Scope:</span>
          <button className={`btn-subtab ${selectedArea === 'All' ? 'active' : ''}`} onClick={() => setSelectedArea('All')}>All Plant (6)</button>
          <button className={`btn-subtab ${selectedArea === 'Line 1' ? 'active' : ''}`} onClick={() => setSelectedArea('Line 1')}>Moulding Line 1</button>
          <button className={`btn-subtab ${selectedArea === 'Line 2' ? 'active' : ''}`} onClick={() => setSelectedArea('Line 2')}>Assembly Line 2 (Anomaly)</button>
          <button className={`btn-subtab ${selectedArea === 'Utilities' ? 'active' : ''}`} onClick={() => setSelectedArea('Utilities')}>Utilities Bank</button>
        </div>

        <div className="segmented-nav">
          <button className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <ZapIcon size={13} />
            <span>Energy Profile</span>
          </button>
          <button className={`nav-tab-btn ${activeTab === 'process_graph' ? 'active' : ''}`} onClick={() => setActiveTab('process_graph')}>
            <ActivityIcon size={13} />
            <span>Line 2 Process Graph</span>
          </button>
        </div>
      </div>

      {/* ── Quick KPIs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
        <div className="card-clean" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Active Power</span>
            <span className="provenance-badge provenance-simulated">Demo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--text-primary)' }}>482</strong>
            <small style={{ color: 'var(--text-muted)' }}>kW</small>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '10.5px', color: 'var(--text-muted)' }}>Aggregate across 6 active load centers</p>
        </div>

        <div className="card-clean" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Demo SEC</span>
            <span className="provenance-badge provenance-simulated">Demo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--text-primary)' }}>9.8</strong>
            <small style={{ color: 'var(--text-muted)' }}>kWh/t</small>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '10.5px', color: '#5e7e60', fontWeight: 600 }}>↓ 8.4% vs 10.7 operating baseline</p>
        </div>

        <div className="card-clean" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Hourly Throughput</span>
            <span className="provenance-badge provenance-simulated">Demo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--text-primary)' }}>10.2</strong>
            <small style={{ color: 'var(--text-muted)' }}>t/h</small>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '10.5px', color: 'var(--text-muted)' }}>Target: 10.0 t/h (100% capacity preserved)</p>
        </div>
      </div>

      {/* ── Main Panel: Energy Profile Chart or Process Graph ── */}
      {activeTab === 'profile' && (
        <div className="card-clean" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 500, color: 'var(--text-primary)' }}>
                Sample Plant Energy Profile (24 Hours)
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                Time-series power draw, baseline envelope, and detected anomaly correlation
              </p>
            </div>
            <span className="provenance-badge provenance-simulated">Synthetic sample series</span>
          </div>

          <div style={{ width: '100%', height: '220px', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 700 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="liveFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bd6249" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#bd6249" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              <line x1="30" y1="40" x2="680" y2="40" stroke="var(--glass-border)" strokeDasharray="3 3" />
              <line x1="30" y1="90" x2="680" y2="90" stroke="var(--glass-border)" strokeDasharray="3 3" />
              <line x1="30" y1="140" x2="680" y2="140" stroke="var(--glass-border)" strokeDasharray="3 3" />
              <line x1="30" y1="180" x2="680" y2="180" stroke="var(--glass-border)" />

              <text x="5" y="44" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">600 kW</text>
              <text x="5" y="94" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">450 kW</text>
              <text x="5" y="144" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">300 kW</text>

              {/* Baseline band */}
              <rect x="30" y="85" width="650" height="25" fill="rgba(94, 126, 96, 0.12)" stroke="rgba(94, 126, 96, 0.3)" strokeDasharray="4 2" />

              {/* Area graph */}
              <polygon
                points="30,120 80,115 140,110 200,95 260,92 320,88 380,48 440,46 500,85 560,90 620,88 680,85 680,180 30,180"
                fill="url(#liveFill)"
              />

              {/* Line graph */}
              <polyline
                points="30,120 80,115 140,110 200,95 260,92 320,88 380,48 440,46 500,85 560,90 620,88 680,85"
                fill="none"
                stroke="#bd6249"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Anomaly marker */}
              <circle cx="410" cy="47" r="5" fill="#bd6249" stroke="#fff" strokeWidth="2" />
              <text x="420" y="45" fill="#bd6249" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">CMP-01 Anomaly Excursion</text>

              <text x="30" y="195" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">00:00</text>
              <text x="200" y="195" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">06:00</text>
              <text x="380" y="195" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">12:00 (Anomaly)</text>
              <text x="540" y="195" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">18:00</text>
              <text x="660" y="195" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">Now</text>
            </svg>
          </div>
        </div>
      )}

      {/* ── Process Graph View (Section 9 of Spec) ── */}
      {activeTab === 'process_graph' && (
        <div className="card-clean" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 500, color: 'var(--text-primary)' }}>
              Assembly Line 2 Process Topology
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
              Sequential manufacturing stages with live equipment status, active power, and operating anomalies.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '12px' }}>
            {processNodes.map((node, index) => (
              <React.Fragment key={node.id}>
                <div
                  style={{
                    flex: '1 0 160px',
                    padding: '14px',
                    borderRadius: '8px',
                    border: node.status === 'alert' ? '1px solid var(--alert-border)' : '1px solid var(--glass-border)',
                    background: node.status === 'alert' ? 'var(--alert-subtle)' : 'var(--bg-ground)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => node.id === 'n3' && onNavigate('assets', 'CMP-01')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>STEP 0{index + 1}</span>
                    <span className={`loop-dot ${node.status === 'alert' ? 'active' : 'green'}`} />
                  </div>
                  <strong style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.3 }}>{node.label}</strong>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginTop: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Power:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{node.power}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Metric:</span>
                    <span>{node.temp}</span>
                  </div>
                  {node.anomaly && (
                    <span style={{ fontSize: '9.5px', color: '#bd6249', fontWeight: 650, marginTop: '4px' }}>
                      ⚠ {node.anomaly}
                    </span>
                  )}
                </div>

                {index < processNodes.length - 1 && (
                  <ArrowRightIcon size={14} className="text-muted" style={{ flexShrink: 0 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* ── Two Columns: Asset State Table & Active Anomalies Feed ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '14px' }}>
        {/* Asset State Table */}
        <div className="card-clean" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 650, color: 'var(--text-primary)' }}>Submetered Asset Fleet</h3>
            <button className="text-action" onClick={() => onNavigate('assets')}>
              All assets &rarr;
            </button>
          </div>

          <div className="clean-table-wrap">
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Status</th>
                  <th>Power (kW)</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assetStates.map((asset) => (
                  <tr key={asset.id}>
                    <td>
                      <strong>{asset.id}</strong>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{asset.name}</div>
                    </td>
                    <td>
                      <span className="provenance-badge provenance-simulated">
                        {asset.state.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono">
                        <strong style={{ color: asset.power > asset.nominal ? '#bd6249' : 'inherit' }}>{asset.power}</strong>
                        <small style={{ color: 'var(--text-muted)' }}> / {asset.nominal} kW</small>
                      </span>
                    </td>
                    <td><span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{asset.line}</span></td>
                    <td>
                      <button className="text-action" onClick={() => onNavigate('assets', asset.id)}>
                        Inspect &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Anomalies Feed */}
        <div className="card-clean" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 650, color: 'var(--text-primary)' }}>Active Anomalies</h3>
            <span className="provenance-badge provenance-simulated">System 1 fallback</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px', borderRadius: '7px', border: '1px solid var(--alert-border)', background: 'var(--alert-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>CMP-01 Power Draw +16.8%</strong>
                <span style={{ fontSize: '9.5px', color: '#bd6249', fontWeight: 700 }}>CRITICAL</span>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Observed 61 kW vs 49 kW baseline without corresponding pressure drop. Suspected manifold leak.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>14 mins ago • Feeder F-03</span>
                <button className="text-action" onClick={() => onNavigate('investigations', 'INV-1024')}>
                  Investigate &rarr;
                </button>
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: '7px', border: '1px solid var(--warning-border)', background: 'var(--warning-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>FURN-02 Idle Thermal Bleed</strong>
                <span style={{ fontSize: '9.5px', color: '#a8793e', fontWeight: 700 }}>WARNING</span>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Holding power 110 kW (+12%) during standby between ladle pours.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>1 hr ago • Feeder F-01B</span>
                <button className="text-action" onClick={() => onNavigate('opportunities', 'opp-3')}>
                  Opportunity &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
