import axios from "axios";
import {
  mockPowerPlantData,
  mockEUETSReport,
  generateMockData,
} from "../mockData";
import type { PowerPlantData, EUETSReport } from "../types";

// Configuration for mock data usage
const USE_MOCK_DATA =
  import.meta.env.VITE_USE_MOCK_DATA === "true" ||
  import.meta.env.NODE_ENV === "development";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// This service can switch between a real API and mock data
export class DataService {
  private static instance: DataService;
  private useMockData: boolean;

  constructor(useMockData: boolean = USE_MOCK_DATA) {
    this.useMockData = useMockData;
  }

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
  }

  async getPowerPlantData(): Promise<PowerPlantData[]> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockPowerPlantData;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/data`);
      return response.data;
    } catch (error) {
      console.warn("API call failed, falling back to mock data:", error);
      return mockPowerPlantData;
    }
  }

  async getEUETSReport(): Promise<EUETSReport> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockEUETSReport;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/reports/eu-ets`);
      return response.data;
    } catch (error) {
      console.warn("API call failed, falling back to mock data:", error);
      return mockEUETSReport;
    }
  }

  async getEUETSReports(): Promise<EUETSReport[]> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200));
      return [mockEUETSReport];
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/reports/eu-ets`);
      return response.data;
    } catch (error) {
      console.warn("API call failed, falling back to mock data:", error);
      return [mockEUETSReport];
    }
  }

  async generateCustomMockData(hours: number = 24): Promise<PowerPlantData[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return generateMockData(hours);
  }

  async testAPIConnectivity(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      console.warn("API connectivity test failed:", error);
      return false;
    }
  }
}

// Export a singleton instance
export const dataService = DataService.getInstance();
