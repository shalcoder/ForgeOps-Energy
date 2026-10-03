"""
Automated Test Suite for Dev 3 (Sham): Physics, Simulation & Energy Economics
ForgeOps Energy Platform

Tests:
  1. Orifice Flow Thermodynamic Calculations (Choked vs Subsonic, Mass flow, Volumetric flow, Leak kW)
  2. Rotary Screw Compressor VFD Modulation Power Curves
  3. Induction Furnace SEC Models (Scrap Density & Holding Loss)
  4. Multi-Objective Pareto Frontier Optimizer (calculate_pareto_front)
  5. Indian DISCOM Tariff Engine (ToD Peak/Normal/Off-peak & PF Penalties/Incentives)
  6. BEE ADEETIE Capital Subsidy & IPMVP Verification Baseline Adjustments
"""

import unittest
from simulation.engine import (
    calculate_orifice_flow,
    calculate_compressor_power,
    calculate_furnace_sec,
    calculate_discom_tariff_costs,
    calculate_pareto_front,
    calculate_bee_adeetie_dpr,
    calculate_ipmvp_option_bc_verification,
    calculate_load_shifting_arbitrage,
    calculate_fuel_switching,
    calculate_brsr_carbon_disclosure,
    evaluate_system1_safety_bounds,
    SimulationEnginePython,
)


class TestThermodynamicPhysics(unittest.TestCase):
    def test_orifice_choked_sonic_flow(self):
        """Test choked sonic flow through 3.2mm orifice at 7.2 bar gauge."""
        res = calculate_orifice_flow(orifice_dia_mm=3.2, upstream_gauge_bar=7.2, ambient_temp_c=25.0)
        self.assertTrue(res["is_choked"])
        self.assertEqual(res["flow_regime"], "choked_sonic")
        self.assertTrue(0.008 < res["mass_flow_kg_s"] < 0.015)
        self.assertTrue(15.0 < res["volume_flow_cfm"] < 25.0)
        self.assertTrue(2.5 < res["leak_power_loss_kw"] < 5.0)
        self.assertTrue(res["daily_kwh_wasted"] > 50.0)

    def test_orifice_subsonic_flow(self):
        """Test subsonic flow when pressure is very low (< 0.8 bar)."""
        res = calculate_orifice_flow(orifice_dia_mm=3.2, upstream_gauge_bar=0.5, ambient_temp_c=25.0)
        self.assertFalse(res["is_choked"])
        self.assertEqual(res["flow_regime"], "subsonic")
        self.assertTrue(res["volume_flow_cfm"] < 20.0)

    def test_compressor_vfd_power_scaling(self):
        """Test 75 kW rotary screw compressor modulation."""
        full_load = calculate_compressor_power(rated_kw=75.0, pressure_setpoint_bar=7.0, vfd_modulation_pct=100.0)
        self.assertAlmostEqual(full_load["power_draw_kw"], 75.0, delta=0.5)

        part_load = calculate_compressor_power(rated_kw=75.0, pressure_setpoint_bar=6.5, vfd_modulation_pct=68.0)
        self.assertTrue(part_load["power_draw_kw"] < full_load["power_draw_kw"])
        self.assertTrue(45.0 < part_load["power_draw_kw"] < 56.0)

    def test_furnace_sec_calculation(self):
        """Test induction furnace SEC with scrap density and holding delays."""
        normal = calculate_furnace_sec(tonnage_per_heat=1.5, scrap_packing_density=0.85, pouring_holding_minutes=0.0)
        self.assertAlmostEqual(normal["total_furnace_sec_kwh_t"], 580.0, delta=1.0)

        with_losses = calculate_furnace_sec(tonnage_per_heat=1.5, scrap_packing_density=0.65, pouring_holding_minutes=30.0)
        self.assertTrue(with_losses["total_furnace_sec_kwh_t"] > normal["total_furnace_sec_kwh_t"])
        self.assertTrue(with_losses["holding_loss_kwh_t"] > 30.0)


class TestParetoOptimization(unittest.TestCase):
    def test_pareto_front_options(self):
        """Test multi-objective Pareto front ranks Option C as optimal."""
        res = calculate_pareto_front(
            leak_repair_budget_inr=15000.0,
            cylinder_min_pressure_bar=5.5,
            baseline_sec=11.2,
        )
        self.assertEqual(res["recommended_candidate"], "OPT-C")
        opt_c = next(o for o in res["pareto_candidates"] if o["id"] == "OPT-C")
        self.assertTrue(opt_c["is_optimal"])
        self.assertEqual(opt_c["sec_delta_pct"], -17.9)
        self.assertEqual(opt_c["clamping_margin_bar"], 1.0)
        self.assertTrue(opt_c["safety_compliant"])


