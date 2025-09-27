// Type definitions for Veridi OS

export interface PowerPlantData {
  timestamp: string;
  plant_id: string;
  fuel_type: string;
  fuel_consumed_liters: number;
  energy_output_mwh: number;
  co2_emissions_tonnes: number;
}

export interface EUETSReport {
  total_emissions_tonnes: number;
  reporting_period: string;
  status: string;
}

export interface ChartData {
  timestamp: string;
  emissions: number;
  plant: string;
}

export interface EnergyData {
  plant: string;
  energy: number;
}
