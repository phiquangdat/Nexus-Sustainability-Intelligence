require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase credentials not found. Using mock data fallback.");
}

// Create Supabase client with service role key for backend operations
const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

// Database service layer
class DatabaseService {
  constructor() {
    this.useSupabase = supabase !== null;
  }

  // Check if Supabase is available
  isSupabaseAvailable() {
    return this.useSupabase;
  }

  // Get all power plant data
  async getPowerPlantData(limit = 1000) {
    if (!this.useSupabase) {
      throw new Error("Supabase not configured");
    }

    try {
      const { data, error } = await supabase
        .from("power_plant_data")
        .select(
          `
          *,
          power_plants (
            id,
            name,
            fuel_type
          )
        `
        )
        .order("timestamp", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching power plant data:", error);
      throw error;
    }
  }

  // Get power plants summary
  async getPowerPlantsSummary() {
    if (!this.useSupabase) {
      throw new Error("Supabase not configured");
    }

    try {
      const { data, error } = await supabase
        .from("power_plant_summary")
        .select("*");

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching power plants summary:", error);
      throw error;
    }
  }

  // Get recent emissions data
  async getRecentEmissions(limit = 100) {
    if (!this.useSupabase) {
      throw new Error("Supabase not configured");
    }

    try {
      const { data, error } = await supabase
        .from("recent_emissions")
        .select("*")
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching recent emissions:", error);
      throw error;
    }
  }

  // Generate EU ETS report
  async generateEUETSReport(startDate = "2024-07-01", endDate = "2024-10-01") {
    if (!this.useSupabase) {
      throw new Error("Supabase not configured");
    }

    try {
      // Calculate total emissions for the period
      const { data: emissionsData, error: emissionsError } = await supabase
        .from("power_plant_data")
        .select("co2_emissions_tonnes")
        .gte("timestamp", startDate)
        .lt("timestamp", endDate);

      if (emissionsError) throw emissionsError;

      const totalEmissions =
        emissionsData?.reduce(
          (sum, record) => sum + record.co2_emissions_tonnes,
          0
        ) || 0;

      const reportData = {
        reporting_period: "Q3 2024",
        total_emissions_tonnes: Math.round(totalEmissions * 100) / 100,
        status: totalEmissions < 20000 ? "Compliant" : "Non-Compliant",
        generated_at: new Date().toISOString(),
      };

      // Insert the report into database
      const { data, error } = await supabase
        .from("eu_ets_reports")
        .insert(reportData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error generating EU ETS report:", error);
      throw error;
    }
  }

  // Get EU ETS reports
  async getEUETSReports(limit = 50) {
    if (!this.useSupabase) {
      throw new Error("Supabase not configured");
    }

    try {
      const { data, error } = await supabase
        .from("eu_ets_reports")
        .select("*")
        .order("generated_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching EU ETS reports:", error);
      throw error;
    }
  }

  // Insert new power plant data
  async insertPowerPlantData(data) {
    if (!this.useSupabase) {
      throw new Error("Supabase not configured");
    }

    try {
      const { data: result, error } = await supabase
        .from("power_plant_data")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error("Error inserting power plant data:", error);
      throw error;
    }
  }

  // Get power plant emissions summary
  async getPlantEmissionsSummary(plantId, hoursBack = 24) {
    if (!this.useSupabase) {
      throw new Error("Supabase not configured");
    }

    try {
      const { data, error } = await supabase.rpc(
        "get_plant_emissions_summary",
        {
          plant_uuid: plantId,
          hours_back: hoursBack,
        }
      );

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error getting plant emissions summary:", error);
      throw error;
    }
  }

  // ============================================================================
  // SUSTAINABILITY INTELLIGENCE METHODS
  // ============================================================================

  // Get CO2 intensity data
  async getCo2IntensityData(limit = 1000, order = "timestamp") {
    if (!this.useSupabase) {
      throw new Error("Supabase not configured");
    }

    try {
      const { data, error } = await supabase
        .from("co2_intensity")
        .select("*")
        .order(order, { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching CO2 intensity data:", error);
      throw error;
    }
  }

  // Get generation mix data
  async getGenerationMixData(limit = 1000, order = "timestamp") {
    if (!this.useSupabase) {
      throw new Error("Supabase not configured");
    }

    try {
      const { data, error } = await supabase
        .from("generation_mix")
        .select("*")
        .order(order, { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching generation mix data:", error);
      throw error;
    }
  }

  // Get net-zero alignment data
  async getNetZeroAlignmentData(limit = 100, order = "year") {
    if (!this.useSupabase) {
      throw new Error("Supabase not configured");
    }

    try {
      const { data, error } = await supabase
        .from("netzero_alignment")
        .select("*")
        .order(order, { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching net-zero alignment data:", error);
      throw error;
    }
  }

  // Get sustainability KPIs
  async getSustainabilityKPIs() {
    if (!this.useSupabase) {
      throw new Error("Supabase not configured");
    }

    try {
      const { data, error } = await supabase
        .from("latest_sustainability_metrics")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching sustainability KPIs:", error);
      throw error;
    }
  }

  // Get goal tracker metrics
  async getGoalTrackerMetrics() {
    if (!this.useSupabase) {
      throw new Error("Supabase not configured");
    }

    try {
      // This would typically involve complex calculations
      // For now, return a placeholder that the analysis service will handle
      return {
        message: "Goal tracker metrics calculated by analysis service",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error fetching goal tracker metrics:", error);
      throw error;
    }
  }

  // Insert CO2 intensity data
  async insertCo2IntensityData(data) {
    if (!this.useSupabase) {
      throw new Error("Supabase not configured");
    }

    try {
      const { data: result, error } = await supabase
        .from("co2_intensity")
        .insert(data)
        .select();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error("Error inserting CO2 intensity data:", error);
      throw error;
    }
  }

  // Insert generation mix data
  async insertGenerationMixData(data) {
    if (!this.useSupabase) {
      throw new Error("Supabase not configured");
    }

    try {
      const { data: result, error } = await supabase
        .from("generation_mix")
        .insert(data)
        .select();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error("Error inserting generation mix data:", error);
      throw error;
    }
  }

  // Insert net-zero alignment data
  async insertNetZeroAlignmentData(data) {
    if (!this.useSupabase) {
      throw new Error("Supabase not configured");
    }

    try {
      const { data: result, error } = await supabase
        .from("netzero_alignment")
        .upsert(data, { onConflict: "year" })
        .select();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error("Error inserting net-zero alignment data:", error);
      throw error;
    }
  }

  // Test database connection
  async testConnection() {
    if (!this.useSupabase) {
      return { connected: false, message: "Supabase not configured" };
    }

    try {
      const { data, error } = await supabase
        .from("power_plants")
        .select("count")
        .limit(1);

      if (error) throw error;
      return { connected: true, message: "Database connection successful" };
    } catch (error) {
      return {
        connected: false,
        message: `Database connection failed: ${error.message}`,
      };
    }
  }
}

module.exports = DatabaseService;
