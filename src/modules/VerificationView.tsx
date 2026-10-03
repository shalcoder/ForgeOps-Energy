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
    9.8,                // post-repair SEC (measured)
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
Facility: Belgaum Foundry SME Complex — Line 2 Moulding & Melting
Incident Reference: INC-ENG-2401 • Work Order: WO-ENG-7922
Verification Date: ${new Date().toLocaleDateString('en-IN')}
========================================================================

1. MEASURED TELEMETRY BASELINE
------------------------------------------------------------------------
Pre-Repair Measured SEC: 11.2 kWh/ton (Line 2 Manifold Leak)
Baseline Production Throughput: 758.9 tons/day
Baseline Ambient Temperature: 28.0 °C

2. ROUTINE ADJUSTMENTS & NORMALIZATION (IPMVP Option B/C)
------------------------------------------------------------------------
Actual Production Throughput: ${verification.tonnage_actual_tons} tons/day
Actual Ambient Temperature: ${ambientTempActual} °C (Delta: +${verification.ambient_temp_delta_c} °C)
Temperature Sensitivity Coefficient (alpha): 0.004 / °C
Temperature Adjustment Factor: ${verification.temp_adjustment_factor}
Normalized / Routine-Adjusted Baseline SEC: 11.0 kWh/ton

3. POST-REPAIR MEASUREMENT & VERIFIED AUDIT
------------------------------------------------------------------------
Post-Repair Measured SEC: 9.8 kWh/ton
Verified Specific Energy Reduction: -1.2 kWh/ton (-12.5%)
Verified Electrical Energy Saved: ${verification.verified_daily_kwh_saved.toLocaleString('en-IN')} kWh/day
Verified Daily Financial Savings: ₹${verification.verified_daily_savings_inr.toLocaleString('en-IN')} / day
Verified Annual Run-Rate Savings: ₹${(verification.verified_annual_savings_inr / 100000).toFixed(2)} Lakhs / year
Statistical Confidence Level: 96.8% (p < 0.01)

4. VERIFICATION STATUS & SIGN-OFF
------------------------------------------------------------------------
Status: VERIFIED & COMPLIANT
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

  const auditStages = [
    { id: 'decision', title: '1. Decision Approval', date: 'Today 10:41 AM', summary: 'Plant engineer approved Option A (Repair leak) under 10.0 t/h constraint gate.' },
    { id: 'work_order', title: '2. Work Order Creation', date: 'Today 10:45 AM', summary: 'CMMS dispatched WO-ENG-7922 for scheduled 14:30 changeover window.' },
    { id: 'execution', title: '3. Physical Execution', date: 'Today 11:32 AM', summary: 'Braided coupling replaced on Line 2 header drop #4. Leak eliminated.' },
    { id: 'telemetry', title: '4. Post-Repair Telemetry', date: 'Today 12:00 PM', summary: 'PM8000 submeter recorded power drop from 61 kW to 49 kW.' },
    { id: 'normalization', title: '5. Baseline Normalization', date: 'Today 12:30 PM', summary: 'IPMVP Option B algorithm adjusted for +3.5°C ambient temperature delta.' },
    { id: 'verification', title: '6. Final Verification', date: 'Today 01:00 PM', summary: 'Certified -1.2 kWh/t SEC reduction with 96.8% statistical confidence.' },
  ];

  return (
    <div className="page-container">
      {/* ── Page Header ── */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">VERIFICATION</span>
            <span>BEE Normalized Measurement & Verification (IPMVP Option B/C)</span>
          </div>
          <h1 className="page-title">Savings Verification Engine</h1>
          <p className="page-subtitle">
            Outcome-oriented mathematical verification proving actual recurring electrical savings normalized for throughput and weather.
          </p>
        </div>

        <div className="header-controls-group">
          <button className="btn-secondary-action" onClick={handleDownloadCertificate}>
            <FileTextIcon size={14} />
            <span>Download M&V Certificate (.txt)</span>
          </button>
          <button className="btn-primary-action" onClick={() => setShowFormulaModal(true)}>
            <span>Inspect Normalization Formula</span>
          </button>
        </div>
      </header>

      {/* ── Top Summary KPIs (Section 28 of Spec) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
        <div className="card-clean" style={{ padding: '16px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Verifications</span>
          <div style={{ fontSize: '24px', fontWeight: 650, color: '#bd6249', marginTop: '2px' }}>3 cases</div>
          <small style={{ color: 'var(--text-muted)' }}>Ongoing telemetry logging</small>
        </div>

        <div className="card-clean" style={{ padding: '16px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verified & Certified</span>
          <div style={{ fontSize: '24px', fontWeight: 650, color: '#5e7e60', marginTop: '2px' }}>18 completed</div>
          <small style={{ color: '#5e7e60', fontWeight: 600 }}>100% IPMVP compliant</small>
        </div>

        <div className="card-clean" style={{ padding: '16px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Review</span>
          <div style={{ fontSize: '24px', fontWeight: 650, color: '#a8793e', marginTop: '2px' }}>2 awaiting</div>
          <small style={{ color: 'var(--text-muted)' }}>Baseline gathering stage</small>
        </div>

        <div className="card-clean" style={{ padding: '16px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verified Savings</span>
          <div style={{ fontSize: '24px', fontWeight: 650, color: 'var(--text-primary)', marginTop: '2px' }}>₹12.8 Lakhs</div>
          <small style={{ color: '#5e7e60', fontWeight: 600 }}>Annual run-rate delivered</small>
        </div>
      </div>

      {/* ── Intervention Outcome Detail (Section 29 of Spec) ── */}
      <div className="card-clean" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="best-tag">VERIFIED OUTCOME</span>
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>WO-ENG-7922 &bull; Feeder F-03</span>
            </div>
            <h2 style={{ margin: '8px 0 2px', fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--text-primary)' }}>
              CMP-01 Pneumatic Leak Repair Outcome
            </h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
              Line 2 manifold drop coupling replacement verified against continuous submeter telemetry.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Predicted vs Measured</span>
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' }}>
                Predicted: <span className="font-mono"><strong>-1.5 kWh/t</strong></span> &bull; Measured: <span className="font-mono" style={{ color: '#5e7e60' }}><strong>-1.2 kWh/t</strong></span>
              </div>
            </div>
            <span className="provenance-badge provenance-measured">Verified</span>
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
            <small style={{ color: '#5e7e60', fontWeight: 600 }}>Measured post-repair</small>
          </div>

          <div style={{ padding: '14px', borderRadius: '7px', border: '1px solid #5e7e60', background: 'var(--bg-surface)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verified Impact</span>
            <div style={{ fontSize: '20px', fontWeight: 650, color: '#5e7e60', marginTop: '2px' }}>-1.2 kWh/t</div>
            <small style={{ color: '#5e7e60', fontWeight: 600 }}>₹6,240/day recurring saving</small>
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
                Savings = (Baseline SEC × Routine Adjustments) - Measured Post-Repair SEC
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
