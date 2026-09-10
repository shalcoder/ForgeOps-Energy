import { ToolDecorator as Tool, ExecutionContext, z } from '../../nitrostack.js';

export class EnergyTools {
  @Tool({
    name: 'get_energy_telemetry',
    description: 'Retrieves active power (kW), energy consumption (kWh), power factor, and specific energy consumption (SEC) across factory lines.',
    inputSchema: z.object({
      line_id: z.string().optional().describe('Line identifier (e.g. LINE-02)'),
      plant_id: z.string().optional().describe('Plant identifier'),
    }),
  })
  async getEnergyTelemetry(input: { line_id?: string; plant_id?: string }, ctx: ExecutionContext) {
    ctx.logger.info('Energy: Retrieving line telemetry', { line_id: input.line_id });
    return {
      line_id: input.line_id ?? 'LINE-02',
      plant_id: input.plant_id ?? 'BELGAUM-FOUNDRY',
      current_sec_kwh_per_ton: 11.2,
      baseline_sec_kwh_per_ton: 9.8,
      sec_delta_pct: 14.3,
      daily_kwh: 8500,
      active_power_kw: 71.4,
      power_factor: 0.94,
      status: 'critical_threshold_exceeded',
      timestamp: new Date().toISOString(),
    };
  }

  @Tool({
    name: 'get_compressed_air_metrics',
    description: 'Queries pneumatic header pressure, acoustic leak sensors, and compressor modulation runtime for industrial air systems.',
    inputSchema: z.object({
      header_id: z.string().optional().describe('Pneumatic header identifier'),
    }),
  })
  async getCompressedAirMetrics(input: { header_id?: string }, ctx: ExecutionContext) {
    ctx.logger.info('Energy: Querying compressed air metrics', { header_id: input.header_id });
    return {
      header_id: input.header_id ?? 'PNEU-HDR-02',
      delivery_pressure_bar: 6.1,
      nominal_pressure_bar: 7.2,
      pressure_drop_pct: 15.3,
      acoustic_leak_frequency_khz: 38.4,
      compressor_runtime_pct: 88,
      compressor_baseline_runtime_pct: 67,
      motor_current_amperes: 142,
      motor_nominal_amperes: 127,
      unrecovered_parasitic_loss_kw: 18.0,
      timestamp: new Date().toISOString(),
    };
  }

  @Tool({
    name: 'simulate_energy_intervention',
    description: 'Simulates SEC reduction, electrical cost savings, downtime, and carbon abatement for equipment setpoint optimization and leak repairs.',
    inputSchema: z.object({
      intervention_type: z.enum(['repair_leak', 'optimize_setpoint', 'both_combined']).describe('Intervention strategy'),
      pressure_setpoint_bar: z.number().optional().describe('Target pressure setpoint in bar'),
      leak_fix_pct: z.number().optional().describe('Estimated leak reduction percentage'),
    }),
  })
  async simulateEnergyIntervention(input: {
    intervention_type: 'repair_leak' | 'optimize_setpoint' | 'both_combined';
    pressure_setpoint_bar?: number;
    leak_fix_pct?: number;
  }, ctx: ExecutionContext) {
    ctx.logger.info('Energy: Running scenario simulation', { type: input.intervention_type });
    const isBoth = input.intervention_type === 'both_combined';
    const isRepair = input.intervention_type === 'repair_leak';
    return {
      intervention: input.intervention_type,
      baseline_sec: 11.2,
      predicted_sec: isBoth ? 9.2 : isRepair ? 9.7 : 10.1,
      sec_reduction_pct: isBoth ? 18.0 : isRepair ? 13.4 : 9.8,
      daily_energy_saving_kwh: isBoth ? 1840 : isRepair ? 1370 : 1000,
      daily_cost_saving_inr: isBoth ? 6240 : isRepair ? 4650 : 3400,
      monthly_cost_saving_inr: isBoth ? 187200 : isRepair ? 139500 : 102000,
      daily_co2_abatement_kg: isBoth ? 96 : isRepair ? 71 : 52,
      payback_months: isBoth ? 1.5 : isRepair ? 1.8 : 0.6,
      implementation_cost_inr: isBoth ? 9500 : isRepair ? 8500 : 2000,
      downtime_minutes: isBoth ? 48 : isRepair ? 42 : 10,
      throughput_preserved: true,
      quality_preserved: true,
      safety_preserved: true,
    };
  }
}
