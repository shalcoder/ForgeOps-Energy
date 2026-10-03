"""
FastAPI main entry point for the ForgeOps 4-Agent Backend.
Exposes HTTP endpoints for the frontend and testing.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

from backend.pipeline import run_pipeline, stream_pipeline
from backend.database.audit_log import get_audit_log, log_decision_approval, get_audit_export
from backend.config import FORGEOPS_MCP_URL, FORGEOPS_MODEL, LIVE_AGENTS_ENABLED
from backend.mcp.nitro_mcp_client import NitroMCPClient
from backend.simulation_reasoning import reconcile_simulation
from backend.workbench import load_live_workbench

app = FastAPI(
    title="ForgeOps 4-Agent Pipeline API",
    description="Planner → Research → Analysis → Execution multi-agent backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str
    incident_id: Optional[str] = "INC-2407-001"
    batch_id: Optional[str] = "B-2407-184"
    constraints: Dict[str, Any] = Field(default_factory=dict)


class DecisionApprovalRequest(BaseModel):
    incident_id: str = "INC-2407-001"
    recommendation: Dict[str, Any]
    approved_by: str = "Vishal"
    agent_conclusion: str = ""


class SimulationRequest(BaseModel):
    name: str
    inputs: Dict[str, Any] = Field(default_factory=dict)
    constraints: Dict[str, Any] = Field(default_factory=dict)


SUPPORTED_INCIDENT_ID = "INC-2407-001"
SUPPORTED_BATCH_ID = "B-2407-184"


def require_supported_case(incident_id: str | None, batch_id: str | None) -> None:
    if incident_id != SUPPORTED_INCIDENT_ID or batch_id != SUPPORTED_BATCH_ID:
        raise HTTPException(
            status_code=409,
            detail=(
                "Live agents currently support only "
                f"{SUPPORTED_INCIDENT_ID} / {SUPPORTED_BATCH_ID}; "
                "this request belongs to a different case."
            ),
        )


def _health_payload():
    mcp_attached = False
    tool_count = 0
    mcp_error = None
    try:
        with NitroMCPClient(timeout=12) as client:
            tool_count = len(client.list_tools())
            mcp_attached = tool_count > 0
    except Exception as exc:
        mcp_error = str(exc)
    return {
        "status": "ok" if mcp_attached else "degraded",
        "service": "forgeops-agent-pipeline",
        "agents": ["planner", "research", "analysis", "execution"],
        "agentRoles": 4,
        "orchestratorProcesses": 1,
        "llmBacked": LIVE_AGENTS_ENABLED,
        "model": FORGEOPS_MODEL,
        "mcp": {
            "attached": mcp_attached,
            "endpoint": FORGEOPS_MCP_URL,
            "toolCount": tool_count,
            "error": mcp_error,
        },
        "supportedCase": {
            "incidentId": SUPPORTED_INCIDENT_ID,
            "batchId": SUPPORTED_BATCH_ID,
        },
    }


@app.get("/api/health")
def health():
    return _health_payload()


@app.get("/api/agent/health")
def agent_health():
    return _health_payload()


@app.get("/api/v1/sim/health")
def sim_health():
    return {
        "status": "ok",
        "service": "forgeops-simulation-engine",
        "version": "1.0.0",
        "physics_models": [
            "orifice_flow",
            "compressor_vfd",
            "furnace_sec",
            "pareto_optimizer",
            "discom_tariff",
            "ipmvp_option_bc",
        ],
    }


@app.post("/api/agent/pipeline")
def pipeline_query(req: QueryRequest):
    """Run the full 4-agent pipeline for a user query."""
    require_supported_case(req.incident_id, req.batch_id)
    result = run_pipeline(
        user_query=req.query,
        incident_id=req.incident_id,
        batch_id=req.batch_id,
        constraints=req.constraints,
    )
    return result.model_dump()


@app.get("/api/pipeline/stream")
def pipeline_stream(
    query: str,
    incident_id: str = "INC-2407-001",
    batch_id: str = "B-2407-184",
):
    """Run the 4-agent pipeline and stream real-time phase updates via SSE."""
    require_supported_case(incident_id, batch_id)
    return StreamingResponse(
        stream_pipeline(user_query=query, incident_id=incident_id, batch_id=batch_id),
        media_type="text/event-stream"
    )


@app.get("/api/agent/workbench")
def workbench_data(
    incident_id: str = "INC-2407-001",
    batch_id: str = "B-2407-184",
):
    """Return the frontend's current incident data from the deployed MCP."""
    require_supported_case(incident_id, batch_id)
    return load_live_workbench(incident_id=incident_id, batch_id=batch_id)


@app.post("/api/agent/simulate")
def simulate(req: SimulationRequest):
    """Execute the selected what-if scenario through the deployed MCP."""
    with NitroMCPClient() as client:
        value, trace = client.call_tool(
            "run_scenario",
            {
                "scenario_name": req.name,
                "parameters": {**req.inputs, **req.constraints},
            },
        )
    result = value.get("result", value) if isinstance(value, dict) else {}
    result = reconcile_simulation(
        req.name,
        req.inputs,
        req.constraints,
        result if isinstance(result, dict) else {},
    )
    return {
        **result,
        "tool_trace": trace,
        "source": "nitrocloud_mcp_with_parameter_reasoning",
    }


@app.get("/api/audit/log")
def audit_log(limit: int = 20):
    """Return the audit trail of agent pipeline runs."""
    return get_audit_log(limit=limit)


@app.get("/api/audit-log/export")
def audit_log_export():
    """Export immutable audit trail for ISO 50001 compliance."""
    return get_audit_export()


@app.post("/api/agent/decision/approve")
def approve_decision(req: DecisionApprovalRequest):
    """Record human approval; no MES or plant-control mutation is performed."""
    return log_decision_approval(
        incident_id=req.incident_id,
        recommendation=req.recommendation,
        approved_by=req.approved_by,
        agent_conclusion=req.agent_conclusion,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
