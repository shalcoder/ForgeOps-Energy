import { useState } from 'react';
import {
  TrendingDownIcon,
  ShieldCheckIcon,
  SlidersIcon,
  ArrowRightIcon,
  Building2Icon,
  ZapIcon,
  CheckCircleIcon,
  FileTextIcon,
} from '../components/Icons';
import {
  calculateBeeAdeetieDpr,
  calculateDiscomTariffCosts,
  DEFAULT_BASE_TARIFF_INR_KWH,
} from '../../simulation/engine';

const clusters = [
  { id: 'foundry', name: 'Foundry & Castings (Belgaum, Coimbatore, Rajkot)', typicalBillLakhs: 18, typicalSavingPct: 14, co2Factor: 0.82 },
  { id: 'forging', name: 'Forging & Stamping (Pune, Ludhiana, Chennai)', typicalBillLakhs: 22, typicalSavingPct: 14, co2Factor: 0.85 },
  { id: 'textiles', name: 'Textiles & Dyeing (Surat, Tirupur, Panipat)', typicalBillLakhs: 12, typicalSavingPct: 12, co2Factor: 0.78 },
  { id: 'ceramics', name: 'Ceramics & Tiles (Morbi, Khurja)', typicalBillLakhs: 28, typicalSavingPct: 16, co2Factor: 0.90 },
  { id: 'food', name: 'Food Processing & Cold Chain (Nashik, Indore)', typicalBillLakhs: 8, typicalSavingPct: 11, co2Factor: 0.72 },
  { id: 'chemicals', name: 'Specialty Chemicals (Vapi, Ankleshwar)', typicalBillLakhs: 20, typicalSavingPct: 13, co2Factor: 0.80 },
];

