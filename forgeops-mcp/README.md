# ForgeOps Energy — Model Context Protocol (MCP) Server

> **TypeScript / NitroStack MCP Server for Industrial Decision-Intelligence & Energy Telemetry**

The `forgeops-mcp` package serves as the **industrial telemetry and action bridge** for the ForgeOps Energy platform. It provides the Python 4-agent backend (`ResearchAgent` & `ExecutionAgent`) with structured, schema-validated tool contracts to query plant sensors, electrical submeters, pneumatic lines, MES production runs, and CMMS work orders.

---

## 🚀 Quick Start

### Prerequisites
- Node.js `18.0.0` or higher
- npm `9.0.0` or higher

### Installation & Build
```bash
cd forgeops-mcp
npm install
npm run build
```

### Running the Server
```bash
# Start MCP server with HTTP bridge for external agents
npm run api

# Start with NitroStack CLI in development mode
npm run dev
```
The HTTP API server initializes on `http://localhost:3001` or standard stdio protocol.

---

## 📦 Module Architecture

The server exposes 7 segregated factory domain modules:

| Module | Location | Description | Key Tools |
|---|---|---|---|
| **energy** | `src/modules/energy/` | Electrical submeters, SEC calculations, pneumatics & tariffs | `get_energy_telemetry`, `get_compressed_air_metrics`, `simulate_energy_intervention` |
| **mes** | `src/modules/mes/` | Batch production runs, gross/net tonnage & cycle times | `get_batch_history`, `get_production_path`, `get_queue_events` |
| **maintenance** | `src/modules/maintenance/` | CMMS failure alerts, PM states & work order dispatching | `get_machine_alerts`, `get_maintenance_state`, `create_work_order` |
| **materials** | `src/modules/materials/` | Charge mix ratios, pig iron grade & chemistry limits | `get_supplier_lot_info`, `get_material_constraints` |
| **quality** | `src/modules/quality/` | Rejection records, porosity defects & hardness testing | `get_defect_records`, `get_inspection_results` |
| **simulation** | `src/modules/simulation/` | Counterfactual physics & multi-objective Pareto optimizer | `run_scenario`, `compare_scenarios` |
| **orchestrator** | `src/modules/orchestrator/` | Incident dossier aggregation, causal DAG & timeline | `get_incident_summary`, `get_timeline`, `get_causal_graph` |

---

## 📋 Engineering Backlog & Required Tool Upgrades

For the complete gap analysis, required tool enhancements, and prioritized backlog for Dev 1 (Keerthi) and Dev 3 (Sham), see:  
👉 **[`MCP_TOOLS_BACKLOG.md`](./MCP_TOOLS_BACKLOG.md)**

---

## 🧪 Testing & Verification

```bash
# Run tool schema and execution tests
npm run test:tools

# Run HTTP API bridge validation
npm run test:api

# Run full TypeScript typecheck
npm run typecheck
```
