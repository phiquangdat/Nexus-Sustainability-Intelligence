import { supabase, TABLES } from "../lib/supabase";
import type {
  PowerPlantData,
  EUETSReport,
  ScatterData,
  Co2IntensityRecord,
  GenerationMixRecord,
  NetZeroAlignmentRecord,
} from "../types";

export class DataService {
  // Power Plants
  static async getPowerPlants(): Promise<PowerPlantData[]> {
    const { data, error } = await supabase
      .from(TABLES.POWER_PLANTS)
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching power plants:", error);
      return [];
    }

    return data || [];
  }

  static async getPowerPlantById(id: string): Promise<PowerPlantData | null> {
    const { data, error } = await supabase
      .from(TABLES.POWER_PLANTS)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching power plant:", error);
      return null;
    }

    return data;
  }

  // EU ETS Reports
  static async getEUETSReports(): Promise<EUETSReport[]> {
    const { data, error } = await supabase
      .from(TABLES.EU_ETS_REPORTS)
      .select("*")
      .order("generated_at", { ascending: false });

    if (error) {
      console.error("Error fetching EU ETS reports:", error);
      return [];
    }

    return data || [];
  }

  static async getEUETSReportById(id: string): Promise<EUETSReport | null> {
    const { data, error } = await supabase
      .from(TABLES.EU_ETS_REPORTS)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching EU ETS report:", error);
      return null;
    }

    return data;
  }

  // Scatter Data
  static async getScatterData(): Promise<ScatterData[]> {
    const { data, error } = await supabase
      .from(TABLES.SCATTER_DATA)
      .select("*")
      .order("renewable_percentage");

    if (error) {
      console.error("Error fetching scatter data:", error);
      return [];
    }

    return data || [];
  }

  // CO2 Intensity Records
  static async getCo2IntensityRecords(
    limit: number = 30
  ): Promise<Co2IntensityRecord[]> {
    const { data, error } = await supabase
      .from(TABLES.CO2_INTENSITY)
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching CO2 intensity records:", error);
      return [];
    }

    return data || [];
  }

  // Generation Mix Records
  static async getGenerationMixRecords(
    limit: number = 30
  ): Promise<GenerationMixRecord[]> {
    const { data, error } = await supabase
      .from(TABLES.GENERATION_MIX)
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching generation mix records:", error);
      return [];
    }

    return data || [];
  }

  // Net Zero Alignment Records
  static async getNetZeroAlignmentRecords(
    limit: number = 30
  ): Promise<NetZeroAlignmentRecord[]> {
    const { data, error } = await supabase
      .from(TABLES.NETZERO_ALIGNMENT)
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching net zero alignment records:", error);
      return [];
    }

    return data || [];
  }

  // Real-time subscriptions
  static subscribeToPowerPlants(callback: (payload: any) => void) {
    return supabase
      .channel("power_plants_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLES.POWER_PLANTS },
        callback
      )
      .subscribe();
  }

  static subscribeToCo2Intensity(callback: (payload: any) => void) {
    return supabase
      .channel("co2_intensity_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLES.CO2_INTENSITY },
        callback
      )
      .subscribe();
  }

  static subscribeToEUETSReports(callback: (payload: any) => void) {
    return supabase
      .channel("eu_ets_reports_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLES.EU_ETS_REPORTS },
        callback
      )
      .subscribe();
  }
}