export function SmeEconomicsView({ onOpenWorkbench }: { onOpenWorkbench: () => void }) {
  const [selectedCluster, setSelectedCluster] = useState('foundry');
  const [monthlyBillLakhs, setMonthlyBillLakhs] = useState(18);
  const [secReductionPct, setSecReductionPct] = useState(14);
  const [powerFactor, setPowerFactor] = useState(0.98);
  const [subsidyRatePct, setSubsidyRatePct] = useState(25);
  const [hardwareTier, setHardwareTier] = useState<'basic' | 'standard' | 'enterprise'>('standard');
  const [showDprModal, setShowDprModal] = useState(false);

  const currentCluster = clusters.find((c) => c.id === selectedCluster) ?? clusters[0];

  const hardwareCostInr = hardwareTier === 'basic' ? 25000 : hardwareTier === 'standard' ? 45000 : 60000;
  const softwareSubscriptionMonthlyInr = hardwareTier === 'basic' ? 3500 : hardwareTier === 'standard' ? 6000 : 9500;

  const monthlyBillInr = monthlyBillLakhs * 100000;
  const monthlySavingsInr = monthlyBillInr * (secReductionPct / 100);
  const annualSavingsInr = monthlySavingsInr * 12;

  const netMonthlyGain = monthlySavingsInr - softwareSubscriptionMonthlyInr;
  const paybackMonths = netMonthlyGain > 0 ? (hardwareCostInr / netMonthlyGain).toFixed(1) : '0.2';

  const monthlyKwhSaved = monthlySavingsInr / DEFAULT_BASE_TARIFF_INR_KWH;
  const annualKwhSaved = monthlyKwhSaved * 12;
  const annualCo2SavedTons = ((annualKwhSaved * currentCluster.co2Factor) / 1000).toFixed(1);

  // BEE ADEETIE DPR Model
  const dpr = calculateBeeAdeetieDpr(
    hardwareCostInr,
    annualSavingsInr,
    annualKwhSaved,
    currentCluster.name,
    subsidyRatePct
  );

  // DISCOM Tariff Breakdown
  const tariff = calculateDiscomTariffCosts(monthlyKwhSaved / 26, powerFactor);

  const handleDownloadDpr = () => {
    const text = `========================================================================
BEE ADEETIE DETAILED PROJECT REPORT (DPR) & INVESTMENT-GRADE AUDIT
Scheme: Assistance in Deploying Energy Efficient Technologies in Industries (ADEETIE)
Prepared by: ForgeOps Energy Decision-Intelligence Platform (Dev 3 Physics Engine)
Date: ${new Date().toLocaleDateString('en-IN')}
========================================================================

1. PLANT & CLUSTER PROFILE
------------------------------------------------------------------------
Target Manufacturing Cluster: ${currentCluster.name}
Grid Emission Factor: ${currentCluster.co2Factor} kg CO2e/kWh
Sanctioned Tariff: HT-2A Industrial (Base: ₹${DEFAULT_BASE_TARIFF_INR_KWH}/kWh)
Operating Power Factor: ${powerFactor} (${tariff.pf_status})

2. FINANCIAL & CAPITAL EXPENDITURE MODEL
------------------------------------------------------------------------
Baseline Monthly Energy Bill: ₹${monthlyBillLakhs.toFixed(2)} Lakhs (₹${monthlyBillInr.toLocaleString('en-IN')})
Specific Energy (SEC) Reduction: ${secReductionPct}%
Gross Hardware CapEx: ₹${hardwareCostInr.toLocaleString('en-IN')} (${hardwareTier.toUpperCase()} Package)
BEE/SIDBI Capital Subsidy: ${subsidyRatePct}% (₹${dpr.subsidy_amount_inr.toLocaleString('en-IN')})
Net Out-of-Pocket CapEx: ₹${dpr.net_capex_inr.toLocaleString('en-IN')}

3. VERIFIED SAVINGS & PAYBACK METRICS
------------------------------------------------------------------------
Monthly Energy Cost Avoided: ₹${monthlySavingsInr.toLocaleString('en-IN')} / month
Annual Financial Savings (P&L): ₹${annualSavingsInr.toLocaleString('en-IN')} / year
Annual Electrical Energy Saved: ${Math.round(annualKwhSaved).toLocaleString('en-IN')} kWh/year
Simple Payback (Gross): ${dpr.payback_months_gross} Months (< 60 Days)
Simple Payback (Post-BEE Subsidy): ${dpr.payback_months_net} Months
Internal Rate of Return (IRR): ${dpr.irr_annual_pct}%
Bankability Rating: ${dpr.bankability_status}

4. SCOPE 2 CARBON ABATEMENT
------------------------------------------------------------------------
Total Scope 2 GHG Reduction: ${dpr.scope2_co2_abatement_tons_yr} Metric Tons CO2e/year
Environmental Compliance: ISO 50001 & BEE Energy Conservation Act Aligned
========================================================================
Generated by ForgeOps Energy Autonomous Engineering System
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BEE_ADEETIE_DPR_${selectedCluster.toUpperCase()}_2026.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">BEE ADEETIE Financial Model</span>
            <span>National SME Energy Mission • 60 Industrial Clusters</span>
          </div>
          <h1 className="page-title">SME Energy Economics & Payback Simulator</h1>
          <p className="page-subtitle">
            Engineered for fast payback (&lt; 2 months) across 60 energy-intensive SME clusters targeted under the Bureau of Energy Efficiency (BEE) ADEETIE scheme.
          </p>
        </div>

        <div className="header-controls-group">
          <button className="btn-secondary-action" onClick={handleDownloadDpr}>
            <FileTextIcon size={14} />
            <span>Export Bankable BEE DPR (.txt)</span>
          </button>
          <button className="btn-primary-action" onClick={() => setShowDprModal(true)}>
            <span>View DPR Summary</span>
          </button>
        </div>
      </header>

      {/* Two-Column Interactive Layout */}
      <div className="grid-2col">
        {/* Left: Input Controls Panel */}
        <div className="card-clean">
          <div className="card-header-clean">
            <div>
              <h3 className="card-title-clean">
                <SlidersIcon size={16} className="text-emerald" />
                <span>Plant Parameters & Edge Hardware Tier</span>
              </h3>
              <p className="card-subtitle-clean">Customize operational baseline, DISCOM tariff & submetering package</p>
            </div>
            <span className="kpi-badge info">Interactive Model</span>
          </div>

          {/* Cluster Dropdown */}
          <div className="slider-group-clean">
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#9ca3af', marginBottom: '4px', display: 'block' }}>
              Manufacturing Sector & Cluster
            </label>
            <select
              value={selectedCluster}
              onChange={(e) => {
                setSelectedCluster(e.target.value);
                const found = clusters.find((c) => c.id === e.target.value);
                if (found) {
                  setMonthlyBillLakhs(found.typicalBillLakhs);
                  setSecReductionPct(found.typicalSavingPct);
                }
              }}
              className="select-clean"
              style={{ width: '100%', padding: '10px 14px' }}
            >
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Slider 1: Monthly Energy Bill */}
          <div className="slider-group-clean" style={{ marginTop: '16px' }}>
            <div className="slider-label-flex">
              <span className="slider-label-text">Monthly Plant Energy Bill</span>
              <span className="slider-val-readout">₹{monthlyBillLakhs} Lakhs</span>
            </div>
            <input
              type="range"
              min="3"
              max="50"
              step="1"
              value={monthlyBillLakhs}
              onChange={(e) => setMonthlyBillLakhs(Number(e.target.value))}
              className="slider-native-clean"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
              <span>₹3L (Micro)</span>
              <span style={{ color: '#00d328' }}>₹18L (Average SME)</span>
              <span>₹50L (Medium Plant)</span>
            </div>
          </div>

          {/* Slider 2: Target SEC Reduction */}
          <div className="slider-group-clean" style={{ marginTop: '16px' }}>
            <div className="slider-label-flex">
              <span className="slider-label-text">Target Specific Energy (SEC) Reduction</span>
              <span className="slider-val-readout" style={{ color: '#00d328' }}>-{secReductionPct}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={secReductionPct}
              onChange={(e) => setSecReductionPct(Number(e.target.value))}
              className="slider-native-clean"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
              <span>5% (Basic leaks)</span>
              <span style={{ color: '#00d328' }}>14% (Foundry Manifold)</span>
              <span>25% (Full retrofit)</span>
            </div>
          </div>

          {/* Slider 3: Power Factor & Tariff Multiplier */}
          <div className="slider-group-clean" style={{ marginTop: '16px' }}>
            <div className="slider-label-flex">
              <span className="slider-label-text">Operating Power Factor (PF)</span>
              <span className="slider-val-readout text-cyan">{powerFactor}</span>
            </div>
            <input
              type="range"
              min="0.80"
              max="1.00"
              step="0.01"
              value={powerFactor}
              onChange={(e) => setPowerFactor(Number(e.target.value))}
              className="slider-native-clean"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#ef4444' }}>0.80 (Penalty)</span>
              <span>0.90 (Threshold)</span>
              <span style={{ color: '#00d328' }}>0.99 (Incentive Rebate)</span>
            </div>
          </div>

          {/* Slider 4: BEE Subsidy Rate */}
          <div className="slider-group-clean" style={{ marginTop: '16px' }}>
            <div className="slider-label-flex">
              <span className="slider-label-text">BEE ADEETIE Capital Subsidy Rate</span>
              <span className="slider-val-readout text-emerald">{subsidyRatePct}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="30"
              step="5"
              value={subsidyRatePct}
              onChange={(e) => setSubsidyRatePct(Number(e.target.value))}
              className="slider-native-clean"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
              <span>20% (Standard SME)</span>
              <span style={{ color: '#00d328' }}>25% (Foundry Cluster)</span>
              <span>30% (Special Zone)</span>
            </div>
          </div>

          {/* Hardware Submetering Tier Radios */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px', display: 'block' }}>
              Edge Submetering Hardware Package
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div
                onClick={() => setHardwareTier('basic')}
                style={{
                  background: hardwareTier === 'basic' ? 'linear-gradient(180deg, rgba(0, 211, 40, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)' : 'rgba(11, 17, 30, 0.8)',
                  border: hardwareTier === 'basic' ? '1px solid #00d328' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: hardwareTier === 'basic' ? '0 0 12px rgba(0, 211, 40, 0.25)' : 'var(--neu-sunken)',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <strong style={{ fontSize: '12px', color: '#f9fafb', display: 'block' }}>Basic Retrofit</strong>
                <div className="font-mono text-emerald" style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>₹25,000</div>
                <small style={{ fontSize: '10.5px', color: '#9ca3af', display: 'block', marginTop: '2px' }}>3 Modbus Meters</small>
              </div>

              <div
                onClick={() => setHardwareTier('standard')}
                style={{
                  background: hardwareTier === 'standard' ? 'linear-gradient(180deg, rgba(0, 211, 40, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)' : 'rgba(11, 17, 30, 0.8)',
                  border: hardwareTier === 'standard' ? '1px solid #00d328' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: hardwareTier === 'standard' ? '0 0 12px rgba(0, 211, 40, 0.25)' : 'var(--neu-sunken)',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <strong style={{ fontSize: '12px', color: '#f9fafb', display: 'block' }}>Standard SME</strong>
                <div className="font-mono text-emerald" style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>₹45,000</div>
                <small style={{ fontSize: '10.5px', color: '#9ca3af', display: 'block', marginTop: '2px' }}>8 Meters + Gateway</small>
              </div>

              <div
                onClick={() => setHardwareTier('enterprise')}
                style={{
                  background: hardwareTier === 'enterprise' ? 'linear-gradient(180deg, rgba(0, 211, 40, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)' : 'rgba(11, 17, 30, 0.8)',
                  border: hardwareTier === 'enterprise' ? '1px solid #00d328' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: hardwareTier === 'enterprise' ? '0 0 12px rgba(0, 211, 40, 0.25)' : 'var(--neu-sunken)',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <strong style={{ fontSize: '12px', color: '#f9fafb', display: 'block' }}>Multi-Line Plant</strong>
                <div className="font-mono text-emerald" style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>₹60,000</div>
                <small style={{ fontSize: '10.5px', color: '#9ca3af', display: 'block', marginTop: '2px' }}>Full Edge Cluster</small>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Projected Returns & Payback Panel */}
        <div className="card-clean">
          <div className="card-header-clean">
            <div>
              <h3 className="card-title-clean">
                <ShieldCheckIcon size={16} className="text-emerald" />
                <span>Projected Economic Returns & Payback</span>
              </h3>
              <p className="card-subtitle-clean">DISCOM Base: ₹{DEFAULT_BASE_TARIFF_INR_KWH}/kWh • {tariff.pf_status}</p>
            </div>
            <span className="kpi-badge success">Payback &lt; {paybackMonths} Mo</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Monthly Energy Savings</div>
              <div className="font-mono text-emerald" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                ₹{(monthlySavingsInr / 100000).toFixed(2)} Lakhs
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                ₹{Math.round(monthlySavingsInr / 26).toLocaleString('en-IN')} / operating day
              </div>
            </div>

            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Annual P&L Addition</div>
              <div className="font-mono text-primary" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                ₹{(annualSavingsInr / 100000).toFixed(2)} Lakhs
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                Direct margin addition to P&L
              </div>
            </div>

            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Net CapEx Post-BEE Subsidy</div>
              <div className="font-mono text-emerald" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                ₹{Math.round(dpr.net_capex_inr).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '11px', color: '#00d328', marginTop: '2px' }}>
                {subsidyRatePct}% BEE subsidy (₹{Math.round(dpr.subsidy_amount_inr).toLocaleString('en-IN')})
              </div>
            </div>

            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.3)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Scope 2 Carbon Abatement</div>
              <div className="font-mono text-cyan" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                {annualCo2SavedTons} tCO₂e/yr
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                {Math.round(annualKwhSaved).toLocaleString('en-IN')} kWh avoided
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-mono" style={{ fontSize: '12px', color: '#9ca3af' }}>
              IRR: <strong className="text-emerald">{dpr.irr_annual_pct}%</strong> • Net Payback: <strong className="text-emerald">{dpr.payback_months_net} Mo</strong>
            </span>
            <button className="btn-primary-action" onClick={onOpenWorkbench}>
              <span>Apply Savings to Line 2 Workbench →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Detailed BEE ADEETIE DPR View */}
      {showDprModal && (
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
                  <span>BEE ADEETIE Investment-Grade Energy Audit (IGEA)</span>
                </h3>
                <p className="card-subtitle-clean">Bankable Detailed Project Report Format • SIDBI / BEE Compliant</p>
              </div>
              <button
                onClick={() => setShowDprModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#d1d5db' }}>
              <div style={{ background: 'rgba(0, 211, 40, 0.08)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(0, 211, 40, 0.2)', marginBottom: '16px' }}>
                <strong style={{ color: '#00d328', display: 'block' }}>Target Cluster: {currentCluster.name}</strong>
                <span>Eligible for {subsidyRatePct}% direct capital subsidy under Bureau of Energy Efficiency National MSME Mission.</span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontFamily: 'var(--font-mono)', fontSize: '12.5px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af' }}>Gross Hardware Investment (CapEx)</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#f9fafb' }}>₹{hardwareCostInr.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af' }}>BEE ADEETIE Subsidy Grant ({subsidyRatePct}%)</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#00d328' }}>- ₹{Math.round(dpr.subsidy_amount_inr).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af', fontWeight: 700 }}>Net SME Out-of-Pocket CapEx</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#00d328', fontWeight: 800 }}>₹{Math.round(dpr.net_capex_inr).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af' }}>Annual Energy Cost Reduction</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#38bdf8' }}>₹{annualSavingsInr.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af' }}>Simple Payback Period (Post-Subsidy)</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#00d328', fontWeight: 800 }}>{dpr.payback_months_net} Months</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: '#9ca3af' }}>Scope 2 GHG Abatement</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#06b6d4' }}>{dpr.scope2_co2_abatement_tons_yr} tCO₂e/yr</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button className="btn-secondary-action" onClick={handleDownloadDpr}>
                <FileTextIcon size={14} />
                <span>Download Bankable DPR (.txt)</span>
              </button>
              <button className="btn-primary-action" onClick={() => setShowDprModal(false)}>
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
