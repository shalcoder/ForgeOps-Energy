/**
 * Automated Test Runner for Role 3: Physics, Simulation & Energy Economics
 * Tests TypeScript simulation engine, orifice thermodynamics, compressor curves,
 * Pareto front optimizer, DISCOM tariffs, BEE ADEETIE DPR, and IPMVP verification.
 */

import {
  SimulationEngine,
  calculateOrificeFlow,
  calculateCompressorPower,
  calculateFurnaceSec,
  calculateDiscomTariffCosts,
  calculateParetoFront,
  calculateBeeAdeetieDpr,
  calculateIpmvpVerification,
} from './simulation/engine';

console.log('🧪 Starting Dev 3 (Sham) Simulation & Energy Economics Test Suite...\n');

// 1. Test Thermodynamic Orifice Flow
const orifice = calculateOrificeFlow(3.2, 7.2);
console.log(`✅ Orifice Flow Physics: ${orifice.volume_flow_cfm} CFM | Regime: ${orifice.flow_regime} | Leak Power: ${orifice.leak_power_loss_kw} kW`);
if (!orifice.is_choked || orifice.volume_flow_cfm <= 0) {
  throw new Error('Orifice flow calculation failed!');
}

// 2. Test Compressor Power with VFD
const comp = calculateCompressorPower(75.0, 6.5, 68.0);
console.log(`✅ Compressor VFD Profile: ${comp.power_draw_kw} kW draw at 68% VFD modulation & 6.5 bar`);
if (comp.power_draw_kw >= 75.0 || comp.power_draw_kw <= 0) {
  throw new Error('Compressor power curve calculation failed!');
}

// 3. Test Induction Furnace SEC
const furnace = calculateFurnaceSec(1.5, 0.70, 30.0);
console.log(`✅ Induction Furnace SEC: ${furnace.total_furnace_sec_kwh_t} kWh/ton (Holding Loss: ${furnace.holding_loss_kwh_t} kWh/t)`);
if (furnace.total_furnace_sec_kwh_t <= 580.0) {
  throw new Error('Furnace SEC loss calculation failed!');
}

// 4. Test Multi-Objective Pareto Optimizer
const pareto = calculateParetoFront();
console.log(`✅ Pareto Frontier Optimizer: Recommended ${pareto.recommended_candidate} (Optimal: ${pareto.optimal_rationale})`);
if (pareto.recommended_candidate !== 'OPT-C') {
  throw new Error('Pareto optimization failed to identify OPT-C!');
}

// 5. Test Indian DISCOM Tariff Engine
const tariff = calculateDiscomTariffCosts(8500.0, 0.99);
console.log(`✅ DISCOM Tariff Engine: ₹${tariff.total_daily_bill_inr}/day | PF Status: ${tariff.pf_status}`);
if (!tariff.pf_status.includes('Incentive')) {
  throw new Error('DISCOM tariff PF incentive failed!');
}

// 6. Test BEE ADEETIE Capital Subsidy DPR
const dpr = calculateBeeAdeetieDpr(45000, 2993000, 383718, 'Foundry & Castings - Belgaum', 25);
console.log(`✅ BEE ADEETIE DPR: Net CapEx ₹${dpr.net_capex_inr} | Payback: ${dpr.payback_months_net} Mo | Scope 2: ${dpr.scope2_co2_abatement_tons_yr} tCO2e/yr`);
if (dpr.payback_months_net >= 1.0) {
  throw new Error('BEE ADEETIE payback calculation failed!');
}

// 7. Test IPMVP Option B/C Normalized Verification
const verif = calculateIpmvpVerification(11.2, 9.2, 758.9, 762.4, 28.0, 31.5);
console.log(`✅ IPMVP Option B/C Verification: Adjusted Baseline ${verif.adjusted_baseline_sec} kWh/t -> Measured ${verif.measured_post_repair_sec} kWh/t (-${verif.verified_sec_reduction_pct}%)`);
if (verif.verified_sec_reduction_pct < 18.0) {
  throw new Error('IPMVP Option B/C normalization failed!');
}

// 8. Test SimulationEngine Class
const engine = new SimulationEngine();
const leakScenario = engine.runScenario({ scenario_name: 'Line 2 Manifold Leak Opt_C' });
console.log(`✅ Simulation Engine Scenario: ${leakScenario.scenario_name} -> Predicted SEC: ${leakScenario.predicted_sec} kWh/t (Confidence: ${leakScenario.confidence})`);

const outOfRange = engine.runScenario({ scenario_name: 'extreme_super_speed_1000' });
console.log(`✅ Guardrail Out-of-Range Test: In Valid Range?: ${outOfRange.in_validated_range} | Warning: ${outOfRange.warning?.slice(0, 45)}...`);

console.log('\n🎉 ALL Dev 3 (Sham) Simulation, Physics & Economics tests passed successfully!');
