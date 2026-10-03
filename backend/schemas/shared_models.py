"""
Shared Pydantic models — the interface contracts between all 4 agents.
These models are the single source of truth for data shapes across the pipeline.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from enum import Enum


class AgentName(str, Enum):
    PLANNER = "planner"
    RESEARCH = "research"
    ANALYSIS = "analysis"
    EXECUTION = "execution"


class MCPServer(str, Enum):
    MES = "MES"
    MAINTENANCE = "Maintenance"
    QUALITY = "Quality"
    MATERIALS = "Materials"
    SIMULATION = "Simulation"
    ORCHESTRATOR = "Orchestrator"


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))



class UIState(BaseModel):
    active_view: Optional[str] = None
    active_incident_id: Optional[str] = None
    active_batch_id: Optional[str] = None
    highlighted_nodes: List[str] = Field(default_factory=list)
    pinned_timestamp: Optional[str] = None


class Incident(BaseModel):
    incident_id: str
    batch_id: str
    plant: str
    line: str
    severity: str
    yield_baseline_pct: float
    yield_actual_pct: float
    status: str
    detected_at: str


# ==========================================
# FACTORY STATE DATA CONTRACT (SECTION 15)
# ==========================================

class EquipmentTelemetry(BaseModel):
    id: str
    type: str
    status: str
    powerKw: float
    loadPct: Optional[float] = None
    temperatureC: Optional[float] = None
    pressureBar: Optional[float] = None
    flowRate: Optional[float] = None
    vibration: Optional[float] = None


class ProductionState(BaseModel):
    lineId: str
    product: str
    throughput: float
    unit: str
    qualityRate: float


class EnergyState(BaseModel):
    totalKw: float
    kwhPerUnit: float
    tariff: float


class MaintenanceState(BaseModel):
    equipmentId: str
    openIssues: List[str] = Field(default_factory=list)
    lastMaintenance: Optional[str] = None


class FactoryConstraints(BaseModel):
    minThroughput: float
    maxTemperature: Optional[float] = None
    minPressure: Optional[float] = None
    maxQualityLoss: float


class FactoryState(BaseModel):
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    equipment: List[EquipmentTelemetry]
    production: ProductionState
    energy: EnergyState
    maintenance: MaintenanceState
    constraints: FactoryConstraints

