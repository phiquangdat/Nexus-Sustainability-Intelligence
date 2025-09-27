import { supabase, TABLES } from "../lib/supabase";
import type {
  PowerPlantSummary,
  EUETSReport,
  ScatterData,
  Co2IntensityRecord,
  GenerationMixRecord,
  NetZeroAlignmentRecord,
} from "../types";

export class DataService {
  // Get all power plants
  static async getPowerPlants(): Promise<PowerPlantSummary[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.POWER_PLANTS)
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching power plants:", error);
      throw error;
    }
  }

  // Get EU ETS reports
  static async getEUETSReports(): Promise<EUETSReport[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.EU_ETS_REPORTS)
        .select("*")
        .order("generated_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching EU ETS reports:", error);
      throw error;
    }
  }

  // Get EU ETS report by ID
  static async getEUETSReportById(id: string): Promise<EUETSReport | null> {
    try {
      if (id === "latest") {
        const { data, error } = await supabase
          .from(TABLES.EU_ETS_REPORTS)
          .select("*")
          .order("generated_at", { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from(TABLES.EU_ETS_REPORTS)
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching EU ETS report:", error);
      throw error;
    }
  }

  // Get scatter data
  static async getScatterData(): Promise<ScatterData[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.SCATTER_DATA)
        .select("*")
        .order("renewable_percentage", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching scatter data:", error);
      throw error;
    }
  }

  // Get CO2 intensity records
  static async getCo2IntensityRecords(): Promise<Co2IntensityRecord[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.CO2_INTENSITY)
        .select("*")
        .order("recorded_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching CO2 intensity records:", error);
      throw error;
    }
  }

  // Get generation mix records
  static async getGenerationMixRecords(): Promise<GenerationMixRecord[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.GENERATION_MIX)
        .select("*")
        .order("recorded_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching generation mix records:", error);
      throw error;
    }
  }

  // Get net-zero alignment records
  static async getNetZeroAlignmentRecords(): Promise<NetZeroAlignmentRecord[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.NETZERO_ALIGNMENT)
        .select("*")
        .order("recorded_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching net-zero alignment records:", error);
      throw error;
    }
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

  static subscribeToGenerationMix(callback: (payload: any) => void) {
    return supabase
      .channel("generation_mix_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLES.GENERATION_MIX },
        callback
      )
      .subscribe();
  }

  static subscribeToNetZeroAlignment(callback: (payload: any) => void) {
    return supabase
      .channel("netzero_alignment_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLES.NETZERO_ALIGNMENT },
        callback
      )
      .subscribe();
  }
}
