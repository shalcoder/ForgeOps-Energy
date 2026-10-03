"""
Unit tests for the Closed-Loop Industrial Decision Harness:
- FactoryState contract
- L1 EdgeBaselineService and equipment envelopes
- System 1 evaluation (ABNORMAL ENERGY BEHAVIOUR)
- Competing Hypotheses & Physics Rejection Matrix (Agent 3)
"""

import unittest
from backend.schemas.shared_models import (
    FactoryState,
    EquipmentTelemetry,
    ProductionState,
    EnergyState,
    MaintenanceState,
    FactoryConstraints,
)
from backend.edge.baseline_service import (
    EdgeBaselineService,
    FACTORY_BASELINES,
    OperatingEnvelope,
)
from backend.agents.analysis.analysis import evaluate_competing_hypotheses


class TestClosedLoopHarness(unittest.TestCase):
    def test_factory_state_contract(self):
        state = FactoryState(
            equipment=[
                EquipmentTelemetry(
                    id="CMP-01",
                    type="Compressor",
                    status="running",
                    powerKw=61.0,
                    loadPct=69.0,
                    pressureBar=6.5,
                    flowRate=397.0,
                    vibration=1.7,
                )
            ],
            production=ProductionState(
                lineId="Line-2",
                product="Automotive Flange Casting",
                throughput=10.2,
                unit="t/h",
                qualityRate=98.7,
            ),
            energy=EnergyState(
                totalKw=61.0,
                kwhPerUnit=5.98,
                tariff=8.50,
            ),
            maintenance=MaintenanceState(
                equipmentId="CMP-01",
                openIssues=["Air coupling seal degradation"],
                lastMaintenance="2026-09-15",
            ),
            constraints=FactoryConstraints(
                minThroughput=10.2,
                maxTemperature=85.0,
                minPressure=5.5,
                maxQualityLoss=0.02,
            ),
        )
        self.assertEqual(state.equipment[0].id, "CMP-01")
        self.assertEqual(state.production.throughput, 10.2)
        self.assertEqual(state.constraints.minPressure, 5.5)

    def test_edge_baseline_service_cmp01(self):
        service = EdgeBaselineService()
        envelope = service.get_envelope("CMP-01")
        self.assertIsNotNone(envelope)
        self.assertEqual(envelope.power_min_kw, 45.0)
        self.assertEqual(envelope.power_max_kw, 53.0)
        self.assertEqual(envelope.pressure_min_bar, 6.2)
        self.assertEqual(envelope.pressure_max_bar, 6.6)
        self.assertTrue(envelope.is_simulated_baseline)

    def test_system1_evaluation_abnormal_power(self):
        service = EdgeBaselineService()
        # Telemetry: 61 kW (above 45-53 envelope), 6.5 bar, 397 CFM, 69% load, 1.7 mm/s vibration
        eval_result = service.evaluate_telemetry(
            equipment_id="CMP-01",
            power_kw=61.0,
            pressure_bar=6.5,
            flow_cfm=397.0,
            load_pct=69.0,
            vibration_mms=1.7,
            production_throughput_tph=10.2,
        )
        self.assertEqual(eval_result.state, "ABNORMAL ENERGY BEHAVIOUR")
        self.assertGreaterEqual(eval_result.confidence, 0.90)
        self.assertTrue(eval_result.requires_deep_investigation)
        self.assertEqual(eval_result.action, "Trigger investigation (System 2)")
        self.assertEqual(eval_result.demand, "Normal")
        self.assertEqual(eval_result.pressure, "Normal")
        self.assertEqual(eval_result.safety_status, "PASS")

    def test_system1_safety_interlock(self):
        service = EdgeBaselineService()
        # Pressure violation: 4.8 bar < 5.5 bar hard guardrail
        eval_result = service.evaluate_telemetry(
            equipment_id="CMP-01",
            power_kw=50.0,
            pressure_bar=4.8,
            flow_cfm=350.0,
            load_pct=70.0,
            vibration_mms=1.5,
        )
        self.assertEqual(eval_result.safety_status, "CRITICAL_PRESSURE_VIOLATION")

    def test_competing_hypotheses_physics_rejection(self):
        hypotheses = evaluate_competing_hypotheses()
        self.assertEqual(len(hypotheses), 4)

        hypo_map = {h.hypothesis_id: h for h in hypotheses}
        # Hypothesis A should be confirmed (air leak)
        self.assertEqual(hypo_map["A"].status, "confirmed")
        self.assertGreater(hypo_map["A"].confidence_score, 0.80)

        # Hypothesis B should be rejected (setpoint excess)
        self.assertEqual(hypo_map["B"].status, "rejected")
        self.assertIsNotNone(hypo_map["B"].rejection_reason)

        # Hypothesis C should be low probability (vibration safe)
        self.assertEqual(hypo_map["C"].status, "low_probability")

        # Hypothesis D should be rejected (throughput static)
        self.assertEqual(hypo_map["D"].status, "rejected")
        self.assertIn("10.2 t/h", hypo_map["D"].rejection_reason)

    def test_mcp_tools_suite(self):
        from backend.mcp.forgeops_mcp_tools import ForgeOpsMCPTools
        tools = ForgeOpsMCPTools()

        # Telemetry
        state = tools.get_equipment_state("CMP-01")
        self.assertEqual(state["equipment_id"], "CMP-01")

        # Baseline
        base = tools.get_equipment_baseline("CMP-01")
        self.assertIn("envelope", base)

        # Anomaly Detection
        anom = tools.detect_anomaly("CMP-01")
        self.assertEqual(anom["state"], "ABNORMAL ENERGY BEHAVIOUR")
        self.assertTrue(anom["requires_deep_investigation"])

        # Physics
        leak = tools.calculate_leak_loss(5.0, 6.1)
        self.assertGreater(leak["annual_financial_loss_inr"], 200000)

        # Simulation
        sim = tools.simulate_intervention("SCN-01", "leak_repair", {"new_pressure_bar": 6.2})
        self.assertEqual(sim["status"], "ENGINEERING_VALIDATED")
        self.assertEqual(sim["label"], "Simulated Results")

        # Safety blocked simulation
        blocked_sim = tools.simulate_intervention("SCN-02", "extreme_reduction", {"new_pressure_bar": 4.8})
        self.assertEqual(blocked_sim["status"], "BLOCKED_BY_SAFETY_GUARDRAIL")

        # Payback
        payback = tools.calculate_payback(18000, 31200)
        self.assertEqual(payback["payback_months"], 0.58)
        self.assertTrue(payback["is_sub_six_month_sme_viable"])

        # Verification with prediction error feedback
        verif = tools.verify_savings("INC-ENG-2401", 762.4, 31.5)
        self.assertIn("prediction_error_pct", verif)
        self.assertEqual(verif["feedback_action"], "RE_CALIBRATE_BASELINE_REGISTRY")



if __name__ == "__main__":
    unittest.main()
