import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

class AnalysisService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Get comprehensive analysis including summaries and goal tracker
   */
  async getAnalysis(limit: number = 1000) {
    try {
      const response = await axios.get(`${this.baseURL}/analysis`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching analysis:', error);
      throw error;
    }
  }

  /**
   * Get analysis summaries only
   */
  async getSummaries(limit: number = 1000) {
    try {
      const response = await axios.get(`${this.baseURL}/analysis/summaries`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching summaries:', error);
      throw error;
    }
  }

  /**
   * Get goal tracker metrics
   */
  async getGoalTracker(limit: number = 1000) {
    try {
      const response = await axios.get(`${this.baseURL}/analysis/goal-tracker`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching goal tracker:', error);
      throw error;
    }
  }

  /**
   * Get CO2 intensity data
   */
  async getCo2IntensityData(limit: number = 1000, order: string = 'timestamp') {
    try {
      const response = await axios.get(`${this.baseURL}/sustainability/co2-intensity`, {
        params: { limit, order }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching CO2 intensity data:', error);
      throw error;
    }
  }

  /**
   * Get generation mix data
   */
  async getGenerationMixData(limit: number = 1000, order: string = 'timestamp') {
    try {
      const response = await axios.get(`${this.baseURL}/sustainability/generation-mix`, {
        params: { limit, order }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching generation mix data:', error);
      throw error;
    }
  }

  /**
   * Get net-zero alignment data
   */
  async getNetZeroAlignmentData(limit: number = 100, order: string = 'year') {
    try {
      const response = await axios.get(`${this.baseURL}/sustainability/netzero-alignment`, {
        params: { limit, order }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching net-zero alignment data:', error);
      throw error;
    }
  }

  /**
   * Get sustainability KPIs
   */
  async getSustainabilityKPIs() {
    try {
      const response = await axios.get(`${this.baseURL}/sustainability/kpis`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sustainability KPIs:', error);
      throw error;
    }
  }

  /**
   * Run simulation once
   */
  async runSimulationOnce(timestamp?: string) {
    try {
      const response = await axios.post(`${this.baseURL}/simulator/run-once`, {
        timestamp
      });
      return response.data;
    } catch (error) {
      console.error('Error running simulation:', error);
      throw error;
    }
  }

  /**
   * Generate historical data
   */
  async generateHistoricalData(startDate: string, endDate: string, intervalMinutes: number = 15) {
    try {
      const response = await axios.post(`${this.baseURL}/simulator/generate-historical`, {
        startDate,
        endDate,
        intervalMinutes
      });
      return response.data;
    } catch (error) {
      console.error('Error generating historical data:', error);
      throw error;
    }
  }

  /**
   * Start continuous simulation
   */
  async startContinuousSimulation() {
    try {
      const response = await axios.post(`${this.baseURL}/simulator/start-continuous`);
      return response.data;
    } catch (error) {
      console.error('Error starting continuous simulation:', error);
      throw error;
    }
  }

  /**
   * Get simulator configuration
   */
  async getSimulatorConfig() {
    try {
      const response = await axios.get(`${this.baseURL}/simulator/config`);
      return response.data;
    } catch (error) {
      console.error('Error fetching simulator config:', error);
      throw error;
    }
  }

  /**
   * Check if service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await axios.get(`${this.baseURL}/health`);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const analysisService = new AnalysisService();