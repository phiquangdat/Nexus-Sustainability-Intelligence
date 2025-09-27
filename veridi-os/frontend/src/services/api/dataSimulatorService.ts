// Data Simulator Service - Frontend integration of Python simulator module
// Integrates simulate.py, bias.py, config.py, and models.py functionality

import type {
  Co2IntensityRecord,
  GenerationMixRecord,
  NetZeroAlignmentRecord,
} from "./supabaseService";

export interface SimulatorConfig {
  timezone: string;
  wallIntervalSeconds: number;
  stepMinutes: number;
  randomSeed?: number;
  outputMode: "csv" | "supabase" | "both";
  csvOutputDir: string;
  supabaseUrl?: string;
  supabaseKey?: string;
  tableCo2Intensity: string;
  tableGenerationMix: string;
  tableNetzeroAlignment: string;
}

export interface SimulationData {
  co2Intensity: Co2IntensityRecord[];
  generationMix: GenerationMixRecord[];
  netZeroAlignment: NetZeroAlignmentRecord[];
}

class DataSimulatorService {
  private config: SimulatorConfig;
  private randomSeed: number | null = null;

  constructor(config?: Partial<SimulatorConfig>) {
    this.config = {
      timezone: "UTC",
      wallIntervalSeconds: 5,
      stepMinutes: 15,
      outputMode: "csv",
      csvOutputDir: "data",
      tableCo2Intensity: "co2_intensity",
      tableGenerationMix: "generation_mix",
      tableNetzeroAlignment: "netzero_alignment",
      ...config,
    };
  }

  // Set random seed for reproducible simulations
  public setRandomSeed(seed: number): void {
    this.randomSeed = seed;
    this.seedRandom(seed);
  }

  private seedRandom(seed: number): void {
    // Simple linear congruential generator for seeding
    let current = seed;
    const next = () => {
      current = (current * 1664525 + 1013904223) % 4294967296;
      return current / 4294967296;
    };

    // Override Math.random temporarily for this simulation
    const originalRandom = Math.random;
    Math.random = next;

    // Restore after simulation
    setTimeout(() => {
      Math.random = originalRandom;
    }, 0);
  }

  // Bounded normal distribution - JavaScript implementation of Python bias.py
  private boundedNormal(
    base: number,
    stdDev: number,
    lower: number,
    upper: number
  ): number {
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const value = base + stdDev * z0;
    return Math.max(lower, Math.min(upper, value));
  }

  // Diurnal profile - peak demand early evening, trough at night
  private diurnalProfile(
    hour: number,
    minFactor: number = 0.8,
    maxFactor: number = 1.2
  ): number {
    // Peak around 19:00, trough around 03:00
    const phase = (hour - 19) % 24;
    // Use cosine centered at 0 for peak at 19:00
    const cosVal = (Math.cos((phase / 24) * 2 * Math.PI) + 1) / 2;
    return minFactor + (maxFactor - minFactor) * cosVal;
  }

  // Weather variation factors
  private weatherVariation(): { wind: number; solar: number; hydro: number } {
    return {
      wind: this.boundedNormal(1.0, 0.2, 0.5, 1.5),
      solar: this.boundedNormal(1.0, 0.25, 0.2, 1.6),
      hydro: this.boundedNormal(1.0, 0.05, 0.8, 1.2),
    };
  }

  // Planned outage factor
  private plannedOutageFactor(): number {
    if (Math.random() < 0.02) {
      return 0.7;
    }
    return 1.0;
  }

  // Fossil price shock factor
  private fossilPriceShockFactor(): number {
    if (Math.random() < 0.01) {
      return 0.8;
    }
    return 1.0;
  }

