// Power Plant interfaces
export interface PowerPlantData {
  id: string;
  name: string;
  region: string;
  type: "coal" | "gas" | "nuclear" | "renewable" | "mixed";
  capacity_mw: number;
  renewable_percentage: number;
  co2_intensity: number;
  last_updated: string;
  compliance_status: "Compliant" | "Non-Compliant" | "Pending";
}

export interface PowerPlantSummary {
  total_plants: number;
  total_capacity_mw: number;
  average_renewable_percentage: number;
  average_co2_intensity: number;
  compliance_rate: number;
  plants_by_type: Record<string, number>;
  plants_by_region: Record<string, number>;
}

// Core data interfaces
export interface EUETSReport {
  id: string;
  reporting_period: string;
  total_emissions_tonnes: number;
  allowances_held: number;
  allowances_surrendered: number;
  compliance_status: "Compliant" | "Non-Compliant" | "Pending";
  status: "Compliant" | "Non-Compliant" | "Pending";
  generated_at: string;
  plant_id: string;
  plant_name: string;
}

export interface ScatterData {
  renewable_percentage: number;
  co2_intensity: number;
  plant_name: string;
  region: string;
}

export interface Co2IntensityRecord {
  timestamp: string;
  plant_id: string;
  plant_name: string;
  co2_intensity: number;
  renewable_percentage: number;
  total_generation_mwh: number;
}

export interface GenerationMixRecord {
  timestamp: string;
  plant_id: string;
  plant_name: string;
  renewable_percentage: number;
  fossil_percentage: number;
  nuclear_percentage: number;
  hydro_percentage: number;
  wind_percentage: number;
  solar_percentage: number;
}

export interface NetZeroAlignmentRecord {
  timestamp: string;
  plant_id: string;
  plant_name: string;
  net_zero_target_year: number;
  current_reduction_percentage: number;
  required_annual_reduction: number;
  projected_completion_year: number;
  alignment_score: number;
}

export interface SustainabilityChartData {
  timestamp: string;
  plant_id: string;
  plant_name: string;
  sustainability_score: number;
  environmental_impact: number;
  social_impact: number;
  governance_score: number;
}

export interface ChartDataInput {
  [key: string]: unknown;
}

export interface GenerationMixData {
  timestamp: string;
  plant_id: string;
  plant_name: string;
  renewable_percentage: number;
  fossil_percentage: number;
  nuclear_percentage: number;
  hydro_percentage: number;
  wind_percentage: number;
  solar_percentage: number;
}

// API Response interfaces
export interface AnalysisResponse {
  rawData: {
    co2: Co2IntensityRecord[];
    generation_mix: GenerationMixRecord[];
    netzero_alignment: NetZeroAlignmentRecord[];
    scatter_data?: ScatterData[];
  };
  summary: {
    total_plants: number;
    average_co2_intensity: number;
    average_renewable_percentage: number;
    compliance_rate: number;
  };
  insights: string[];
}

// Theme interfaces
export type Theme = "light" | "dark";

// Component prop interfaces
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface ButtonProps {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}
