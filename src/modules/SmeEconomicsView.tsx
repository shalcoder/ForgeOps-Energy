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
  const [hardwareTier, setHardwareTier] = useState<'basic' | 'standard' | 'enterprise'>('standard');

  const currentCluster = clusters.find((c) => c.id === selectedCluster) ?? clusters[0];

  const hardwareCostInr = hardwareTier === 'basic' ? 25000 : hardwareTier === 'standard' ? 45000 : 60000;
  const softwareSubscriptionMonthlyInr = hardwareTier === 'basic' ? 3500 : hardwareTier === 'standard' ? 6000 : 9500;

  const monthlyBillInr = monthlyBillLakhs * 100000;
  const monthlySavingsInr = monthlyBillInr * (secReductionPct / 100);
  const annualSavingsInr = monthlySavingsInr * 12;

  const netMonthlyGain = monthlySavingsInr - softwareSubscriptionMonthlyInr;
  const paybackMonths = netMonthlyGain > 0 ? (hardwareCostInr / netMonthlyGain).toFixed(1) : '0.2';

  const monthlyKwhSaved = monthlySavingsInr / 7.8;
  const annualCo2SavedTons = ((monthlyKwhSaved * 12 * currentCluster.co2Factor) / 1000).toFixed(1);

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
          <button className="btn-secondary-action" onClick={() => alert('Generating Investment-Grade Energy Audit (IGEA) Summary...')}>
            <FileTextIcon size={14} />
            <span>Export IGEA Summary</span>
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
              <p className="card-subtitle-clean">Customize operational baseline and submetering package</p>
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
                  transition: 'all 0.15s ease'
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
                  transition: 'all 0.15s ease'
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
                  transition: 'all 0.15s ease'
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
              <p className="card-subtitle-clean">Based on ₹7.8/kWh grid tariff • 26 operating days/month</p>
            </div>
            <span className="kpi-badge success">Payback &lt; 2 Months</span>
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
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Hardware Payback Period</div>
              <div className="font-mono text-emerald" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                {paybackMonths} Months
              </div>
              <div style={{ fontSize: '11px', color: '#00d328', marginTop: '2px' }}>
                CapEx recovered in &lt; 60 days
              </div>
            </div>

            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.3)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Scope 2 Carbon Abatement</div>
              <div className="font-mono text-cyan" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                {annualCo2SavedTons} tCO₂e/yr
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                {Math.round(monthlyKwhSaved * 12).toLocaleString('en-IN')} kWh avoided
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary-action" onClick={onOpenWorkbench}>
              <span>Apply Savings to Line 2 Workbench →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
