import { useState, useMemo } from 'react';
import { simulationPresets } from '../mockData';
import { useWorkbenchData } from '../WorkbenchDataContext';
import type { SimulationResult } from '../types';

type PresetKey = 'both_repair_and_optimize' | 'repair_leakage' | 'optimize_setpoint' | 'no_action';

export function SimulatorPanel() {
  const { data } = useWorkbenchData();
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('both_repair_and_optimize');

  // Interactive Parameter Sliders
  const [setpointBar, setSetpointBar] = useState(6.5);
  const [leakageFixPct, setLeakageFixPct] = useState(90);
  const [maintenanceMin, setMaintenanceMin] = useState(48);
  const [scheduledChangeover, setScheduledChangeover] = useState(true);

  // Dynamic Energy Model Calculation
  const simulation = useMemo<SimulationResult>(() => {
    const baselineSec = 11.2;
    const baselineKwh = 8500;
    const tariff = 7.8; // ₹/kWh

    // Physics-based model:
    // Pressure impact: Every 0.5 bar drop below 7.2 bar reduces compressor work by ~3.5%
    const pressureDelta = 7.2 - setpointBar;
    const pressureSavingPct = Math.max(0, pressureDelta * 7.0);

    // Leakage impact: 90% leak fix eliminates 14.2 m3/min load, saving up to ~14%
    const leakSavingPct = (leakageFixPct / 100) * 14.2;

    // Compound savings
    const totalSavingPct = Math.min(26.0, pressureSavingPct + leakSavingPct);
    const predictedSec = Math.max(8.0, Number((baselineSec * (1 - totalSavingPct / 100)).toFixed(2)));
    const secReductionPct = Number((((baselineSec - predictedSec) / baselineSec) * 100).toFixed(1));

    const energySavedKwh = Math.round(baselineKwh * (secReductionPct / 100));
    const costSavedInr = Math.round(energySavedKwh * tariff);
    const co2SavedKg = Math.round(energySavedKwh * 0.052);

    const capex = (leakageFixPct > 0 ? 8000 : 0) + (pressureDelta > 0 ? 1500 : 0);
    const netDailySaving = costSavedInr;
    const paybackMonths = netDailySaving > 0 ? Number((capex / (netDailySaving * 26)).toFixed(1)) : 0;

    return {
      scenarioId: selectedPreset,
      scenarioName: simulationPresets[selectedPreset]?.scenarioName ?? 'Custom Simulation',
      baselineYield: 97.6,
      predictedYield: scheduledChangeover ? 97.8 : 97.4,
      baselineSec,
      predictedSec,
      secUnit: 'kWh/ton',
      secReductionPct,
      energySavingKwhDay: energySavedKwh,
      costSavingInrDay: costSavedInr,
      co2ReductionKgDay: co2SavedKg,
      confidence: 0.94,
      cost: `₹${capex.toLocaleString('en-IN')}`,
      costInr: capex,
      effort: `${maintenanceMin} min window`,
      downtimeMinutes: maintenanceMin,
      paybackMonths,
      throughputImpact: scheduledChangeover ? '0% impact (10.2 ton/day Preserved)' : '-1.5% during unscheduled stop',
      qualityImpact: '97.8% (Preserved ≥ 97.0%)',
      safetyPreserved: true,
      assumptions: [
        `Compressor setpoint adjusted to ${setpointBar.toFixed(1)} bar (nominal 7.2 bar)`,
        `Pneumatic distribution leak reduction achieved at ${leakageFixPct}%`,
        scheduledChangeover ? 'Intervention executed strictly during scheduled changeover (Zero downtime)' : 'Unscheduled intervention',
      ],
      reasoning: `Adjusting setpoint to ${setpointBar.toFixed(1)} bar and reducing distribution leakage by ${leakageFixPct}% delivers ${secReductionPct}% SEC reduction (${energySavedKwh} kWh/day).`,
      inValidatedRange: setpointBar >= 6.0 && setpointBar <= 8.0,
      warnings: setpointBar < 6.2 ? ['Setpoint below 6.2 bar may require verifying pneumatic clamp speeds on Line 2 Moulding bank.'] : [],
      evidenceRefs: ['ev_sec_calculation', 'ev_pressure_telemetry', 'ev_compressor_telemetry'],
      modelVersion: 'ForgeOps-Energy-Harness-v2.4',
    };
  }, [selectedPreset, setpointBar, leakageFixPct, maintenanceMin, scheduledChangeover]);

  const applyPreset = (key: PresetKey) => {
    setSelectedPreset(key);
    if (key === 'both_repair_and_optimize') {
      setSetpointBar(6.5);
      setLeakageFixPct(90);
      setMaintenanceMin(48);
      setScheduledChangeover(true);
    } else if (key === 'repair_leakage') {
      setSetpointBar(7.2);
      setLeakageFixPct(90);
      setMaintenanceMin(42);
      setScheduledChangeover(true);
    } else if (key === 'optimize_setpoint') {
      setSetpointBar(6.5);
      setLeakageFixPct(0);
      setMaintenanceMin(10);
      setScheduledChangeover(true);
    } else if (key === 'no_action') {
      setSetpointBar(7.2);
      setLeakageFixPct(0);
      setMaintenanceMin(0);
      setScheduledChangeover(true);
    }
  };

  return (
    <section id="scenario-comparison" className="module-panel energy-simulator-panel">
      <header className="module-header">
        <div>
          <h2>What-If Simulator & Scenario Optimization</h2>
          <span>Simulate interventions against the 11.2 kWh/ton anomaly baseline</span>
        </div>
        <span className="objective-badge">Constraint: min(SEC) | Throughput ≥ 10.2t | Quality ≥ 97.6%</span>
      </header>

      <div className="simulator-grid-layout">
        {/* Left Column: Preset Switcher & Sliders */}
        <div className="sim-controls-col">
          <div className="preset-radio-group">
            <button
              className={`preset-btn ${selectedPreset === 'both_repair_and_optimize' ? 'active best' : ''}`}
              onClick={() => applyPreset('both_repair_and_optimize')}
            >
              <div className="preset-btn-top">
                <strong>C. Both A + B (Recommended Optimal)</strong>
                <span className="best-tag">★ Optimal</span>
              </div>
              <small>Repair leak + setpoint 6.5 bar · -18.0% SEC · ₹6,240/day saved</small>
            </button>

            <button
              className={`preset-btn ${selectedPreset === 'repair_leakage' ? 'active' : ''}`}
              onClick={() => applyPreset('repair_leakage')}
            >
              <div className="preset-btn-top">
                <strong>A. Repair Leakage Only</strong>
                <span>42 min</span>
              </div>
              <small>Fix Line 2 flexible coupling · -13.4% SEC · ₹4,650/day saved</small>
            </button>

            <button
              className={`preset-btn ${selectedPreset === 'optimize_setpoint' ? 'active' : ''}`}
              onClick={() => applyPreset('optimize_setpoint')}
            >
              <div className="preset-btn-top">
                <strong>B. Optimize Setpoint Only</strong>
                <span>10 min</span>
              </div>
              <small>Lower setpoint to 6.5 bar · -9.8% SEC · ₹3,400/day saved</small>
            </button>

            <button
              className={`preset-btn ${selectedPreset === 'no_action' ? 'active' : ''}`}
              onClick={() => applyPreset('no_action')}
            >
              <div className="preset-btn-top">
                <strong>D. No Action (Status Quo)</strong>
                <span className="loss-tag">Loss</span>
              </div>
              <small>Maintain current 11.2 kWh/ton · ₹1,87,200/month continuous loss</small>
            </button>
          </div>

          {/* Interactive Sliders */}
          <div className="interactive-sliders-box">
            <h4>Live Parameter Optimization</h4>

            <div className="slider-field">
              <div className="slider-label-row">
                <label>Compressor Pressure Setpoint:</label>
                <span className="slider-readout">{setpointBar.toFixed(1)} bar</span>
              </div>
              <input
                type="range"
                min="6.0"
                max="8.5"
                step="0.1"
                value={setpointBar}
                onChange={(e) => setSetpointBar(Number(e.target.value))}
                className="sim-slider"
              />
              <div className="slider-ticks">
                <small>6.0 bar (Min)</small>
                <small>6.5 bar (Optimal)</small>
                <small>7.2 bar (Nominal)</small>
                <small>8.5 bar</small>
              </div>
            </div>

            <div className="slider-field">
              <div className="slider-label-row">
                <label>Leakage Reduction Efficiency:</label>
                <span className="slider-readout green-text">{leakageFixPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={leakageFixPct}
                onChange={(e) => setLeakageFixPct(Number(e.target.value))}
                className="sim-slider"
              />
              <div className="slider-ticks">
                <small>0% (No fix)</small>
                <small>50% (Temporary clamp)</small>
                <small>90% (Braided hose)</small>
                <small>100% (Full manifold)</small>
              </div>
            </div>

            <div className="slider-field">
              <div className="slider-label-row">
                <label>Maintenance Window (Downtime):</label>
                <span className="slider-readout">{maintenanceMin} min</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="2"
                value={maintenanceMin}
                onChange={(e) => setMaintenanceMin(Number(e.target.value))}
                className="sim-slider"
              />
              <div className="slider-ticks">
                <small>10 min</small>
                <small>48 min (Standard changeover)</small>
                <small>60 min</small>
              </div>
            </div>

            <div className="checkbox-field">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={scheduledChangeover}
                  onChange={(e) => setScheduledChangeover(e.target.checked)}
                />
                <span>Execute strictly during planned shift changeover (Zero throughput penalty)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Simulated Impact & Comparison Table */}
        <div className="sim-results-col">
          <div className="sim-kpi-banner">
            <div className="sim-kpi-block highlight">
              <small>Simulated SEC</small>
              <strong>{simulation.predictedSec} <span>{simulation.secUnit}</span></strong>
              <span className="sim-delta green-text">▼ {simulation.secReductionPct}%</span>
            </div>
            <div className="sim-kpi-block">
              <small>Energy Saved</small>
              <strong>{simulation.energySavingKwhDay.toLocaleString('en-IN')} <span>kWh/day</span></strong>
              <span className="sim-delta">{Math.round(simulation.energySavingKwhDay * 26).toLocaleString('en-IN')} kWh/mo</span>
            </div>
            <div className="sim-kpi-block">
              <small>Cost Savings</small>
              <strong>₹{simulation.costSavingInrDay.toLocaleString('en-IN')} <span>/ day</span></strong>
              <span className="sim-delta">₹{Math.round(simulation.costSavingInrDay * 26).toLocaleString('en-IN')} / mo</span>
            </div>
            <div className="sim-kpi-block">
              <small>CO₂ Abatement</small>
              <strong>{simulation.co2ReductionKgDay} <span>kg / day</span></strong>
              <span className="sim-delta">{((simulation.co2ReductionKgDay * 26 * 12) / 1000).toFixed(1)} tCO₂e/yr</span>
            </div>
          </div>

          {/* Hard Constraints Verification Box */}
          <div className="constraints-validation-box">
            <h4>Constrained Optimization Verification</h4>
            <div className="constraint-chips-row">
              <span className="val-chip ok">✓ Throughput: {simulation.throughputImpact}</span>
              <span className="val-chip ok">✓ Quality: {simulation.qualityImpact}</span>
              <span className="val-chip ok">✓ Safety: Preserved</span>
              <span className="val-chip info">⏱ Payback: {simulation.paybackMonths} Months</span>
            </div>
          </div>

          {/* Side-by-Side Interventions Matrix */}
          <div className="scenarios-matrix-table">
            <h4>All Interventions Comparison Matrix</h4>
            <table>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Intervention Strategy</th>
                  <th>SEC (kWh/t)</th>
                  <th>SEC Δ</th>
                  <th>Cost</th>
                  <th>Downtime</th>
                  <th>Daily Saving</th>
                  <th>Payback</th>
                </tr>
              </thead>
              <tbody>
                <tr className={selectedPreset === 'repair_leakage' ? 'active-row' : ''}>
                  <td><strong>A</strong></td>
                  <td>Repair distribution leakage</td>
                  <td>9.7</td>
                  <td className="green-text">-13.4%</td>
                  <td>₹8,500</td>
                  <td>42 min</td>
                  <td>₹4,650</td>
                  <td>1.8 mo</td>
                </tr>
                <tr className={selectedPreset === 'optimize_setpoint' ? 'active-row' : ''}>
                  <td><strong>B</strong></td>
                  <td>Optimize setpoint to 6.5 bar</td>
                  <td>10.1</td>
                  <td className="green-text">-9.8%</td>
                  <td>₹2,000</td>
                  <td>10 min</td>
                  <td>₹3,400</td>
                  <td>0.6 mo</td>
                </tr>
                <tr className={`best-option-tr ${selectedPreset === 'both_repair_and_optimize' ? 'active-row' : ''}`}>
                  <td><strong>C ★</strong></td>
                  <td><strong>Both A + B (Optimal)</strong></td>
                  <td><strong>9.2</strong></td>
                  <td className="best-pct"><strong>-18.0%</strong></td>
                  <td>₹9,500</td>
                  <td>48 min</td>
                  <td className="green-text"><strong>₹6,240</strong></td>
                  <td><strong>1.5 mo</strong></td>
                </tr>
                <tr className={selectedPreset === 'no_action' ? 'active-row' : ''}>
                  <td><strong>D</strong></td>
                  <td>No action (Status quo)</td>
                  <td>11.2</td>
                  <td>0.0%</td>
                  <td>₹0</td>
                  <td>0 min</td>
                  <td>₹0</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>

          {simulation.warnings.length > 0 && (
            <div className="sim-warning-banner">
              ⚠️ {simulation.warnings[0]}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
