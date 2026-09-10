import { useMemo, useState } from 'react';
import {
  decarbonisationStats,
  energyWasteBreakdown,
  incidents,
  topAnomalies,
} from '../mockData';
import { useWorkbenchData } from '../WorkbenchDataContext';

const formatInr = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
};

export function HomeDashboard({ onOpenWorkbench }: { onOpenWorkbench: () => void }) {
  const { data, loading } = useWorkbenchData();
  const incidentList = [data.incident, ...incidents.slice(1)];
  const [plantFilter, setPlantFilter] = useState('All plants');
  const [statusFilter, setStatusFilter] = useState('All statuses');

  const filteredIncidents = useMemo(() => {
    return incidentList.filter((incident) => {
      const matchPlant = plantFilter === 'All plants' || incident.plant.toLowerCase().includes(plantFilter.toLowerCase());
      const matchStatus = statusFilter === 'All statuses' || incident.status === statusFilter;
      return matchPlant && matchStatus;
    });
  }, [incidentList, plantFilter, statusFilter]);

  return (
    <main className="dashboard-page energy-dashboard-page">
      {/* Top Banner / National Manufacturing Context (Image 1 Header) */}
      <section className="energy-banner">
        <div className="energy-banner-header">
          <div>
            <div className="energy-pill-tag">Smart Manufacturing · Challenge 04</div>
            <h1>ForgeOps Energy Decision Intelligence</h1>
            <p className="energy-subtag">Agentic AI for Industrial Energy & Process Efficiency · Indian SME Retrofit</p>
          </div>
          <div className="energy-national-stats">
            <div className="national-stat-chip">
              <span className="chip-icon">🏭</span>
              <div>
                <strong>35–40%</strong>
                <small>of India's energy consumed by industry</small>
              </div>
            </div>
            <div className="national-stat-chip">
              <span className="chip-icon">₹</span>
              <div>
                <strong>15–30%</strong>
                <small>of SME production costs from energy</small>
              </div>
            </div>
            <div className="national-stat-chip alert-chip">
              <span className="chip-icon">📉</span>
              <div>
                <strong>Real-Time Gap</strong>
                <small>Energy monitoring missing in 70%+ SMEs</small>
              </div>
            </div>
          </div>
        </div>

        {/* What Our Solution Achieves Grid */}
        <div className="solution-pillars">
          <div className="pillar-item">
            <span className="pillar-icon">🎯</span>
            <div>
              <strong>Reduce Specific Energy (SEC)</strong>
              <p>Cut kWh per ton/unit without reducing quality or throughput.</p>
            </div>
          </div>
          <div className="pillar-item">
            <span className="pillar-icon">👁️</span>
            <div>
              <strong>Enable Real-Time Visibility</strong>
              <p>Submetering, machine health, and power quality across legacy & modern assets.</p>
            </div>
          </div>
          <div className="pillar-item">
            <span className="pillar-icon">🌿</span>
            <div>
              <strong>Support Decarbonisation</strong>
              <p>Scope 1 & 2 carbon tracking and rooftop renewable load-shifting.</p>
            </div>
          </div>
          <div className="pillar-item">
            <span className="pillar-icon">⚡</span>
            <div>
              <strong>Strengthen SME Competitiveness</strong>
              <p>Fast payback (1–3 months) with low-cost edge retrofit (₹20k–₹60k).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Primary KPI Grid (Energy Overview matching Image 1) */}
      <section className="metric-grid energy-kpi-grid" aria-label="Energy KPIs">
        <article className="metric-card metric-critical energy-card">
          <div className="metric-topline">
            <span>Specific Energy (SEC)</span>
            <span className="metric-delta negative">↓ 12.9% vs Base</span>
          </div>
          <div className="kpi-main-val">
            <strong>7.40</strong>
            <span className="unit-label">kWh / unit</span>
          </div>
          <div className="kpi-subline">
            <span>Target: <strong>8.50</strong> kWh/unit</span>
            <span className="kpi-status-badge">Optimization Active</span>
          </div>
          <div className="mini-sparkline" aria-hidden="true">
            <svg viewBox="0 0 160 30" className="sparkline-svg">
              <path
                d="M 0 24 Q 20 22, 40 18 T 80 20 T 120 12 T 160 8"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              <line x1="0" y1="20" x2="160" y2="20" stroke="#94a3b8" strokeDasharray="3,3" strokeWidth="1" />
            </svg>
          </div>
          <small className="kpi-footnote">Induction Line 2 · Foundry Cluster Belgaum</small>
        </article>

        <article className="metric-card energy-card">
          <div className="metric-topline">
            <span>Energy Today</span>
            <span className="metric-delta positive">↓ 8.7% vs Yesterday</span>
          </div>
          <div className="kpi-main-val">
            <strong>7,400</strong>
            <span className="unit-label">kWh</span>
          </div>
          <div className="kpi-subline">
            <span>Yesterday: 8,500 kWh</span>
            <span className="positive-text">Saved: 1,100 kWh</span>
          </div>
          <div className="progress-track">
            <i style={{ width: '87%', background: '#10b981' }} />
          </div>
          <small className="kpi-footnote">Cost run-rate: ₹59,200 (Saved ₹8,800 today)</small>
        </article>

        <article className="metric-card energy-card">
          <div className="metric-topline">
            <span>Production Output</span>
            <span className="metric-delta neutral">0% impact (Preserved)</span>
          </div>
          <div className="kpi-main-val">
            <strong>1,000</strong>
            <span className="unit-label">units / 10.2 ton</span>
          </div>
          <div className="kpi-subline">
            <span>Shift Target: 1,000 units</span>
            <span className="badge-ok">Constraint Met</span>
          </div>
          <div className="progress-track">
            <i style={{ width: '100%', background: '#38bdf8' }} />
          </div>
          <small className="kpi-footnote">Throughput ≥ Baseline (Hard constraint maintained)</small>
        </article>

        <article className="metric-card energy-card">
          <div className="metric-topline">
            <span>Quality Yield</span>
            <span className="metric-delta positive">↑ 0.1% vs Yesterday</span>
          </div>
          <div className="kpi-main-val">
            <strong>97.9<span>%</span></strong>
            <span className="unit-label">Good casting yield</span>
          </div>
          <div className="kpi-subline">
            <span>Threshold: 97.0%</span>
            <span className="badge-ok">Zero Rejects</span>
          </div>
          <div className="progress-track">
            <i style={{ width: '97.9%', background: '#3b82f6' }} />
          </div>
          <small className="kpi-footnote">Quality ≥ Baseline (Hard constraint preserved)</small>
        </article>

        <article className="metric-card energy-card">
          <div className="metric-topline">
            <span>Carbon Intensity</span>
            <span className="metric-delta positive">↓ 9.4% CO₂</span>
          </div>
          <div className="kpi-main-val">
            <strong>0.81</strong>
            <span className="unit-label">tCO₂e / day</span>
          </div>
          <div className="kpi-subline">
            <span>Renewable share: <strong>18.2%</strong></span>
            <span>Target: 30%</span>
          </div>
          <div className="progress-track">
            <i style={{ width: '60.6%', background: '#10b981' }} />
          </div>
          <small className="kpi-footnote">Scope 1 (0.18t) + Scope 2 (0.63t)</small>
        </article>
      </section>

      {/* Analytics Mid-Section (Trend + Waste Donut + Top Anomalies + Decarbonisation) */}
      <section className="energy-analytics-section">
        {/* Left: 7-Day SEC Trend Curve */}
        <div className="analytics-card trend-card">
          <div className="card-header-flex">
            <div>
              <h3>Energy Trend</h3>
              <p className="card-sub">Specific Energy Consumption (kWh/unit) vs Baseline SEC</p>
            </div>
            <div className="trend-legend">
              <span className="legend-item"><i className="legend-dot live-sec" /> Daily SEC</span>
              <span className="legend-item"><i className="legend-dot base-sec" /> Baseline SEC (8.50)</span>
            </div>
          </div>
          <div className="trend-chart-container">
            <svg viewBox="0 0 460 170" className="trend-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="secAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="440" y2="20" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="40" y1="55" x2="440" y2="55" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="40" y1="90" x2="440" y2="90" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="40" y1="125" x2="440" y2="125" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />

              {/* Y Axis Labels */}
              <text x="15" y="24" className="axis-text">10.0</text>
              <text x="15" y="59" className="axis-text">8.5</text>
              <text x="15" y="94" className="axis-text">6.0</text>
              <text x="15" y="129" className="axis-text">4.0</text>

              {/* Baseline Reference Line at 8.50 */}
              <line x1="40" y1="55" x2="440" y2="55" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,4" />

              {/* Shaded Area Under SEC */}
              <path
                d="M 60 48 L 120 40 L 180 32 L 240 75 L 300 82 L 360 88 L 420 90 L 420 140 L 60 140 Z"
                fill="url(#secAreaGrad)"
              />

              {/* SEC Trend Line */}
              <path
                d="M 60 48 L 120 40 L 180 32 L 240 75 L 300 82 L 360 88 L 420 90"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Points */}
              <circle cx="60" cy="48" r="4" fill="#10b981" />
              <circle cx="120" cy="40" r="4" fill="#ef4444" />
              <circle cx="180" cy="32" r="5" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
              <circle cx="240" cy="75" r="4" fill="#10b981" />
              <circle cx="300" cy="82" r="4" fill="#10b981" />
              <circle cx="360" cy="88" r="4" fill="#10b981" />
              <circle cx="420" cy="90" r="4" fill="#10b981" />

              {/* X Axis Labels */}
              <text x="50" y="155" className="axis-text">May 12</text>
              <text x="110" y="155" className="axis-text">May 13</text>
              <text x="170" y="155" className="axis-text">May 14</text>
              <text x="230" y="155" className="axis-text">May 15</text>
              <text x="290" y="155" className="axis-text">May 16</text>
              <text x="350" y="155" className="axis-text">May 17</text>
              <text x="410" y="155" className="axis-text">May 18</text>
            </svg>
          </div>
          <div className="trend-insight-strip">
            <span className="badge-pill alert-pill">May 14 Anomaly</span>
            <p>Air leak on Line 2 caused temporary SEC spike to 11.2 kWh/ton. Post-intervention setpoint lowered SEC to 7.40 kWh/unit.</p>
          </div>
        </div>

        {/* Center: Energy Waste Breakdown (Image 1 Donut) */}
        <div className="analytics-card waste-card">
          <div className="card-header-flex">
            <div>
              <h3>Energy Waste Breakdown</h3>
              <p className="card-sub">Identified today: <strong>1,250 kWh waste</strong></p>
            </div>
          </div>
          <div className="donut-and-legend">
            <div className="donut-wrapper">
              <svg viewBox="0 0 120 120" className="donut-svg">
                {/* 
                  Circumference = 2 * PI * 40 = 251.3
                  Compressed Air: 28% = 70.3
                  Furnace: 26% = 65.3
                  Motors: 20% = 50.2
                  Fans & Pumps: 14% = 35.1
                  Lighting: 6% = 15.0
                  Others: 6% = 15.0
                */}
                <circle cx="60" cy="60" r="40" fill="none" stroke="#1e293b" strokeWidth="18" />
                <circle cx="60" cy="60" r="40" fill="none" stroke="#38bdf8" strokeWidth="18" strokeDasharray="70.3 181" strokeDashoffset="0" />
                <circle cx="60" cy="60" r="40" fill="none" stroke="#f97316" strokeWidth="18" strokeDasharray="65.3 186" strokeDashoffset="-70.3" />
                <circle cx="60" cy="60" r="40" fill="none" stroke="#10b981" strokeWidth="18" strokeDasharray="50.2 201" strokeDashoffset="-135.6" />
                <circle cx="60" cy="60" r="40" fill="none" stroke="#a855f7" strokeWidth="18" strokeDasharray="35.1 216" strokeDashoffset="-185.8" />
                <circle cx="60" cy="60" r="40" fill="none" stroke="#eab308" strokeWidth="18" strokeDasharray="15.0 236" strokeDashoffset="-220.9" />
                <circle cx="60" cy="60" r="40" fill="none" stroke="#64748b" strokeWidth="18" strokeDasharray="15.4 236" strokeDashoffset="-235.9" />
              </svg>
              <div className="donut-center-text">
                <span className="donut-number">1,250</span>
                <small>kWh Loss</small>
              </div>
            </div>
            <div className="donut-legend-list">
              {energyWasteBreakdown.map((item) => (
                <div key={item.category} className="legend-row">
                  <span className="legend-color-dot" style={{ backgroundColor: item.color }} />
                  <span className="legend-name">{item.category}</span>
                  <strong className="legend-pct">{item.percentage}%</strong>
                  <small className="legend-kwh">({item.kwh} kWh)</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Top Anomalies + Decarbonisation */}
        <div className="analytics-card anomalies-card">
          <div className="card-header-flex">
            <div>
              <h3>Top Detected Anomalies</h3>
              <p className="card-sub">AI cross-correlated across energy & production</p>
            </div>
            <button className="text-link-btn" onClick={onOpenWorkbench}>Investigate All ↗</button>
          </div>

          <div className="anomalies-list">
            {topAnomalies.map((anomaly) => (
              <div key={anomaly.id} className={`anomaly-item-chip ${anomaly.severity}`}>
                <div className="anomaly-chip-left">
                  <span className={`chip-badge ${anomaly.severity}`}>
                    {anomaly.severity.toUpperCase()}
                  </span>
                  <div>
                    <strong>{anomaly.title}</strong>
                    <small>{anomaly.equipment}</small>
                  </div>
                </div>
                <div className="anomaly-chip-impact">
                  <span>Energy Impact</span>
                  <strong>{anomaly.impactPct}%</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Decarbonisation & Renewables Mini-Widget */}
          <div className="decarbonisation-subpanel">
            <div className="decarb-top">
              <strong>CO₂ & Decarbonisation</strong>
              <span>Renewable: <strong>{decarbonisationStats.renewablePct}%</strong> (Target 30%)</span>
            </div>
            <div className="scope-bars">
              <div className="scope-bar-item">
                <span className="scope-label">Scope 1 (Thermal/Standby)</span>
                <div className="bar-track"><i style={{ width: '22%', background: '#f97316' }} /></div>
                <span className="scope-val">0.18 tCO₂e</span>
              </div>
              <div className="scope-bar-item">
                <span className="scope-label">Scope 2 (Grid Electricity)</span>
                <div className="bar-track"><i style={{ width: '78%', background: '#3b82f6' }} /></div>
                <span className="scope-val">0.63 tCO₂e</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decision Queue / Active Plant Incidents (Image 1 Bottom Section) */}
      <section className="energy-decision-queue">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Agentic Triage & Action</p>
            <h2>Active Plant Energy Decisions</h2>
          </div>
          <div className="filter-controls">
            <label>
              <span className="filter-label">Filter Plant:</span>
              <select value={plantFilter} onChange={(e) => setPlantFilter(e.target.value)} className="select-input">
                <option>All plants</option>
                <option>Foundry Cluster - Belgaum</option>
                <option>Forging Cluster - Pune</option>
                <option>Textile Finishing - Surat</option>
                <option>Foundry Cluster - Coimbatore</option>
              </select>
            </label>
            <label>
              <span className="filter-label">Status:</span>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select-input">
                <option>All statuses</option>
                <option value="investigating">Investigating</option>
                <option value="open">Open</option>
                <option value="monitoring">Monitoring</option>
              </select>
            </label>
          </div>
        </div>

        <div className="incident-cards-container">
          {filteredIncidents.map((incident) => {
            const isPriority = incident.id === data.incident.id;
            return (
              <article key={incident.id} className={`energy-incident-card ${incident.severity}${isPriority ? ' is-priority-incident' : ''}`}>
                <div className="card-topline">
                  <div className="id-tags">
                    <span className={`severity-tag ${incident.severity}`}>{incident.severity.toUpperCase()}</span>
                    <span className="incident-id-text">{incident.id}</span>
                    {isPriority && <span className="priority-pill">★ Priority Decision</span>}
                  </div>
                  <span className={`status-pill ${incident.status}`}>{incident.status}</span>
                </div>

                <div className="card-body-text">
                  <h3>{incident.title}</h3>
                  <p className="incident-summary">{incident.summary}</p>
                </div>

                <div className="incident-metrics-strip">
                  <div className="strip-metric">
                    <small>SEC Impact</small>
                    <strong className="critical-metric-text">
                      {incident.currentSec} {incident.secUnit}
                      <span className="delta-sub"> (+{incident.secDeltaPct}%)</span>
                    </strong>
                  </div>
                  <div className="strip-metric">
                    <small>Plant / Line</small>
                    <strong>{incident.plant}</strong>
                  </div>
                  <div className="strip-metric">
                    <small>Batch / Product</small>
                    <span>{incident.product}</span>
                  </div>
                  <div className="strip-metric">
                    <small>Loss Exposure</small>
                    <strong className="loss-val">{formatInr(incident.exposureInr)}/mo</strong>
                  </div>
                </div>

                <div className="card-actions-strip">
                  <div className="constraint-confirmation">
                    <span className="constraint-badge">✓ Throughput Preserved</span>
                    <span className="constraint-badge">✓ Quality Preserved</span>
                  </div>
                  <button
                    className={`btn-action ${isPriority ? 'btn-primary-glow' : 'btn-secondary'}`}
                    onClick={onOpenWorkbench}
                  >
                    {isPriority ? 'Open 4-Agent Workbench →' : 'Review Incident'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