class TestDiscomTariffAndEconomics(unittest.TestCase):
    def test_tod_tariff_and_pf_incentive(self):
        """Test Time of Day tariff and PF > 0.98 incentive rebate."""
        res = calculate_discom_tariff_costs(daily_kwh=8500.0, power_factor=0.99)
        self.assertTrue(res["power_factor_adjustment_inr"] < 0)
        self.assertIn("Incentive", res["pf_status"])

    def test_pf_penalty_surcharge(self):
        """Test PF < 0.90 penalty surcharge."""
        res = calculate_discom_tariff_costs(daily_kwh=8500.0, power_factor=0.82)
        self.assertTrue(res["power_factor_adjustment_inr"] > 0)
        self.assertIn("Penalty", res["pf_status"])

    def test_bee_adeetie_dpr(self):
        """Test BEE ADEETIE subsidy DPR calculation."""
        dpr = calculate_bee_adeetie_dpr(
            capex_inr=120000.0,
            annual_savings_inr=2993000.0,
            annual_kwh_saved=383718.0,
            subsidy_rate_pct=25.0
        )
        self.assertEqual(dpr["subsidy_amount_inr"], 30000.0)
        self.assertEqual(dpr["net_capex_inr"], 90000.0)
        self.assertTrue(dpr["payback_months_net"] < 1.0)
        self.assertTrue(dpr["scope2_co2_abatement_tons_yr"] > 300.0)

    def test_ipmvp_normalization(self):
        """Test IPMVP Option B/C baseline weather and tonnage normalization."""
        verif = calculate_ipmvp_option_bc_verification(
            baseline_sec=11.2,
            post_repair_sec=9.2,
            baseline_tonnage=758.9,
            actual_tonnage=762.4,
            ambient_temp_baseline_c=28.0,
            ambient_temp_actual_c=31.5,
        )
        self.assertEqual(verif["ambient_temp_delta_c"], 3.5)
        self.assertTrue(verif["adjusted_baseline_sec"] > 11.2)
        self.assertTrue(verif["verified_sec_reduction_pct"] > 18.0)
        self.assertEqual(verif["verification_status"], "APPROVED_VERIFIED")

    def test_load_shifting_arbitrage(self):
        """Test Time-of-Day peak-to-solar load shifting cost arbitrage."""
        res = calculate_load_shifting_arbitrage(shiftable_kwh_daily=1600.0)
        self.assertTrue(res["daily_cost_avoided_inr"] > 4000.0)
        self.assertTrue(res["annual_savings_inr"] > 1000000.0)
        self.assertTrue(res["tonnage_throughput_preserved"])

    def test_fuel_switching_decarbonisation(self):
        """Test thermal fuel switching from furnace oil to PNG."""
        res = calculate_fuel_switching(
            annual_thermal_consumption_gj=12500.0,
            baseline_fuel="furnace_oil",
            target_fuel="png",
            burner_retrofit_capex_inr=250000.0,
        )
        self.assertTrue(res["annual_fuel_cost_savings_inr"] > 2500000.0)
        self.assertTrue(res["payback_months"] < 2.0)
        self.assertTrue(res["scope1_co2_reduction_tons_yr"] > 200.0)

    def test_brsr_carbon_disclosure(self):
        """Test SEBI BRSR Core and GHG Protocol reporting."""
        res = calculate_brsr_carbon_disclosure(
            annual_electricity_kwh=3650000.0,
            annual_tonnage_good=3720.0,
            annual_kwh_saved=383718.0,
            thermal_gj=12500.0,
        )
        self.assertTrue(res["supply_chain_scorecard"]["sebi_brsr_core_aligned"])
        self.assertTrue(res["ghg_emissions"]["total_scope_1_and_2_tco2e"] > 0)
        self.assertTrue(res["energy_metrics"]["intensity_reduction_pct"] > 5.0)

    def test_system1_fast_verification(self):
        """Test System 1 non-autoregressive decision and safety bounding."""
        res = evaluate_system1_safety_bounds("OPT-C", 6.5, 5.5, 2.1, 3.5, 20.0)
        self.assertEqual(res["decision"], "APPROVE_FOR_OPERATOR")
        self.assertTrue(res["latency_ms"] < 30)
        self.assertEqual(res["safety_score"], 1.0)


class TestSimulationEngineRunner(unittest.TestCase):
    def test_engine_scenarios_and_guardrails(self):
        engine = SimulationEnginePython()
        leak_res = engine.run_scenario("leak_opt_c")
        self.assertEqual(leak_res["predicted_sec"], 9.2)
        self.assertTrue(leak_res["in_validated_range"])

        out_of_range = engine.run_scenario("extreme_super_speed_1000")
        self.assertFalse(out_of_range["in_validated_range"])
        self.assertIsNotNone(out_of_range["warning"])


if __name__ == "__main__":
    unittest.main()
