// Simulator Service - Integrates Python simulator/simulate.py functionality
// Provides real-time data generation with configurable intervals

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
  tableNetZeroAlignment: string;
}

export interface Co2IntensityRecord {
  id?: number;
  timestamp: string;
  co2_intensity_g_per_kwh: number;
}

export interface GenerationMixRecord {
  id?: number;
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

class SimulatorService {
  private static instance: SimulatorService;
  private config: SimulatorConfig;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor() {
    this.config = this.loadConfigFromEnv();
  }

  static getInstance(): SimulatorService {
    if (!SimulatorService.instance) {
      SimulatorService.instance = new SimulatorService();
    }
    return SimulatorService.instance;
  }

  /**
   * Load configuration from environment variables
   */
  private loadConfigFromEnv(): SimulatorConfig {
    return {
      timezone: import.meta.env.VITE_SIM_TIMEZONE || "UTC",
      wallIntervalSeconds: parseInt(
        import.meta.env.VITE_SIM_WALL_INTERVAL_SECONDS || "5"
      ),
      stepMinutes: parseInt(import.meta.env.VITE_SIM_STEP_MINUTES || "15"),
      randomSeed: import.meta.env.VITE_SIM_RANDOM_SEED
        ? parseInt(import.meta.env.VITE_SIM_RANDOM_SEED)
        : undefined,
      outputMode: (import.meta.env.VITE_OUTPUT_MODE || "supabase") as
        | "csv"
        | "supabase"
        | "both",
      csvOutputDir: import.meta.env.VITE_CSV_OUTPUT_DIR || "data",
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseKey: import.meta.env.VITE_SUPABASE_KEY,
      tableCo2Intensity:
        import.meta.env.VITE_TABLE_CO2_INTENSITY || "co2_intensity",
      tableGenerationMix:
        import.meta.env.VITE_TABLE_GENERATION_MIX || "generation_mix",
      tableNetZeroAlignment:
        import.meta.env.VITE_TABLE_NETZERO_ALIGNMENT || "netzero_alignment",
    };
  }

  /**
   * Update simulator configuration
   */
  updateConfig(newConfig: Partial<SimulatorConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): SimulatorConfig {
    return { ...this.config };
  }

  /**
   * Start continuous simulation
   */
  async startContinuous(): Promise<void> {
    if (this.isRunning) {
      console.warn("Simulator is already running");
      return;
    }

    this.isRunning = true;
    console.log("Starting continuous simulation...");

    // Run initial step
    await this.runOnce();

    // Set up interval for continuous updates
    this.intervalId = setInterval(async () => {
      try {
        await this.runOnce();
      } catch (error) {
        console.error("Simulation step failed:", error);
      }
    }, this.config.wallIntervalSeconds * 1000);
  }

  /**
   * Stop continuous simulation
   */
  stopContinuous(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log("Stopped continuous simulation");
  }

  /**
   * Check if simulator is running
   */
  isSimulatorRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Run a single simulation step
   */
  async runOnce(anchor?: Date): Promise<Date> {
    const timestamp = anchor || this.getCurrentTimestamp();

    // Generate data
    const generation = this.simulateGenerationMix(timestamp);
    const co2Intensity = this.simulateCo2Intensity(timestamp, generation);
    const netZeroAlignment = this.simulateNetZeroAlignment(
      timestamp.getFullYear()
    );

    // Output data based on configuration
    await this.writeOutputs(co2Intensity, generation, netZeroAlignment);

    return timestamp;
  }

  /**
   * Get current timestamp rounded to step interval
   */
  private getCurrentTimestamp(): Date {
    const now = new Date();
    const stepSeconds = this.config.stepMinutes * 60;
    const roundedSeconds =
      Math.floor(now.getTime() / 1000 / stepSeconds) * stepSeconds;
    return new Date(roundedSeconds * 1000);
  }

  /**
   * Simulate generation mix - equivalent to Python simulate_generation_mix
   */
  private simulateGenerationMix(timestamp: Date): GenerationMixRecord {
    const hour = timestamp.getHours();

    // Demand diurnal shape
    const loadFactor = this.diurnalProfile(hour, 0.85, 1.15);
    const { windFactor, solarFactor, hydroFactor } = this.weatherVariation();
    const plannedFactor = this.plannedOutageFactor();
    const priceShock = this.fossilPriceShockFactor();

    // Baseline capacities (MW)
    const baseHydro = 950.0;
    const baseWind = 1800.0;
    const baseSolar = 8 <= hour && hour <= 18 ? 150.0 : 10.0;
    const baseNuclear = 2700.0;
    const baseFossil = Math.max(1200.0, 1600.0 * loadFactor);

    // Apply factors
    let hydro = Math.max(0, baseHydro * hydroFactor);
    let wind = Math.max(0, baseWind * windFactor);
    let solar = Math.max(0, baseSolar * solarFactor);
    let nuclear = Math.max(0, baseNuclear * plannedFactor);
    let fossil = Math.max(0, baseFossil * priceShock);

    // Scale to match demand
    const rawTotal = hydro + wind + solar + nuclear + fossil;
    const baseTotalMw = 7000.0;
    const scale = (baseTotalMw * loadFactor) / rawTotal;

    hydro *= scale;
    wind *= scale;
    solar *= scale;
    nuclear *= scale;
    fossil *= scale;

    const total = hydro + wind + solar + nuclear + fossil;
    const renewables = hydro + wind + solar;
    const renewableSharePct = total > 0 ? (100.0 * renewables) / total : 0;

    return {
      id: undefined,
      timestamp: timestamp.toISOString(),
      hydro_mw: Math.round(hydro * 10) / 10,
      wind_mw: Math.round(wind * 10) / 10,
      solar_mw: Math.round(solar * 10) / 10,
      nuclear_mw: Math.round(nuclear * 10) / 10,
      fossil_mw: Math.round(fossil * 10) / 10,
      total_mw: Math.round(total * 10) / 10,
      renewable_share_pct: Math.round(renewableSharePct * 10) / 10,
    };
  }

