import { useState } from 'react';

export function FoundryUserStoryView({ onSwitchToWorkbench }: { onSwitchToWorkbench: () => void }) {
  const [approved, setApproved] = useState(true);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <main className="user-story-page">
      {/* Header Banner */}
      <section className="user-story-header">
        <div className="badge-pill energy-pill">Foundry SME Case Study</div>
        <h1>A Realistic User Journey: From Anomaly to Verified Impact</h1>
        <p className="subtitle">
          How a 4-agent pipeline identifies a 14.3% SEC spike, discovers the hidden compressed-air leak root cause, simulates interventions, and delivers verified 18.0% energy savings.
        </p>
      </section>

      {/* 5-Step Story Board (Image 2 Bottom Half) */}
      <div className="storyboard-container">
        {/* Step 1: Anomaly Detected */}
        <div
          className={`story-card ${activeStep === 1 ? 'is-focused' : ''}`}
          onClick={() => setActiveStep(activeStep === 1 ? null : 1)}
        >
          <div className="story-card-header">
            <span className="step-badge">1</span>
            <div className="step-title-group">
              <strong>ANOMALY DETECTED</strong>
              <small className="step-time">08:30 AM</small>
            </div>
          </div>
          <p className="step-desc">
            SEC has increased in the last 6 hours compared to yesterday.
          </p>

          <div className="step-visual">
            <div className="chart-label-sm">Specific Energy Consumption (kWh/ton)</div>
            {/* SVG Comparison Chart: Today vs Yesterday */}
            <svg viewBox="0 0 200 90" className="micro-chart-svg">
              {/* Yesterday Line (Green) */}
              <path
                d="M 10 65 Q 40 60, 70 63 T 130 60 T 190 64"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.2"
              />
              {/* Today Line (Red Spike) */}
              <path
                d="M 10 65 Q 40 58, 70 46 T 130 38 T 190 35"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
              />
              <circle cx="190" cy="35" r="3.5" fill="#ef4444" />
              {/* X Axis Time Marks */}
              <text x="10" y="84" className="chart-subtext">00:00</text>
              <text x="80" y="84" className="chart-subtext">04:00</text>
              <text x="160" y="84" className="chart-subtext">08:00</text>
            </svg>
            <div className="chart-micro-legend">
              <span className="legend-entry"><i className="legend-color-box red" /> Today</span>
              <span className="legend-entry"><i className="legend-color-box green" /> Yesterday</span>
            </div>
          </div>

          <div className="step-metric-table">
            <div className="metric-pair">
              <span>Today: <strong>11.2 kWh/ton</strong></span>
              <span className="spike-indicator">▲ 14.3%</span>
            </div>
            <div className="metric-pair">
              <span>Yesterday: <strong>9.8 kWh/ton</strong></span>
            </div>
          </div>

          <div className="step-constraint-footer">
            <span>Throughput: <strong>10.2 ton</strong></span>
            <span>Quality: <strong>97.6%</strong></span>
          </div>
        </div>

        {/* Step 2: Root Cause Analysis */}
        <div
          className={`story-card ${activeStep === 2 ? 'is-focused' : ''}`}
          onClick={() => setActiveStep(activeStep === 2 ? null : 2)}
        >
          <div className="story-card-header">
            <span className="step-badge">2</span>
            <div className="step-title-group">
              <strong>ROOT CAUSE ANALYSIS</strong>
              <small className="step-time">08:33 AM</small>
            </div>
          </div>
          <p className="step-desc">
            ForgeOps investigates cross-domain evidence and isolates the root cause.
          </p>

          <div className="findings-checklist">
            <div className="finding-row">
              <span className="finding-icon">⚙️</span>
              <span>Compressor runtime <strong>↑ 21%</strong></span>
            </div>
            <div className="finding-row">
              <span className="finding-icon">📉</span>
              <span>Air pressure dropped from <strong>7.2 to 6.1 bar</strong></span>
            </div>
            <div className="finding-row">
              <span className="finding-icon">⚡</span>
              <span>Motor current <strong>↑ 12%</strong> on Line 2</span>
            </div>
            <div className="finding-row">
              <span className="finding-icon">🔧</span>
              <span>Maintenance: <strong>3 leakage incidents</strong> in last 15 days</span>
            </div>
            <div className="finding-row ok-row">
              <span className="finding-icon">✓</span>
              <span>Production & quality <strong>unaffected</strong></span>
            </div>
          </div>

          <div className="root-cause-box">
            <div className="root-cause-tag">
              <span className="alert-triangle">⚠️</span>
              <strong>Probable Root Cause</strong>
            </div>
            <p className="root-cause-text">
              Compressed-air distribution leakage in <strong>Line 2 distribution</strong> (Confidence: 93%).
            </p>
          </div>
        </div>

        {/* Step 3: What-If Simulation */}
        <div
          className={`story-card ${activeStep === 3 ? 'is-focused' : ''}`}
          onClick={() => setActiveStep(activeStep === 3 ? null : 3)}
        >
          <div className="story-card-header">
            <span className="step-badge">3</span>
            <div className="step-title-group">
              <strong>WHAT-IF SIMULATION</strong>
              <small className="step-time">08:35 AM</small>
            </div>
          </div>
          <p className="step-desc">
            ForgeOps simulates multiple interventions before taking action.
          </p>

          <div className="sim-scenarios-table">
            <table>
              <thead>
                <tr>
                  <th>Intervention</th>
                  <th>SEC</th>
                  <th>Δ vs Base</th>
                  <th>Cost</th>
                  <th>Downtime</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>A.</strong> Repair leakage</td>
                  <td>9.7</td>
                  <td className="green-text">-13.4%</td>
                  <td>₹8,500</td>
                  <td>42 min</td>
                </tr>
                <tr>
                  <td><strong>B.</strong> Optimize setpoint</td>
                  <td>10.1</td>
                  <td className="green-text">-9.8%</td>
                  <td>₹2,000</td>
                  <td>10 min</td>
                </tr>
                <tr className="best-row">
                  <td><strong>C.</strong> Both A + B</td>
                  <td>9.2</td>
                  <td className="best-pct">-18.0%</td>
                  <td>₹9,500</td>
                  <td>48 min</td>
                </tr>
                <tr>
                  <td><strong>D.</strong> No action</td>
                  <td>11.2</td>
                  <td>—</td>
                  <td>₹0</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="baseline-ref-strip">
            Baseline SEC: <strong>11.2 kWh/ton</strong>
          </div>

          <div className="best-option-banner">
            <div className="banner-col">
              <small>Best Option</small>
              <strong>C. Both A + B</strong>
            </div>
            <div className="banner-col">
              <small>Energy Saving</small>
              <strong className="green-text">18.0%</strong>
            </div>
            <div className="banner-col">
              <small>Est. Saving / day</small>
              <strong>₹6,240</strong>
            </div>
            <div className="banner-col">
              <small>CO₂ Reduction</small>
              <strong>96 kg/day</strong>
            </div>
          </div>
        </div>

        {/* Step 4: Recommendation & Operator Approval */}
        <div
          className={`story-card ${activeStep === 4 ? 'is-focused' : ''}`}
          onClick={() => setActiveStep(activeStep === 4 ? null : 4)}
        >
          <div className="story-card-header">
            <span className="step-badge">4</span>
            <div className="step-title-group">
              <strong>RECOMMENDATION</strong>
              <small className="step-time">08:35 AM</small>
            </div>
          </div>
          <p className="step-desc">
            ForgeOps recommends the best action with quantified business impact.
          </p>

          <div className="rec-action-callout">
            <small>Recommended Action:</small>
            <strong>Repair compressed air leakage in Line 2 and optimize compressor setpoint to 6.5 bar.</strong>
          </div>

          <div className="quantified-impact-grid">
            <div className="impact-line">
              <span>⚡ Energy Saving</span>
              <strong>1,840 kWh/day (18.0%)</strong>
            </div>
            <div className="impact-line">
              <span>💰 Cost Saving</span>
              <strong>₹6,240 / day</strong>
            </div>
            <div className="impact-line">
              <span>🌿 CO₂ Reduction</span>
              <strong>96 kg / day</strong>
            </div>
            <div className="impact-line">
              <span>⏱ Payback Period</span>
              <strong>1.5 months</strong>
            </div>
            <div className="impact-line">
              <span>🎯 Model Confidence</span>
              <div className="confidence-track">
                <i style={{ width: '93%' }} />
                <strong>93%</strong>
              </div>
            </div>
          </div>

          <div className="operator-approval-controls">
            <button
              className={`btn-approve ${approved ? 'is-approved' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setApproved(true);
              }}
            >
              {approved ? '✓ APPROVED & DISPATCHED' : 'APPROVE'}
            </button>
            <button
              className="btn-reject"
              onClick={(e) => {
                e.stopPropagation();
                setApproved(false);
              }}
            >
              REJECT
            </button>
          </div>
        </div>

        {/* Step 5: Action Taken & Verified */}
        <div
          className={`story-card verified-card ${activeStep === 5 ? 'is-focused' : ''}`}
          onClick={() => setActiveStep(activeStep === 5 ? null : 5)}
        >
          <div className="story-card-header">
            <span className="step-badge ok-badge">5</span>
            <div className="step-title-group">
              <strong>ACTION TAKEN & VERIFIED</strong>
              <small className="step-time">11:30 AM</small>
            </div>
          </div>
          <p className="step-desc">
            Action implemented during shift changeover; impact verified in real time.
          </p>

          <div className="post-impl-kpis">
            <div className="post-kpi-box">
              <small>After Implementation SEC</small>
              <strong className="green-text">9.2 kWh/ton</strong>
              <span className="delta-tag">▼ 18.0%</span>
            </div>
            <div className="post-kpi-box">
              <small>Throughput</small>
              <strong>10.2 ton/day</strong>
              <span className="delta-tag neutral">0% impact</span>
            </div>
            <div className="post-kpi-box">
              <small>Quality Yield</small>
              <strong>97.8%</strong>
              <span className="delta-tag positive">+0.2%</span>
            </div>
          </div>

          <div className="step-visual">
            <div className="chart-label-sm">Trend (Today) · Action Implemented at 08:35 AM</div>
            <svg viewBox="0 0 200 75" className="micro-chart-svg">
              {/* Line dropping after implementation */}
              <path
                d="M 10 35 L 70 34 L 100 35 L 120 62 L 150 64 L 190 65"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              <line x1="100" y1="10" x2="100" y2="70" stroke="#f59e0b" strokeDasharray="3,3" strokeWidth="1.2" />
              <text x="104" y="22" className="chart-marker-text">Action Implemented</text>
              <text x="10" y="72" className="chart-subtext">00:00</text>
              <text x="65" y="72" className="chart-subtext">04:00</text>
              <text x="105" y="72" className="chart-subtext">08:00</text>
              <text x="160" y="72" className="chart-subtext">12:00</text>
            </svg>
          </div>

          <div className="verification-stamp">
            <span className="check-circle">✓</span>
            <div>
              <strong>Impact verified. Case closed.</strong>
              <small>1,840 kWh/day permanent recurring savings locked in.</small>
            </div>
          </div>
        </div>
      </div>

      {/* Value to SME Bottom Summary Strip (Image 2 Bottom Banner) */}
      <section className="sme-value-banner">
        <div className="value-banner-header">
          <strong>VALUE TO INDIAN MANUFACTURING SMEs</strong>
          <button className="link-action-btn" onClick={onSwitchToWorkbench}>
            Simulate Your Own Factory Data →
          </button>
        </div>
        <div className="value-pills-row">
          <div className="value-pill">
            <span className="pill-icon">⚡</span>
            <div>
              <strong>8–20%</strong>
              <small>Reduction in Specific Energy (SEC)</small>
            </div>
          </div>
          <div className="value-pill">
            <span className="pill-icon">💰</span>
            <div>
              <strong>10–15%</strong>
              <small>Reduction in Total Energy Cost</small>
            </div>
          </div>
          <div className="value-pill">
            <span className="pill-icon">🌿</span>
            <div>
              <strong>5–15%</strong>
              <small>CO₂ Emission Abatement</small>
            </div>
          </div>
          <div className="value-pill">
            <span className="pill-icon">⏱</span>
            <div>
              <strong>1–3 Months</strong>
              <small>Typical Payback Period</small>
            </div>
          </div>
          <div className="value-pill">
            <span className="pill-icon">🔌</span>
            <div>
              <strong>Minimal Disruption</strong>
              <small>Works with existing machines & SCADA</small>
            </div>
          </div>
          <div className="value-pill">
            <span className="pill-icon">📡</span>
            <div>
              <strong>Affordable & Scalable</strong>
              <small>Edge-first, modular deployment</small>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
