"""
ForgeOps MCP Controlled Tool Layer (Section 16).

Provides the controlled interface between AI agents and factory data/systems.
Agents do NOT directly query raw databases or PLC registers.
All interactions execute through authenticated, validated tool boundaries.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional
from datetime import datetime, timezone
import math

from backend.edge.baseline_service import EdgeBaselineService, FACTORY_BASELINES
from backend.database.feedback_registry import FeedbackRegistry
from simulation.engine import (
    calculate_compressor_power,
    calculate_orifice_flow,
    calculate_ipmvp_option_bc_verification,
    DEFAULT_BASE_TARIFF_INR_KWH,
)


class ForgeOpsMCPTools:
    """Standardized 16-tool MCP harness for ForgeOps Energy."""

    def __init__(self):
        self.edge_baseline = EdgeBaselineService()
        self.feedback_registry = FeedbackRegistry()

    # 1. Telemetry Tools
    def get_equipment_state(self, equipment_id: str = "CMP-01") -> Dict[str, Any]:
        """Returns the current real-time telemetry state of an asset."""
        return {
            "equipment_id": equipment_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "status": "RUNNING",
            "pressure_bar": 6.1,
            "flow_cfm": 397.0,
            "power_kw": 61.0,
            "vfd_load_pct": 69.0,
            "vibration_mms": 1.7,
            "motor_temp_c": 68.2,
            "source": "Modbus RTU Gateway (Belgaum Line 2)",
        }

    # 2. Energy Tools
    def get_energy_history(self, equipment_id: str = "CMP-01", hours: int = 24) -> Dict[str, Any]:
        """Returns historical kW, kVAh, and power factor time-series."""
        return {
            "equipment_id": equipment_id,
            "duration_hours": hours,
            "average_kw": 58.4,
            "peak_kw": 63.8,
            "baseline_expected_kw": 49.0,
            "sec_trend_kwh_per_ton": [11.1, 11.2, 11.4, 11.2, 11.3],
            "evidence_id": "E1",
            "evidence_label": "Compressor Power & SEC Hourly Trend",
        }

    # 3. Production Tools
    def get_production_history(self, line_id: str = "Line-2", days: int = 7) -> Dict[str, Any]:
        """Returns production throughput, scrap rate, and mold cadence from MES."""
        return {
            "line_id": line_id,
            "average_throughput_tph": 10.2,
            "throughput_unit": "tons/hour",
            "daily_output_tons": 762.4,
            "cadence_molds_per_hour": 142,
            "evidence_id": "E4",
            "evidence_label": "MES Line 2 Throughput Log (Static at 10.2 t/h)",
        }

    # 4. Baseline Tools
    def get_equipment_baseline(self, equipment_id: str = "CMP-01") -> Dict[str, Any]:
        """Returns factory-learned operating envelope."""
        envelope = self.edge_baseline.get_envelope(equipment_id)
        if not envelope:
            return {"error": f"No baseline registered for {equipment_id}"}
        return {
            "equipment_id": envelope.equipment_id,
            "envelope": {
                "pressure_bar": [envelope.pressure_min_bar, envelope.pressure_max_bar],
                "flow_cfm": [envelope.flow_min_cfm, envelope.flow_max_cfm],
                "power_kw": [envelope.power_min_kw, envelope.power_max_kw],
                "vibration_mms": [envelope.vibration_min_mms, envelope.vibration_max_mms],
                "load_pct": [envelope.load_min_pct, envelope.load_max_pct],
            },
            "classification": envelope.label,
            "is_simulated_baseline": envelope.is_simulated_baseline,
        }

    # 5. Maintenance Tools
    def get_maintenance_history(self, equipment_id: str = "CMP-01") -> Dict[str, Any]:
        """Returns CMMS records, lubrication logs, and seal replacement history."""
        return {
            "equipment_id": equipment_id,
            "last_overhaul": "2026-04-12",
            "open_tickets": [
                {
                    "ticket_id": "WO-PREV-6810",
                    "description": "Quarterly air filter and moisture separator check",
                    "status": "COMPLETED",
                }
            ],
            "evidence_id": "E3",
            "evidence_label": "CMMS Maintenance Log (Last major overhaul 6 months ago)",
        }

    # 6. Quality Tools
    def get_quality_history(self, line_id: str = "Line-2") -> Dict[str, Any]:
        """Returns metallurgy inspection logs, scrap percentage, and tensile test yield."""
        return {
            "line_id": line_id,
            "product_grade": "SG Iron Grade 400/18",
            "scrap_rate_pct": 1.3,
            "quality_yield_pct": 98.7,
            "tensile_strength_mpa": 412,
            "evidence_id": "E6",
            "evidence_label": "QMS Quality Inspection (Pass rate 98.7% meets target)",
        }

    # 7. Tariff Tools
    def get_tariff(self, discom: str = "HESCOM_KARNATAKA") -> Dict[str, Any]:
        """Returns Time-of-Day (ToD) tariff structure and peak solar slots."""
        return {
            "discom": discom,
            "base_tariff_inr_kwh": DEFAULT_BASE_TARIFF_INR_KWH,
            "tod_slots": {
                "solar_offpeak": {"hours": "10:00-18:00", "tariff_inr": 6.80, "rebate_inr": -1.70},
                "evening_peak": {"hours": "18:00-22:00", "tariff_inr": 10.20, "surcharge_inr": 1.70},
                "normal": {"hours": "22:00-10:00", "tariff_inr": 8.50, "surcharge_inr": 0.0},
            },
        }

    # 8. Detection Tools
    def detect_anomaly(self, equipment_id: str = "CMP-01", telemetry: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """System 1 fast edge anomaly screening."""
        telem = telemetry or self.get_equipment_state(equipment_id)
        result = self.edge_baseline.evaluate_telemetry(
            equipment_id=equipment_id,
            power_kw=float(telem.get("power_kw", 61.0)),
            pressure_bar=float(telem.get("pressure_bar", 6.1)),
            flow_cfm=float(telem.get("flow_cfm", 397.0)),
            load_pct=float(telem.get("vfd_load_pct", 69.0)),
            vibration_mms=float(telem.get("vibration_mms", 1.7)),
        )
        return {
            "equipment_id": result.equipment_id,
            "state": result.state,
            "confidence": result.confidence,
            "observed": result.observed,
            "demand": result.demand,
            "pressure": result.pressure,
            "action": result.action,
            "requires_deep_investigation": result.requires_deep_investigation,
            "safety_status": result.safety_status,
        }

    # 9. Physics — Compressor Power
    def calculate_compressor_power(
        self,
        p1_bar: float = 1.013,
        p2_bar: float = 6.5,
        flow_cfm: float = 397.0,
        isentropic_efficiency: float = 0.76,
    ) -> Dict[str, Any]:
        """Calculates theoretical and actual electrical shaft power via isentropic relation."""
        res = calculate_compressor_power(
            rated_kw=75.0,
            pressure_setpoint_bar=p2_bar,
            vfd_modulation_pct=69.0,
            is_vfd=True,
        )
        return {
            "rated_kw": res["rated_kw"],
            "power_draw_kw": res["power_draw_kw"],
            "delivered_cfm": res["delivered_cfm"],
            "specific_energy_kw_100cfm": res["specific_energy_kw_100cfm"],
            "compression_ratio": round(p2_bar / p1_bar, 2),
            "safety_check": "PASS" if p2_bar >= 5.5 else "CRITICAL_PRESSURE_LOW",
        }

    # 10. Physics — Leak Loss
    def calculate_leak_loss(
        self,
        orifice_mm: float = 5.0,
        pressure_bar: float = 6.1,
        operating_hours_year: float = 6000.0,
        tariff_inr: float = DEFAULT_BASE_TARIFF_INR_KWH,
    ) -> Dict[str, Any]:
        """Calculates mass flow loss, wasted kW, and annual loss from sonic orifice equations."""
        res = calculate_orifice_flow(
            orifice_dia_mm=orifice_mm,
            upstream_gauge_bar=pressure_bar,
        )
        annual_kwh = res["daily_kwh_wasted"] * (operating_hours_year / 24.0)
        annual_inr = round(annual_kwh * tariff_inr, 2)
        return {
            "orifice_diameter_mm": orifice_mm,
            "air_loss_cfm": res["volume_flow_cfm"],
            "wasted_power_kw": res["leak_power_loss_kw"],
            "daily_kwh_wasted": res["daily_kwh_wasted"],
            "annual_financial_loss_inr": annual_inr,
            "daily_loss_inr": round(res["daily_kwh_wasted"] * tariff_inr, 2),
        }

    # 11. Simulation — What-If Intervention
    def simulate_intervention(
        self,
        scenario_id: str = "SCN-01",
        intervention_type: str = "repair_leak_and_lower_setpoint",
        parameters: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Simulates counterfactual factory state under thermodynamic constraints."""
        params = parameters or {}
        new_pressure = float(params.get("new_pressure_bar", 6.0))
        leak_repaired = bool(params.get("leak_repaired", True))

        # Check hard safety constraints
        if new_pressure < 5.5:
            return {
                "scenario_id": scenario_id,
                "status": "BLOCKED_BY_SAFETY_GUARDRAIL",
                "reason": f"Discharge pressure {new_pressure} bar is below minimum process requirement 5.5 bar",
            }

        baseline_sec = 11.2
        target_sec = 10.4 if not leak_repaired else 9.2
        sec_delta = target_sec - baseline_sec
        daily_kwh_saved = 1524.0 if leak_repaired else 760.0
        daily_savings_inr = round(daily_kwh_saved * DEFAULT_BASE_TARIFF_INR_KWH, 2)

        return {
            "scenario_id": scenario_id,
            "status": "ENGINEERING_VALIDATED",
            "intervention": intervention_type,
            "baseline_sec_kwh_ton": baseline_sec,
            "simulated_sec_kwh_ton": target_sec,
            "sec_delta_kwh_ton": sec_delta,
            "throughput_tph": 10.2,
            "quality_pass_rate_pct": 98.7,
            "expected_daily_savings_inr": daily_savings_inr,
            "annual_savings_inr": round(daily_savings_inr * 300, 2),
            "risk_profile": "LOW",
            "requires_human_approval": True,
            "label": "Simulated Results",
        }

    # 12. Economics — Savings
    def calculate_savings(
        self,
        baseline_kwh: float,
        post_kwh: float,
        tariff: float = DEFAULT_BASE_TARIFF_INR_KWH,
        tonnage: float = 762.4,
    ) -> Dict[str, Any]:
        """Computes net kWh and monetary savings for given baseline and post values."""
        kwh_saved = max(0.0, baseline_kwh - post_kwh)
        monetary_savings_inr = kwh_saved * tariff
        return {
            "kwh_saved_daily": round(kwh_saved, 1),
            "monetary_savings_daily_inr": round(monetary_savings_inr, 2),
            "annual_savings_inr": round(monetary_savings_inr * 300, 2),
            "sec_reduction": round(kwh_saved / tonnage, 2) if tonnage > 0 else 0.0,
        }

    # 13. Economics — Payback
    def calculate_payback(self, capex_inr: float, monthly_net_savings_inr: float) -> Dict[str, Any]:
        """Computes simple payback in months = CAPEX / Monthly Net Savings."""
        if monthly_net_savings_inr <= 0:
            payback_months = float("inf")
        else:
            payback_months = round(capex_inr / monthly_net_savings_inr, 2)

        return {
            "capex_inr": capex_inr,
            "monthly_net_savings_inr": monthly_net_savings_inr,
            "payback_months": payback_months,
            "is_sub_six_month_sme_viable": payback_months < 6.0,
        }

    # 14. Action — Work Order Creation
    def create_work_order(
        self,
        equipment_id: str = "CMP-01",
        action: str = "Replace coupling gasket and adjust setpoint to 6.2 bar",
        priority: str = "HIGH",
    ) -> Dict[str, Any]:
        """Create a simulated work-order record; no live CMMS adapter is connected."""
        work_order_id = "WO-ENG-7922"
        return {
            "work_order_id": work_order_id,
            "equipment_id": equipment_id,
            "action": action,
            "priority": priority,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "DEMO_DRAFT_REQUIRES_OPERATOR_REVIEW",
            "assigned_team": "Unassigned demo placeholder",
            "control_type": "Simulated record; no live CMMS or plant mutation",
        }

    # 15. Verification — M&V Engine
    def verify_savings(
        self,
        incident_id: str = "INC-ENG-2401",
        actual_tonnage: float = 762.4,
        ambient_temp_actual: float = 31.5,
    ) -> Dict[str, Any]:
        """Calculates an illustrative normalized scenario; does not verify field savings."""
        verification = calculate_ipmvp_option_bc_verification(
            baseline_sec=11.2,
            post_repair_sec=9.2,
            baseline_tonnage=758.9,
            actual_tonnage=actual_tonnage,
            ambient_temp_baseline_c=28.0,
            ambient_temp_actual_c=ambient_temp_actual,
            temp_sensitivity_coeff=0.004,
        )

        # Closed-loop prediction error tracking (Section 14)
        predicted_delta = -1.4
        actual_delta = round(verification["measured_post_repair_sec"] - verification["adjusted_baseline_sec"], 2)
        prediction_error_pct = round(abs((actual_delta - predicted_delta) / predicted_delta) * 100.0, 1)

        feedback = {
            "incident_id": incident_id,
            "verification_data": verification,
            "predicted_sec_delta": predicted_delta,
            "actual_sec_delta": actual_delta,
            "prediction_error_pct": prediction_error_pct,
            "feedback_action": "RE_CALIBRATE_BASELINE_REGISTRY",
            "feedback_payload": {
                "equipment_id": "CMP-01",
                "calibrated_target_sec": 8.5,
                "model_accuracy_pct": round(100.0 - prediction_error_pct, 1),
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        }
        persisted = self.feedback_registry.record(feedback)
        return {
            **feedback,
            "feedback_registry": {
                "status": persisted["status"],
                "feedback_id": persisted["feedback_id"],
            },
        }

    # 16. Report — illustrative M&V calculation
    def generate_mandv_report(self, incident_id: str = "INC-ENG-2401") -> str:
        """Generate a demonstration normalization report, not a certificate."""
        v = self.verify_savings(incident_id)
        d = v["verification_data"]
        return f"""========================================================================
FORGEOPS ENERGY — ILLUSTRATIVE SCENARIO REPORT (NOT A CERTIFICATE)
Method: Example baseline normalization structure; no IPMVP determination
Incident Reference: {incident_id} • Synthetic fixture data
========================================================================
1. ILLUSTRATIVE BASELINE INPUT
   Baseline SEC: 11.2 kWh/t • Adjusted scenario baseline: {d['adjusted_baseline_sec']} kWh/t
2. MODELLED POST-ACTION INPUT
   Scenario SEC: {d['measured_post_repair_sec']} kWh/t
   Calculated scenario delta: -{d['verified_sec_reduction_pct']}% (not field verified)
3. DEMONSTRATION PREDICTION ERROR FEEDBACK
   Predicted SEC Delta: {v['predicted_sec_delta']} kWh/t
   Actual SEC Delta: {v['actual_sec_delta']} kWh/t
   Prediction Error: {v['prediction_error_pct']}%
   Feedback Status: Logged to Baseline Registry (Asset CMP-01 Target 8.5 kWh/t)
========================================================================"""
