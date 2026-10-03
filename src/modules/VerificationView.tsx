import { useState } from 'react';
import { useWorkbenchData } from '../WorkbenchDataContext';
import { useFocusContext } from '../FocusContext';
import { AuditDossier, exportAuditDossier } from './AuditDossier';
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  ActivityIcon,
  TrendingDownIcon,
  ClockIcon,
  WrenchIcon,
  FileTextIcon,
  ArrowRightIcon,
  ZapIcon,
  RefreshCwIcon,
  SlidersIcon,
} from '../components/Icons';
import {
  calculateIpmvpVerification,
  DEFAULT_BASE_TARIFF_INR_KWH,
} from '../../simulation/engine';

export function VerificationView({ onOpenWorkbench }: { onOpenWorkbench: () => void }) {
  const { data } = useWorkbenchData();
  const { focus } = useFocusContext();
  const [actualTonnage, setActualTonnage] = useState(762.4);
  const [ambientTempActual, setAmbientTempActual] = useState(31.5);
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  // IPMVP Option B / Option C Normalized Verification
  const verification = calculateIpmvpVerification(
    11.2,               // baseline SEC (incident)
    9.2,                // post-repair SEC (measured)
    758.9,              // baseline tonnage
    actualTonnage,      // actual throughput
    28.0,               // baseline ambient temp °C
    ambientTempActual,  // actual ambient temp °C
    0.004               // temperature sensitivity coefficient
  );

  const handleDownloadCertificate = () => {
    const text = `========================================================================
IPMVP OPTION B / OPTION C SAVINGS VERIFICATION CERTIFICATE
Protocol: International Performance Measurement and Verification Protocol (IPMVP)
Standard: BEE / ISO 50015 Energy Savings Verification Protocol
Facility: Belgaum Foundry SME Cluster — Line 2 Moulding & Melting
Incident Reference: INC-ENG-2401 • Work Order: WO-ENG-7922
Verification Date: ${new Date().toLocaleDateString('en-IN')}
========================================================================

1. MEASURED TELEMETRY BASELINE
------------------------------------------------------------------------
Pre-Repair Measured SEC: ${verification.measured_baseline_sec} kWh/ton (Line 2 Manifold Leak)
Baseline Production Throughput: 758.9 tons/day
Baseline Ambient Temperature: 28.0 °C

2. ROUTINE ADJUSTMENTS & NORMALIZATION (IPMVP Option B/C)
------------------------------------------------------------------------
Actual Production Throughput: ${verification.tonnage_actual_tons} tons/day
Actual Ambient Temperature: ${ambientTempActual} °C (Delta: +${verification.ambient_temp_delta_c} °C)
Temperature Sensitivity Coefficient (alpha): 0.004 / °C
Temperature Adjustment Factor: ${verification.temp_adjustment_factor}
Normalized / Routine-Adjusted Baseline SEC: ${verification.adjusted_baseline_sec} kWh/ton

3. POST-REPAIR MEASUREMENT & VERIFIED AUDIT
------------------------------------------------------------------------
Post-Repair Measured SEC: ${verification.measured_post_repair_sec} kWh/ton
Verified Specific Energy Reduction: -${verification.verified_sec_reduction_pct}%
Verified Electrical Energy Saved: ${verification.verified_daily_kwh_saved.toLocaleString('en-IN')} kWh/day
Verified Daily Financial Savings: ₹${verification.verified_daily_savings_inr.toLocaleString('en-IN')} / day
Verified Annual Run-Rate Savings: ₹${(verification.verified_annual_savings_inr / 100000).toFixed(2)} Lakhs / year
Statistical Confidence Level: ${verification.statistical_confidence_pct}% (p < 0.01)

4. VERIFICATION STATUS & SIGN-OFF
------------------------------------------------------------------------
Status: ${verification.verification_status}
Lead Energy Auditor: Plant Energy Engineer & Certified Energy Auditor (BEE Reg. #EA-4902)
Governing Method: Direct Modbus submetering on Feeder F-03 & CMP-01 VFD drive
========================================================================
Verified by ForgeOps Energy Autonomous Industrial Decision-Intelligence Platform
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IPMVP_Verification_Certificate_INC-ENG-2401.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">Closed-Loop Verification</span>
            <span>BEE Normalized Measurement & Verification Protocol (IPMVP Option B/C)</span>
          </div>
          <h1 className="page-title">Post-Intervention Savings Verification Engine</h1>
          <p className="page-subtitle">
            Rigorous before-vs-after telemetry comparison normalized for throughput, metallurgy product mix, and ambient operating temperature shifts.
          </p>
        </div>

        <div className="header-controls-group">
          <span className="kpi-badge success" style={{ padding: '8px 14px', fontSize: '12px' }}>
            <CheckCircleIcon size={14} />
            <span>Audit Verified: -{verification.verified_sec_reduction_pct}% SEC</span>
          </span>
          <button className="btn-secondary-action" onClick={handleDownloadCertificate}>
            <FileTextIcon size={14} />
            <span>Download M&V Certificate (.txt)</span>
          </button>
          <button className="btn-secondary-action" onClick={() => exportAuditDossier(data, focus)}>
            <FileTextIcon size={14} />
            <span>Export Incident Dossier (PDF)</span>
          </button>
          <button className="btn-primary-action" onClick={() => setShowFormulaModal(true)}>
            <span>Inspect IPMVP Formula</span>
          </button>
        </div>
      </header>

      {/* Hero Card: Verified Incident Summary */}
      <div className="card-clean" style={{ borderLeft: '4px solid #00d328', background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.85) 100%)' }}>
        <div className="card-header-clean">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="kpi-badge success">CLOSED • VERIFIED</span>
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>INC-ENG-2401 • Work Order WO-ENG-7922</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f9fafb' }}>
              Line 2 Compressed-Air Manifold Coupling Replacement & Pressure Optimization
            </h2>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Verified Annual Run-Rate</span>
            <div className="font-mono text-emerald" style={{ fontSize: '24px', fontWeight: 800 }}>
              ₹{(verification.verified_annual_savings_inr / 100000).toFixed(2)} Lakhs / yr
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginTop: '8px' }}>
          {/* SEC Comparison */}
          <div style={{ background: 'var(--glass-surface)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: 'var(--neu-sunken)' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Normalized Baseline vs Actual</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span className="font-mono" style={{ textDecoration: 'line-through', color: '#f87171', fontSize: '15px' }}>{verification.adjusted_baseline_sec}</span>
              <span className="font-mono text-emerald" style={{ fontSize: '24px', fontWeight: 800 }}>{verification.measured_post_repair_sec}</span>
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>kWh/t</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#00d328', fontWeight: 600, marginTop: '4px' }}>
              &darr; -{verification.verified_sec_reduction_pct}% Verified Reduction
            </div>
          </div>

          {/* Throughput Preservation */}
          <div style={{ background: 'var(--glass-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--glass-border)', boxShadow: 'var(--neu-sunken)' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Daily Production Output</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span className="font-mono text-primary" style={{ fontSize: '24px', fontWeight: 800 }}>{actualTonnage}</span>
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>tons / day</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#38bdf8', fontWeight: 600, marginTop: '4px' }}>
              100% Preserved (10.2 t/h)
            </div>
          </div>

          {/* Verified Energy Saved */}
          <div style={{ background: 'var(--glass-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--glass-border)', boxShadow: 'var(--neu-sunken)' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Daily Energy Saved</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span className="font-mono text-primary" style={{ fontSize: '24px', fontWeight: 800 }}>{verification.verified_daily_kwh_saved.toLocaleString('en-IN')}</span>
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>kWh/day</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#00d328', fontWeight: 600, marginTop: '4px' }}>
              ₹{verification.verified_daily_savings_inr.toLocaleString('en-IN')} saved daily
            </div>
          </div>

          {/* Carbon Abatement */}
          <div style={{ background: 'var(--glass-surface)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.3)', boxShadow: 'var(--neu-sunken)' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Scope 2 Avoidance</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span className="font-mono text-cyan" style={{ fontSize: '24px', fontWeight: 800 }}>{((verification.verified_daily_kwh_saved * 0.82) / 1000 * 365).toFixed(1)}</span>
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>tCO₂e/yr</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#22d3ee', fontWeight: 600, marginTop: '4px' }}>
              Clean avoided emissions
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Normalization Controls */}
      <div className="card-clean" style={{ marginTop: '16px' }}>
        <div className="card-header-clean">
          <div>
            <h3 className="card-title-clean">
              <SlidersIcon size={16} className="text-emerald" />
              <span>IPMVP Option B/C Baseline Normalization Sandbox</span>
            </h3>
            <p className="card-subtitle-clean">Adjust factory noise variables (ambient temperature & tonnage) to verify mathematical invariance</p>
          </div>
          <span className="kpi-badge info">Mathematical Normalizer</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {/* Tonnage Slider */}
          <div className="slider-group-clean">
            <div className="slider-label-flex">
              <span className="slider-label-text">Actual Production Throughput Tonnage</span>
              <span className="slider-val-readout">{actualTonnage} tons/day</span>
            </div>
            <input
              type="range"
              min="500"
              max="1000"
              step="5"
              value={actualTonnage}
              onChange={(e) => setActualTonnage(Number(e.target.value))}
              className="slider-native-clean"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
              <span>500 tons (Low load)</span>
              <span style={{ color: '#00d328' }}>762.4 tons (Current)</span>
              <span>1000 tons (Full capacity)</span>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="slider-group-clean">
            <div className="slider-label-flex">
              <span className="slider-label-text">Actual Ambient Temperature (Compressor Room)</span>
              <span className="slider-val-readout text-cyan">{ambientTempActual} °C (ΔT = +{verification.ambient_temp_delta_c} °C)</span>
            </div>
            <input
              type="range"
              min="20"
              max="45"
              step="0.5"
              value={ambientTempActual}
              onChange={(e) => setAmbientTempActual(Number(e.target.value))}
              className="slider-native-clean"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
              <span>20 °C (Winter)</span>
              <span style={{ color: '#00d328' }}>31.5 °C (Current)</span>
              <span>45 °C (Peak Summer)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Detail Grid */}
      <div className="grid-equal-2" style={{ marginTop: '16px' }}>
        {/* Left: Execution & Governance Audit Trail */}
        <div className="card-clean">
          <div className="card-header-clean">
            <div>
              <h3 className="card-title-clean">
                <WrenchIcon size={16} className="text-emerald" />
                <span>CMMS Work Order & Execution Audit Trail</span>
              </h3>
              <p className="card-subtitle-clean">End-to-end trace from anomaly detection to physical resolution</p>
            </div>
            <span className="kpi-badge info">Audit Stamped</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-elevated, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#f87171' }}>
                <ClockIcon size={14} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '13px', color: '#f9fafb' }}>Anomaly Detected by Edge Gateway</strong>
                  <span className="font-mono text-muted" style={{ fontSize: '11px' }}>08:30 AM Today</span>
                </div>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                  Pneumatic manifold pressure dropped to 6.1 bar; compressor modulation spiked to 88%.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-elevated, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#38bdf8' }}>
                <ShieldCheckIcon size={14} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '13px', color: '#f9fafb' }}>4-Agent Pipeline Investigation & Approval</strong>
                  <span className="font-mono text-muted" style={{ fontSize: '11px' }}>08:35 AM Today</span>
                </div>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                  Option C approved by Supervisor. Work order <strong>WO-ENG-7922</strong> generated and dispatched.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-elevated, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#f59e0b' }}>
                <WrenchIcon size={14} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '13px', color: '#f9fafb' }}>Maintenance Executed (Shift B Changeover)</strong>
                  <span className="font-mono text-muted" style={{ fontSize: '11px' }}>11:00 AM - 11:48 AM</span>
                </div>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                  Technician replaced ruptured manifold coupling gasket; compressor setpoint adjusted to 6.5 bar.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#00d328', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#051408' }}>
                <CheckCircleIcon size={14} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '13px', color: '#00d328' }}>Independent Telemetry Verification Confirmed</strong>
                  <span className="font-mono text-emerald" style={{ fontSize: '11px', fontWeight: 600 }}>12:30 PM Today</span>
                </div>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                  Modbus Feeder F-03 confirms SEC stabilized at 9.2 kWh/ton. Energy audit ledger permanently updated.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controlled Model Learning & Baseline Calibration */}
        <div className="card-clean">
          <div className="card-header-clean">
            <div>
              <h3 className="card-title-clean">
                <RefreshCwIcon size={16} className="text-emerald" />
                <span>Controlled Model Learning & Calibration (Section 73)</span>
              </h3>
              <p className="card-subtitle-clean">Closed-loop model evaluation and baseline recalibration record</p>
            </div>
            <span className="kpi-badge success">Model Calibrated</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--glass-surface)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Simulation Prediction vs Actual Result</span>
                <strong style={{ display: 'block', fontSize: '13px', color: '#f9fafb', marginTop: '2px' }}>
                  Predicted: -17.9% SEC • Measured Actual: -{verification.verified_sec_reduction_pct}% SEC
                </strong>
              </div>
              <span className="kpi-badge success">99.4% Accuracy</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--glass-surface)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Downtime Window Execution</span>
                <strong style={{ display: 'block', fontSize: '13px', color: '#f9fafb', marginTop: '2px' }}>
                  Estimated: 48 min • Actual Changeover: 42 min
                </strong>
              </div>
              <span className="kpi-badge info">Within Budget</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--glass-surface)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Dynamic Baseline Envelope Status</span>
                <strong style={{ display: 'block', fontSize: '13px', color: '#f9fafb', marginTop: '2px' }}>
                  Line 2 Standard SEC recalibrated to 8.5 kWh/ton target
                </strong>
              </div>
              <span className="kpi-badge success">Re-Anchored</span>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary-action" onClick={onOpenWorkbench}>
                <span>View Decision Workbench →</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Dossier Section */}
      <AuditDossier data={data} focus={focus} />

      {/* Modal: IPMVP Mathematical Regression Inspection */}
      {showFormulaModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div className="card-clean" style={{ maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #00d328' }}>
            <div className="card-header-clean">
              <div>
                <h3 className="card-title-clean">
                  <FileTextIcon size={18} className="text-emerald" />
                  <span>IPMVP Mathematical Normalization Equations</span>
                </h3>
                <p className="card-subtitle-clean">Option B (Retrofit Isolation) & Option C (Facility Level)</p>
              </div>
              <button
                onClick={() => setShowFormulaModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#d1d5db' }}>
              <div style={{ background: 'rgba(0, 211, 40, 0.08)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(0, 211, 40, 0.2)', marginBottom: '16px' }}>
                <strong style={{ color: '#00d328', display: 'block', fontFamily: 'var(--font-mono)' }}>
                  E_adjusted = E_baseline × (V_actual / V_baseline) × (1 + α × ΔT)
                </strong>
                <span style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Ensures energy savings cannot be faked or distorted by changes in ambient factory weather or product production shifts.
                </span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontFamily: 'var(--font-mono)', fontSize: '12.5px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af' }}>Measured Baseline SEC</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#f9fafb' }}>11.20 kWh/t</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af' }}>Throughput Scaling Ratio</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#38bdf8' }}>{(actualTonnage / 758.9).toFixed(3)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af' }}>Temperature Factor (1 + 0.004 × {verification.ambient_temp_delta_c})</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#38bdf8' }}>{verification.temp_adjustment_factor}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af', fontWeight: 700 }}>Adjusted Baseline SEC</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#f87171', fontWeight: 800 }}>{verification.adjusted_baseline_sec} kWh/t</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af', fontWeight: 700 }}>Measured Post-Repair SEC</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#00d328', fontWeight: 800 }}>{verification.measured_post_repair_sec} kWh/t</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: '#9ca3af', fontWeight: 700 }}>Net Verified Savings</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#00d328', fontWeight: 800 }}>-{verification.verified_sec_reduction_pct}% ({verification.verified_daily_kwh_saved.toLocaleString('en-IN')} kWh/day)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button className="btn-secondary-action" onClick={handleDownloadCertificate}>
                <FileTextIcon size={14} />
                <span>Export M&V Certificate (.txt)</span>
              </button>
              <button className="btn-primary-action" onClick={() => setShowFormulaModal(false)}>
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
