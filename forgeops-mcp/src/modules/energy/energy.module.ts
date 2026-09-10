import { Module } from '../../nitrostack.js';
import { EnergyTools } from './energy.tools.js';

@Module({
  name: 'energy',
  description: 'Energy Intelligence - submetering, pneumatic metrics, and SEC intervention simulation',
  controllers: [EnergyTools],
})
export class EnergyModule {}
