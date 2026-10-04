import { useState, useMemo } from 'react';
import { simulationPresets } from '../mockData';
import { useWorkbenchData } from '../WorkbenchDataContext';
import type { SimulationResult } from '../types';
import {
  SlidersIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ClockIcon,
} from '../components/Icons';

type PresetKey = 'both_repair_and_optimize' | 'repair_leakage' | 'optimize_setpoint' | 'no_action';

function interpolate(value: number, points: Array<[number, number]>) {
  const ordered = [...points].sort(([left], [right]) => left - right);
  const upperIndex = ordered.findIndex(([x]) => x >= value);
  const left = ordered[Math.max(0, upperIndex === -1 ? ordered.length - 2 : upperIndex - 1)];
  const right = ordered[Math.max(1, upperIndex === -1 ? ordered.length - 1 : upperIndex)];
  const fraction = (value - left[0]) / (right[0] - left[0]);
  return Math.round(left[1] + (right[1] - left[1]) * fraction);
}

export function SimulatorPanel() {
  const { data } = useWorkbenchData();
  const [selectedPreset, setSelectedPreset] = useState<PresetKey | 'custom'>('both_repair_and_optimize');

  // Interactive Parameter Sliders
  const [setpointBar, setSetpointBar] = useState(6.5);
  const [leakageFixPct, setLeakageFixPct] = useState(90);
  const [maintenanceMin, setMaintenanceMin] = useState(48);
  const [scheduledChangeover, setScheduledChangeover] = useState(true);

  // Keep custom estimates anchored to the published options so the same inputs
  // never produce a second set of savings figures elsewhere in the workbench.
  const simulation = useMemo<SimulationResult>(() => {
    const baselineSec = data.incident.currentSec;
    const repair = simulationPresets.repair_leakage;
    const setpoint = simulationPresets.optimize_setpoint;
    const combined = simulationPresets.both_repair_and_optimize;
    const leakSavingPct = repair.secReductionPct * (leakageFixPct / 90);
    const pressureSavingPct = setpoint.secReductionPct * ((7.2 - setpointBar) / 0.7);
    const overlapPct = Math.min(
      leakSavingPct / repair.secReductionPct,
      pressureSavingPct / setpoint.secReductionPct,
    ) * (leakSavingPct > 0 && pressureSavingPct > 0 ? 5.2 : 0);
    const secReductionPct = Number(Math.max(-25, Math.min(26, leakSavingPct + pressureSavingPct - overlapPct)).toFixed(1));
    const predictedSec = Number((baselineSec * (1 - secReductionPct / 100)).toFixed(1));
    const energySavedKwh = interpolate(secReductionPct, [
      [0, 0], [setpoint.secReductionPct, setpoint.energySavingKwhDay],
      [repair.secReductionPct, repair.energySavingKwhDay], [combined.secReductionPct, combined.energySavingKwhDay],
    ]);
    const costSavedInr = interpolate(secReductionPct, [
      [0, 0], [setpoint.secReductionPct, setpoint.costSavingInrDay],
      [repair.secReductionPct, repair.costSavingInrDay], [combined.secReductionPct, combined.costSavingInrDay],
    ]);
    const co2SavedKg = interpolate(secReductionPct, [
      [0, 0], [setpoint.secReductionPct, setpoint.co2ReductionKgDay],
      [repair.secReductionPct, repair.co2ReductionKgDay], [combined.secReductionPct, combined.co2ReductionKgDay],
    ]);

    const hasLeakRepair = leakageFixPct > 0;
    const hasSetpointChange = setpointBar !== 7.2;
    const capex = hasLeakRepair && hasSetpointChange
      ? combined.costInr
      : hasLeakRepair
        ? repair.costInr
        : hasSetpointChange
          ? setpoint.costInr
          : 0;
    const paybackDays = costSavedInr > 0 ? Number((capex / costSavedInr).toFixed(1)) : 0;
    const paybackMonths = Number((paybackDays / 26).toFixed(2));
    const predictedYield = scheduledChangeover || maintenanceMin === 0
      ? (hasLeakRepair ? 97.8 : 97.6)
      : 97.4;
    const safetyPreserved = setpointBar >= 6.2 && setpointBar <= 8.0;
    const qualityPreserved = predictedYield >= 97.6;
    const warnings = [
      ...(setpointBar < 6.2 ? ['Below 6.2 bar: verify clamping pressure at the furthest moulding station.'] : []),
      ...(setpointBar > 8.0 ? ['Above 8.0 bar is outside the validated operating range.'] : []),
      ...(!scheduledChangeover && maintenanceMin > 0 ? ['An unscheduled maintenance window may reduce throughput and yield.'] : []),
      ...(selectedPreset === 'no_action' ? ['Leaving the leak open keeps the plant exposed to energy waste and compressor stress.'] : []),
    ];

    return {
      scenarioId: selectedPreset,
      scenarioName: simulationPresets[selectedPreset]?.scenarioName ?? 'Custom Simulation',
      baselineYield: 97.6,
      predictedYield,
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
      throughputImpact: scheduledChangeover || maintenanceMin === 0
        ? '10.2 ton/day preserved'
        : 'Possible 1.5% loss during unscheduled work',
      qualityImpact: `${predictedYield.toFixed(1)}% ${qualityPreserved ? '(baseline preserved)' : '(below 97.6% baseline)'}`,
      safetyPreserved,
      assumptions: [
        `Compressor setpoint adjusted to ${setpointBar.toFixed(1)} bar (nominal 7.2 bar)`,
        `Pneumatic distribution leak reduction achieved at ${leakageFixPct}%`,
        scheduledChangeover ? 'Intervention executed strictly during scheduled changeover (Zero downtime)' : 'Unscheduled intervention',
      ],
      reasoning: `Adjusting setpoint to ${setpointBar.toFixed(1)} bar and reducing distribution leakage by ${leakageFixPct}% delivers ${secReductionPct}% SEC reduction (${energySavedKwh} kWh/day).`,
      inValidatedRange: setpointBar >= 6.0 && setpointBar <= 8.0,
      warnings,
      evidenceRefs: ['ev_sec_calculation', 'ev_pressure_telemetry', 'ev_compressor_telemetry'],
      modelVersion: 'ForgeOps-Energy-Harness-v2.4',
    };
  }, [data.incident.currentSec, selectedPreset, setpointBar, leakageFixPct, maintenanceMin, scheduledChangeover]);

  const markCustom = () => setSelectedPreset('custom');

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
          <h2>Compare intervention scenarios</h2>
          <span>Adjust assumptions and review the estimated effect on this incident.</span>
        </div>
        <span className="objective-badge font-mono">
          min(SEC) | Throughput ≥ 10.2t | Quality ≥ 97.6%
        </span>
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
                <strong>Option C: Both A + B (Recommended)</strong>
                <span className="best-tag">OPTIMAL</span>
              </div>
              <small>Repair leak + setpoint 6.5 bar • -18.0% SEC • &#8377;6,240/day saved</small>
            </button>

            <button
              className={`preset-btn ${selectedPreset === 'repair_leakage' ? 'active' : ''}`}
              onClick={() => applyPreset('repair_leakage')}
            >
              <div className="preset-btn-top">
                <strong>Option A: Repair Leakage Only</strong>
                <span className="font-mono text-xs text-slate-400">42 min</span>
              </div>
              <small>Fix Line 2 coupling • -13.4% SEC • &#8377;4,650/day saved</small>
            </button>

            <button
              className={`preset-btn ${selectedPreset === 'optimize_setpoint' ? 'active' : ''}`}
              onClick={() => applyPreset('optimize_setpoint')}
            >
              <div className="preset-btn-top">
                <strong>Option B: Optimize Setpoint Only</strong>
                <span className="font-mono text-xs text-slate-400">10 min</span>
              </div>
              <small>Lower setpoint to 6.5 bar • -9.8% SEC • &#8377;3,400/day saved</small>
            </button>

            <button
              className={`preset-btn ${selectedPreset === 'no_action' ? 'active' : ''}`}
              onClick={() => applyPreset('no_action')}
            >
              <div className="preset-btn-top">
                <strong>Option D: No Action (Status Quo)</strong>
                <span className="loss-tag">LOSS</span>
              </div>
              <small>Maintain 11.2 kWh/ton • &#8377;1,87,200/month continuous waste</small>
            </button>
          </div>

          {/* Interactive Sliders */}
          <div className="interactive-sliders-box">
            <div className="flex items-center gap-2 mb-3">
              <SlidersIcon size={14} className="text-emerald-400" />
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Scenario Parameter Tuning
              </h4>
            </div>

            <div className="slider-field">
              <div className="slider-label-row">
                <label>Compressor Pressure Setpoint:</label>
                <span className="slider-readout font-mono text-cyan-400 font-bold">{setpointBar.toFixed(1)} bar</span>
              </div>
              <input
                type="range"
                min="6.0"
                max="8.5"
                step="0.1"
                value={setpointBar}
                onChange={(e) => { markCustom(); setSetpointBar(Number(e.target.value)); }}
                className="sim-slider"
              />
              <div className="slider-ticks font-mono text-[10px] text-slate-500">
                <span>6.0 bar (Min)</span>
                <span>6.5 bar (Optimal)</span>
                <span>7.2 bar (Nominal)</span>
                <span>8.5 bar</span>
              </div>
            </div>

            <div className="slider-field">
              <div className="slider-label-row">
                <label>Leakage Reduction Efficiency:</label>
                <span className="slider-readout green-text font-mono text-emerald-400 font-bold">{leakageFixPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={leakageFixPct}
                onChange={(e) => { markCustom(); setLeakageFixPct(Number(e.target.value)); }}
                className="sim-slider"
              />
              <div className="slider-ticks font-mono text-[10px] text-slate-500">
                <span>0% (No fix)</span>
                <span>50% (Clamp)</span>
                <span>90% (Braided hose)</span>
                <span>100% (Manifold)</span>
              </div>
            </div>

            <div className="slider-field">
              <div className="slider-label-row">
                <label>Maintenance Window (Downtime):</label>
                <span className="slider-readout font-mono text-slate-300">{maintenanceMin} min</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="2"
                value={maintenanceMin}
                onChange={(e) => { markCustom(); setMaintenanceMin(Number(e.target.value)); }}
                className="sim-slider"
              />
              <div className="slider-ticks font-mono text-[10px] text-slate-500">
                <span>0 min</span>
                <span>48 min (Changeover)</span>
                <span>60 min</span>
              </div>
            </div>

            <div className="checkbox-field">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={scheduledChangeover}
                  onChange={(e) => { markCustom(); setScheduledChangeover(e.target.checked); }}
                />
                <span className="text-xs text-slate-300">
                  Schedule work during planned shift changeover to preserve throughput
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Current scenario estimate */}
        <div className="sim-results-col">
          <div className="sim-kpi-banner">
            <div className="sim-kpi-block highlight">
              <small>{selectedPreset === 'custom' ? 'Custom estimate' : `${simulation.scenarioName} · estimate`}</small>
              <strong className="font-mono text-emerald-400">{simulation.predictedSec} <span>{simulation.secUnit}</span></strong>
              <span className="sim-delta green-text font-mono">{simulation.secReductionPct > 0 ? '−' : simulation.secReductionPct < 0 ? '+' : ''}{Math.abs(simulation.secReductionPct).toFixed(1)}% SEC</span>
            </div>
            <div className="sim-kpi-block">
              <small>{simulation.energySavingKwhDay >= 0 ? 'Energy saved' : 'Additional energy'}</small>
              <strong className="font-mono text-slate-100">{simulation.energySavingKwhDay.toLocaleString('en-IN')} <span>kWh/day</span></strong>
              <span className="sim-delta font-mono">{Math.round(simulation.energySavingKwhDay * 26).toLocaleString('en-IN')} kWh / 26 workdays</span>
            </div>
            <div className="sim-kpi-block">
              <small>{simulation.costSavingInrDay >= 0 ? 'Cost saved' : 'Additional cost'}</small>
              <strong className="font-mono text-slate-100">&#8377;{simulation.costSavingInrDay.toLocaleString('en-IN')} <span>/ day</span></strong>
              <span className="sim-delta font-mono">&#8377;{Math.round(simulation.costSavingInrDay * 26).toLocaleString('en-IN')} / 26 workdays</span>
            </div>
            <div className="sim-kpi-block">
              <small>{simulation.co2ReductionKgDay >= 0 ? 'CO₂ reduction' : 'Additional CO₂'}</small>
              <strong className="font-mono text-cyan-400">{simulation.co2ReductionKgDay} <span>kg/day</span></strong>
              <span className="sim-delta font-mono">{((simulation.co2ReductionKgDay * 26 * 12) / 1000).toFixed(1)} tCO₂e/yr</span>
            </div>
          </div>

          <p className="sim-assumption-note">Illustrative estimate based on the Belgaum case study. Confirm tariff, operating limits, and plant conditions before acting.</p>

          {/* Hard Constraints Verification Box */}
          <div className="constraints-validation-box">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Constrained Optimization Verification
            </h4>
            <div className="constraint-chips-row font-mono text-xs">
              <span className={`val-chip ${scheduledChangeover ? 'ok' : 'warning'} flex items-center gap-1`}>
                {scheduledChangeover ? <CheckCircleIcon size={12} /> : <AlertTriangleIcon size={12} />}
                Throughput: {simulation.throughputImpact}
              </span>
              <span className={`val-chip ${simulation.predictedYield >= 97.6 ? 'ok' : 'warning'} flex items-center gap-1`}>
                {simulation.predictedYield >= 97.6 ? <CheckCircleIcon size={12} /> : <AlertTriangleIcon size={12} />}
                Quality: {simulation.qualityImpact}
              </span>
              <span className={`val-chip ${simulation.safetyPreserved ? 'ok' : 'warning'} flex items-center gap-1`}>
                {simulation.safetyPreserved ? <CheckCircleIcon size={12} /> : <AlertTriangleIcon size={12} />}
                Safety: {simulation.safetyPreserved ? 'Within validated range' : 'Outside validated range'}
              </span>
              <span className="val-chip info flex items-center gap-1">
                <ClockIcon size={12} className="text-cyan-400" />
                Payback: {simulation.costInr > 0 && simulation.costSavingInrDay > 0 ? `${(simulation.costInr / simulation.costSavingInrDay).toFixed(1)} days` : '—'}
              </span>
            </div>
          </div>

          {simulation.warnings.length > 0 && (
            <div className="sim-warning-banner flex items-center gap-2 font-mono text-xs text-amber-300">
              <AlertTriangleIcon size={14} className="text-amber-400 flex-shrink-0" />
              <span>{simulation.warnings.join(' ')}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
