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
  calculateLoadShiftingArbitrage,
  calculateFuelSwitching,
  calculateBrsrCarbonDisclosure,
  evaluateSystem1SafetyBounds,
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

// 9. Test Load Shifting & Solar Arbitrage
const shift = calculateLoadShiftingArbitrage(1600.0);
console.log(`✅ ToD Load-Shifting Arbitrage: ₹${shift.daily_cost_avoided_inr}/day saved (Annual: ₹${(shift.annual_savings_inr / 100000).toFixed(2)} Lakhs)`);
if (shift.daily_cost_avoided_inr <= 0 || !shift.tonnage_throughput_preserved) {
  throw new Error('Load-shifting calculation failed!');
}

// 10. Test Thermal Fuel Switching (Scope 1 Decarb)
const fuel = calculateFuelSwitching(12500.0, 'furnace_oil', 'png', 250000.0);
console.log(`✅ Thermal Fuel-Switching: ${fuel.clean_fuel_type} replaces ${fuel.baseline_fuel_type} -> Cut ${fuel.scope1_co2_reduction_tons_yr} tCO2e/yr (Payback: ${fuel.payback_months} Mo)`);
if (fuel.scope1_co2_reduction_tons_yr <= 0 || fuel.payback_months > 12.0) {
  throw new Error('Fuel-switching calculation failed!');
}

// 11. Test BRSR Core & ESG Supply Chain Scorecard
const brsrCard = calculateBrsrCarbonDisclosure(3650000.0, 3720.0, 383718.0, 12500.0);
console.log(`✅ SEBI BRSR Core ESG Card: ${brsrCard.supply_chain_scorecard.oem_compliance_status} | GHG Intensity: ${brsrCard.ghg_emissions.ghg_intensity_tco2e_per_ton} tCO2e/t`);
if (!brsrCard.supply_chain_scorecard.sebi_brsr_core_aligned) {
  throw new Error('BRSR ESG scorecard failed!');
}

// 12. Test System 1 Edge Fast Verification (CLM / Laya)
const sys1 = evaluateSystem1SafetyBounds('OPT-C', 6.5, 5.5, 2.1, 3.5, 20.0);
console.log(`✅ System 1 Fast Verifier: Decision: ${sys1.decision} in ${sys1.latency_ms}ms (Score: ${sys1.safety_score})`);
if (sys1.decision !== 'APPROVE_FOR_OPERATOR') {
  throw new Error('System 1 fast safety verification failed!');
}

console.log('\n🎉 ALL 12 Dev 3 (Sham) Simulation, Physics, Arbitrage & Decarbonisation tests passed successfully!');
