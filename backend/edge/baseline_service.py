"""
L1 Edge Industrial Gateway — Factory-Specific Baseline & Anomaly Screening Service.

Architecture Principle:
There is NO universal equipment threshold across factories.
The baseline service models:
  Equipment + Operating Condition + Production State + Historical Telemetry
  -> Expected Operating Envelope

Notice: All baseline boundaries in prototype are explicitly labeled:
"Synthetic pilot telemetry / simulated baseline"
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, Optional
from datetime import datetime


@dataclass
class OperatingEnvelope:
    equipment_id: str
    equipment_type: str
    pressure_min_bar: float
    pressure_max_bar: float
    flow_min_cfm: float
    flow_max_cfm: float
    power_min_kw: float
    power_max_kw: float
    vibration_min_mms: float
    vibration_max_mms: float
    load_min_pct: float
    load_max_pct: float
    label: str = "Synthetic pilot telemetry / simulated baseline"
    is_simulated_baseline: bool = True
    calibrated_at: str = "2026-10-01T08:00:00Z"


# Belgaum SME Foundry Pilot Baselines (Equipment Specific)
FACTORY_BASELINES: Dict[str, OperatingEnvelope] = {
    "CMP-01": OperatingEnvelope(
        equipment_id="CMP-01",
        equipment_type="Rotary Screw Compressor with VFD",
        pressure_min_bar=6.2,
        pressure_max_bar=6.6,
        flow_min_cfm=380.0,
        flow_max_cfm=430.0,
        power_min_kw=45.0,
        power_max_kw=53.0,
        vibration_min_mms=1.2,
        vibration_max_mms=2.1,
        load_min_pct=55.0,
        load_max_pct=75.0,
    ),
    "FURN-02": OperatingEnvelope(
        equipment_id="FURN-02",
        equipment_type="Medium Frequency Coreless Induction Furnace (1.5 Ton)",
        pressure_min_bar=0.0,
        pressure_max_bar=0.0,
        flow_min_cfm=0.0,
        flow_max_cfm=0.0,
        power_min_kw=520.0,
        power_max_kw=610.0,
        vibration_min_mms=0.5,
        vibration_max_mms=1.4,
        load_min_pct=70.0,
        load_max_pct=95.0,
    ),
    "MOT-04": OperatingEnvelope(
        equipment_id="MOT-04",
        equipment_type="ID Fan Induction Motor 45 kW with VFD",
        pressure_min_bar=0.0,
        pressure_max_bar=0.0,
        flow_min_cfm=0.0,
        flow_max_cfm=0.0,
        power_min_kw=28.0,
        power_max_kw=36.0,
        vibration_min_mms=0.8,
        vibration_max_mms=2.2,
        load_min_pct=60.0,
        load_max_pct=82.0,
    ),
}


@dataclass
class System1EvaluationResult:
    equipment_id: str
    state: str
    confidence: float
    observed: str
    demand: str
    pressure: str
    action: str
    requires_deep_investigation: bool
    safety_status: str
    envelope: OperatingEnvelope
    diagnostics: Dict[str, Any] = field(default_factory=dict)


class EdgeBaselineService:
    """Edge runtime service calculating deviations from learned factory envelopes."""

    def __init__(self, baselines: Optional[Dict[str, OperatingEnvelope]] = None):
        self.baselines = baselines or FACTORY_BASELINES

    def get_envelope(self, equipment_id: str) -> Optional[OperatingEnvelope]:
        return self.baselines.get(equipment_id)

    def evaluate_telemetry(
        self,
        equipment_id: str,
        power_kw: float,
        pressure_bar: float = 6.5,
        flow_cfm: float = 397.0,
        load_pct: float = 69.0,
        vibration_mms: float = 1.7,
        production_throughput_tph: float = 10.2,
        expected_throughput_tph: float = 10.2,
    ) -> System1EvaluationResult:
        """
        System 1 fast loop evaluation.
        Never declares "The equipment is definitely faulty."
        Instead outputs structured state, calibrated confidence, and investigation trigger.
        """
        envelope = self.get_envelope(equipment_id)
        if not envelope:
            # Fallback envelope if unknown
            envelope = OperatingEnvelope(
                equipment_id=equipment_id,
                equipment_type="Industrial Asset",
                pressure_min_bar=5.5,
                pressure_max_bar=7.0,
                flow_min_cfm=300.0,
                flow_max_cfm=500.0,
                power_min_kw=power_kw * 0.8,
                power_max_kw=power_kw * 1.05,
                vibration_min_mms=1.0,
                vibration_max_mms=2.5,
                load_min_pct=50.0,
                load_max_pct=80.0,
            )

        # Baseline midpoint and power deviation
        baseline_mid_power = (envelope.power_min_kw + envelope.power_max_kw) / 2.0
        power_delta_pct = ((power_kw - baseline_mid_power) / baseline_mid_power) * 100.0

        # Production demand state
        demand_status = "Normal"
        if production_throughput_tph > expected_throughput_tph * 1.08:
            demand_status = "Surge (+8% above nominal)"
        elif production_throughput_tph < expected_throughput_tph * 0.92:
            demand_status = "Curtailed (-8% below nominal)"

        # Pressure state
        pressure_status = "Normal"
        if pressure_bar < envelope.pressure_min_bar:
            pressure_status = f"Sub-nominal ({pressure_bar:.1f} bar < {envelope.pressure_min_bar:.1f} bar)"
        elif pressure_bar > envelope.pressure_max_bar:
            pressure_status = f"Super-nominal ({pressure_bar:.1f} bar > {envelope.pressure_max_bar:.1f} bar)"

        # Hard Safety Guardrails check (P >= 5.5 bar, vibration <= 3.5 mm/s)
        safety_status = "PASS"
        if pressure_bar < 5.5:
            safety_status = "CRITICAL_PRESSURE_VIOLATION"
        elif vibration_mms > 3.5:
            safety_status = "BEARING_VIBRATION_INTERLOCK"

        # Fast non-autoregressive triage
        is_abnormal_power = power_kw > envelope.power_max_kw
        if is_abnormal_power:
            pct_above_max = ((power_kw - envelope.power_max_kw) / envelope.power_max_kw) * 100.0
            confidence = min(0.85 + (pct_above_max / 100.0) * 0.4, 0.98)
            observed_str = f"Power +{pct_above_max:.1f}% above expected envelope ({envelope.power_min_kw:.0f}–{envelope.power_max_kw:.0f} kW)"
            state_str = "ABNORMAL ENERGY BEHAVIOUR"
            action_str = "Trigger investigation (System 2)"
            trigger_deep = True
        elif power_kw < envelope.power_min_kw * 0.8 and load_pct > 50.0:
            confidence = 0.88
            observed_str = "Severe under-power anomaly relative to VFD load percentage"
            state_str = "ELECTRICAL ANOMALY"
            action_str = "Trigger investigation (System 2)"
            trigger_deep = True
        else:
            confidence = 0.95
            observed_str = "Operating within normal historical envelope"
            state_str = "NOMINAL ENERGY BEHAVIOUR"
            action_str = "Normal Monitoring"
            trigger_deep = False

        return System1EvaluationResult(
            equipment_id=equipment_id,
            state=state_str,
            confidence=round(confidence, 2),
            observed=observed_str,
            demand=demand_status,
            pressure=pressure_status,
            action=action_str,
            requires_deep_investigation=trigger_deep,
            safety_status=safety_status,
            envelope=envelope,
            diagnostics={
                "measured_power_kw": power_kw,
                "measured_pressure_bar": pressure_bar,
                "measured_flow_cfm": flow_cfm,
                "measured_vibration_mms": vibration_mms,
                "power_deviation_from_mid_pct": round(power_delta_pct, 1),
                "is_simulated_pilot": envelope.is_simulated_baseline,
            },
        )
