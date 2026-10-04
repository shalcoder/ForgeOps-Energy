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
  calculateLoadShiftingArbitrage,
  calculateFuelSwitching,
  calculateBrsrCarbonDisclosure,
  DEFAULT_BASE_TARIFF_INR_KWH,
} from '../../simulation/engine';

const clusters = [
  { id: 'foundry', name: 'Foundry & Castings (Belgaum, Coimbatore, Rajkot)', planningBillLakhs: 23.73, planningSavingPct: 10, co2Factor: 0.82 },
  { id: 'forging', name: 'Forging & Stamping (Pune, Ludhiana, Chennai)', planningBillLakhs: 22, planningSavingPct: 14, co2Factor: 0.85 },
  { id: 'textiles', name: 'Textiles & Dyeing (Surat, Tirupur, Panipat)', planningBillLakhs: 12, planningSavingPct: 12, co2Factor: 0.78 },
  { id: 'ceramics', name: 'Ceramics & Tiles (Morbi, Khurja)', planningBillLakhs: 28, planningSavingPct: 16, co2Factor: 0.90 },
  { id: 'food', name: 'Food Processing & Cold Chain (Nashik, Indore)', planningBillLakhs: 8, planningSavingPct: 11, co2Factor: 0.72 },
  { id: 'chemicals', name: 'Specialty Chemicals (Vapi, Ankleshwar)', planningBillLakhs: 20, planningSavingPct: 13, co2Factor: 0.80 },
];

