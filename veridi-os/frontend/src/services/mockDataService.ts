import axios from 'axios';
import { mockPowerPlantData, mockEUETSReport, generateMockData } from '../mockData';
import type { PowerPlantData, EUETSReport } from '../types';

// Configuration for mock data usage
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || 
                     import.meta.env.NODE_ENV === 'development';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Mock data service that can switch between real API and mock data
export class MockDataService {
  private static instance: MockDataService;
  private useMockData: boolean;

  constructor(useMockData: boolean = USE_MOCK_DATA) {
    this.useMockData = useMockData;
  }

  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
  }

  async getPowerPlantData(): Promise<PowerPlantData[]> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPowerPlantData;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/data`);
      return response.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return mockPowerPlantData;
    }
  }

  async getEUETSReport(): Promise<EUETSReport> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockEUETSReport;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/reports/eu-ets`);
      return response.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return mockEUETSReport;
    }
  }

  // Generate custom mock data
  generateCustomMockData(hours: number = 24): PowerPlantData[] {
    return generateMockData(hours);
  }

  // Get mock data scenarios
  getMockScenarios() {
    return {
      normal: mockPowerPlantData,
      highEmissions: mockPowerPlantData.map(item => ({
        ...item,
        co2_emissions_tonnes: item.co2_emissions_tonnes * 1.5,
        fuel_consumed_liters: item.fuel_consumed_liters * 1.3
      })),
      lowEmissions: mockPowerPlantData.map(item => ({
        ...item,
        co2_emissions_tonnes: item.co2_emissions_tonnes * 0.7,
        fuel_consumed_liters: item.fuel_consumed_liters * 0.8
      })),
      peakDemand: mockPowerPlantData.map(item => ({
        ...item,
        energy_output_mwh: item.energy_output_mwh * 1.4,
        fuel_consumed_liters: item.fuel_consumed_liters * 1.2
      }))
    };
  }

  // Test API connectivity
  async testAPIConnectivity(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const mockDataService = MockDataService.getInstance();
