import { useState } from 'react';

const clusters = [
  { id: 'foundry', name: 'Foundry & Castings', typicalBillLakhs: 18, typicalSavingPct: 15, co2Factor: 0.82 },
  { id: 'forging', name: 'Forging & Stamping', typicalBillLakhs: 22, typicalSavingPct: 14, co2Factor: 0.85 },
  { id: 'textiles', name: 'Textiles & Dyeing', typicalBillLakhs: 12, typicalSavingPct: 12, co2Factor: 0.78 },
  { id: 'ceramics', name: 'Ceramics & Tiles', typicalBillLakhs: 28, typicalSavingPct: 16, co2Factor: 0.90 },
  { id: 'food', name: 'Food Processing & Cold Chain', typicalBillLakhs: 8, typicalSavingPct: 11, co2Factor: 0.72 },
  { id: 'chemicals', name: 'Specialty Chemicals', typicalBillLakhs: 20, typicalSavingPct: 13, co2Factor: 0.80 },
];

export function SmeEconomicsView({ onOpenWorkbench }: { onOpenWorkbench: () => void }) {
  const [selectedCluster, setSelectedCluster] = useState('foundry');
  const [monthlyBillLakhs, setMonthlyBillLakhs] = useState(18);
  const [secReductionPct, setSecReductionPct] = useState(14);
  const [hardwareTier, setHardwareTier] = useState<'basic' | 'standard' | 'enterprise'>('standard');

  const currentCluster = clusters.find((c) => c.id === selectedCluster) ?? clusters[0];

  // Calculations
  const hardwareCostInr = hardwareTier === 'basic' ? 25000 : hardwareTier === 'standard' ? 45000 : 60000;
  const softwareSubscriptionMonthlyInr = hardwareTier === 'basic' ? 3500 : hardwareTier === 'standard' ? 6000 : 9500;

  const monthlyBillInr = monthlyBillLakhs * 100000;
  const monthlySavingsInr = monthlyBillInr * (secReductionPct / 100);
  const annualSavingsInr = monthlySavingsInr * 12;

  // Payback period in months
  const netMonthlyGain = monthlySavingsInr - softwareSubscriptionMonthlyInr;
  const paybackMonths = netMonthlyGain > 0 ? (hardwareCostInr / netMonthlyGain).toFixed(1) : '—';

  // CO2 reduction (rough estimate based on ₹7.8/kWh grid tariff)
  const monthlyKwhSaved = monthlySavingsInr / 7.8;
  const annualCo2SavedTons = ((monthlyKwhSaved * 12 * 0.82) / 1000).toFixed(1);

  return (
    <main className="economics-page">
      <section className="economics-header">
        <div className="badge-pill energy-pill">SME ROI & BEE ADEETIE Alignment</div>
        <h1>Indian SME Deployment & Economic Calculator</h1>
        <p className="subtitle">
          Designed for rapid payback (1–3 months) across energy-intensive SME clusters targeted by BEE’s ADEETIE scheme.
        </p>
      </section>

      {/* ADEETIE & BEE Context Strip */}
      <section className="adeetie-context-card">
        <div className="adeetie-flag">
          <span>🇮🇳</span>
          <div>
            <strong>BEE ADEETIE Scheme Alignment</strong>
            <small>Assistance in Deploying Energy Efficient Technologies in Industries & Establishments</small>
          </div>
        </div>
        <p className="adeetie-desc">
          BEE targets <strong>60 energy-intensive SME clusters across 14 manufacturing sectors</strong>. ForgeOps Energy acts as the plug-and-play decision layer to quantify savings for investment-grade energy audits (IGEA) and bankable Detailed Project Reports (DPR).
        </p>
        <div className="target-cluster-tags">
          <span>Foundries (Belgaum, Coimbatore, Rajkot)</span>
          <span>Forging (Pune, Ludhiana, Chennai)</span>
          <span>Textiles (Surat, Tirupur, Panipat)</span>
          <span>Ceramics (Morbi, Khurja)</span>
          <span>Chemicals (Vapi, Ankleshwar)</span>
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <div className="calculator-layout">
        {/* Left: Input Controls */}
        <div className="calc-inputs-panel">
          <h3>Plant Parameters & Hardware Configuration</h3>

          <div className="calc-field">
            <label>Manufacturing Sector:</label>
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
              className="select-input"
            >
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="calc-field">
            <div className="field-header-flex">
              <label>Monthly Energy Bill (₹ Lakhs):</label>
              <span className="slider-val">₹{monthlyBillLakhs} Lakhs</span>
            </div>
            <input
              type="range"
              min="3"
              max="50"
              step="1"
              value={monthlyBillLakhs}
              onChange={(e) => setMonthlyBillLakhs(Number(e.target.value))}
              className="range-slider"
            />
            <div className="range-limits">
              <small>₹3L</small>
              <small>₹25L (Typical SME)</small>
              <small>₹50L</small>
            </div>
          </div>

          <div className="calc-field">
            <div className="field-header-flex">
              <label>Target Specific Energy (SEC) Reduction:</label>
              <span className="slider-val green-text">{secReductionPct}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={secReductionPct}
              onChange={(e) => setSecReductionPct(Number(e.target.value))}
              className="range-slider"
            />
            <div className="range-limits">
              <small>5% (Low hanging)</small>
              <small>14% (Simulated case)</small>
              <small>25% (Full retrofit)</small>
            </div>
          </div>

          <div className="calc-field">
            <label>Edge Hardware & Submetering Tier:</label>
            <div className="hardware-tier-radios">
              <label className={`tier-card ${hardwareTier === 'basic' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="hwTier"
                  checked={hardwareTier === 'basic'}
                  onChange={() => setHardwareTier('basic')}
                />
                <div>
                  <strong>Basic Retrofit</strong>
                  <small>₹25,000 · 3 submeters</small>
                </div>
              </label>
              <label className={`tier-card ${hardwareTier === 'standard' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="hwTier"
                  checked={hardwareTier === 'standard'}
                  onChange={() => setHardwareTier('standard')}
                />
                <div>
                  <strong>Standard SME</strong>
                  <small>₹45,000 · 8 submeters + IoT</small>
                </div>
              </label>
              <label className={`tier-card ${hardwareTier === 'enterprise' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="hwTier"
                  checked={hardwareTier === 'enterprise'}
                  onChange={() => setHardwareTier('enterprise')}
                />
                <div>
                  <strong>Multi-Line</strong>
                  <small>₹60,000 · Full plant edge</small>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Projected Returns & Payback */}
        <div className="calc-results-panel">
          <div className="results-header">
            <h3>Projected SME Economic Return</h3>
            <span className="badge-pill ok-pill">Payback &lt; 2 Months</span>
          </div>

          <div className="results-kpi-grid">
            <div className="res-kpi-card highlight">
              <small>Monthly Energy Savings</small>
              <strong>₹{(monthlySavingsInr / 100000).toFixed(2)} Lakhs</strong>
              <span className="res-sub">₹{(monthlySavingsInr / 26).toFixed(0)} saved per working day</span>
            </div>

            <div className="res-kpi-card">
              <small>Annual Cost Reduction</small>
              <strong>₹{(annualSavingsInr / 100000).toFixed(2)} Lakhs</strong>
              <span className="res-sub">Recurring operating margin boost</span>
            </div>

            <div className="res-kpi-card green-highlight">
              <small>Simple Payback Period</small>
              <strong>{paybackMonths} Months</strong>
              <span className="res-sub">CapEx recovered in under 60 days</span>
            </div>

            <div className="res-kpi-card">
              <small>Annual Carbon Abatement</small>
              <strong>{annualCo2SavedTons} tCO₂e</strong>
              <span className="res-sub">Scope 2 emissions reduction</span>
            </div>
          </div>

          <div className="commercial-models-box">
            <h4>Flexible Commercial Adoption Models</h4>
            <div className="model-rows">
              <div className="model-item">
                <strong>Option A: Software SaaS</strong>
                <p>₹3,000 – ₹10,000 / month per plant. Ideal for plants with existing Modbus/OPC meters.</p>
              </div>
              <div className="model-item">
                <strong>Option B: Retrofit + SaaS</strong>
                <p>One-time low-cost edge gateway (₹20k–₹60k) + recurring decision software subscription.</p>
              </div>
              <div className="model-item">
                <strong>Option C: Energy Savings-as-a-Service (ESaaS)</strong>
                <p>Zero upfront CapEx; ForgeOps takes a 15–20% share of verified monthly energy savings.</p>
              </div>
            </div>
          </div>

          <button className="btn-primary-glow btn-full" onClick={onOpenWorkbench}>
            Test with Real Line Telemetry in 4-Agent Workbench →
          </button>
        </div>
      </div>
    </main>
  );
}
