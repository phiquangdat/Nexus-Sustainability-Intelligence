// Type definitions for Veridi OS

// Supabase Database Types
export interface PowerPlant {
  id: string;
  name: string;
  location: string;
  fuel_type: 'Natural Gas' | 'HFO' | 'Coal' | 'Renewable';
  capacity_mw: number;
  created_at: string;
  updated_at: string;
}

export interface PowerPlantData {
  id: string;
  plant_id: string;
  timestamp: string;
  fuel_consumed_liters: number;
  energy_output_mwh: number;
  co2_emissions_tonnes: number;
  created_at: string;
  // Joined data from power_plants table
  power_plants?: {
    id: string;
    name: string;
    fuel_type: string;
  };
}

export interface EUETSReport {
  id: string;
  reporting_period: string;
  total_emissions_tonnes: number;
  status: 'Compliant' | 'Non-Compliant' | 'Pending';
  generated_at: string;
  created_at: string;
}

// Chart data interfaces
export interface ChartData {
  timestamp: string;
  emissions: number;
  plant: string;
}

export interface EnergyData {
  plant: string;
  energy: number;
}

// API Response types
export interface PowerPlantSummary {
  id: string;
  name: string;
  location: string;
  fuel_type: string;
  capacity_mw: number;
  data_points: number;
  total_energy_output: number;
  total_co2_emissions: number;
  avg_energy_output: number;
  avg_co2_emissions: number;
  last_data_timestamp: string;
}

export interface RecentEmissions {
  plant_name: string;
  fuel_type: string;
  timestamp: string;
  co2_emissions_tonnes: number;
  energy_output_mwh: number;
  fuel_consumed_liters: number;
}
