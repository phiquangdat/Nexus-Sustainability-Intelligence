// Fallback service for when Supabase is not configured
import { mockDataService } from './mockDataService';
import type { PowerPlantData, EUETSReport } from "../types";

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && key && url !== 'your_supabase_project_url_here' && key !== 'your_supabase_anon_key_here';
};

// Fallback service that uses mock data when Supabase is not available
export const dataService = {
  async getPowerPlantData(): Promise<PowerPlantData[]> {
    if (isSupabaseConfigured()) {
      try {
        // Try to import Supabase dynamically
        const supabaseModule = await import("../lib/supabase").catch(
          () => null
        );
        if (supabaseModule?.supabaseHelpers) {
          return await supabaseModule.supabaseHelpers.getAllPowerPlantData(
            1000
          );
        }
        throw new Error("Supabase module not available");
      } catch (error) {
        console.warn(
          "Supabase not available, falling back to mock data:",
          error
        );
        return await mockDataService.getPowerPlantData();
      }
    } else {
      console.log("Supabase not configured, using mock data");
      return await mockDataService.getPowerPlantData();
    }
  },

  async getEUETSReport(): Promise<EUETSReport> {
    if (isSupabaseConfigured()) {
      try {
        // Try to import Supabase dynamically
        const supabaseModule = await import("../lib/supabase").catch(
          () => null
        );
        if (supabaseModule?.supabaseHelpers && supabaseModule?.typedSupabase) {
          // Calculate emissions from database
          const { data: emissionsData } = await supabaseModule.typedSupabase
            .from("power_plant_data")
            .select("co2_emissions_tonnes")
            .gte("timestamp", "2024-07-01")
            .lt("timestamp", "2024-10-01");

          const totalEmissions =
            emissionsData?.reduce(
              (sum: number, record: any) => sum + record.co2_emissions_tonnes,
              0
            ) || 0;

          const reportData = {
            reporting_period: "Q3 2024",
            total_emissions_tonnes: Math.round(totalEmissions * 100) / 100,
            status: (totalEmissions < 20000 ? "Compliant" : "Non-Compliant") as
              | "Compliant"
              | "Non-Compliant",
            generated_at: new Date().toISOString(),
          };

          return await supabaseModule.supabaseHelpers.generateEUETSReport(
            reportData
          );
        }
        throw new Error("Supabase module not available");
      } catch (error) {
        console.warn(
          "Supabase not available, falling back to mock data:",
          error
        );
        return await mockDataService.getEUETSReport();
      }
    } else {
      console.log("Supabase not configured, using mock data");
      return await mockDataService.getEUETSReport();
    }
  },

  async getEUETSReports(): Promise<EUETSReport[]> {
    if (isSupabaseConfigured()) {
      try {
        // Try to import Supabase dynamically
        const supabaseModule = await import("../lib/supabase").catch(
          () => null
        );
        if (supabaseModule?.supabaseHelpers) {
          return await supabaseModule.supabaseHelpers.getEUETSReports(50);
        }
        throw new Error("Supabase module not available");
      } catch (error) {
        console.warn(
          "Supabase not available, falling back to mock data:",
          error
        );
        return [await mockDataService.getEUETSReport()];
      }
    } else {
      console.log("Supabase not configured, returning mock report");
      return [await mockDataService.getEUETSReport()];
    }
  },
};
