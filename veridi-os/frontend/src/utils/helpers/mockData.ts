import type { PowerPlantData, EUETSReport } from './types';

// Simplified mock data that matches the new interface
export const mockPowerPlantData: PowerPlantData[] = [
  {
    id: "1",
    plant_id: "Vaasa-Plant-A",
    timestamp: "2024-09-20T00:00:00Z",
    fuel_consumed_liters: 3250.45,
    energy_output_mwh: 1425.30,
    co2_emissions_tonnes: 650.09,
    created_at: "2024-09-20T00:00:00Z",
    power_plants: {
      id: "Vaasa-Plant-A",
      name: "Vaasa Plant A",
      fuel_type: "Natural Gas"
    }
  },
  {
    id: "2",
    plant_id: "Vaasa-Plant-B",
    timestamp: "2024-09-20T01:00:00Z",
    fuel_consumed_liters: 4100.20,
    energy_output_mwh: 1640.08,
    co2_emissions_tonnes: 1230.06,
    created_at: "2024-09-20T01:00:00Z",
    power_plants: {
      id: "Vaasa-Plant-B",
      name: "Vaasa Plant B",
      fuel_type: "HFO"
    }
  },
  {
    id: "3",
    plant_id: "Vaasa-Plant-A",
    timestamp: "2024-09-20T02:00:00Z",
    fuel_consumed_liters: 3100.15,
    energy_output_mwh: 1380.25,
    co2_emissions_tonnes: 620.03,
    created_at: "2024-09-20T02:00:00Z",
    power_plants: {
      id: "Vaasa-Plant-A",
      name: "Vaasa Plant A",
      fuel_type: "Natural Gas"
    }
  },
  {
    id: "4",
    plant_id: "Vaasa-Plant-B",
    timestamp: "2024-09-20T03:00:00Z",
    fuel_consumed_liters: 4200.30,
    energy_output_mwh: 1680.12,
    co2_emissions_tonnes: 1260.09,
    created_at: "2024-09-20T03:00:00Z",
    power_plants: {
      id: "Vaasa-Plant-B",
      name: "Vaasa Plant B",
      fuel_type: "HFO"
    }
  },
  {
    id: "5",
    plant_id: "Vaasa-Plant-A",
    timestamp: "2024-09-20T04:00:00Z",
    fuel_consumed_liters: 2950.80,
    energy_output_mwh: 1320.45,
    co2_emissions_tonnes: 590.16,
    created_at: "2024-09-20T04:00:00Z",
    power_plants: {
      id: "Vaasa-Plant-A",
      name: "Vaasa Plant A",
      fuel_type: "Natural Gas"
    }
  }
];

export const mockEUETSReport: EUETSReport = {
  id: "1",
  reporting_period: "Q3 2024",
  total_emissions_tonnes: 15420.567,
  status: "Compliant",
  generated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
};

// Generate additional mock data for testing
export const generateMockData = (hours: number = 24): PowerPlantData[] => {
  const data: PowerPlantData[] = [];
  const plants = [
    { id: "Vaasa-Plant-A", name: "Vaasa Plant A", fuel_type: "Natural Gas" },
    { id: "Vaasa-Plant-B", name: "Vaasa Plant B", fuel_type: "HFO" },
    { id: "Helsinki-Plant-C", name: "Helsinki Plant C", fuel_type: "Natural Gas" },
    { id: "Tampere-Plant-D", name: "Tampere Plant D", fuel_type: "Renewable" }
  ];

  for (let i = 0; i < hours; i++) {
    const plant = plants[i % plants.length];
    const timestamp = new Date(Date.now() - (hours - i) * 60 * 60 * 1000).toISOString();
    
    data.push({
      id: `${i + 1}`,
      plant_id: plant.id,
      timestamp,
      fuel_consumed_liters: Math.random() * 5000 + 2000,
      energy_output_mwh: Math.random() * 100 + 50,
      co2_emissions_tonnes: Math.random() * 50 + 25,
      created_at: timestamp,
      power_plants: {
        id: plant.id,
        name: plant.name,
        fuel_type: plant.fuel_type
      }
    });
  }

  return data;
};
