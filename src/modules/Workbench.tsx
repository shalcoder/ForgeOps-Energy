import { useState } from 'react';
import {
  ZapIcon,
  ActivityIcon,
  SlidersIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  ClockIcon,
  WrenchIcon,
  RefreshCwIcon,
  GaugeIcon,
  FileTextIcon,
} from '../components/Icons';

export function Workbench({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'simulator'>('diagnostics');
  const [setpointBar, setSetpointBar] = useState(6.5);
  const [leakFixPct, setLeakFixPct] = useState(100);
  const [isApproved, setIsApproved] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Dynamic simulation calculations based on sliders
  // Baseline SEC is 9.8, current with leak is 11.2 (+14.3%)
  // Lower setpoint (7.2 -> 6.5 saves ~1.0 kWh/t), 100% leak fix saves ~1.5 kWh/t
  const setpointSavings = (7.2 - setpointBar) * 1.4; // bar reduction * factor
  const leakSavings = (leakFixPct / 100) * 1.5;
  const totalSecReduction = Math.min(2.5, Math.max(0, setpointSavings + leakSavings));
  const simulatedSec = (11.2 - totalSecReduction).toFixed(1);
  const secDeltaPct = (((11.2 - Number(simulatedSec)) / 11.2) * 100).toFixed(1);
  const dailyKwhSaved = Math.round((Number(secDeltaPct) / 100) * 8500);
  const dailyInrSaved = Math.round(dailyKwhSaved * 7.8);
  const monthlyInrSaved = (dailyInrSaved * 26 / 100000).toFixed(2);
  const dailyCo2Kg = Math.round(dailyKwhSaved * 0.82);

  const handleApprove = () => {
    setIsApproved(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="page-container">
      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '76px',
          right: '32px',
          zIndex: 100,
          backgroundColor: 'var(--bg-ground, #111827)',
          border: '1px solid #00d328',
          boxShadow: '0 8px 24px rgba(0, 211, 40, 0.25)',
          borderRadius: '8px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircleIcon size={18} className="text-emerald" />
          <div>
            <strong style={{ color: '#f9fafb', fontSize: '13px' }}>CMMS Work Order Dispatched: WO-ENG-7922</strong>
            <p style={{ color: '#9ca3af', fontSize: '11.5px', margin: 0 }}>
              Assigned to Mechanical Maintenance • Shift B Changeover (11:00 AM)
            </p>
          </div>
        </div>
      )}

      {/* Incident Hero Header Banner */}
      <div className="incident-hero-banner">
        <div className="incident-hero-details">
          <div className="page-kicker" style={{ marginBottom: '4px' }}>
            <span className="kpi-badge danger">INCIDENT INC-ENG-2401</span>
            <span>Belgaum Line 2 Moulding Pneumatics • Screw Compressor COMP-02</span>
          </div>
          <h2>
            <span>Compressed-Air Header Pressure Loss & SEC Modulation Surge</span>
          </h2>
          <div className="incident-tags-row">
            <span>Detected: <strong>Today 08:30 AM</strong></span>
            <span>•</span>
            <span>Severity: <strong style={{ color: '#f87171' }}>Critical Excursion</strong></span>
            <span>•</span>
            <span>SEC Delta: <strong style={{ color: '#f87171' }}>+14.3% Spike (9.8 → 11.2 kWh/t)</strong></span>
            <span>•</span>
            <span>Causal Confidence: <strong className="text-emerald">94%</strong></span>
          </div>
        </div>

        <div className="incident-impact-callout">
          <div className="impact-rate-label">Hourly Financial Bleed</div>
          <div className="impact-rate-figure">₹780 / hr</div>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
            ₹1.87 Lakhs / month unmitigated
          </div>
        </div>
      </div>

      {/* Segmented Mode Selector Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="segmented-nav" style={{ width: 'fit-content' }}>
          <button
            className={`nav-tab-btn ${activeTab === 'diagnostics' ? 'active' : ''}`}
            onClick={() => setActiveTab('diagnostics')}
          >
            <ActivityIcon size={14} />
            <span>01 • Multi-Sensor Causal Diagnostics</span>
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            <SlidersIcon size={14} />
            <span>02 • What-If Simulation & Decision Gate</span>
          </button>
        </div>

        <button className="btn-secondary-action" onClick={onBack}>
          <span>← Back to Command Center</span>
        </button>
      </div>

      {/* Tab 1: Causal Diagnostics & Sensor Correlation */}
      {activeTab === 'diagnostics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Multi-Domain Sensor Matrix */}
          <div className="card-clean">
            <div className="card-header-clean">
              <div>
                <h3 className="card-title-clean">
                  <GaugeIcon size={16} className="text-cyan" />
                  <span>Real-Time Sensor Correlation Matrix (Line 2 Telemetry)</span>
                </h3>
                <p className="card-subtitle-clean">
                  Synchronized telemetry streams across electrical, pneumatic, and maintenance systems.
                </p>
              </div>
              <span className="kpi-badge danger">Anomaly Correlated</span>
            </div>

            <div className="sensor-matrix-grid">
              <div className="sensor-box abnormal">
                <div className="sensor-box-title">Pneumatic Header Pressure</div>
                <div className="sensor-box-val">6.1 bar</div>
                <div className="sensor-box-baseline" style={{ color: '#f87171' }}>
                  Nominal: 7.2 bar • (-15.3% Drop)
                </div>
              </div>

              <div className="sensor-box abnormal">
                <div className="sensor-box-title">Compressor On-Load Duty</div>
                <div className="sensor-box-val">84% duty</div>
                <div className="sensor-box-baseline" style={{ color: '#f87171' }}>
                  Nominal: 62% • (+22% Overcycling)
                </div>
              </div>

              <div className="sensor-box abnormal">
                <div className="sensor-box-title">Drive Motor Current (75 kW)</div>
                <div className="sensor-box-val">142 A</div>
                <div className="sensor-box-baseline" style={{ color: '#f87171' }}>
                  Nominal: 125 A • (+13.6% Overload)
                </div>
              </div>

              <div className="sensor-box">
                <div className="sensor-box-title">CMMS Maintenance History</div>
                <div className="sensor-box-val" style={{ color: '#f59e0b' }}>3 Leak Logs</div>
                <div className="sensor-box-baseline">
                  Line 2 Moulding Manifold (Last 14d)
                </div>
              </div>
            </div>
          </div>

          {/* Root Cause Diagnosis & Boundary Check */}
          <div className="grid-equal-2">
            <div className="card-clean" style={{ borderLeft: '4px solid #00d328' }}>
              <div className="card-header-clean">
                <h3 className="card-title-clean">
                  <ShieldCheckIcon size={16} className="text-emerald" />
                  <span>Automated Causal Inference (Analysis Agent)</span>
                </h3>
                <span className="kpi-badge success">94% Confidence</span>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface, #090d16)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '16px', marginBottom: '14px' }}>
                <p style={{ color: '#f9fafb', fontSize: '13px', lineHeight: '1.6' }}>
                  A <strong>ruptured braided coupling</strong> on the Line 2 Moulding Bank distribution manifold is causing continuous compressed air leakage. This forces the 75kW master compressor into 84% on-load modulation to maintain 6.1 bar delivery pressure, consuming <strong>+1,840 kWh/day in excess parasitic power</strong>.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-primary-action" onClick={() => setActiveTab('simulator')}>
                  <span>Proceed to What-If Simulation</span>
                  <ArrowRightIcon size={13} />
                </button>
              </div>
            </div>

            <div className="card-clean">
              <div className="card-header-clean">
                <h3 className="card-title-clean">
                  <CheckCircleIcon size={16} className="text-cyan" />
                  <span>Operational Boundary Constraints Check</span>
                </h3>
                <span className="kpi-badge info">Zero Negative Impact</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-surface, #090d16)', borderRadius: '6px', border: '1px solid var(--glass-border)' }}>
                  <span style={{ color: '#9ca3af', fontSize: '12.5px' }}>Production Throughput</span>
                  <span className="font-mono text-emerald" style={{ fontWeight: 600 }}>10.2 ton/hr • 100% Target Preserved</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-surface, #090d16)', borderRadius: '6px', border: '1px solid var(--glass-border)' }}>
                  <span style={{ color: '#9ca3af', fontSize: '12.5px' }}>Metallurgical Quality Yield</span>
                  <span className="font-mono text-emerald" style={{ fontWeight: 600 }}>97.6% • Grade 400/18 Within Spec</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-surface, #090d16)', borderRadius: '6px', border: '1px solid var(--glass-border)' }}>
                  <span style={{ color: '#9ca3af', fontSize: '12.5px' }}>Line Safety Boundary</span>
                  <span className="font-mono text-emerald" style={{ fontWeight: 600 }}>P ≥ 6.0 bar • No Clamp Safety Trips</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: What-If Simulator & Human Intervention Gate */}
      {activeTab === 'simulator' && (
        <div className="grid-2col">
          {/* Left: Interactive Physics Simulator */}
          <div className="card-clean">
            <div className="card-header-clean">
              <div>
                <h3 className="card-title-clean">
                  <SlidersIcon size={16} className="text-emerald" />
                  <span>What-If Physical Intervention Simulator</span>
                </h3>
                <p className="card-subtitle-clean">
                  Simulate pressure setpoint optimization and manifold leak elimination before operational deployment.
                </p>
              </div>
              <span className="kpi-badge success">Live Physics Model</span>
            </div>

            {/* Slider 1: Setpoint */}
            <div className="slider-group-clean">
              <div className="slider-label-flex">
                <span className="slider-label-text">Compressor Discharge Setpoint (bar)</span>
                <span className="slider-val-readout">{setpointBar.toFixed(1)} bar</span>
              </div>
              <input
                type="range"
                min="6.0"
                max="8.0"
                step="0.1"
                value={setpointBar}
                onChange={(e) => setSetpointBar(Number(e.target.value))}
                className="slider-native-clean"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
                <span>6.0 bar (Min Limit)</span>
                <span style={{ color: '#00d328' }}>6.5 bar (Optimal)</span>
                <span>8.0 bar (Max Overpressure)</span>
              </div>
            </div>

            {/* Slider 2: Leak Remediation */}
            <div className="slider-group-clean" style={{ marginTop: '16px' }}>
              <div className="slider-label-flex">
                <span className="slider-label-text">Manifold Braided Coupling Leak Repair</span>
                <span className="slider-val-readout">{leakFixPct}% Remediated</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="25"
                value={leakFixPct}
                onChange={(e) => setLeakFixPct(Number(e.target.value))}
                className="slider-native-clean"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
                <span>0% (No Action)</span>
                <span>50% (Clamp seal)</span>
                <span style={{ color: '#00d328' }}>100% (Coupling replacement)</span>
              </div>
            </div>

            {/* Simulated Impact Output Grid */}
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #1f2937' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '14px' }}>
                Simulated Operational Impact
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                <div style={{ backgroundColor: 'var(--bg-surface, #090d16)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>Projected SEC</div>
                  <div className="font-mono text-emerald" style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>
                    {simulatedSec} <span style={{ fontSize: '12px' }}>kWh/t</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#00d328', marginTop: '2px' }}>
                    -{secDeltaPct}% vs current
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-surface, #090d16)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>Daily Energy Saved</div>
                  <div className="font-mono text-emerald" style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>
                    {dailyKwhSaved.toLocaleString()} <span style={{ fontSize: '12px' }}>kWh</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                    {dailyCo2Kg} kg CO₂/day
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-surface, #090d16)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>Monthly Cost Return</div>
                  <div className="font-mono text-emerald" style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>
                    ₹{monthlyInrSaved}L <span style={{ fontSize: '12px' }}>/ mo</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#00d328', marginTop: '2px' }}>
                    ₹{dailyInrSaved.toLocaleString()} / day
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Human-in-the-Loop Decision & CMMS Work Order Gate */}
          <div className="card-clean" style={{ border: isApproved ? '1px solid rgba(0, 211, 40, 0.4)' : '1px solid #1f2937' }}>
            <div className="card-header-clean">
              <div>
                <h3 className="card-title-clean">
                  <ShieldCheckIcon size={16} className="text-emerald" />
                  <span>Human-in-the-Loop Decision Gate</span>
                </h3>
                <p className="card-subtitle-clean">Operator verification required before CMMS dispatch</p>
              </div>
              <span className={`kpi-badge ${isApproved ? 'success' : 'warning'}`}>
                {isApproved ? 'Approved & Dispatched' : 'Pending Approval'}
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface, #090d16)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '18px', marginBottom: '18px' }}>
              <div style={{ fontSize: '11.5px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px' }}>
                Recommended Intervention Package
              </div>
              <p style={{ color: '#f9fafb', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
                <strong>Option C: Dual Intervention</strong> — Replace ruptured braided coupling on Line 2 Moulding Bank manifold during 11:00 AM mold changeover (48 min window) and re-tune compressor setpoint from 7.2 to 6.5 bar.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #1f2937' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>Implementation CapEx</span>
                  <div className="font-mono" style={{ color: '#f9fafb', fontSize: '14px', fontWeight: 600 }}>₹9,500</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>Payback Period</span>
                  <div className="font-mono text-emerald" style={{ fontSize: '14px', fontWeight: 600 }}>1.5 Months</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isApproved ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  className="btn-primary-action"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 18px', fontSize: '13.5px' }}
                  onClick={handleApprove}
                >
                  <WrenchIcon size={16} />
                  <span>Approve Intervention & Dispatch CMMS Work Order</span>
                </button>
                <div style={{ textAlign: 'center', fontSize: '11.5px', color: '#6b7280' }}>
                  Work order WO-ENG-7922 will be queued to Maintenance Shift B
                </div>
              </div>
            ) : (
              <div style={{ backgroundColor: 'rgba(0, 211, 40, 0.08)', border: '1px solid rgba(0, 211, 40, 0.3)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <CheckCircleIcon size={18} className="text-emerald" />
                  <strong style={{ color: '#00d328', fontSize: '13px' }}>Work Order WO-ENG-7922 Dispatched & Active</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.5' }}>
                  Technician assigned: <strong>S. Kulkarni (Millwright Shift B)</strong>. Execution scheduled at <strong>11:00 AM Changeover</strong>. Edge telemetry verification loop initiated.
                </div>
              </div>
            )}

            {/* Closed-Loop Telemetry Verification Loop */}
            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#9ca3af' }}>
                <RefreshCwIcon size={14} className="text-emerald" />
                <span>Closed-Loop Telemetry Verification active on Belgaum Edge Gateway</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
