import React, { useState } from 'react';
import { useWorkbenchData } from '../WorkbenchDataContext';
import { useFocusContext } from '../FocusContext';
import { exportAuditDossier } from './AuditDossier';
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
  CheckIcon,
} from '../components/Icons';
import {
  calculateIpmvpVerification,
  DEFAULT_BASE_TARIFF_INR_KWH,
} from '../../simulation/engine';

export function VerificationView({ onOpenWorkbench }: { onOpenWorkbench?: () => void }) {
  const { data } = useWorkbenchData();
  const { focus } = useFocusContext();
  const [actualTonnage, setActualTonnage] = useState(762.4);
  const [ambientTempActual, setAmbientTempActual] = useState(31.5);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  // IPMVP Option B / Option C Normalized Verification
  const verification = calculateIpmvpVerification(
    11.2,               // baseline SEC (incident)
    9.8,                // synthetic scenario SEC input
    758.9,              // baseline tonnage
    actualTonnage,      // selected scenario throughput
    28.0,               // baseline ambient temp °C
    ambientTempActual,  // selected scenario ambient temp °C
    0.004               // temperature sensitivity coefficient
  );

  const handleDownloadCertificate = () => {
    const text = `========================================================================
FORGEOPS ENERGY — DEMONSTRATION SCENARIO REPORT
NOT an IPMVP certificate, field measurement, or compliance attestation
Data source: synthetic Belgaum Foundry demonstration fixture
Facility: Belgaum Foundry SME Complex — Line 2 Moulding & Melting
Incident Reference: INC-ENG-2401 • Work Order: WO-ENG-7922
Verification Date: ${new Date().toLocaleDateString('en-IN')}
========================================================================

1. ASSUMED SCENARIO BASELINE (NOT MEASURED TELEMETRY)
------------------------------------------------------------------------
Baseline SEC assumption: 11.2 kWh/ton (illustrative)
Baseline Production Throughput: 758.9 tons/day
Baseline Ambient Temperature: 28.0 °C

2. ROUTINE ADJUSTMENTS & NORMALIZATION (IPMVP Option B/C)
------------------------------------------------------------------------
Actual Production Throughput: ${verification.tonnage_actual_tons} tons/day
Actual Ambient Temperature: ${ambientTempActual} °C (Delta: +${verification.ambient_temp_delta_c} °C)
Temperature Sensitivity Coefficient (alpha): 0.004 / °C
Temperature Adjustment Factor: ${verification.temp_adjustment_factor}
Normalized / Routine-Adjusted Baseline SEC: 11.0 kWh/ton

3. MODELLED SCENARIO OUTPUT (NOT FIELD VERIFIED)
------------------------------------------------------------------------
Scenario SEC assumption: 9.8 kWh/ton
Modelled SEC delta: ${verification.verified_sec_reduction_pct}%
Modelled energy delta: ${verification.verified_daily_kwh_saved.toLocaleString('en-IN')} kWh/day
Illustrative cost delta: ₹${verification.verified_daily_savings_inr.toLocaleString('en-IN')} / day

4. VERIFICATION STATUS & SIGN-OFF
------------------------------------------------------------------------
Status: DEMONSTRATION CALCULATION ONLY — NOT CERTIFIED
No plant meter, PLC, MES, CMMS, or QMS data was collected.
No physical intervention or savings result is represented as having occurred.
========================================================================
Independent review and field measurement are required before reporting realized savings or compliance.
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ForgeOps_Energy_Demo_Scenario_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const auditStages = [
    { id: 'decision', title: '1. Demo approval record', date: 'Scenario event', summary: 'The fixture represents an operator selecting a repair scenario under a throughput constraint.' },
    { id: 'work_order', title: '2. Simulated work-order record', date: 'Scenario event', summary: 'A demo reference is shown; no CMMS dispatch occurred.' },
    { id: 'execution', title: '3. Assumed intervention', date: 'Scenario event', summary: 'The calculation assumes a coupling repair; no physical work is represented as completed.' },
    { id: 'telemetry', title: '4. Scenario inputs', date: 'Scenario event', summary: 'Power and SEC values are synthetic inputs, not submeter readings.' },
    { id: 'normalization', title: '5. Baseline calculation', date: 'Scenario event', summary: 'The calculator applies an illustrative temperature adjustment to the assumed baseline.' },
    { id: 'verification', title: '6. Modelled result', date: 'Scenario event', summary: 'The calculated delta is not field verified, certified, or supported by statistical confidence.' },
  ];

  return (
    <div className="page-container">
      {/* ── Page Header ── */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">VERIFICATION</span>
            <span>Illustrative calculation · synthetic fixture</span>
          </div>
          <h1 className="page-title">Scenario M&V Calculator</h1>
          <p className="page-subtitle">
            Explore baseline normalization on demonstration inputs. This prototype does not certify savings or replace independent M&V review.
          </p>
        </div>

        <div className="header-controls-group">
          <button className="btn-secondary-action" onClick={handleDownloadCertificate}>
            <FileTextIcon size={14} />
            <span>Export scenario report (.txt)</span>
          </button>
          <button className="btn-primary-action" onClick={() => setShowFormulaModal(true)}>
            <span>Inspect Normalization Formula</span>
          </button>
        </div>
      </header>

      {/* ── Top Summary KPIs (Section 28 of Spec) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
        <div className="card-clean" style={{ padding: '16px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Demo scenarios</span>
          <div style={{ fontSize: '24px', fontWeight: 650, color: '#bd6249', marginTop: '2px' }}>3 cases</div>
          <small style={{ color: 'var(--text-muted)' }}>No live telemetry logging</small>
        </div>

        <div className="card-clean" style={{ padding: '16px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Demo scenarios</span>
          <div style={{ fontSize: '24px', fontWeight: 650, color: '#5e7e60', marginTop: '2px' }}>18 examples</div>
          <small style={{ color: '#5e7e60', fontWeight: 600 }}>Synthetic history only</small>
        </div>

        <div className="card-clean" style={{ padding: '16px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scenario review state</span>
          <div style={{ fontSize: '24px', fontWeight: 650, color: '#a8793e', marginTop: '2px' }}>2 awaiting</div>
          <small style={{ color: 'var(--text-muted)' }}>Illustrative workflow</small>
        </div>

        <div className="card-clean" style={{ padding: '16px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Modelled savings (illustrative)</span>
          <div style={{ fontSize: '24px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '2px' }}>No field data</div>
          <small style={{ color: '#5e7e60', fontWeight: 600 }}>Illustrative annualized estimate</small>
        </div>
      </div>

      {/* ── Intervention Outcome Detail (Section 29 of Spec) ── */}
      <div className="card-clean" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="best-tag">MODELLED SCENARIO</span>
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>WO-ENG-7922 &bull; Feeder F-03</span>
            </div>
            <h2 style={{ margin: '8px 0 2px', fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--text-primary)' }}>
              CMP-01 Pneumatic Leak Repair Outcome
            </h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
              Synthetic inputs demonstrate how normalized savings calculations could be reviewed after a real intervention.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Model prediction vs scenario input</span>
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' }}>
                Predicted: <span className="font-mono"><strong>-1.5 kWh/t</strong></span> &bull; Scenario input: <span className="font-mono" style={{ color: '#5e7e60' }}><strong>-1.2 kWh/t</strong></span>
              </div>
            </div>
            <span className="provenance-badge provenance-simulated">Modelled</span>
          </div>
        </div>

        {/* ── Baseline Normalization Strip (Section 29 of Spec) ── */}
        <div style={{ margin: '18px 0', padding: '14px', borderRadius: '8px', background: 'var(--bg-ground)', border: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Baseline Normalization Parameters (IPMVP Option B)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', fontSize: '11.5px' }}>
            <div>Production Throughput: <strong>{actualTonnage} t/day</strong></div>
            <div>Ambient Temperature: <strong>{ambientTempActual}°C (+3.5°C delta)</strong></div>
            <div>Product Metallurgy: <strong>Grade SG 500/7 (Matched)</strong></div>
            <div>Operating Hours: <strong>24 hrs continuous (Matched)</strong></div>
          </div>
        </div>

        {/* SEC Normalized Comparison Strip (Section 29 of Spec) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
          <div style={{ padding: '14px', borderRadius: '7px', border: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Baseline SEC</span>
            <div style={{ fontSize: '20px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '2px' }}>11.2 kWh/t</div>
            <small style={{ color: 'var(--text-muted)' }}>Pre-intervention incident</small>
          </div>

          <div style={{ padding: '14px', borderRadius: '7px', border: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Normalized Baseline</span>
            <div style={{ fontSize: '20px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '2px' }}>11.0 kWh/t</div>
            <small style={{ color: 'var(--text-muted)' }}>Routine weather adjustment</small>
          </div>

          <div style={{ padding: '14px', borderRadius: '7px', border: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Post-Intervention</span>
            <div style={{ fontSize: '20px', fontWeight: 650, color: '#5e7e60', marginTop: '2px' }}>9.8 kWh/t</div>
            <small style={{ color: '#5e7e60', fontWeight: 600 }}>Illustrative scenario value</small>
          </div>

          <div style={{ padding: '14px', borderRadius: '7px', border: '1px solid #5e7e60', background: 'var(--bg-surface)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Modelled scenario impact</span>
            <div style={{ fontSize: '20px', fontWeight: 650, color: '#5e7e60', marginTop: '2px' }}>-1.2 kWh/t</div>
            <small style={{ color: '#5e7e60', fontWeight: 600 }}>Scenario estimate; not measured</small>
          </div>
        </div>
      </div>

      {/* ── Expandable Audit Trail (Section 30 of Spec) ── */}
      <div className="card-clean" style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 14px', fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text-primary)' }}>
          Traceable M&V Audit Trail
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {auditStages.map((st) => (
            <div
              key={st.id}
              style={{
                padding: '12px 14px',
                borderRadius: '7px',
                background: 'var(--bg-ground)',
                border: '1px solid var(--glass-border)',
                cursor: 'pointer',
              }}
              onClick={() => setExpandedStage(expandedStage === st.id ? null : st.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircleIcon size={15} style={{ color: '#5e7e60' }} />
                  <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>{st.title}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{st.date}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{expandedStage === st.id ? '▴' : '▾'}</span>
                </div>
              </div>

              {expandedStage === st.id && (
                <p style={{ margin: '8px 0 0', paddingLeft: '25px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {st.summary}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Formula Modal */}
      {showFormulaModal && (
        <div className="command-palette-backdrop" onClick={() => setShowFormulaModal(false)}>
          <div className="command-palette-modal" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '17px', color: 'var(--text-primary)' }}>
                IPMVP Equation & Normalization Logic
              </h3>
              <button className="header-icon-btn" onClick={() => setShowFormulaModal(false)}>✕</button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-ground)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)' }}>
                Modelled change = (Assumed baseline SEC × Routine adjustments) - Scenario SEC input
              </div>
              <p style={{ margin: 0 }}>
                Routine adjustments isolate weather (ambient temperature alpha = 0.004/°C) and product tonnage from physical energy efficiency changes.
              </p>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-secondary-action" onClick={() => setShowFormulaModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
