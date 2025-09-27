import type { PowerPlantData, EUETSReport } from './types';

// Mock data for development and testing
export const mockPowerPlantData: PowerPlantData[] = [
  {
    timestamp: "2024-09-20T00:00:00Z",
    plant_id: "Vaasa-Plant-A",
    fuel_type: "Natural Gas",
    fuel_consumed_liters: 3250.45,
    energy_output_mwh: 1425.30,
    co2_emissions_tonnes: 650.09
  },
  {
    timestamp: "2024-09-20T01:00:00Z",
    plant_id: "Vaasa-Plant-B",
    fuel_type: "HFO",
    fuel_consumed_liters: 4100.20,
    energy_output_mwh: 1640.08,
    co2_emissions_tonnes: 1230.06
  },
  {
    timestamp: "2024-09-20T02:00:00Z",
    plant_id: "Vaasa-Plant-A",
    fuel_type: "Natural Gas",
    fuel_consumed_liters: 3100.15,
    energy_output_mwh: 1360.07,
    co2_emissions_tonnes: 620.03
  },
  {
    timestamp: "2024-09-20T03:00:00Z",
    plant_id: "Vaasa-Plant-B",
    fuel_type: "HFO",
    fuel_consumed_liters: 3950.80,
    energy_output_mwh: 1580.32,
    co2_emissions_tonnes: 1185.24
  },
  {
    timestamp: "2024-09-20T04:00:00Z",
    plant_id: "Vaasa-Plant-A",
    fuel_type: "Natural Gas",
    fuel_consumed_liters: 3300.25,
    energy_output_mwh: 1447.61,
    co2_emissions_tonnes: 660.05
  },
  {
    timestamp: "2024-09-20T05:00:00Z",
    plant_id: "Vaasa-Plant-B",
    fuel_type: "HFO",
    fuel_consumed_liters: 4200.50,
    energy_output_mwh: 1680.20,
    co2_emissions_tonnes: 1260.15
  },
  {
    timestamp: "2024-09-20T06:00:00Z",
    plant_id: "Vaasa-Plant-A",
    fuel_type: "Natural Gas",
    fuel_consumed_liters: 3500.75,
    energy_output_mwh: 1535.33,
    co2_emissions_tonnes: 700.15
  },
  {
    timestamp: "2024-09-20T07:00:00Z",
    plant_id: "Vaasa-Plant-B",
    fuel_type: "HFO",
    fuel_consumed_liters: 4300.90,
    energy_output_mwh: 1720.36,
    co2_emissions_tonnes: 1290.27
  },
  {
    timestamp: "2024-09-20T08:00:00Z",
    plant_id: "Vaasa-Plant-A",
    fuel_type: "Natural Gas",
    fuel_consumed_liters: 3600.40,
    energy_output_mwh: 1580.18,
    co2_emissions_tonnes: 720.08
  },
  {
    timestamp: "2024-09-20T09:00:00Z",
    plant_id: "Vaasa-Plant-B",
    fuel_type: "HFO",
    fuel_consumed_liters: 4400.65,
    energy_output_mwh: 1760.26,
    co2_emissions_tonnes: 1320.20
  },
  {
    timestamp: "2024-09-20T10:00:00Z",
    plant_id: "Vaasa-Plant-A",
    fuel_type: "Natural Gas",
    fuel_consumed_liters: 3700.85,
    energy_output_mwh: 1623.37,
    co2_emissions_tonnes: 740.17
  },
  {
    timestamp: "2024-09-20T11:00:00Z",
    plant_id: "Vaasa-Plant-B",
    fuel_type: "HFO",
    fuel_consumed_liters: 4500.30,
    energy_output_mwh: 1800.12,
    co2_emissions_tonnes: 1350.09
  },
  {
    timestamp: "2024-09-20T12:00:00Z",
    plant_id: "Vaasa-Plant-A",
    fuel_type: "Natural Gas",
    fuel_consumed_liters: 3800.55,
    energy_output_mwh: 1667.24,
    co2_emissions_tonnes: 760.11
  },
  {
    timestamp: "2024-09-20T13:00:00Z",
    plant_id: "Vaasa-Plant-B",
    fuel_type: "HFO",
    fuel_consumed_liters: 4600.70,
    energy_output_mwh: 1840.28,
    co2_emissions_tonnes: 1380.21
  },
  {
    timestamp: "2024-09-20T14:00:00Z",
    plant_id: "Vaasa-Plant-A",
    fuel_type: "Natural Gas",
    fuel_consumed_liters: 3900.95,
    energy_output_mwh: 1711.42,
    co2_emissions_tonnes: 780.19
  },
  {
    timestamp: "2024-09-20T15:00:00Z",
    plant_id: "Vaasa-Plant-B",
    fuel_type: "HFO",
    fuel_consumed_liters: 4700.15,
    energy_output_mwh: 1880.06,
    co2_emissions_tonnes: 1410.05
  },
  {
    timestamp: "2024-09-20T16:00:00Z",
    plant_id: "Vaasa-Plant-A",
    fuel_type: "Natural Gas",
    fuel_consumed_liters: 4000.25,
    energy_output_mwh: 1755.11,
    co2_emissions_tonnes: 800.05
  },
  {
    timestamp: "2024-09-20T17:00:00Z",
    plant_id: "Vaasa-Plant-B",
    fuel_type: "HFO",
    fuel_consumed_liters: 4800.40,
    energy_output_mwh: 1920.16,
    co2_emissions_tonnes: 1440.12
  },
  {
    timestamp: "2024-09-20T18:00:00Z",
    plant_id: "Vaasa-Plant-A",
    fuel_type: "Natural Gas",
    fuel_consumed_liters: 4100.60,
    energy_output_mwh: 1798.26,
    co2_emissions_tonnes: 820.12
  },
  {
    timestamp: "2024-09-20T19:00:00Z",
    plant_id: "Vaasa-Plant-B",
    fuel_type: "HFO",
    fuel_consumed_liters: 4900.85,
    energy_output_mwh: 1960.34,
    co2_emissions_tonnes: 1470.26
  },
  {
    timestamp: "2024-09-20T20:00:00Z",
    plant_id: "Vaasa-Plant-A",
    fuel_type: "Natural Gas",
    fuel_consumed_liters: 4200.10,
    energy_output_mwh: 1842.04,
    co2_emissions_tonnes: 840.02
  },
  {
    timestamp: "2024-09-20T21:00:00Z",
    plant_id: "Vaasa-Plant-B",
    fuel_type: "HFO",
    fuel_consumed_liters: 5000.35,
    energy_output_mwh: 2000.14,
    co2_emissions_tonnes: 1500.11
  },
  {
    timestamp: "2024-09-20T22:00:00Z",
    plant_id: "Vaasa-Plant-A",
    fuel_type: "Natural Gas",
    fuel_consumed_liters: 4300.45,
    energy_output_mwh: 1886.20,
    co2_emissions_tonnes: 860.09
  },
  {
    timestamp: "2024-09-20T23:00:00Z",
    plant_id: "Vaasa-Plant-B",
    fuel_type: "HFO",
    fuel_consumed_liters: 5100.60,
    energy_output_mwh: 2040.24,
    co2_emissions_tonnes: 1530.18
  }
];