export function SmeEconomicsView({ onOpenWorkbench }: { onOpenWorkbench: () => void }) {
  const [activeSection, setActiveSection] = useState<'bee_dpr' | 'load_shifting' | 'fuel_switching' | 'brsr_esg'>('bee_dpr');
  const [selectedCluster, setSelectedCluster] = useState('foundry');
  const [monthlyBillLakhs, setMonthlyBillLakhs] = useState(23.73);
  const [secReductionPct, setSecReductionPct] = useState(10);
  const [powerFactor, setPowerFactor] = useState(0.98);
  const [subsidyRatePct, setSubsidyRatePct] = useState(0);
  const [hardwareTier, setHardwareTier] = useState<'basic' | 'standard' | 'enterprise'>('standard');
  const [showDprModal, setShowDprModal] = useState(false);

  // Load Shifting & Solar Arbitrage State
  const [shiftableKwhDaily, setShiftableKwhDaily] = useState(1600);

  // Fuel Switching State
  const [baselineFuel, setBaselineFuel] = useState<'furnace_oil' | 'coal' | 'diesel'>('furnace_oil');
  const [targetFuel, setTargetFuel] = useState<'png' | 'biomass_briquettes'>('png');
  const [annualThermalGj, setAnnualThermalGj] = useState(12500);

  const currentCluster = clusters.find((c) => c.id === selectedCluster) ?? clusters[0];

  const hardwareCostInr = hardwareTier === 'basic' ? 75000 : hardwareTier === 'standard' ? 120000 : 200000;
  const softwareSubscriptionMonthlyInr = hardwareTier === 'basic' ? 3500 : hardwareTier === 'standard' ? 6000 : 9500;

  const monthlyBillInr = monthlyBillLakhs * 100000;
  const monthlySavingsInr = monthlyBillInr * (secReductionPct / 100);
  const annualSavingsInr = monthlySavingsInr * 12;

  const netMonthlyGain = monthlySavingsInr - softwareSubscriptionMonthlyInr;
  const paybackMonths = netMonthlyGain > 0 ? (hardwareCostInr / netMonthlyGain).toFixed(1) : 'N/A';

  const monthlyKwhSaved = monthlySavingsInr / DEFAULT_BASE_TARIFF_INR_KWH;
  const annualKwhSaved = monthlyKwhSaved * 12;
  const annualCo2SavedTons = ((annualKwhSaved * currentCluster.co2Factor) / 1000).toFixed(1);

  // BEE ADEETIE DPR Model
  const dpr = calculateBeeAdeetieDpr(
    hardwareCostInr,
    Math.max(0, netMonthlyGain * 12),
    annualKwhSaved,
    currentCluster.name,
    subsidyRatePct
  );

  // DISCOM Tariff Breakdown
  const tariff = calculateDiscomTariffCosts(monthlyKwhSaved / 26, powerFactor);

  // Load Shifting Arbitrage Calculation
  const loadShift = calculateLoadShiftingArbitrage(shiftableKwhDaily);

  // Fuel Switching Calculation
  const fuelSwitch = calculateFuelSwitching(annualThermalGj, baselineFuel, targetFuel);

  // BRSR Core Carbon Disclosure
  const brsr = calculateBrsrCarbonDisclosure(annualKwhSaved * 8.5, 3720, annualKwhSaved, annualThermalGj);

  const handleDownloadDpr = () => {
    const text = `========================================================================
FORGEOPS ENERGY — ILLUSTRATIVE SCENARIO ECONOMICS
Not a DPR, investment-grade audit, eligibility determination, or savings verification
Prepared by: ForgeOps Energy prototype
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
Optional CapEx credit sensitivity (not an ADEETIE benefit): ${subsidyRatePct}% (₹${dpr.subsidy_amount_inr.toLocaleString('en-IN')})
Net modeled CapEx after optional credit assumption: ₹${dpr.net_capex_inr.toLocaleString('en-IN')}

3. MODELLED SAVINGS & PAYBACK ESTIMATES
------------------------------------------------------------------------
Monthly Energy Cost Avoided: ₹${monthlySavingsInr.toLocaleString('en-IN')} / month
Annual Financial Savings (P&L): ₹${annualSavingsInr.toLocaleString('en-IN')} / year
Annual Electrical Energy Saved: ${Math.round(annualKwhSaved).toLocaleString('en-IN')} kWh/year
Simple Payback (Gross): ${dpr.payback_months_gross} Months (< 60 Days)
Simple Payback after optional planning credit sensitivity (not an ADEETIE/BEE award): ${dpr.payback_months_net} Months
Annual net savings / modeled net CapEx ratio: ${dpr.annual_net_savings_to_capex_pct}%
Bankability Rating: ${dpr.bankability_status}

4. SCOPE 2 CARBON ABATEMENT
------------------------------------------------------------------------
Total Scope 2 GHG Reduction: ${dpr.scope2_co2_abatement_tons_yr} Metric Tons CO2e/year
This estimate is not an emissions inventory, ISO 50001 or BEE compliance attestation.
========================================================================
Generated by ForgeOps Energy Autonomous Engineering System
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ForgeOps_Energy_Scenario_Economics_${selectedCluster.toUpperCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadBrsr = () => {
    const text = `========================================================================
ILLUSTRATIVE ENERGY & CARBON WORKSHEET (NOT A DISCLOSURE)
Reference fields: SEBI BRSR Core and GHG Protocol categories; not compliant or assured reporting
Target Tier-1 Automotive Buyers: ${brsr.supply_chain_scorecard.target_buyers.join(', ')}
Facility: Belgaum Foundry SME Cluster • FY 2026-27
========================================================================

1. ENERGY INTENSITY METRICS
------------------------------------------------------------------------
Total Electricity Consumption: ${brsr.energy_metrics.total_electricity_consumption_mwh.toLocaleString('en-IN')} MWh
Thermal Fuel Consumption: ${brsr.energy_metrics.total_fuel_energy_consumption_gj.toLocaleString('en-IN')} GJ
Total Energy Consumption: ${brsr.energy_metrics.total_energy_consumption_gj.toLocaleString('en-IN')} GJ
Energy Intensity: ${brsr.energy_metrics.energy_intensity_gj_per_ton} GJ / metric ton of good castings
Baseline Intensity: ${brsr.energy_metrics.baseline_energy_intensity_gj_per_ton} GJ / metric ton
Modelled Energy Intensity Change: -${brsr.energy_metrics.intensity_reduction_pct}% (synthetic assumptions)

2. GREENHOUSE GAS (GHG) EMISSIONS
------------------------------------------------------------------------
Scope 1 Direct Thermal Emissions: ${brsr.ghg_emissions.scope_1_direct_emissions_tco2e} tCO2e
Scope 2 Indirect Grid Electricity: ${brsr.ghg_emissions.scope_2_indirect_grid_emissions_tco2e} tCO2e
Total Scope 1 + Scope 2: ${brsr.ghg_emissions.total_scope_1_and_2_tco2e} tCO2e
GHG Emission Intensity: ${brsr.ghg_emissions.ghg_intensity_tco2e_per_ton} tCO2e / metric ton
Annual CO2e Abated via ForgeOps: ${brsr.ghg_emissions.abated_emissions_via_forgeops_tco2e_yr} tCO2e / year

3. SUPPLY CHAIN COMPLIANCE STATUS
------------------------------------------------------------------------
OEM Audit Status: NOT ASSESSED
ISO 50001 Energy Management: NOT CERTIFIED
SEBI BRSR Core compliance: NOT ASSESSED
Audit trail hash: NOT PROVIDED
========================================================================
Generated by ForgeOps Energy Autonomous Decision-Intelligence Platform
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ForgeOps_Illustrative_Carbon_Worksheet_${selectedCluster.toUpperCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadFuelReport = () => {
    const text = `========================================================================
THERMAL DECARBONISATION & FUEL-SWITCHING FEASIBILITY REPORT
Target Process: ${fuelSwitch.application}
Plant Cluster: ${currentCluster.name}
========================================================================

1. FUEL TRANSITION SPECIFICATION
------------------------------------------------------------------------
Baseline Fossil Fuel: ${fuelSwitch.baseline_fuel_type} (Annual Cost: ₹${(fuelSwitch.baseline_fuel_cost_inr_yr / 100000).toFixed(2)} Lakhs)
Clean Replacement Fuel: ${fuelSwitch.clean_fuel_type} (Annual Cost: ₹${(fuelSwitch.clean_fuel_cost_inr_yr / 100000).toFixed(2)} Lakhs)
Annual Thermal Duty: ${annualThermalGj.toLocaleString('en-IN')} GJ

2. FINANCIAL & CAPITAL EXPENDITURE
------------------------------------------------------------------------
Burner & Pipeline Retrofit CapEx: ₹${fuelSwitch.equipment_conversion_capex_inr.toLocaleString('en-IN')}
Annual Operating Cost Savings: ₹${(fuelSwitch.annual_fuel_cost_savings_inr / 100000).toFixed(2)} Lakhs / year
Simple Payback Period: ${fuelSwitch.payback_months} Months

3. SCOPE 1 DIRECT DECARBONISATION
------------------------------------------------------------------------
Baseline Scope 1 Emissions: ${fuelSwitch.baseline_scope1_co2_tons_yr} tCO2e / year
Clean Scope 1 Emissions: ${fuelSwitch.clean_scope1_co2_tons_yr} tCO2e / year
Scope 1 GHG Reduction: -${fuelSwitch.scope1_co2_reduction_tons_yr} tCO2e / year (-${fuelSwitch.co2_reduction_pct}%)
Feasibility Score: ${fuelSwitch.feasibility_score}%
========================================================================
Generated by ForgeOps Energy Autonomous Decision-Intelligence Platform
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Fuel_Switching_Feasibility_${fuelSwitch.clean_fuel_type}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header-clean">
        <div>
          <div className="page-kicker">
            <span className="kicker-tag">SME ENERGY ECONOMICS</span>
            <span>Illustrative scenario calculator</span>
          </div>
          <h1 className="page-title">SME Energy Economics, Arbitrage & Decarbonisation</h1>
          <p className="page-subtitle">
            Explore tariff, installation, and energy-saving assumptions. Outputs are estimates; this prototype does not verify savings, certify disclosures, or determine scheme eligibility.
          </p>
        </div>

        <div className="header-controls-group" style={{ flexWrap: 'wrap', gap: '8px' }}>
          <button className="btn-secondary-action" onClick={handleDownloadDpr} title="Export an illustrative scenario economics report">
            <FileTextIcon size={14} />
            <span>Scenario economics (.txt)</span>
          </button>
          <button className="btn-secondary-action" onClick={handleDownloadBrsr} title="Export SEBI BRSR Core / GHG Protocol ESG Card for OEM buyers">
            <ShieldCheckIcon size={14} />
            <span>Carbon worksheet (.txt)</span>
          </button>
          <button className="btn-secondary-action" onClick={handleDownloadFuelReport} title="Export Thermal Fuel Switching Decarbonisation Study">
            <ZapIcon size={14} />
            <span>Fuel Switching (.txt)</span>
          </button>
          <button className="btn-primary-action" onClick={() => setShowDprModal(true)}>
            <span>View DPR Summary</span>
          </button>
        </div>
      </header>

      {/* Sub-Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }} aria-label="SME Economics Modules">
        <button
          className={`btn-secondary-action ${activeSection === 'bee_dpr' ? 'btn-primary-action' : ''}`}
          style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
          onClick={() => setActiveSection('bee_dpr')}
        >
          <Building2Icon size={14} />
          <span>Installation economics (scenario)</span>
        </button>
        <button
          className={`btn-secondary-action ${activeSection === 'load_shifting' ? 'btn-primary-action' : ''}`}
          style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
          onClick={() => setActiveSection('load_shifting')}
        >
          <ZapIcon size={14} />
          <span>ToD Load-Shifting (Solar Arbitrage)</span>
        </button>
        <button
          className={`btn-secondary-action ${activeSection === 'fuel_switching' ? 'btn-primary-action' : ''}`}
          style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
          onClick={() => setActiveSection('fuel_switching')}
        >
          <TrendingDownIcon size={14} />
          <span>Thermal Fuel-Switching (Scope 1)</span>
        </button>
        <button
          className={`btn-secondary-action ${activeSection === 'brsr_esg' ? 'btn-primary-action' : ''}`}
          style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
          onClick={() => setActiveSection('brsr_esg')}
        >
          <ShieldCheckIcon size={14} />
          <span>BRSR Core & OEM Supply Chain Card</span>
        </button>
      </nav>

      {/* 1. BEE ADEETIE Module */}
      {activeSection === 'bee_dpr' && (
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
                  setMonthlyBillLakhs(found.planningBillLakhs);
                  setSecReductionPct(found.planningSavingPct);
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

          {/* Optional incentive sensitivity is not a scheme eligibility determination. */}
          <div className="slider-group-clean" style={{ marginTop: '16px' }}>
            <div className="slider-label-flex">
              <span className="slider-label-text">Illustrative CapEx credit sensitivity (not ADEETIE)</span>
              <span className="slider-val-readout text-emerald">{subsidyRatePct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={subsidyRatePct}
              onChange={(e) => setSubsidyRatePct(Number(e.target.value))}
              className="slider-native-clean"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
              <span>0% (default)</span>
              <span style={{ color: '#00d328' }}>Planning sensitivity only</span>
              <span>30% (not a grant promise)</span>
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
              <div className="font-mono text-emerald" style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>₹75,000</div>
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
              <div className="font-mono text-emerald" style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>₹1,20,000</div>
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
              <div className="font-mono text-emerald" style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>₹2,00,000</div>
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
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Modelled gross annual savings</div>
              <div className="font-mono text-primary" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                ₹{(annualSavingsInr / 100000).toFixed(2)} Lakhs
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                Before subscription, maintenance, finance, tax and downtime
              </div>
            </div>

            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Modeled installation cost after optional credit</div>
              <div className="font-mono text-emerald" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                ₹{Math.round(dpr.net_capex_inr).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '11px', color: '#00d328', marginTop: '2px' }}>
          {subsidyRatePct}% optional planning credit (not ADEETIE; ₹{Math.round(dpr.subsidy_amount_inr).toLocaleString('en-IN')})
              </div>
            </div>

            <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.3)', boxShadow: 'var(--neu-sunken)' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Indicative Scope 2 scenario</div>
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
                Annual net savings / modeled CapEx: <strong className="text-emerald">{dpr.annual_net_savings_to_capex_pct}%</strong> • Estimated payback: <strong className="text-emerald">{netMonthlyGain > 0 ? `${dpr.payback_months_net} Mo` : 'N/A'}</strong>
            </span>
            <button className="btn-primary-action" onClick={onOpenWorkbench}>
              <span>Apply Savings to Line 2 Workbench →</span>
            </button>
          </div>
        </div>
      </div>
      )}

      {/* 2. Load-Shifting & Solar Arbitrage Module */}
      {activeSection === 'load_shifting' && (
        <div className="grid-2col">
          <div className="card-clean">
            <div className="card-header-clean">
              <div>
                <h3 className="card-title-clean">
                  <ZapIcon size={16} className="text-emerald" />
                  <span>Time-of-Day (ToD) Load Shifting Parameters</span>
                </h3>
                <p className="card-subtitle-clean">Align non-continuous plant loads with solar window & off-peak tariff bands</p>
              </div>
              <span className="kpi-badge success">Tariff Arbitrage</span>
            </div>

            <div className="slider-group-clean">
              <div className="slider-label-flex">
                <span className="slider-label-text">Daily Shiftable Electrical Energy</span>
                <span className="slider-val-readout text-emerald">{shiftableKwhDaily.toLocaleString('en-IN')} kWh / day</span>
              </div>
              <input
                type="range"
                min="500"
                max="4000"
                step="100"
                value={shiftableKwhDaily}
                onChange={(e) => setShiftableKwhDaily(Number(e.target.value))}
                className="slider-native-clean"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
                <span>500 kWh (Air reservoir only)</span>
                <span style={{ color: '#00d328' }}>1,600 kWh (2 Furnace Heats + Air)</span>
                <span>4,000 kWh (Line 1+2 Full Batch Shift)</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', background: 'rgba(11, 17, 30, 0.6)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#e5e7eb', marginBottom: '8px' }}>
                DISCOM Industrial Time-of-Day (ToD) Rate Structure
              </div>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '6px 0', color: '#ef4444' }}>Peak Band (06:00-10:00 & 18:00-22:00)</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', color: '#ef4444' }}>₹{loadShift.peak_tariff_inr}/kWh (+20%)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '6px 0', color: '#9ca3af' }}>Normal Band (10:00-18:00 Standard)</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', color: '#e5e7eb' }}>₹{DEFAULT_BASE_TARIFF_INR_KWH}/kWh</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', color: '#00d328' }}>Solar Window / Off-Peak (10:00-16:00 & Night)</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', color: '#00d328' }}>₹{loadShift.offpeak_tariff_inr}/kWh (-15%)</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: '12px', fontSize: '11.5px', color: '#38bdf8' }}>
                💡 <strong>Arbitrage Spread:</strong> ₹{loadShift.tariff_delta_inr} saved per shifted kWh with zero capital investment.
              </div>
            </div>

            <div style={{ marginTop: '16px', background: 'rgba(0, 211, 40, 0.08)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0, 211, 40, 0.2)', fontSize: '12px' }}>
              <strong style={{ color: '#00d328', display: 'block', marginBottom: '4px' }}>Autonomous Scheduler Recommendation:</strong>
              <span style={{ color: '#d1d5db' }}>{loadShift.schedule_recommendation}</span>
            </div>
          </div>

          <div className="card-clean">
            <div className="card-header-clean">
              <div>
                <h3 className="card-title-clean">
                  <CheckCircleIcon size={16} className="text-emerald" />
                  <span>Financial Arbitrage & Grid Off-Peak Impact</span>
                </h3>
                <p className="card-subtitle-clean">Immediate OpEx reduction without purchasing new machinery</p>
              </div>
              <span className="kpi-badge info">Zero CapEx</span>
            </div>

            <div className="kpi-grid-clean" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginTop: '12px' }}>
              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Daily Surcharge Avoided</div>
                <div className="font-mono text-emerald" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                  ₹{Math.round(loadShift.daily_cost_avoided_inr).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>per operating day</div>
              </div>

              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Monthly Cost Saved</div>
                <div className="font-mono text-primary" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                  ₹{Math.round(loadShift.monthly_savings_inr).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>26 working days</div>
              </div>

              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Annual Direct Savings</div>
                <div className="font-mono text-emerald" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                  ₹{(loadShift.annual_savings_inr / 100000).toFixed(2)} Lakhs
                </div>
                <div style={{ fontSize: '11px', color: '#00d328', marginTop: '2px' }}>100% margin addition</div>
              </div>

              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Throughput Guarantee</div>
                <div className="font-mono text-cyan" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                  100% Preserved
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Zero tonnage penalty</div>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary-action" onClick={onOpenWorkbench}>
                <span>Dispatch Load Shift to Work Order →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Thermal Decarbonisation & Fuel-Switching Module */}
      {activeSection === 'fuel_switching' && (
        <div className="grid-2col">
          <div className="card-clean">
            <div className="card-header-clean">
              <div>
                <h3 className="card-title-clean">
                  <TrendingDownIcon size={16} className="text-emerald" />
                  <span>Thermal Process Fuel-Switching (Scope 1)</span>
                </h3>
                <p className="card-subtitle-clean">Convert dirty fossil fuels in cupolas/ladles to clean piped gas or biomass</p>
              </div>
              <span className="kpi-badge warning">Scope 1 Decarb</span>
            </div>

            <div className="slider-group-clean">
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '4px', display: 'block' }}>
                Baseline Fossil Fuel in Use
              </label>
              <select
                value={baselineFuel}
                onChange={(e) => setBaselineFuel(e.target.value as any)}
                className="select-clean"
                style={{ width: '100%', padding: '10px 14px' }}
              >
                <option value="furnace_oil">Furnace Oil (Heavy Fuel Oil - 77.4 kg CO₂/GJ)</option>
                <option value="coal">Sub-bituminous Coal (94.6 kg CO₂/GJ)</option>
                <option value="diesel">High Speed Diesel (HSD - 74.1 kg CO₂/GJ)</option>
              </select>
            </div>

            <div className="slider-group-clean" style={{ marginTop: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '4px', display: 'block' }}>
                Clean Fuel Transition Target
              </label>
              <select
                value={targetFuel}
                onChange={(e) => setTargetFuel(e.target.value as any)}
                className="select-clean"
                style={{ width: '100%', padding: '10px 14px' }}
              >
                <option value="png">Piped Natural Gas (PNG - 56.1 kg CO₂/GJ)</option>
                <option value="biomass_briquettes">Agricultural Biomass Briquettes (4.2 kg CO₂/GJ Net)</option>
              </select>
            </div>

            <div className="slider-group-clean" style={{ marginTop: '16px' }}>
              <div className="slider-label-flex">
                <span className="slider-label-text">Annual Thermal Consumption</span>
                <span className="slider-val-readout">{annualThermalGj.toLocaleString('en-IN')} GJ/yr</span>
              </div>
              <input
                type="range"
                min="5000"
                max="30000"
                step="1000"
                value={annualThermalGj}
                onChange={(e) => setAnnualThermalGj(Number(e.target.value))}
                className="slider-native-clean"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
                <span>5,000 GJ (Small Ladle)</span>
                <span style={{ color: '#00d328' }}>12,500 GJ (Standard 50t/day Foundry)</span>
                <span>30,000 GJ (Heavy Forging)</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <button className="btn-secondary-action" onClick={handleDownloadFuelReport} style={{ width: '100%', justifyContent: 'center' }}>
                <FileTextIcon size={14} />
                <span>Export Fuel Feasibility Study (.txt)</span>
              </button>
            </div>
          </div>

          <div className="card-clean">
            <div className="card-header-clean">
              <div>
                <h3 className="card-title-clean">
                  <ShieldCheckIcon size={16} className="text-cyan" />
                  <span>Decarbonisation Economics & Emission Cuts</span>
                </h3>
                <p className="card-subtitle-clean">Retrofit CapEx: ₹2.50 Lakhs (Dual-fuel burner & manifold valves)</p>
              </div>
              <span className="kpi-badge success">Score: {fuelSwitch.feasibility_score}%</span>
            </div>

            <div className="kpi-grid-clean" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginTop: '12px' }}>
              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Annual Fuel Cost Saved</div>
                <div className="font-mono text-emerald" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                  ₹{(fuelSwitch.annual_fuel_cost_savings_inr / 100000).toFixed(2)} Lakhs
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Operating expenditure cut</div>
              </div>

              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Burner Retrofit Payback</div>
                <div className="font-mono text-primary" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                  {fuelSwitch.payback_months} Months
                </div>
                <div style={{ fontSize: '11px', color: '#00d328', marginTop: '2px' }}>&lt; 3 months hurdle cleared</div>
              </div>

              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Scope 1 CO₂ Cut</div>
                <div className="font-mono text-cyan" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                  -{fuelSwitch.scope1_co2_reduction_tons_yr} tCO₂e/yr
                </div>
                <div style={{ fontSize: '11px', color: '#00d328', marginTop: '2px' }}>-{fuelSwitch.co2_reduction_pct}% direct emissions</div>
              </div>

              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Target Process</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f3f4f6', marginTop: '6px' }}>
                  Foundry Ladle & Cupola
                </div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Flame stability assumption; site validation required</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SEBI BRSR Core & Supply Chain ESG Module */}
      {activeSection === 'brsr_esg' && (
        <div className="grid-2col">
          <div className="card-clean">
            <div className="card-header-clean">
              <div>
                <h3 className="card-title-clean">
                  <ShieldCheckIcon size={16} className="text-emerald" />
                  <span>SEBI BRSR Core & GHG Protocol Disclosure Card</span>
                </h3>
                <p className="card-subtitle-clean">Official carbon disclosure for Tier-1 OEM suppliers (Tata, Mahindra, Bosch)</p>
              </div>
              <span className="kpi-badge success">BRSR Aligned</span>
            </div>

            <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#d1d5db', marginTop: '8px' }}>
              <div style={{ background: 'rgba(11, 17, 30, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Enterprise Supplier Status</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#00d328', marginTop: '2px' }}>
                  {brsr.supply_chain_scorecard.oem_compliance_status}
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                  Complies with Scope 1 & 2 carbon disclosure mandates across: {brsr.supply_chain_scorecard.target_buyers.join(', ')}
                </div>
              </div>

              <table style={{ width: '100%', fontSize: '12.5px', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af' }}>Scope 1 Direct Emissions</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#f3f4f6' }}>{brsr.ghg_emissions.scope_1_direct_emissions_tco2e} tCO₂e</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af' }}>Scope 2 Indirect Grid Electricity</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#f3f4f6' }}>{brsr.ghg_emissions.scope_2_indirect_grid_emissions_tco2e} tCO₂e</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af', fontWeight: 700 }}>Total Scope 1 + 2 Footprint</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#00d328', fontWeight: 800 }}>{brsr.ghg_emissions.total_scope_1_and_2_tco2e} tCO₂e</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af' }}>Specific Energy Intensity</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#38bdf8' }}>{brsr.energy_metrics.energy_intensity_gj_per_ton} GJ / ton</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: '#9ca3af' }}>GHG Emissions Intensity</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#06b6d4', fontWeight: 700 }}>{brsr.ghg_emissions.ghg_intensity_tco2e_per_ton} tCO₂e / ton</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: '16px' }}>
                <button className="btn-secondary-action" onClick={handleDownloadBrsr} style={{ width: '100%', justifyContent: 'center' }}>
                  <FileTextIcon size={14} />
                  <span>Download illustrative carbon worksheet (.txt)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="card-clean">
            <div className="card-header-clean">
              <div>
                <h3 className="card-title-clean">
                  <CheckCircleIcon size={16} className="text-emerald" />
                  <span>Buyer Supply Chain Sustainability Impact</span>
                </h3>
                <p className="card-subtitle-clean">A planning view only; buyer reporting requires measured site data and independent review</p>
              </div>
              <span className="kpi-badge info">Scenario estimate</span>
            </div>

            <div className="kpi-grid-clean" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginTop: '12px' }}>
              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Annual CO₂e Abated</div>
                <div className="font-mono text-emerald" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                  {brsr.ghg_emissions.abated_emissions_via_forgeops_tco2e_yr} tCO₂e
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Scenario estimate; not field verified</div>
              </div>

              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Energy Intensity Cut</div>
                <div className="font-mono text-primary" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                  -{brsr.energy_metrics.intensity_reduction_pct}%
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>below historical baseline</div>
              </div>

              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>SEBI BRSR Core</div>
                <div className="font-mono text-cyan" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                  NOT ASSESSED
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Not an audit or compliance opinion</div>
              </div>

              <div style={{ background: 'rgba(11, 17, 30, 0.85)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>ISO 50001 Alignment</div>
                <div className="font-mono text-emerald" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                  DEMO ONLY
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Continuous EnMS Loop</div>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary-action" onClick={onOpenWorkbench}>
                <span>Open Decision Workbench →</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <span>Illustrative SME economics</span>
                </h3>
                <p className="card-subtitle-clean">Planning summary only • not an IGEA, DPR, or scheme-compliant report</p>
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
                <span>Illustrative calculator output only. ADEETIE describes conditional loan interest subvention, not this modeled CapEx credit. Confirm scheme eligibility with BEE and the lending institution.</span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontFamily: 'var(--font-mono)', fontSize: '12.5px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af' }}>Gross Hardware Investment (CapEx)</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#f9fafb' }}>₹{hardwareCostInr.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '8px 0', color: '#9ca3af' }}>Optional scenario credit (not a scheme grant, {subsidyRatePct}%)</td>
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
                    <td style={{ padding: '8px 0', color: '#9ca3af' }}>Estimated Payback (Net of Subscription)</td>
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
                <span>Download scenario economics (.txt)</span>
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
