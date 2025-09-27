import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Type definitions
export interface GoalTrackerResult {
  rai_pct?: number;
  budget?: {
    ytd_tons: number;
    ytd_budget_tons: number;
    days_ahead: number;
  };
  velocity?: {
    v_actual_g_per_kwh_per_yr: number;
    v_required_g_per_kwh_per_yr: number;
    on_track: boolean;
  };
  pathway?: {
    eta_year?: number;
    series?: Array<{ year: number; target_emissions_mt: number }>;
  };
  error?: string;
}

export interface AnalysisResult {
  summaries: {
    co2: any;
    generation_mix: any;
    netzero_alignment: any;
  };
  goalTracker: GoalTrackerResult;
  rawData: {
    co2: any[];
    generation_mix: any[];
    netzero_alignment: any[];
  };
}

class AnalysisService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Compute goal tracker metrics (client-side calculation)
   */
  computeGoalTracker(co2Data: any[], genData: any[], nzData: any[]): GoalTrackerResult {
    if (!co2Data || co2Data.length === 0 || !genData || genData.length === 0) {
      return { error: 'insufficient_data' };
    }

    const result: GoalTrackerResult = {};
    const now = new Date();
    const currentYear = now.getFullYear();

    // Sort data by timestamp
    const sortedCo2 = co2Data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const sortedGen = genData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Get latest CO2 intensity
    const latestCo2 = sortedCo2[sortedCo2.length - 1];
    const I_latest = latestCo2.co2_intensity_g_per_kwh;

    // Find base year from data
    const baseYear = Math.min(
      new Date(sortedCo2[0].timestamp).getFullYear(),
      new Date(sortedGen[0].timestamp).getFullYear()
    );

    // Get annual target for current year
    const currentYearTarget = nzData.find((d: any) => d.year === currentYear);
    const annualTargetTons = currentYearTarget ? currentYearTarget.target_emissions_mt * 1000000 : null;

    // Calculate base intensity
    const baseYearCo2 = sortedCo2.filter((d: any) => new Date(d.timestamp).getFullYear() === baseYear);
    const I_base = baseYearCo2.length > 0 
      ? baseYearCo2.reduce((sum: number, d: any) => sum + d.co2_intensity_g_per_kwh, 0) / baseYearCo2.length
      : I_latest;

    // Calculate target intensity
    let I_target = null;
    if (annualTargetTons && currentYearTarget) {
      const baseYearActual = nzData.find((d: any) => d.year === baseYear);
      if (baseYearActual && baseYearActual.actual_emissions_mt > 0) {
        I_target = I_base * (annualTargetTons / (baseYearActual.actual_emissions_mt * 1000000));
      }
    }

    // Real-time Alignment Index
    if (I_target && I_latest > 0) {
      result.rai_pct = Math.round(((100.0 * I_target) / I_latest) * 10) / 10;
    }

    // YTD Carbon Budget
    const currentYearGen = sortedGen.filter((d: any) => new Date(d.timestamp).getFullYear() === currentYear);
    if (currentYearGen.length >= 2 && annualTargetTons) {
      let totalEmissions = 0;
      
      for (let i = 1; i < currentYearGen.length; i++) {
        const prev = currentYearGen[i - 1];
        const curr = currentYearGen[i];
        
        // Find corresponding CO2 intensity
        const co2Record = sortedCo2.find((c: any) => 
          Math.abs(new Date(c.timestamp).getTime() - new Date(curr.timestamp).getTime()) < 20 * 60 * 1000 // 20 minutes tolerance
        );
        
        if (co2Record) {
          const dtHours = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / (1000 * 60 * 60);
          const mwh = curr.total_mw * dtHours;
          const tons = mwh * co2Record.co2_intensity_g_per_kwh * 0.001;
          totalEmissions += tons;
        }
      }

      const startOfYear = new Date(currentYear, 0, 1);
      const daysElapsed = Math.max(1, (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
      const ytdBudgetTons = annualTargetTons * (daysElapsed / 365);
      const dailyAvgTons = totalEmissions / daysElapsed;
      const daysAhead = dailyAvgTons > 0 ? (ytdBudgetTons - totalEmissions) / dailyAvgTons : 0;

      result.budget = {
        ytd_tons: Math.round(totalEmissions),
        ytd_budget_tons: Math.round(ytdBudgetTons),
        days_ahead: Math.round(daysAhead * 10) / 10,
      };
    }

    // Decarbonization velocity
    if (sortedCo2.length >= 10 && I_target) {
      const endTime = new Date(sortedCo2[sortedCo2.length - 1].timestamp);
      const startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
      
      const recentCo2 = sortedCo2.filter((d: any) => new Date(d.timestamp).getTime() >= startTime.getTime());
      
      if (recentCo2.length >= 10) {
        // Simple linear regression for slope
        const n = recentCo2.length;
        const x = recentCo2.map((_: any, i: number) => i);
        const y = recentCo2.map((d: any) => d.co2_intensity_g_per_kwh);
        
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum: number, xi: number, i: number) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum: number, xi: number) => sum + xi * xi, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const vActual = -slope * 365; // g/kWh per year
        
        const endOfYear = new Date(currentYear + 1, 0, 1);
        const daysLeft = Math.max(1, (endOfYear.getTime() - endTime.getTime()) / (1000 * 60 * 60 * 24));
        const vRequired = Math.max(0, (I_latest - I_target) * (365 / daysLeft));
        
        result.velocity = {
          v_actual_g_per_kwh_per_yr: Math.round(vActual * 10) / 10,
          v_required_g_per_kwh_per_yr: Math.round(vRequired * 10) / 10,
          on_track: vActual >= vRequired,
        };

        // ETA to near-zero
        if (vActual > 0) {
          const yearsToZero = Math.max(0, I_latest / vActual);
          result.pathway = {
            eta_year: Math.round(currentYear + yearsToZero),
          };
        }
      }
    }

    // Pathway series
    if (nzData && nzData.length > 0) {
      const series = nzData
        .map((d: any) => ({ year: d.year, target_emissions_mt: d.target_emissions_mt }))
        .sort((a, b) => a.year - b.year);
      
      // Add 2050 target if not present
      if (!series.find((s: any) => s.year === 2050)) {
        series.push({ year: 2050, target_emissions_mt: 0 });
      }
      
      if (result.pathway) {
        result.pathway.series = series;
      } else {
        result.pathway = { series };
      }
    }

    return result;
  }

  /**
   * Get comprehensive analysis including summaries and goal tracker
   */
  async getAnalysis(limit: number = 1000): Promise<AnalysisResult> {
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