  // Compute CO2 intensity from renewable share (unused but kept for compatibility)
  // private computeCo2Intensity(renewableSharePct: number, baseRange: [number, number] = [100, 300]): number {
  //   const [low, high] = baseRange;
  //   // Inverse relationship: when renewables 60%, intensity ~ low; at 30%, ~ high
  //   const norm = Math.max(0.0, Math.min(1.0, (60 - renewableSharePct) / 30));
  //   const base = low + norm * (high - low);
  //   return this.boundedNormal(base, 10, low, high);
  // }

  // Generate CO2 intensity data
  public generateCo2IntensityData(
    count: number = 1000,
    startTime?: Date
  ): Co2IntensityRecord[] {
    const data: Co2IntensityRecord[] = [];
    const now = startTime || new Date();

    // Set random seed if provided
    if (this.randomSeed !== null) {
      this.seedRandom(this.randomSeed);
    }

    for (let i = 0; i < count; i++) {
      const timestamp = new Date(
        now.getTime() - (count - i - 1) * this.config.stepMinutes * 60 * 1000
      );

      // Generate realistic CO2 intensity with seasonal and diurnal patterns
      const hour = timestamp.getUTCHours();
      const month = timestamp.getUTCMonth();

      // Seasonal variation (lower in summer due to more renewables)
      const seasonalFactor =
        0.9 + 0.2 * Math.cos(((month - 6) / 12) * 2 * Math.PI);

      // Diurnal variation
      const diurnalFactor = this.diurnalProfile(hour, 0.85, 1.15);

      // Base intensity with trend (decreasing over time)
      const daysFromStart =
        (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24);
      const trendFactor = 1.0 - (daysFromStart / 365) * 0.05; // 5% reduction per year

      const baseIntensity = 200 * seasonalFactor * diurnalFactor * trendFactor;
      const co2Intensity = this.boundedNormal(baseIntensity, 15, 50, 400);

      data.push({
        id: i + 1,
        timestamp: timestamp.toISOString(),
        co2_intensity_g_per_kwh: Math.round(co2Intensity * 10) / 10,
      });
    }

    return data;
  }

  // Generate generation mix data
  public generateGenerationMixData(
    count: number = 1000,
    startTime?: Date
  ): GenerationMixRecord[] {
    const data: GenerationMixRecord[] = [];
    const now = startTime || new Date();

    // Set random seed if provided
    if (this.randomSeed !== null) {
      this.seedRandom(this.randomSeed);
    }

    for (let i = 0; i < count; i++) {
      const timestamp = new Date(
        now.getTime() - (count - i - 1) * this.config.stepMinutes * 60 * 1000
      );
      const hour = timestamp.getUTCHours();
      const month = timestamp.getUTCMonth();

      // Weather factors
      const weather = this.weatherVariation();

      // Diurnal factors
      const diurnalFactor = this.diurnalProfile(hour, 0.7, 1.3);

      // Seasonal factors
      const seasonalFactor =
        0.9 + 0.2 * Math.cos(((month - 6) / 12) * 2 * Math.PI);

      // Base capacities (MW)
      const baseHydro = 150;
      const baseWind = 200;
      const baseSolar = 180;
      const baseNuclear = 300;
      const baseFossil = 400;

      // Apply variations
      const hydro = baseHydro * weather.hydro * diurnalFactor;
      const wind = baseWind * weather.wind * seasonalFactor;
      const solar = baseSolar * weather.solar * this.getSolarFactor(hour);
      const nuclear = baseNuclear * this.plannedOutageFactor();
      const fossil = baseFossil * this.fossilPriceShockFactor() * diurnalFactor;

      const totalMW = hydro + wind + solar + nuclear + fossil;
      const renewableSharePct = ((hydro + wind + solar) / totalMW) * 100;

      data.push({
        id: i + 1,
        timestamp: timestamp.toISOString(),
        hydro_mw: Math.round(hydro * 10) / 10,
        wind_mw: Math.round(wind * 10) / 10,
        solar_mw: Math.round(solar * 10) / 10,
        nuclear_mw: Math.round(nuclear * 10) / 10,
        fossil_mw: Math.round(fossil * 10) / 10,
        total_mw: Math.round(totalMW * 10) / 10,
        renewable_share_pct: Math.round(renewableSharePct * 10) / 10,
      });
    }

    return data;
  }

