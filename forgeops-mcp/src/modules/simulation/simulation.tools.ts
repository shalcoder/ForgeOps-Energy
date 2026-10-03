/**
 * ForgeOps — Simulation MCP Server Module
 *
 * Exposes Role 3's Simulation Engine physics via NitroStack @Tool decorators:
 *   - run_scenario: Counterfactual simulation scenario runner
 *   - compare_scenarios: Side-by-side scenario comparison & deltas
 *   - calculate_pareto_front: Multi-objective candidate option optimizer
 *   - calculate_orifice_flow: Thermodynamic choked sonic/subsonic flow calculator
 */
import { ToolDecorator as Tool, ExecutionContext, z } from '../../nitrostack.js';
import { SimulationEngine } from '../../services/simulation-engine.js';

export class SimulationTools {
  private engine = new SimulationEngine();

  @Tool({
    name: 'run_scenario',
    description: 'Run a counterfactual simulation scenario with modified parameters. Returns predicted yield, SEC, confidence, assumptions, and warnings if the scenario is outside the validated operating range.',
    inputSchema: z.object({
      scenario_name: z.string().describe('Name or key for the scenario (e.g. "leak_opt_c", "reduce_queue_delay", "replace_machine_7", "humidity_control", "baseline")'),
      parameters: z.record(z.any()).optional().describe('Optional parameter overrides'),
    }),
  })
  async runScenario(input: { scenario_name: string; parameters?: Record<string, any> }, ctx: ExecutionContext) {
    ctx.logger.info('Simulation: Running scenario via Role 3 engine', { scenario_name: input.scenario_name });
    return this.engine.runScenario(input);
  }

  @Tool({
    name: 'compare_scenarios',
    description: 'Compare multiple simulation scenarios side-by-side with deltas against the baseline. Returns recommended scenario based on yield × confidence.',
    inputSchema: z.object({
      scenario_names: z.array(z.string()).describe('List of scenario names/keys to compare'),
    }),
  })
  async compareScenarios(input: { scenario_names: string[] }, ctx: ExecutionContext) {
    ctx.logger.info('Simulation: Comparing scenarios via Role 3 engine', { scenarios: input.scenario_names });
    return this.engine.compareScenarios(input.scenario_names);
  }

  @Tool({
    name: 'calculate_pareto_front',
    description: 'Multi-objective Pareto optimization across CapEx, downtime, line pressure setpoint, and SEC reduction.',
    inputSchema: z.object({
      leak_repair_budget_inr: z.number().default(15000).describe('Budget in INR for leak repair'),
      cylinder_min_pressure_bar: z.number().default(5.5).describe('Minimum clamping pressure requirement in bar'),
      baseline_sec: z.number().default(11.2).describe('Current baseline SEC in kWh/ton'),
    }),
  })
  async calculateParetoFront(input: { leak_repair_budget_inr?: number; cylinder_min_pressure_bar?: number; baseline_sec?: number }, ctx: ExecutionContext) {
    ctx.logger.info('Simulation: Calculating Pareto front via Role 3 engine', input);
    return this.engine.calculateParetoFront(input.leak_repair_budget_inr, input.cylinder_min_pressure_bar, input.baseline_sec);
  }

  @Tool({
    name: 'calculate_orifice_flow',
    description: 'Calculates compressed air leakage flow rate (CFM, kg/s) and kW power loss using thermodynamic orifice equations.',
    inputSchema: z.object({
      orifice_diameter_mm: z.number().default(3.2).describe('Leak orifice equivalent diameter in mm'),
      upstream_gauge_bar: z.number().default(7.2).describe('Header gauge pressure in bar'),
      discharge_coeff: z.number().default(0.65).describe('Orifice discharge coefficient (Cd)'),
      ambient_temp_c: z.number().default(25.0).describe('Ambient air temperature in °C'),
    }),
  })
  async calculateOrificeFlow(input: { orifice_diameter_mm?: number; upstream_gauge_bar?: number; discharge_coeff?: number; ambient_temp_c?: number }, ctx: ExecutionContext) {
    ctx.logger.info('Simulation: Calculating orifice thermodynamics via Role 3 engine', input);
    return this.engine.calculateOrificeFlow(input.orifice_diameter_mm, input.upstream_gauge_bar, input.discharge_coeff, input.ambient_temp_c);
  }
}
