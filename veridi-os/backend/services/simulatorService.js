const { createClient } = require("@supabase/supabase-js");

class SimulatorService {
  constructor() {
    // Initialize Supabase client with fallback for missing credentials
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      console.log("Supabase credentials not found. Simulator will use mock mode.");
      this.supabase = null;
    }

    // Configuration
    this.config = {
      timezone: process.env.SIM_TIMEZONE || "UTC",
      wallIntervalSeconds: parseInt(
        process.env.SIM_WALL_INTERVAL_SECONDS ||
          process.env.WALL_INTERVAL_SECONDS ||
          "5"
      ),
      stepMinutes: parseInt(
        process.env.SIM_STEP_MINUTES || process.env.STEP_MINUTES || "15"
      ),
      randomSeed: process.env.SIM_RANDOM_SEED
        ? parseInt(process.env.SIM_RANDOM_SEED)
        : null,
      outputMode: process.env.OUTPUT_MODE || "supabase",
      csvOutputDir: process.env.CSV_OUTPUT_DIR || "data",
      tables: {
        co2Intensity: process.env.TABLE_CO2_INTENSITY || "co2_intensity",
        generationMix: process.env.TABLE_GENERATION_MIX || "generation_mix",
        netzeroAlignment:
          process.env.TABLE_NETZERO_ALIGNMENT || "netzero_alignment",
      },
    };

