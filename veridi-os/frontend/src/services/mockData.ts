import type {
  EUETSReport,
  ScatterData,
  Co2IntensityRecord,
  GenerationMixRecord,
  NetZeroAlignmentRecord,
  PowerPlantData,
} from "../types";

// Mock Power Plant Data
export const mockPowerPlantData: PowerPlantData[] = Array.from(
  { length: 20 },
  (_, i) => ({
    id: `plant-${String(i + 1).padStart(3, "0")}`,
    name: [
      "Green Valley",
      "Solar Wind",
      "Clean Energy",
      "Eco Power",
      "Renewable Hub",
      "Zero Carbon",
      "Sustainable Energy",
      "Clean Power",
    ][i % 8],
    region: ["North", "South", "East", "West", "Central"][i % 5],
    type: ["coal", "gas", "nuclear", "renewable", "mixed"][i % 5] as
      | "coal"
      | "gas"
      | "nuclear"
      | "renewable"
      | "mixed",
    capacity_mw: 100 + Math.random() * 900,
    renewable_percentage: Math.random() * 100,
    co2_intensity: 100 + Math.random() * 800,
    last_updated: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    compliance_status: ["Compliant", "Non-Compliant", "Pending"][
      Math.floor(Math.random() * 3)
    ] as "Compliant" | "Non-Compliant" | "Pending",
  })
);

// Mock EU ETS Report data
export const mockEUETSReport: EUETSReport = {
  id: "euets-2024-001",
  reporting_period: "2024-Q1",
  total_emissions_tonnes: 125000,
  allowances_held: 130000,
  allowances_surrendered: 125000,
  compliance_status: "Compliant",
  status: "Compliant",
  generated_at: "2024-03-31T23:59:59Z",
  plant_id: "plant-001",
  plant_name: "Green Valley Power Plant",
};

// Mock scatter data for renewables vs CO₂ analysis
export const mockScatterData: ScatterData[] = [
  {
    renewable_percentage: 15,
    co2_intensity: 850,
    plant_name: "Coal Plant Alpha",
    region: "North",
  },
  {
    renewable_percentage: 25,
    co2_intensity: 720,
    plant_name: "Mixed Energy Beta",
    region: "South",
  },
  {
    renewable_percentage: 45,
    co2_intensity: 580,
    plant_name: "Green Valley Plant",
    region: "East",
  },
  {
    renewable_percentage: 65,
    co2_intensity: 420,
    plant_name: "Solar Wind Complex",
    region: "West",
  },
  {
    renewable_percentage: 85,
    co2_intensity: 280,
    plant_name: "Renewable Hub",
    region: "Central",
  },
  {
    renewable_percentage: 95,
    co2_intensity: 150,
    plant_name: "Clean Energy Center",
    region: "North",
  },
  {
    renewable_percentage: 35,
    co2_intensity: 650,
    plant_name: "Hybrid Power Station",
    region: "South",
  },
  {
    renewable_percentage: 55,
    co2_intensity: 480,
    plant_name: "Eco Power Plant",
    region: "East",
  },
  {
    renewable_percentage: 75,
    co2_intensity: 350,
    plant_name: "Sustainable Energy",
    region: "West",
  },
  {
    renewable_percentage: 90,
    co2_intensity: 200,
    plant_name: "Zero Carbon Facility",
    region: "Central",
  },
];

// Mock CO₂ intensity data
export const mockCo2Data: Co2IntensityRecord[] = Array.from(
  { length: 30 },
  (_, i) => ({
    timestamp: new Date(
      Date.now() - (29 - i) * 24 * 60 * 60 * 1000
    ).toISOString(),
    plant_id: `plant-${String((i % 5) + 1).padStart(3, "0")}`,
    plant_name: [
      "Green Valley",
      "Solar Wind",
      "Clean Energy",
      "Eco Power",
      "Renewable Hub",
    ][i % 5],
    co2_intensity: 400 + Math.random() * 200,
    renewable_percentage: 20 + Math.random() * 60,
    total_generation_mwh: 1000 + Math.random() * 2000,
  })
);

// Mock generation mix data
export const mockGenerationMixData: GenerationMixRecord[] = Array.from(
  { length: 30 },
  (_, i) => ({
    timestamp: new Date(
      Date.now() - (29 - i) * 24 * 60 * 60 * 1000
    ).toISOString(),
    plant_id: `plant-${String((i % 5) + 1).padStart(3, "0")}`,
    plant_name: [
      "Green Valley",
      "Solar Wind",
      "Clean Energy",
      "Eco Power",
      "Renewable Hub",
    ][i % 5],
    renewable_percentage: 30 + Math.random() * 50,
    fossil_percentage: 40 - Math.random() * 20,
    nuclear_percentage: 15 + Math.random() * 10,
    hydro_percentage: 10 + Math.random() * 15,
    wind_percentage: 20 + Math.random() * 20,
    solar_percentage: 15 + Math.random() * 25,
  })
);

// Mock net-zero alignment data
export const mockNetZeroData: NetZeroAlignmentRecord[] = Array.from(
  { length: 30 },
  (_, i) => ({
    timestamp: new Date(
      Date.now() - (29 - i) * 24 * 60 * 60 * 1000
    ).toISOString(),
    plant_id: `plant-${String((i % 5) + 1).padStart(3, "0")}`,
    plant_name: [
      "Green Valley",
      "Solar Wind",
      "Clean Energy",
      "Eco Power",
      "Renewable Hub",
    ][i % 5],
    net_zero_target_year: 2030 + Math.floor(Math.random() * 10),
    current_reduction_percentage: 20 + Math.random() * 40,
    required_annual_reduction: 5 + Math.random() * 10,
    projected_completion_year: 2028 + Math.floor(Math.random() * 15),
    alignment_score: 60 + Math.random() * 35,
  })
);

// Function to generate additional mock data
export const generateMockData = (count: number = 100) => {
  const plants = [
    "Green Valley",
    "Solar Wind",
    "Clean Energy",
    "Eco Power",
    "Renewable Hub",
    "Zero Carbon",
    "Sustainable Energy",
    "Clean Power",
  ];
  const regions = ["North", "South", "East", "West", "Central"];

  return Array.from({ length: count }, (_, i) => ({
    id: `plant-${String(i + 1).padStart(3, "0")}`,
    name: plants[i % plants.length],
    region: regions[i % regions.length],
    renewable_percentage: Math.random() * 100,
    co2_intensity: 100 + Math.random() * 800,
    total_generation_mwh: 500 + Math.random() * 3000,
    compliance_status: ["Compliant", "Non-Compliant", "Pending"][
      Math.floor(Math.random() * 3)
    ],
    last_updated: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
  }));
};

// Mock analysis data
export const mockAnalysisData = {
  rawData: {
    co2: mockCo2Data,
    generation_mix: mockGenerationMixData,
    netzero_alignment: mockNetZeroData,
    scatter_data: mockScatterData,
  },
  summary: {
    total_plants: 8,
    average_co2_intensity: 450,
    average_renewable_percentage: 65,
    compliance_rate: 87.5,
  },
  insights: [
    "Renewable energy integration shows strong correlation with reduced CO₂ intensity",
    "Plants with >80% renewable energy achieve net-zero alignment scores >90%",
    "Solar and wind integration has increased by 25% over the past quarter",
    "Coal-dependent plants require immediate transition planning for 2030 targets",
  ],
};