// Mock EU ETS Report
export const mockEUETSReport: EUETSReport = {
  total_emissions_tonnes: 18547.32,
  reporting_period: "Q3 2024",
  status: "Compliant"
};

// Mock data for different scenarios
export const mockScenarios = {
  // High emissions scenario
  highEmissions: mockPowerPlantData.map(item => ({
    ...item,
    co2_emissions_tonnes: item.co2_emissions_tonnes * 1.5,
    fuel_consumed_liters: item.fuel_consumed_liters * 1.3
  })),
  
  // Low emissions scenario
  lowEmissions: mockPowerPlantData.map(item => ({
    ...item,
    co2_emissions_tonnes: item.co2_emissions_tonnes * 0.7,
    fuel_consumed_liters: item.fuel_consumed_liters * 0.8
  })),
  
  // Peak demand scenario
  peakDemand: mockPowerPlantData.map(item => ({
    ...item,
    energy_output_mwh: item.energy_output_mwh * 1.4,
    fuel_consumed_liters: item.fuel_consumed_liters * 1.2
  }))
};

// Utility functions for mock data
export const generateMockData = (hours: number = 24): PowerPlantData[] => {
  const data: PowerPlantData[] = [];
  const startDate = new Date('2024-09-20T00:00:00Z');
  const plantIds = ['Vaasa-Plant-A', 'Vaasa-Plant-B'];
  const fuelTypes = ['Natural Gas', 'HFO'];
  
  for (let i = 0; i < hours; i++) {
    const timestamp = new Date(startDate.getTime() + i * 60 * 60 * 1000);
    const plantId = plantIds[i % 2];
    const fuelType = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
    
    // Simulate realistic power plant data
    const baseLoad = Math.random() * 0.3 + 0.7; // 70-100% load factor
    const fuelConsumed = (Math.random() * 2000 + 3000) * baseLoad;
    const energyOutput = fuelConsumed * (Math.random() * 0.3 + 0.35);
    const co2Emissions = fuelConsumed * (fuelType === 'Natural Gas' ? 0.2 : 0.3);
    
    data.push({
      timestamp: timestamp.toISOString(),
      plant_id: plantId,
      fuel_type: fuelType,
      fuel_consumed_liters: Math.round(fuelConsumed * 100) / 100,
      energy_output_mwh: Math.round(energyOutput * 100) / 100,
      co2_emissions_tonnes: Math.round(co2Emissions * 100) / 100
    });
  }
  
  return data;
};

// Mock API responses
export const mockAPIResponses = {
  getData: () => Promise.resolve({ data: mockPowerPlantData }),
  getEUETSReport: () => Promise.resolve({ data: mockEUETSReport }),
  getDataWithError: () => Promise.reject(new Error('Mock API Error')),
  getDataWithDelay: (delay: number = 1000) => 
    new Promise(resolve => setTimeout(() => resolve({ data: mockPowerPlantData }), delay))
};