    // Initialize random seed if provided
    if (this.config.randomSeed) {
      this.seedRandom(this.config.randomSeed);
    }
  }

  seedRandom(seed) {
    // Simple seeded random number generator
    this.randomSeed = seed;
    this.randomState = seed;
  }

  seededRandom() {
    if (this.randomSeed) {
      this.randomState = (this.randomState * 9301 + 49297) % 233280;
      return this.randomState / 233280;
    }
    return Math.random();
  }

  boundedNormal(base, stdDev, lower, upper) {
    const value =
      base +
      stdDev *
        Math.sqrt(-2 * Math.log(this.seededRandom())) *
        Math.cos(2 * Math.PI * this.seededRandom());
    return Math.max(lower, Math.min(upper, value));
  }

  diurnalProfile(hour, minFactor = 0.8, maxFactor = 1.2) {
    // Peak around 19:00, trough around 03:00
    const phase = (hour - 19) % 24;
    const cosVal = (Math.cos((phase / 24) * 2 * Math.PI) + 1) / 2;
    return minFactor + (maxFactor - minFactor) * cosVal;
  }

  weatherVariation() {
    const wind = this.boundedNormal(1.0, 0.2, 0.5, 1.5);
    const solar = this.boundedNormal(1.0, 0.25, 0.2, 1.6);
    const hydro = this.boundedNormal(1.0, 0.05, 0.8, 1.2);
    return { wind, solar, hydro };
  }

  plannedOutageFactor() {
    if (this.seededRandom() < 0.02) {
      return 0.7;
    }
    return 1.0;
  }

  fossilPriceShockFactor() {
    if (this.seededRandom() < 0.01) {
      return 0.8;
    }
    return 1.0;
  }

  computeCo2Intensity(renewableSharePct, baseRange = [100, 300]) {
    const [low, high] = baseRange;
    const norm = Math.max(0.0, Math.min(1.0, (60 - renewableSharePct) / 30));
    const base = low + norm * (high - low);
    return this.boundedNormal(base, 10, low, high);
  }

  simulateGenerationMix(timestamp, baseTotalMw = 7000.0) {
    const hour = new Date(timestamp).getHours();

    // Demand diurnal shape
    const loadFactor = this.diurnalProfile(hour, 0.85, 1.15);
    const {
      wind: windF,
      solar: solarF,
      hydro: hydroF,
    } = this.weatherVariation();
    const plannedFactor = this.plannedOutageFactor();
    const priceShock = this.fossilPriceShockFactor();

    // Baseline capacities (MW)
    const baseHydro = 950.0;
    const baseWind = 1800.0;
    const baseSolar = 8 <= hour && hour <= 18 ? 150.0 : 10.0;
    const baseNuclear = 2700.0;
    const baseFossil = Math.max(1200.0, 1600.0 * loadFactor);

    // Apply multiplicative factors
    let hydro = Math.max(0.0, baseHydro * hydroF);
    let wind = Math.max(0.0, baseWind * windF);
    let solar = Math.max(0.0, baseSolar * solarF);
    let nuclear = Math.max(0.0, baseNuclear * plannedFactor);
    let fossil = Math.max(0.0, baseFossil * priceShock);

    // Adjust total to reflect demand
    const rawTotal = hydro + wind + solar + nuclear + fossil;
    const scale = rawTotal > 0 ? (baseTotalMw * loadFactor) / rawTotal : 1.0;

    hydro *= scale;
    wind *= scale;
    solar *= scale;
    nuclear *= scale;
    fossil *= scale;

    const total = hydro + wind + solar + nuclear + fossil;
    const renewables = hydro + wind + solar;
    const renewPct = total > 0 ? (100.0 * renewables) / total : 0.0;

    return {
      timestamp,
      hydro_mw: Math.round(hydro * 10) / 10,
      wind_mw: Math.round(wind * 10) / 10,
      solar_mw: Math.round(solar * 10) / 10,
      nuclear_mw: Math.round(nuclear * 10) / 10,
      fossil_mw: Math.round(fossil * 10) / 10,
      total_mw: Math.round(total * 10) / 10,
      renewable_share_pct: Math.round(renewPct * 10) / 10,
    };
  }

  simulateCo2Intensity(timestamp, generation) {
    const intensity = this.computeCo2Intensity(
      generation.renewable_share_pct,
      [100, 300]
    );
    return {
      timestamp,
      co2_intensity_g_per_kwh: Math.round(intensity * 10) / 10,
    };
  }

  simulateNetZeroAlignment(year) {
    // Targets per doc example: 2020=30, 2021=29, ..., 2025=25
    const baseTargets = {
      2020: 30,
      2021: 29,
      2022: 28,
      2023: 27,
      2024: 26,
      2025: 25,
    };
    const target = baseTargets[year] || Math.max(10, 30 - (year - 2020));

    // Actual with noise and potential setbacks
    const actual = this.boundedNormal(
      target * 1.02,
      1.0,
      target * 0.8,
      target * 1.2
    );
    const alignment = actual > 0 ? (100.0 * target) / actual : 0.0;

    return {
      year,
      actual_emissions_mt: Math.round(actual * 10) / 10,
      target_emissions_mt: target,
      alignment_pct: Math.round(alignment),
    };
  }

  async insertRows(tableName, rows, onConflict = null, resolution = "ignore") {
    try {
      if (onConflict) {
        // For upsert operations
        const { data, error } = await this.supabase
          .from(tableName)
          .upsert(rows, {
            onConflict,
            ignoreDuplicates: resolution === "ignore",
          });

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await this.supabase
          .from(tableName)
          .insert(rows);

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error(`Error inserting into ${tableName}:`, error);
      throw error;
    }
  }

  async writeOutputs(co2Rows, genRows, nzRows) {
    try {
      if (
        this.config.outputMode === "supabase" ||
        this.config.outputMode === "both"
      ) {
        await Promise.all([
          this.insertRows(this.config.tables.co2Intensity, co2Rows),
          this.insertRows(this.config.tables.generationMix, genRows),
          this.insertRows(
            this.config.tables.netzeroAlignment,
            nzRows,
            "year",
            "ignore"
          ),
        ]);
      }

      // CSV output would go here if needed
      if (
        this.config.outputMode === "csv" ||
        this.config.outputMode === "both"
      ) {
        // CSV writing logic would be implemented here
        console.log("CSV output not implemented in this version");
      }
    } catch (error) {
      console.error("Error writing outputs:", error);
      throw error;
    }
  }

  async runOnce(anchor = null) {
    const timestamp = anchor || new Date().toISOString();
    const year = new Date(timestamp).getFullYear();

    const generation = this.simulateGenerationMix(timestamp);
    const co2 = this.simulateCo2Intensity(timestamp, generation);
    const netZero = this.simulateNetZeroAlignment(year);

    await this.writeOutputs([co2], [generation], [netZero]);

    return {
      timestamp,
      generation,
      co2,
      netZero,
    };
  }

  async runContinuous() {
    console.log("Starting continuous simulation...");
    let anchor = new Date();

    while (true) {
      try {
        const result = await this.runOnce(anchor.toISOString());
        console.log(`Simulated data for ${result.timestamp}`);

        // Advance simulated time
        anchor = new Date(
          anchor.getTime() + this.config.stepMinutes * 60 * 1000
        );

        // Wait for wall clock interval
        await new Promise((resolve) =>
          setTimeout(resolve, this.config.wallIntervalSeconds * 1000)
        );
      } catch (error) {
        console.error("Error in continuous simulation:", error);
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retry
      }
    }
  }

  async generateHistoricalData(startDate, endDate, intervalMinutes = 15) {
    console.log(`Generating historical data from ${startDate} to ${endDate}`);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const interval = intervalMinutes * 60 * 1000;

    const co2Rows = [];
    const genRows = [];
    const nzRows = [];

    let current = new Date(start);
    while (current <= end) {
      const generation = this.simulateGenerationMix(current.toISOString());
      const co2 = this.simulateCo2Intensity(current.toISOString(), generation);

      co2Rows.push(co2);
      genRows.push(generation);

      // Add net-zero alignment once per year
      const year = current.getFullYear();
      if (!nzRows.find((row) => row.year === year)) {
        const netZero = this.simulateNetZeroAlignment(year);
        nzRows.push(netZero);
      }

      current = new Date(current.getTime() + interval);
    }

    await this.writeOutputs(co2Rows, genRows, nzRows);

    return {
      co2Rows: co2Rows.length,
      genRows: genRows.length,
      nzRows: nzRows.length,
    };
  }
}

module.exports = SimulatorService;
