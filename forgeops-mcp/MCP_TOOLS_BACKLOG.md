# ForgeOps MCP Server — Engineering Backlog & Required Tool Changes

> **Target Component:** `forgeops-mcp/` (TypeScript / NitroStack Model Context Protocol Server)  
> **Primary Owner:** Dev 1 (Keerthi — Agentic Pipeline & MCP Backend Engineer)  
> **Supporting Role:** Dev 3 (Sham — Physics & Simulation Specialist)  
> **Document Status:** Active Engineering Backlog & Specification  

---

## 📑 Table of Contents

1. [Executive Audit of Current MCP Tools](#1-executive-audit-of-current-mcp-tools)
2. [Module-by-Module Gap Analysis & Required Changes](#2-module-by-module-gap-analysis--required-changes)
   - [2.1 Energy Module (`modules/energy/`)](#21-energy-module-modulesenergy)
   - [2.2 MES Module (`modules/mes/`)](#22-mes-module-modulesmes)
   - [2.3 Maintenance & CMMS Module (`modules/maintenance/`)](#23-maintenance--cmms-module-modulesmaintenance)
   - [2.4 Materials & Metallurgy Module (`modules/materials/`)](#24-materials--metallurgy-module-modulesmaterials)
   - [2.5 Quality & Defect Module (`modules/quality/`)](#25-quality--defect-module-modulesquality)
   - [2.6 Counterfactual Simulation Module (`modules/simulation/`)](#26-counterfactual-simulation-module-modulessimulation)
   - [2.7 Orchestrator Module (`modules/orchestrator/`)](#27-orchestrator-module-modulesorchestrator)
3. [Cross-Cutting Architectural Improvements](#3-cross-cutting-architectural-improvements)
4. [Prioritized Implementation Backlog (P0, P1, P2)](#4-prioritized-implementation-backlog-p0-p1-p2)
5. [Complete Target Tool Registry & Schemas](#5-complete-target-tool-registry--schemas)

---

## 1. Executive Audit of Current MCP Tools

The `forgeops-mcp` server acts as the **standardized telemetry bridge** connecting the Python 4-agent backend to the physical shop floor and historical factory databases.

### Current Strengths:
- Modular TypeScript structure with `@Tool` decorators adhering to NitroStack / MCP standards.
- High-fidelity incident data fixtures (`data/incident-data.ts`) representing the Belgaum Foundry demonstration.
- HTTP bridge (`http-api.ts`) allowing seamless REST calling from the Python `ResearchAgent`.

### Identified Deficiencies & Architectural Gaps:
1. **Loose Typing in Simulation:** `run_scenario` and `compare_scenarios` accept `z.record(z.any())` without enforcing physics parameters (pressure bar, leak orifice diameter, VFD modulation).
2. **Missing Mutation Capabilities:** While read tools exist, CMMS work order creation (`create_work_order`) and status updates are partially mocked in the frontend rather than exposed as native MCP tools.
3. **Missing Indian Tariff Telemetry:** Energy tools lack Time-of-Day (ToD) peak demand surcharge registers and Power Factor penalty calculations.
4. **Context Window Token Bloat:** Raw telemetry queries return uncompressed arrays of timestamps, consuming excessive tokens when passed to LLM agents.
5. **No Device Error Boundaries:** If an edge sensor or meter is unreachable, tools throw unhandled errors rather than returning structured degraded telemetry with `is_partial: true`.

---

## 2. Module-by-Module Gap Analysis & Required Changes

```text
┌────────────────────────────────────────────────────────────────────────┐
│                     FORGEOPS MCP TOOL MODULES                          │
├──────────────┬──────────────┬────────────────┬─────────────────────────┤
│ energy       │ mes          │ maintenance    │ materials               │
│ • Submeters  │ • Batches    │ • CMMS Alerts  │ • Charge Mix & Scrap    │
│ • Air Scada  │ • Tonnage    │ • Work Orders  │ • Chemistry (C, Si, Mn) │
├──────────────┼──────────────┼────────────────┼─────────────────────────┤
│ quality      │ simulation   │ orchestrator   │ edge-gateway (NEW)      │
│ • Defects    │ • Orifice    │ • Dossier      │ • Modbus RS-485 Poll    │
│ • Hardness   │ • Pareto Sim │ • Causal DAG   │ • Local Ring Buffer     │
└──────────────┴──────────────┴────────────────┴─────────────────────────┘
```

---

### 2.1 Energy Module (`modules/energy/`)
*Files: `src/modules/energy/energy.tools.ts`, `src/modules/energy/energy.module.ts`*

#### Required Changes:
1. **Add Time-of-Day (ToD) Tariff Tool (`get_peak_demand_tariff`):**
   - Must query active DISCOM tariff bands (Normal: ₹8.20/kWh, Peak: ₹9.84/kWh, Solar: ₹6.97/kWh).
   - Calculate instantaneous penalty risk if plant active power exceeds Contract Demand (kVA).
2. **Enhance `get_energy_telemetry` with Induction Furnace Breakdown:**
   - Return segregated melting power vs holding power for twin 1.5-ton furnaces.
   - Include 3-phase voltage balance ($V_{ab}, V_{bc}, V_{ca}$) and Power Factor ($\text{PF}$).
3. **Enhance `get_compressed_air_metrics` with Specific Power Consumption:**
   - Return rotary compressor specific power ($\text{kW} / 100 \text{ CFM}$).
   - Return acoustic leak detection frequency band (38.4 kHz ultrasonic spectrum).

```typescript
// TARGET TOOL SCHEMA: get_peak_demand_tariff
@Tool({
  name: 'get_peak_demand_tariff',
  description: 'Queries active Indian industrial electricity tariff band, contract demand threshold, and current power factor penalty risk.',
  inputSchema: z.object({
    discom_id: z.string().default('HESCOM_BELGAUM'),
    timestamp: z.string().optional(),
  }),
})
```

---

### 2.2 MES Module (`modules/mes/`)
*Files: `src/modules/mes/mes.tools.ts`, `src/modules/mes/mes.module.ts`*

#### Required Changes:
1. **Add Scrap-to-Good Ratio Tracking (`get_tonnage_produced`):**
   - Calculate net good casting tonnage vs runner/riser return scrap per heat cycle.
   - Enables the Planner Agent to calculate the exact denominator for $\text{SEC} = \frac{\text{kWh}}{\text{Good Net Output (tons)}}$.
2. **Add Pouring Station Queue Delay Telemetry (`get_queue_events`):**
   - Track temperature drop in transfer ladles during mold line pauses (every 10 min delay increases ladle reheating energy by 18 kWh).

---

### 2.3 Maintenance & CMMS Module (`modules/maintenance/`)
*Files: `src/modules/maintenance/maintenance.tools.ts`, `src/modules/maintenance/maintenance.module.ts`*

#### Required Changes:
1. **Implement CMMS Work Order Dispatch Tool (`create_work_order`):**
   - **Current Gap:** Work order dispatching is only mocked in the frontend.
   - **Requirement:** Allow the Execution Agent to generate and dispatch formal CMMS work orders (`WO-ENG-8821`) with torque specs, required flange gaskets (EPDM 80mm), and assigned shift maintenance crew.
2. **Add Mechanical Vibration Spectrum Tool (`get_vibration_spectrum`):**
   - Return velocity RMS (mm/s) and FFT peak frequencies for Machine 7 and Compressor 1.
   - Allows Analysis Agent to cryptographically prove that Machine 7 vibration (1.8 mm/s) is within ISO 10816 Class II permissible limits (<2.8 mm/s), ruling out bearing failure.

```typescript
// TARGET TOOL SCHEMA: create_work_order
@Tool({
  name: 'create_work_order',
  description: 'Dispatches an actionable maintenance work order to the plant CMMS with parts list, torque specifications, and downtime scheduling.',
  inputSchema: z.object({
    incident_id: z.string(),
    equipment_id: z.string(),
    intervention_type: z.enum(['leak_seal_repair', 'pressure_regulator_tune', 'valve_replacement', 'preventive_overhaul']),
    assigned_crew: z.string(),
    scheduled_time: z.string(),
    max_downtime_minutes: z.number(),
    required_parts: z.array(z.string()),
    approval_signature: z.string(),
  }),
})
```

---

### 2.4 Materials & Metallurgy Module (`modules/materials/`)
*Files: `src/modules/materials/materials.tools.ts`, `src/modules/materials/materials.module.ts`*

#### Required Changes:
1. **Add Charge Mix Chemistry Validation (`get_charge_mix_specs`):**
   - Query raw material charge ratios (Pig Iron: 40%, Steel Scrap: 35%, Foundry Returns: 25%).
   - Validate Carbon Equivalent ($\text{CE} = \%C + \frac{\%Si + \%P}{3}$) within grey iron casting window ($3.8\% - 4.2\%$).
2. **Add Scrap Moisture & Rust Level Check:**
   - Verify that energy consumption was not elevated due to drying wet scrap in the furnace.

---

### 2.5 Quality & Defect Module (`modules/quality/`)
*Files: `src/modules/quality/quality.tools.ts`, `src/modules/quality/quality.module.ts`*

#### Required Changes:
1. **Add Defect Classification Taxonomy (`get_defect_records`):**
   - Segregate defect records into: *Gas Porosity*, *Sand Inclusions*, *Misruns*, *Shrinkage Cavities*.
   - Correlate with mold line clamping pressure (dropping below 5.5 bar causes parting line flash and dimensional defect spikes).
2. **Add Brinell Hardness (BHN) & Tensile Strength Tool (`get_metallurgical_inspection`):**
   - Confirm that reducing holding temperature or trimming pneumatic setpoints does not compromise casting tensile strength ($\ge 250\text{ MPa}$).

---

### 2.6 Counterfactual Simulation Module (`modules/simulation/`)
*Files: `src/modules/simulation/simulation.tools.ts`, `src/services/simulation-engine.ts`*

#### Required Changes:
1. **Replace Loose Parameter Typing with Strict Zod Physics Schema:**
   - **Current:** `parameters: z.record(z.any()).optional()`
   - **Target:** Strict schema with `leak_orifice_mm`, `target_pressure_bar`, `vfd_speed_pct`, `ambient_temp_c`.
2. **Implement Thermodynamic Orifice Physics in `services/simulation-engine.ts`:**
   - Calculate compressed air mass flow rate $Q$ based on sonic vs subsonic pressure ratios:
     $$\dot{m} = C_d \cdot A \cdot P_1 \sqrt{\frac{\gamma}{R \cdot T} \left(\frac{2}{\gamma + 1}\right)^{\frac{\gamma + 1}{\gamma - 1}}}$$
3. **Add Multi-Objective Pareto Frontier Tool (`calculate_pareto_front`):**
   - Generates candidate options (A, B, C, D) balancing:
     - Specific Energy Reduction ($\Delta \text{SEC}$)
     - Implementation Cost ($\text{INR}$)
     - Tooling Changeover Downtime ($\text{Minutes}$)
     - Safety Clamping Pressure Margin ($\ge 5.5\text{ bar}$)

---

### 2.7 Orchestrator Module (`modules/orchestrator/`)
*Files: `src/modules/orchestrator/orchestrator.tools.ts`, `src/modules/orchestrator/orchestrator.module.ts`*

#### Required Changes:
1. **Dynamic Causal Graph Construction (`get_causal_graph`):**
   - Accept active incident telemetry and compute Bayesian conditional probabilities dynamically rather than returning static nodes.
2. **Synchronized Multi-Stream Timeline Builder (`get_timeline`):**
   - Accept time-range filters and return normalized events with millisecond timestamps and system provenance badges.

---

## 3. Cross-Cutting Architectural Improvements

### 1. Standardized Provenance Envelope
Every MCP tool must return its payload enclosed in a uniform metadata envelope:
```typescript
export interface MCPTelemetryEnvelope<T> {
  source_system: 'SCADA_ENERGY' | 'PNEUMATICS' | 'MES' | 'CMMS' | 'QUALITY' | 'SIMULATION';
  record_id: string;
  timestamp: string;
  is_partial: boolean;
  confidence: number;
  data: T;
  provenance_hash?: string; // SHA-256 for ISO 50001 auditability
}
```

### 2. Token-Efficient Response Compaction
- Instead of returning 5,000 raw 1-second telemetry points to the LLM, provide automated windowing:
  - Aggregate time-series into `mean`, `p95`, `min`, `max`, `std_dev`, and `anomalous_outliers`.
  - Reduces token footprint by **85%** while increasing LLM reasoning accuracy.

### 3. Graceful Hardware & Edge Fallbacks
- Wrap all external I/O queries in standard error boundaries:
  - If a Modbus RS-485 meter times out, return cached local ring-buffer data with `is_partial: true` and a warning flag.
  - Never throw unhandled 500 exceptions into the calling Agent pipeline.

---

## 4. Prioritized Implementation Backlog (P0, P1, P2)

### 🔴 Phase 1: P0 Critical Blockers (Sprint Week 1)
| ID | Task | Target Files | Owner |
|---|---|---|---|
| **MCP-01** | Replace loose simulation schemas with strict Zod physics inputs (`leak_orifice_mm`, `pressure_setpoint_bar`, `vfd_mod_pct`) | `modules/simulation/simulation.tools.ts` | Dev 1 + Dev 3 |
| **MCP-02** | Add Indian ToD peak tariff and power factor penalty tool (`get_peak_demand_tariff`) | `modules/energy/energy.tools.ts` | Dev 1 |
| **MCP-03** | Implement authentic CMMS work order mutation tool (`create_work_order`) | `modules/maintenance/maintenance.tools.ts` | Dev 1 |
| **MCP-04** | Implement compressed air orifice thermodynamics in simulation engine | `services/simulation-engine.ts` | Dev 3 |

### 🟡 Phase 2: P1 High-Value Enhancements (Sprint Week 2)
| ID | Task | Target Files | Owner |
|---|---|---|---|
| **MCP-05** | Add Machine 7 & Compressor vibration spectrum tool for ISO 10816 baseline verification | `modules/maintenance/maintenance.tools.ts` | Dev 1 |
| **MCP-06** | Add Pareto front optimization calculation tool (`calculate_pareto_front`) | `modules/simulation/simulation.tools.ts` | Dev 3 |
| **MCP-07** | Standardize telemetry return envelopes with cryptographic provenance hashes | `src/nitrostack.ts`, all tools | Dev 1 |
| **MCP-08** | Implement time-series token compaction (mean/min/max/p95 windowing) | `services/telemetry-compactor.ts` | Dev 1 |

### 🟢 Phase 3: P2 Production Hardening (Sprint Week 3)
| ID | Task | Target Files | Owner |
|---|---|---|---|
| **MCP-09** | Add Modbus RTU/TCP & MQTT edge gateway direct listener | `src/gateway/modbus-client.ts` | Dev 1 |
| **MCP-10** | Add automated Zod I/O validation test harness for all 18 tools | `src/test-all-tool-io.ts` | Dev 1 |
| **MCP-11** | Add bearer token authentication & tool mutation permissions | `src/http-api.ts` | Dev 1 |

---

## 5. Complete Target Tool Registry & Schemas

| # | Module | Tool Name | Scope / Permission | Key Input Arguments | Return Payload |
|---|---|---|---|---|---|
| 1 | **energy** | `get_energy_telemetry` | Read-only | `line_id`, `time_range`, `plant_id` | kW, kWh, SEC, Power Factor, 3-Phase Volts |
| 2 | **energy** | `get_compressed_air_metrics` | Read-only | `compressor_id`, `header_id` | Pressure (bar), CFM, Specific Power, Leak kHz |
| 3 | **energy** | `get_peak_demand_tariff` | Read-only | `discom_id`, `timestamp` | Tariff Band (Peak/Normal), Rate (₹), PF Penalty |
| 4 | **mes** | `get_batch_history` | Read-only | `batch_id` | Route, Start/End, Gross Tons, Net Good Tons |
| 5 | **mes** | `get_production_path` | Read-only | `batch_id` | Station sequence, Cycle time deltas |
| 6 | **mes** | `get_queue_events` | Read-only | `batch_id` | Ladle transfer delays, Mold line pauses |
| 7 | **mes** | `get_tonnage_produced` | Read-only | `shift_id`, `line_id` | Good net tonnage, Runner/Riser scrap tons |
| 8 | **maintenance** | `get_machine_alerts` | Read-only | `machine_id`, `time_range` | Alarm codes, Vibration (mm/s), Overheating |
| 9 | **maintenance** | `get_maintenance_state` | Read-only | `machine_id` | Health score, Last PM date, Overdue tasks |
| 10 | **maintenance** | `get_vibration_spectrum` | Read-only | `machine_id` | Velocity RMS, FFT peak spectrum, ISO baseline |
| 11 | **maintenance** | `create_work_order` | **Mutation** | `incident_id`, `parts`, `crew`, `downtime` | Work Order ID (`WO-ENG-8821`), Scheduled Status |
| 12 | **materials** | `get_supplier_lot_info` | Read-only | `lot_id` | Pig iron grade, Scrap mix %, Certifications |
| 13 | **materials** | `get_charge_mix_specs` | Read-only | `furnace_id`, `heat_number` | Carbon Equivalent %, Si %, Return scrap % |
| 14 | **quality** | `get_defect_records` | Read-only | `batch_id` | Porosity count, Flash defects, Scrap % |
| 15 | **quality** | `get_inspection_results`| Read-only | `batch_id` | Tensile strength (MPa), BHN hardness, Pass/Fail |
| 16 | **simulation** | `run_scenario` | Compute | `leak_fix_pct`, `pressure_bar`, `vfd_mod_pct` | Predicted SEC, Daily kWh saved, Daily ₹ saved |
| 17 | **simulation** | `calculate_pareto_front`| Compute | `budget_inr`, `max_downtime_min` | Ranked Options A, B, C, D with Payback (Mo) |
| 18 | **orchestrator**| `get_incident_summary` | Aggregate | `incident_id` | Aggregated root cause, Timeline, Financial loss |

---

*This backlog provides Dev 1 (Keerthi) and Dev 3 (Sham) with a definitive, sprint-ready specification to elevate `forgeops-mcp` to enterprise industrial standards.*
