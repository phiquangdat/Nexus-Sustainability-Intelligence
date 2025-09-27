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

// Sustainability Intelligence Types (from Python prototype)
export interface Co2IntensityRecord {
  id: number;
  timestamp: string;
  co2_intensity_g_per_kwh: number;
}

export interface GenerationMixRecord {
  id: number;
  timestamp: string;
  hydro_mw: number;
  wind_mw: number;
  solar_mw: number;
  nuclear_mw: number;
  fossil_mw: number;
  total_mw: number;
  renewable_share_pct: number;
}

export interface NetZeroAlignmentRecord {
  year: number;
  actual_emissions_mt: number;
  target_emissions_mt: number;
  alignment_pct: number;
}

// Goal Tracker Types
export interface GoalTrackerBudget {
  ytd_tons: number;
  ytd_budget_tons: number;
  days_ahead: number;
}

export interface GoalTrackerVelocity {
  v_actual_g_per_kwh_per_yr: number;
  v_required_g_per_kwh_per_yr: number;
  on_track: boolean;
}

export interface GoalTrackerPathway {
  eta_year?: number;
  series: Array<{
    year: number;
    target_emissions_mt: number;
  }>;
}

export interface GoalTracker {
  rai_pct?: number;
  budget?: GoalTrackerBudget;
  velocity?: GoalTrackerVelocity;
  pathway?: GoalTrackerPathway;
  error?: string;
}

// Chart data for sustainability metrics
export interface SustainabilityChartData {
  timestamp: string;
  co2_intensity_g_per_kwh: number;
  renewable_share_pct: number;
  hydro_mw: number;
  wind_mw: number;
  solar_mw: number;
  nuclear_mw: number;
  fossil_mw: number;
  total_mw: number;
}

export interface NetZeroChartData {
  year: number;
  actual_emissions_mt: number;
  target_emissions_mt: number;
  alignment_pct: number;
}

// KPI Summary Types
export interface Co2IntensitySummary {
  count: number;
  min_gco2_kwh: number;
  max_gco2_kwh: number;
  avg_gco2_kwh: number;
}

export interface GenerationMixSummary {
  count: number;
  avg_total_mw: number;
  avg_renewable_share_pct: number;
}

export interface NetZeroSummary {
  count: number;
  latest_alignment_pct: number;
}
