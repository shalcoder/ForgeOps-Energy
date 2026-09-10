import { useState } from 'react';
import {
  ZapIcon,
  ActivityIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  GaugeIcon,
  ClockIcon,
  FileTextIcon,
} from '../components/Icons';

export function HomeDashboard({ onOpenWorkbench }: { onOpenWorkbench: () => void }) {
  const [timeFilter, setTimeFilter] = useState('today');

  return (
    <div className="page-container">
      {/* Industrial Executive Header */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">Live Modbus Edge</span>
            <span>Belgaum Foundry Complex • Induction Melting & Moulding Line 2</span>
          </div>
          <h1 className="page-title">Plant Energy Command & Decision Center</h1>
          <p className="page-subtitle">
            Sub-second telemetry monitoring, specific energy envelope tracking, and automated anomaly diagnosis.
          </p>
        </div>

        <div className="header-controls-group">
          <select
            className="select-clean"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="today">Shift A • Live Today (06:00 - 14:00)</option>
            <option value="yesterday">Yesterday (Full Day)</option>
            <option value="7days">Last 7 Operating Days</option>
          </select>
          <button className="btn-secondary-action" onClick={() => alert('Exporting BEE-compliant Energy Audit Report (PDF)...')}>
            <FileTextIcon size={14} />
            <span>Export Audit (PDF)</span>
          </button>
        </div>
      </header>

      {/* 4 Core KPI Metric Cards */}
      <section className="grid-kpi-4">
        {/* KPI 1: Specific Energy Consumption */}
        <div className="card-clean">
          <div className="kpi-card-top">
            <span className="kpi-card-label">Specific Energy (SEC)</span>
            <span className="kpi-badge success">
              <CheckCircleIcon size={12} />
              <span>-12.9% Optimal</span>
            </span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-big-value">7.40</span>
            <span className="kpi-unit-label">kWh / ton</span>
          </div>
          <div className="kpi-subtext">
            <span>Target Envelope: <strong>8.50 kWh/t</strong> • Baseline preserved</span>
          </div>
        </div>

        {/* KPI 2: Active Power Demand */}
        <div className="card-clean">
          <div className="kpi-card-top">
            <span className="kpi-card-label">Active Power Demand</span>
            <span className="kpi-badge info">
              <ZapIcon size={12} />
              <span>Normal Load</span>
            </span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-big-value">842</span>
            <span className="kpi-unit-label">kW</span>
          </div>
          <div className="kpi-subtext">
            <span>Peak Demand Today: <strong>1,080 kW</strong> (Contract: 1,200 kW)</span>
          </div>
        </div>

        {/* KPI 3: Daily Energy Cost */}
        <div className="card-clean">
          <div className="kpi-card-top">
            <span className="kpi-card-label">Daily Energy Cost</span>
            <span className="kpi-badge success">
              <span>₹8,800 Saved</span>
            </span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-big-value">₹59,200</span>
            <span className="kpi-unit-label">Today</span>
          </div>
          <div className="kpi-subtext">
            <span>Run-rate: <strong>7,400 kWh</strong> • Blended Tariff: ₹7.80/kWh</span>
          </div>
        </div>

        {/* KPI 4: Active Energy Inefficiencies */}
        <div className="card-clean" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
          <div className="kpi-card-top">
            <span className="kpi-card-label" style={{ color: '#f87171' }}>Active Anomalies</span>
            <span className="kpi-badge danger">
              <AlertTriangleIcon size={12} />
              <span>₹780 / hr Bleed</span>
            </span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-big-value" style={{ color: '#f87171' }}>1 Critical</span>
            <span className="kpi-unit-label">1 Warning</span>
          </div>
          <div className="kpi-subtext">
            <span>Action Required: <strong>COMP-02 Manifold Pressure Loss</strong></span>
          </div>
        </div>
      </section>

      {/* Middle Section: 24h Profile Chart + Sub-metering Distribution */}
      <section className="grid-2col">
        {/* Left: 24-Hour Energy Load Profile & SEC Envelope */}
        <div className="card-clean">
          <div className="card-header-clean">
            <div>
              <h2 className="card-title-clean">
                <ActivityIcon size={16} className="text-emerald" />
                <span>24-Hour Specific Energy & Operational Envelope</span>
              </h2>
              <p className="card-subtitle-clean">
                Continuous telemetry comparison against dynamic baseline standards and anomaly threshold.
              </p>
            </div>
            <span className="kpi-badge success">Dynamic Envelope Active</span>
          </div>

          <div className="chart-container-box">
            <svg viewBox="0 0 700 200" className="svg-chart-clean" preserveAspectRatio="none">
              <defs>
                <linearGradient id="secAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d328" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#00d328" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="anomalyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="40" x2="680" y2="40" stroke="#1f2937" strokeDasharray="3 3" />
              <line x1="40" y1="90" x2="680" y2="90" stroke="#1f2937" strokeDasharray="3 3" />
              <line x1="40" y1="140" x2="680" y2="140" stroke="#1f2937" strokeDasharray="3 3" />
              <line x1="40" y1="180" x2="680" y2="180" stroke="#374151" />

              {/* Y-Axis Labels */}
              <text x="10" y="44" fill="#6b7280" fontSize="10" fontFamily="var(--font-mono)">12.0</text>
              <text x="10" y="94" fill="#6b7280" fontSize="10" fontFamily="var(--font-mono)">10.0</text>
              <text x="10" y="144" fill="#6b7280" fontSize="10" fontFamily="var(--font-mono)">8.0</text>

              {/* Baseline Band (Target: 8.5 kWh/t) */}
              <line x1="40" y1="130" x2="680" y2="130" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.8" />
              <text x="610" y="124" fill="#f59e0b" fontSize="10" fontFamily="var(--font-mono)">Target 8.5</text>

              {/* Upper Control Limit (10.0 kWh/t) */}
              <line x1="40" y1="90" x2="680" y2="90" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.7" />
              <text x="610" y="84" fill="#ef4444" fontSize="10" fontFamily="var(--font-mono)">UCL 10.0</text>

              {/* Area Fill */}
              <path
                d="M 40 145 Q 120 140, 200 135 T 320 50 T 440 145 T 560 148 T 680 145 L 680 180 L 40 180 Z"
                fill="url(#secAreaGrad)"
              />

              {/* Main Trend Line */}
              <path
                d="M 40 145 Q 120 140, 200 135 T 320 50 T 440 145 T 560 148 T 680 145"
                fill="none"
                stroke="#00d328"
                strokeWidth="2.5"
              />

              {/* Anomaly Highlight Section around 08:30 (x=320, y=50) */}
              <circle cx="320" cy="50" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              <line x1="320" y1="50" x2="320" y2="180" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

              {/* Anomaly Callout Box */}
              <rect x="250" y="15" width="140" height="26" rx="4" fill="#111827" stroke="#ef4444" strokeWidth="1" />
              <text x="258" y="32" fill="#f87171" fontSize="10.5" fontFamily="var(--font-mono)" fontWeight="bold">
                08:30 Anomaly: +14.3%
              </text>

              {/* X-Axis Ticks */}
              <text x="40" y="196" fill="#6b7280" fontSize="10" fontFamily="var(--font-mono)">00:00</text>
              <text x="180" y="196" fill="#6b7280" fontSize="10" fontFamily="var(--font-mono)">04:00</text>
              <text x="300" y="196" fill="#f87171" fontSize="10" fontFamily="var(--font-mono)" fontWeight="bold">08:30 (Excursion)</text>
              <text x="440" y="196" fill="#6b7280" fontSize="10" fontFamily="var(--font-mono)">12:00</text>
              <text x="560" y="196" fill="#6b7280" fontSize="10" fontFamily="var(--font-mono)">16:00</text>
              <text x="650" y="196" fill="#6b7280" fontSize="10" fontFamily="var(--font-mono)">20:00</text>
            </svg>
          </div>

          <div className="chart-legend-bar">
            <div className="legend-chip">
              <span className="legend-dot-indicator" style={{ backgroundColor: '#00d328' }} />
              <span>Measured SEC (kWh/ton)</span>
            </div>
            <div className="legend-chip">
              <span className="legend-dot-indicator" style={{ backgroundColor: '#f59e0b' }} />
              <span>Target Standard (8.50)</span>
            </div>
            <div className="legend-chip">
              <span className="legend-dot-indicator" style={{ backgroundColor: '#ef4444' }} />
              <span>Excursion Threshold (10.0)</span>
            </div>
          </div>
        </div>

        {/* Right: Sub-metering Energy Distribution */}
        <div className="card-clean">
          <div className="card-header-clean">
            <div>
              <h2 className="card-title-clean">
                <GaugeIcon size={16} className="text-cyan" />
                <span>Sub-Metered Load Center</span>
              </h2>
              <p className="card-subtitle-clean">Total: 7,400 kWh • 4 Feeder Circuits</p>
            </div>
            <span className="kpi-badge info">14 Meters Live</span>
          </div>

          <div className="distribution-layout">
            <div className="donut-graphic-wrap">
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                {/* Furnace 44% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#00d328" strokeWidth="12" strokeDasharray="105 239" />
                {/* Compressors 28% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#ef4444" strokeWidth="12" strokeDasharray="67 239" strokeDashoffset="-105" />
                {/* Sand Preparation 16% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#06b6d4" strokeWidth="12" strokeDasharray="38 239" strokeDashoffset="-172" />
                {/* Auxiliaries 12% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#6b7280" strokeWidth="12" strokeDasharray="29 239" strokeDashoffset="-210" />
              </svg>
              <div className="donut-center-metric">
                <strong>7,400</strong>
                <small>kWh Today</small>
              </div>
            </div>

            <div className="breakdown-bars-list">
              <div className="breakdown-item">
                <div className="breakdown-item-label">
                  <span className="text-primary font-semibold">Induction Melting</span>
                  <span className="font-mono text-emerald">44% (3,256 kWh)</span>
                </div>
                <div className="breakdown-bar-track">
                  <div className="breakdown-bar-fill" style={{ width: '44%', backgroundColor: '#00d328' }} />
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-item-label">
                  <span className="text-primary font-semibold">Compressed Air Systems</span>
                  <span className="font-mono text-alert font-bold">28% (2,072 kWh) • Leak</span>
                </div>
                <div className="breakdown-bar-track">
                  <div className="breakdown-bar-fill" style={{ width: '28%', backgroundColor: '#ef4444' }} />
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-item-label">
                  <span className="text-primary font-semibold">Sand Muller & Drives</span>
                  <span className="font-mono text-cyan">16% (1,184 kWh)</span>
                </div>
                <div className="breakdown-bar-track">
                  <div className="breakdown-bar-fill" style={{ width: '16%', backgroundColor: '#06b6d4' }} />
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-item-label">
                  <span className="text-primary font-semibold">Auxiliaries & Cooling</span>
                  <span className="font-mono text-muted">12% (888 kWh)</span>
                </div>
                <div className="breakdown-bar-track">
                  <div className="breakdown-bar-fill" style={{ width: '12%', backgroundColor: '#6b7280' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Active Anomalies Queue Table */}
      <section className="card-clean">
        <div className="card-header-clean">
          <div>
            <h2 className="card-title-clean">
              <AlertTriangleIcon size={16} className="text-alert" />
              <span>Active Plant Energy Anomalies & Decision Queue</span>
            </h2>
            <p className="card-subtitle-clean">
              Ranked by hourly financial exposure. Click Investigate to launch root cause reasoning in the Workbench.
            </p>
          </div>
          <span className="kpi-badge danger">2 Active Excursions</span>
        </div>

        <div className="table-wrap-clean">
          <table className="table-clean">
            <thead>
              <tr>
                <th>Incident ID</th>
                <th>Asset / Location</th>
                <th>Physical Mechanism</th>
                <th>SEC Delta</th>
                <th>Hourly Loss</th>
                <th>Severity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="font-mono font-bold text-primary">INC-ENG-2401</span>
                </td>
                <td>
                  <strong>Line 2 Moulding Pneumatics</strong>
                  <div className="text-muted font-mono text-xs">Screw Compressor COMP-02 (75 kW)</div>
                </td>
                <td>
                  <span className="text-secondary">Pneumatic distribution line pressure drop (7.2 → 6.1 bar)</span>
                  <div className="text-alert font-mono text-xs">Continuous on-load compressor modulation +21%</div>
                </td>
                <td>
                  <span className="font-mono text-alert font-bold">+14.3% Spike</span>
                </td>
                <td>
                  <span className="font-mono text-alert font-bold">₹780 / hr</span>
                </td>
                <td>
                  <span className="kpi-badge danger">CRITICAL</span>
                </td>
                <td>
                  <button className="btn-primary-action" onClick={onOpenWorkbench}>
                    <span>Investigate</span>
                    <ArrowRightIcon size={13} />
                  </button>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="font-mono font-bold text-primary">INC-ENG-2402</span>
                </td>
                <td>
                  <strong>Induction Furnace Preheater</strong>
                  <div className="text-muted font-mono text-xs">Heating Bank F-01 • Holding Stage</div>
                </td>
                <td>
                  <span className="text-secondary">Preheat idling power draw over 45 min without charge transfer</span>
                </td>
                <td>
                  <span className="font-mono text-warning font-bold">+8.2% Nominal</span>
                </td>
                <td>
                  <span className="font-mono text-warning font-bold">₹240 / hr</span>
                </td>
                <td>
                  <span className="kpi-badge warning">WARNING</span>
                </td>
                <td>
                  <button className="btn-secondary-action" onClick={onOpenWorkbench}>
                    <span>Inspect</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