  // Get solar factor based on hour (0 at night, peak at noon)
  private getSolarFactor(hour: number): number {
    if (hour < 6 || hour > 18) {
      return 0;
    }
    const normalizedHour = (hour - 6) / 12; // 0 to 1
    return Math.sin(normalizedHour * Math.PI);
  }

  // Generate net-zero alignment data
  public generateNetZeroAlignmentData(): NetZeroAlignmentRecord[] {
    const data: NetZeroAlignmentRecord[] = [];
    // const currentYear = new Date().getFullYear();

    // Set random seed if provided
    if (this.randomSeed !== null) {
      this.seedRandom(this.randomSeed);
    }

    // Generate data for years 2020-2050
    for (let year = 2020; year <= 2050; year++) {
      const yearsFromStart = year - 2020;

      // Target emissions (decreasing to net-zero by 2050)
      const targetEmissionsMt = Math.max(0, 50 * (1 - yearsFromStart / 30));

      // Actual emissions (with some variation around target)
      const variation = this.boundedNormal(1.0, 0.1, 0.7, 1.3);
      const actualEmissionsMt = targetEmissionsMt * variation;

      // Alignment percentage
      const alignmentPct =
        targetEmissionsMt > 0
          ? Math.max(
              0,
              Math.min(100, (targetEmissionsMt / actualEmissionsMt) * 100)
            )
          : 100;

      data.push({
        year,
        actual_emissions_mt: Math.round(actualEmissionsMt * 100) / 100,
        target_emissions_mt: Math.round(targetEmissionsMt * 100) / 100,
        alignment_pct: Math.round(alignmentPct * 10) / 10,
      });
    }

    return data;
  }

  // Generate all simulation data
  public generateAllData(
    count: number = 1000,
    startTime?: Date
  ): SimulationData {
    return {
      co2Intensity: this.generateCo2IntensityData(count, startTime),
      generationMix: this.generateGenerationMixData(count, startTime),
      netZeroAlignment: this.generateNetZeroAlignmentData(),
    };
  }

  // Generate data for specific time range
  public generateDataForTimeRange(
    startTime: Date,
    endTime: Date,
    intervalMinutes: number = 15
  ): SimulationData {
    const totalMinutes =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const count = Math.floor(totalMinutes / intervalMinutes);

    return this.generateAllData(count, endTime);
  }

  // Export data to CSV format (simplified)
  public exportToCSV(data: SimulationData): {
    co2Intensity: string;
    generationMix: string;
    netZeroAlignment: string;
  } {
    const co2Csv = this.arrayToCSV(data.co2Intensity);
    const genCsv = this.arrayToCSV(data.generationMix);
    const netZeroCsv = this.arrayToCSV(data.netZeroAlignment);

    return {
      co2Intensity: co2Csv,
      generationMix: genCsv,
      netZeroAlignment: netZeroCsv,
    };
  }

  private arrayToCSV(data: any[]): string {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];

    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        return typeof value === "string" ? `"${value}"` : value;
      });
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  }

  // Load configuration from environment variables
  public static loadConfigFromEnv(): SimulatorConfig {
    return {
      timezone: "UTC",
      wallIntervalSeconds: 5,
      stepMinutes: 15,
      randomSeed: undefined,
      outputMode: "csv",
      csvOutputDir: "data",
      supabaseUrl: undefined,
      supabaseKey: undefined,
      tableCo2Intensity: "co2_intensity",
      tableGenerationMix: "generation_mix",
      tableNetzeroAlignment: "netzero_alignment",
    };
  }
}

// Export singleton instance
export const dataSimulatorService = new DataSimulatorService();
export default dataSimulatorService;