  /**
   * Simulate CO2 intensity - equivalent to Python simulate_co2_intensity
   */
  private simulateCo2Intensity(
    timestamp: Date,
    generation: GenerationMixRecord
  ): Co2IntensityRecord {
    const intensity = this.computeCo2Intensity(generation.renewable_share_pct, {
      min: 100,
      max: 300,
    });
    return {
      id: undefined,
      timestamp: timestamp.toISOString(),
      co2_intensity_g_per_kwh: Math.round(intensity * 10) / 10,
    };
  }

  /**
   * Simulate net-zero alignment - equivalent to Python simulate_netzero_alignment
   */
  private simulateNetZeroAlignment(year: number): NetZeroAlignmentRecord {
    const baseTargets: Record<number, number> = {
      2020: 30,
      2021: 29,
      2022: 28,
      2023: 27,
      2024: 26,
      2025: 25,
    };

    const target = baseTargets[year] || Math.max(10, 30 - (year - 2020));
    const actual = this.boundedNormal(
      target * 1.02,
      1.0,
      target * 0.8,
      target * 1.2
    );
    const alignment = actual > 0 ? (100.0 * target) / actual : 0;

    return {
      year,
      actual_emissions_mt: Math.round(actual * 10) / 10,
      target_emissions_mt: target,
      alignment_pct: Math.round(alignment),
    };
  }

  /**
   * Write outputs based on configuration
   */
  private async writeOutputs(
    co2Data: Co2IntensityRecord,
    genData: GenerationMixRecord,
    nzData: NetZeroAlignmentRecord
  ): Promise<void> {
    if (this.config.outputMode === "csv" || this.config.outputMode === "both") {
      // CSV output would be implemented here
      console.log("CSV output:", { co2Data, genData, nzData });
    }

    if (
      this.config.outputMode === "supabase" ||
      this.config.outputMode === "both"
    ) {
      if (this.config.supabaseUrl && this.config.supabaseKey) {
        try {
          // Import supabaseService dynamically to avoid circular dependencies
          const { supabaseService } = await import("./supabaseService");

          if (supabaseService.isEnabled()) {
            await supabaseService.insertCo2IntensityData([co2Data]);
            await supabaseService.insertGenerationMixData([genData]);
            await supabaseService.insertNetZeroAlignmentData([nzData]);
          }
        } catch (error) {
          console.error("Supabase insert failed:", error);
        }
      }
    }
  }

  // Helper methods for simulation factors
  private diurnalProfile(
    hour: number,
    minFactor: number,
    maxFactor: number
  ): number {
    // Simplified diurnal profile - peaks during day, valleys at night
    const normalizedHour = hour / 24;
    const factor =
      0.5 + 0.5 * Math.sin(2 * Math.PI * normalizedHour - Math.PI / 2);
    return minFactor + (maxFactor - minFactor) * factor;
  }

  private weatherVariation(): {
    windFactor: number;
    solarFactor: number;
    hydroFactor: number;
  } {
    return {
      windFactor: this.boundedNormal(1.0, 0.3, 0.2, 1.8),
      solarFactor: this.boundedNormal(1.0, 0.4, 0.0, 1.5),
      hydroFactor: this.boundedNormal(1.0, 0.2, 0.5, 1.5),
    };
  }

  private plannedOutageFactor(): number {
    return this.boundedNormal(1.0, 0.1, 0.7, 1.0);
  }

  private fossilPriceShockFactor(): number {
    return this.boundedNormal(1.0, 0.2, 0.5, 1.5);
  }

  private computeCo2Intensity(
    renewableSharePct: number,
    baseRange: { min: number; max: number }
  ): number {
    // Inverse relationship: higher renewable share = lower CO2 intensity
    const renewableFactor = renewableSharePct / 100;
    return (
      baseRange.min + (baseRange.max - baseRange.min) * (1 - renewableFactor)
    );
  }

  private boundedNormal(
    base: number,
    stdDev: number,
    min: number,
    max: number
  ): number {
    // Simplified normal distribution with bounds
    const value = base + (Math.random() - 0.5) * stdDev * 2;
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Generate historical data for testing
   */
  async generateHistoricalData(hours: number = 24): Promise<{
    co2Data: Co2IntensityRecord[];
    genData: GenerationMixRecord[];
    nzData: NetZeroAlignmentRecord[];
  }> {
    const co2Data: Co2IntensityRecord[] = [];
    const genData: GenerationMixRecord[] = [];
    const nzData: NetZeroAlignmentRecord[] = [];

    const now = new Date();
    const stepMs = this.config.stepMinutes * 60 * 1000;
    const startTime = new Date(now.getTime() - hours * 60 * 60 * 1000);

    // Generate data for each time step
    for (let time = startTime.getTime(); time < now.getTime(); time += stepMs) {
      const timestamp = new Date(time);
      const generation = this.simulateGenerationMix(timestamp);
      const co2Intensity = this.simulateCo2Intensity(timestamp, generation);

      co2Data.push(co2Intensity);
      genData.push(generation);
    }

    // Generate net-zero alignment data for recent years
    const currentYear = now.getFullYear();
    for (let year = currentYear - 5; year <= currentYear; year++) {
      nzData.push(this.simulateNetZeroAlignment(year));
    }

    return { co2Data, genData, nzData };
  }
}

// Export singleton instance
export const simulatorService = SimulatorService.getInstance();
export default simulatorService;
