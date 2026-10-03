import React from 'react';
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ZapIcon,
  ActivityIcon,
  ClockIcon,
  ShieldCheckIcon,
  TrendingDownIcon,
  GaugeIcon,
} from '../components/Icons';

type OverviewProps = {
  onNavigate: (view: string, detailId?: string) => void;
};

export function OverviewView({ onNavigate }: OverviewProps) {
  return (
    <div className="overview-page">
      {/* ── Above the Fold: Plant Status & KPI Cards ── */}
      <header className="overview-heading">
        <div>
          <p className="eyebrow">PLANT STATUS <span>·</span> BELGAUM FOUNDRY COMPLEX</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
            <h1>Belgaum Foundry</h1>
            <span style={{ fontSize: '13px', color: '#5e7e60', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span className="status-dot" style={{ background: '#5e7e60' }} /> Plant operating normally
            </span>
          </div>
          <p className="overview-subtitle">
            Energy performance <strong>9.8 kWh/t</strong> <span style={{ color: '#5e7e60', fontWeight: 600 }}>↓ 8.4% vs baseline</span> • Today's operational cycle
          </p>
        </div>

        <div className="overview-date">
          <span className="status-dot" /> Edge connection <strong>Live</strong>
        </div>
      </header>

      {/* ── 4 Compact KPI Cards with Data Provenance ── */}
      <section className="overview-metrics" aria-label="Plant performance KPIs">
        <article className="overview-metric">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Specific Energy (SEC)</span>
            <span className="provenance-badge provenance-measured">Measured</span>
          </div>
          <div>
            <strong>9.8</strong>
            <small>kWh/t</small>
          </div>
          <p><span className="metric-change" style={{ color: '#5e7e60' }}>-8.4%</span> from 10.7 kWh/t target</p>
        </article>

        <article className="overview-metric">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Energy Cost (Today)</span>
            <span className="provenance-badge provenance-modelled">Modelled</span>
          </div>
          <div>
            <strong>₹1.84L</strong>
            <small>est.</small>
          </div>
          <p>HT-2A industrial tariff at ₹7.8/kWh</p>
        </article>

        <article className="overview-metric">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Daily Throughput</span>
            <span className="provenance-badge provenance-measured">Measured</span>
          </div>
          <div>
            <strong>762</strong>
            <small>t/day</small>
          </div>
          <p>Moulding Lines 1 & 2 full capacity</p>
        </article>

        <article className="overview-metric">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Metallurgical Quality</span>
            <span className="provenance-badge provenance-verified">Verified</span>
          </div>
          <div>
            <strong>97.6%</strong>
            <small>first-pass</small>
          </div>
          <p>Above 97.0% plant minimum guardrail</p>
        </article>
      </section>

      {/* ── Today's Pipeline at a Glance ── */}
      <div className="pipeline-pulse-strip">
        <button className="pipeline-pulse-item" onClick={() => onNavigate('opportunities')}>
          <span className="pipeline-pulse-num alert-col">12</span>
          <span className="pipeline-pulse-label">Opportunities</span>
        </button>
        <span className="pipeline-pulse-divider" />
        <button className="pipeline-pulse-item" onClick={() => onNavigate('investigations')}>
          <span className="pipeline-pulse-num cyan-col">3</span>
          <span className="pipeline-pulse-label">Investigating</span>
        </button>
        <span className="pipeline-pulse-divider" />
        <button className="pipeline-pulse-item" onClick={() => onNavigate('actions')}>
          <span className="pipeline-pulse-num amber-col">4</span>
          <span className="pipeline-pulse-label">Awaiting decision</span>
        </button>
        <span className="pipeline-pulse-divider" />
        <button className="pipeline-pulse-item" onClick={() => onNavigate('verification')}>
          <span className="pipeline-pulse-num green-col">₹3.8L</span>
          <span className="pipeline-pulse-label">Savings / month</span>
        </button>
        <span className="pipeline-pulse-divider" />
        <button className="pipeline-pulse-item" onClick={() => onNavigate('verification')}>
          <span className="pipeline-pulse-num indigo-col">2</span>
          <span className="pipeline-pulse-label">Under verification</span>
        </button>
      </div>

      {/* ── Section 2: Active Attention (What Needs Attention?) ── */}
      <section style={{ marginTop: '28px' }}>
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">ACTION REQUIRED</p>
            <h2>Needs attention</h2>
          </div>
          <span className="sidebar-count" style={{ marginLeft: 0, padding: '2px 8px', height: 'auto', fontSize: '11px' }}>2 items</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '14px' }}>
          {/* Attention Card 1: CMP-01 */}
          <div className="attention-card">
            <div className="attention-card-top">
              <div>
                <span className="kicker-tag" style={{ border: '1px solid #ebd0c9', background: '#f8ebe8', color: '#a84d39', fontSize: '9px' }}>
                  ANOMALY DETECTED • CMP-01
                </span>
                <h3 className="attention-card-title" style={{ marginTop: '5px' }}>Compressor CMP-01</h3>
                <p className="attention-card-sub">Energy consumption 16.8% above operating baseline</p>
              </div>
              <span className="provenance-badge provenance-measured">Detected 14m ago</span>
            </div>

            <div className="attention-meta-strip">
              <span>Demand: <strong>Normal</strong></span>
              <span>Pressure: <strong>Normal (6.5 bar)</strong></span>
              <span>Power: <strong style={{ color: '#bd6249' }}>Elevated (61 kW)</strong></span>
              <span>Confidence: <strong>0.91</strong></span>
            </div>

            <div className="attention-card-footer">
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                System 1 fast triage confirmed safety interlocks pass.
              </span>
              <button className="btn-primary-action" style={{ padding: '6px 14px', fontSize: '11.5px' }} onClick={() => onNavigate('investigations', 'INV-1024')}>
                <span>Investigate</span>
                <ArrowRightIcon size={13} />
              </button>
            </div>
          </div>

          {/* Attention Card 2: F-02 */}
          <div className="attention-card warning-level">
            <div className="attention-card-top">
              <div>
                <span className="kicker-tag" style={{ border: '1px solid #e8dec7', background: '#f7f3ea', color: '#796131', fontSize: '9px' }}>
                  OPPORTUNITY • FURN-02
                </span>
                <h3 className="attention-card-title" style={{ marginTop: '5px' }}>Furnace F-02</h3>
                <p className="attention-card-sub">Holding energy rising during idle periods</p>
              </div>
              <span className="provenance-badge provenance-estimated">1h ago</span>
            </div>

            <div className="attention-meta-strip">
              <span>Status: <strong>Standby</strong></span>
              <span>Temp: <strong>1,380°C</strong></span>
              <span>Idle Draw: <strong style={{ color: '#a8793e' }}>110 kW (+12%)</strong></span>
              <span>Savings: <strong>₹26k/mo</strong></span>
            </div>

            <div className="attention-card-footer">
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Lid seal thermal bleed identified by thermography telemetry.
              </span>
              <button className="btn-secondary-action" style={{ padding: '6px 14px', fontSize: '11.5px' }} onClick={() => onNavigate('opportunities', 'opp-3')}>
                <span>View opportunity</span>
                <ArrowRightIcon size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Energy Opportunities Summary ── */}
      <section style={{ marginTop: '34px' }}>
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">OPTIMIZATION PIPELINE</p>
            <h2>Energy opportunities</h2>
          </div>
          <button className="text-action" onClick={() => onNavigate('opportunities')}>
            View all 12 opportunities <ArrowRightIcon size={14} />
          </button>
        </div>

        {/* 4 Pipeline Stat Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px', marginBottom: '14px' }}>
          <div style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identified</span>
            <div style={{ fontSize: '18px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '2px' }}>12 opportunities</div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Potential savings</span>
            <div style={{ fontSize: '18px', fontWeight: 650, color: '#5e7e60', marginTop: '2px' }}>₹3.8L <small style={{ fontSize: '11px', fontWeight: 500 }}>/ month</small></div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Awaiting decision</span>
            <div style={{ fontSize: '18px', fontWeight: 650, color: '#bd6249', marginTop: '2px' }}>4 ready</div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Under verification</span>
            <div style={{ fontSize: '18px', fontWeight: 650, color: '#5c438f', marginTop: '2px' }}>2 active</div>
          </div>
        </div>

        {/* Opportunity Table */}
        <div className="clean-table-wrap">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Opportunity</th>
                <th>Asset</th>
                <th>Current Deviation</th>
                <th>Impact</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Compressor pressure optimization</strong>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Tune setpoint 7.2 &rarr; 6.5 bar with zero throughput loss</div>
                </td>
                <td><span className="font-mono">CMP-01</span></td>
                <td><span style={{ color: '#bd6249', fontWeight: 600 }}>+16.8%</span></td>
                <td><strong style={{ color: '#5e7e60' }}>₹48,000/mo</strong></td>
                <td><span className="provenance-badge provenance-modelled">Investigating</span></td>
                <td>
                  <button className="text-action" onClick={() => onNavigate('investigations', 'INV-1024')}>
                    Investigate &rarr;
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Pneumatic distribution leakage</strong>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Braided coupling leak on Line 2 Moulding bank</div>
                </td>
                <td><span className="font-mono">Line 2</span></td>
                <td><span style={{ color: '#bd6249', fontWeight: 600 }}>+11.4%</span></td>
                <td><strong style={{ color: '#5e7e60' }}>₹61,000/mo</strong></td>
                <td><span className="provenance-badge provenance-simulated">Ready</span></td>
                <td>
                  <button className="text-action" onClick={() => onNavigate('opportunities', 'opp-2')}>
                    View &rarr;
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Furnace idle holding losses</strong>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Thermal lid seal replacement and standby power clamp</div>
                </td>
                <td><span className="font-mono">F-02</span></td>
                <td><span style={{ color: '#a8793e', fontWeight: 600 }}>+8.1%</span></td>
                <td><strong style={{ color: '#5e7e60' }}>₹26,000/mo</strong></td>
                <td><span className="provenance-badge provenance-estimated">Simulated</span></td>
                <td>
                  <button className="text-action" onClick={() => onNavigate('opportunities', 'opp-3')}>
                    Review &rarr;
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 4: Performance Trend with Expected Baseline Band ── */}
      <section style={{ marginTop: '34px' }}>
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">HISTORICAL TREND</p>
            <h2>Specific energy vs production baseline</h2>
          </div>
          <span className="section-aside">Past 7 days operating envelope</span>
        </div>

        <div className="card-clean" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '2px', background: '#bd6249' }} /> Actual SEC (kWh/t)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '8px', background: 'rgba(94, 126, 96, 0.25)', border: '1px solid rgba(94, 126, 96, 0.5)' }} /> Expected Baseline Band (9.2–10.4)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#bd6249' }} /> Anomaly Excursion
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#5e7e60' }} /> Verified Intervention
              </span>
            </div>

            <span className="provenance-badge provenance-measured">ISO 50001 Baseline</span>
          </div>

          {/* SVG Trend Band Chart */}
          <div style={{ width: '100%', height: '200px', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 700 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5e7e60" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#5e7e60" stopOpacity="0.08" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="40" y1="30" x2="680" y2="30" stroke="var(--glass-border)" strokeDasharray="3 3" />
              <line x1="40" y1="75" x2="680" y2="75" stroke="var(--glass-border)" strokeDasharray="3 3" />
              <line x1="40" y1="120" x2="680" y2="120" stroke="var(--glass-border)" strokeDasharray="3 3" />
              <line x1="40" y1="160" x2="680" y2="160" stroke="var(--glass-border)" />

              {/* Y Axis labels */}
              <text x="10" y="34" fill="var(--text-muted)" fontSize="9.5" fontFamily="var(--font-mono)">12.0</text>
              <text x="10" y="79" fill="var(--text-muted)" fontSize="9.5" fontFamily="var(--font-mono)">10.5</text>
              <text x="10" y="124" fill="var(--text-muted)" fontSize="9.5" fontFamily="var(--font-mono)">9.0</text>
              <text x="10" y="164" fill="var(--text-muted)" fontSize="9.5" fontFamily="var(--font-mono)">7.5</text>

              {/* Baseline Expected Band (9.2 to 10.4) */}
              <polygon
                points="40,80 140,82 240,78 340,85 440,80 540,76 680,78 680,115 540,112 440,116 340,120 240,114 140,116 40,115"
                fill="url(#bandGradient)"
              />

              {/* Actual Measured SEC Line */}
              <polyline
                points="40,95 140,92 240,88 340,42 440,48 540,105 680,108"
                fill="none"
                stroke="#bd6249"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Anomaly Excursion Point (Day 4: 11.2 kWh/t) */}
              <circle cx="340" cy="42" r="5" fill="#bd6249" stroke="#fff" strokeWidth="2" />
              <text x="348" y="38" fill="#bd6249" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">+16.8% Spike (11.2)</text>

              {/* Intervention / Verification Marker (Day 6: 9.8 kWh/t) */}
              <circle cx="540" cy="105" r="5" fill="#5e7e60" stroke="#fff" strokeWidth="2" />
              <text x="548" y="102" fill="#5e7e60" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">Intervention (-1.2 kWh/t)</text>

              {/* X Axis days */}
              <text x="40" y="176" fill="var(--text-muted)" fontSize="9.5" fontFamily="var(--font-sans)">Mon</text>
              <text x="140" y="176" fill="var(--text-muted)" fontSize="9.5" fontFamily="var(--font-sans)">Tue</text>
              <text x="240" y="176" fill="var(--text-muted)" fontSize="9.5" fontFamily="var(--font-sans)">Wed</text>
              <text x="340" y="176" fill="var(--text-muted)" fontSize="9.5" fontFamily="var(--font-sans)">Thu</text>
              <text x="440" y="176" fill="var(--text-muted)" fontSize="9.5" fontFamily="var(--font-sans)">Fri</text>
              <text x="540" y="176" fill="var(--text-muted)" fontSize="9.5" fontFamily="var(--font-sans)">Sat</text>
              <text x="660" y="176" fill="var(--text-muted)" fontSize="9.5" fontFamily="var(--font-sans)">Today</text>
            </svg>
          </div>
        </div>
      </section>

      {/* ── Section 5: Closed-Loop Status (Section 7 of Spec) ── */}
      <section style={{ marginTop: '34px', marginBottom: '20px' }}>
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">AUTONOMOUS CYCLE</p>
            <h2>ForgeOps decision loop</h2>
          </div>
          <span className="section-aside">Closed-loop sense &rarr; verify state</span>
        </div>

        <div className="loop-status-grid">
          <div className="loop-status-item">
            <div className="loop-status-dot-label">
              <span className="loop-dot green" />
              <span>Detecting</span>
            </div>
            <div className="loop-status-count">12 events / hr</div>
          </div>

          <div className="loop-status-item">
            <div className="loop-status-dot-label">
              <span className="loop-dot active" />
              <span>Investigating</span>
            </div>
            <div className="loop-status-count">3 cases open</div>
          </div>

          <div className="loop-status-item">
            <div className="loop-status-dot-label">
              <span className="loop-dot amber" />
              <span>Simulating</span>
            </div>
            <div className="loop-status-count">5 scenarios</div>
          </div>

          <div className="loop-status-item">
            <div className="loop-status-dot-label">
              <span className="loop-dot active" />
              <span>Awaiting approval</span>
            </div>
            <div className="loop-status-count">2 ready for gate</div>
          </div>

          <div className="loop-status-item">
            <div className="loop-status-dot-label">
              <span className="loop-dot green" />
              <span>Executing</span>
            </div>
            <div className="loop-status-count">1 work order</div>
          </div>

          <div className="loop-status-item">
            <div className="loop-status-dot-label">
              <span className="loop-dot green" />
              <span>Verifying</span>
            </div>
            <div className="loop-status-count">2 IPMVP tests</div>
          </div>
        </div>
      </section>
    </div>
  );
}
