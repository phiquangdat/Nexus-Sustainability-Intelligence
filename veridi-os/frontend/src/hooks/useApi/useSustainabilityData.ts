// Comprehensive Data Management Hook
// Integrates Supabase, Analysis, and Simulator services

import { useState, useEffect, useCallback, useRef } from "react";
import { supabaseService } from "../services/supabaseService";
import { dataAnalysisService } from "../services/dataAnalysisService";
import { dataSimulatorService } from "../services/dataSimulatorService";
import type {
  Co2IntensityRecord,
  GenerationMixRecord,
  NetZeroAlignmentRecord,
} from "../services/supabaseService";
import type { GoalTracker } from "../services/dataAnalysisService";
import type { SimulationData } from "../services/dataSimulatorService";

export interface DataState {
  co2Data: Co2IntensityRecord[];
  genData: GenerationMixRecord[];
  netZeroData: NetZeroAlignmentRecord[];
  goalTracker: GoalTracker;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  dataSource: "supabase" | "simulated";
}

export interface DataConfig {
  timeRange: "24h" | "7d" | "30d";
  useSimulatedData: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // milliseconds
}

export const useSustainabilityData = (config: DataConfig) => {
  const [state, setState] = useState<DataState>({
    co2Data: [],
    genData: [],
    netZeroData: [],
    goalTracker: {},
    loading: true,
    error: null,
    lastUpdated: null,
    dataSource: "simulated",
  });

  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subscriptionsRef = useRef<any[]>([]);

  // Calculate data limit based on time range
  const getDataLimit = useCallback((timeRange: string) => {
    switch (timeRange) {
      case "24h":
        return 96; // 15-minute intervals
      case "7d":
        return 96 * 7;
      case "30d":
        return 96 * 30;
      default:
        return 96;
    }
  }, []);

  // Fetch data from appropriate source
  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const limit = getDataLimit(config.timeRange);
      let data: SimulationData;

      if (config.useSimulatedData || !supabaseService.isEnabled()) {
        // Use simulated data
        data = dataSimulatorService.generateAllData(limit);
        setState((prev) => ({ ...prev, dataSource: "simulated" }));
      } else {
        // Fetch from Supabase
        const [co2Data, genData, netZeroData] = await Promise.all([
          supabaseService.fetchCo2IntensityData(limit),
          supabaseService.fetchGenerationMixData(limit),
          supabaseService.fetchNetZeroAlignmentData(100),
        ]);

        data = {
          co2Intensity: co2Data,
          generationMix: genData,
          netZeroAlignment: netZeroData,
        };
        setState((prev) => ({ ...prev, dataSource: "supabase" }));
      }

      // Compute goal tracker metrics
      const goalTracker = dataAnalysisService.computeGoalTracker(
        data.co2Intensity,
        data.generationMix,
        data.netZeroAlignment
      );

      setState((prev) => ({
        ...prev,
        co2Data: data.co2Intensity,
        genData: data.generationMix,
        netZeroData: data.netZeroAlignment,
        goalTracker,
        loading: false,
        lastUpdated: new Date(),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch data";
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      console.error("Error fetching sustainability data:", error);
    }
  }, [config.timeRange, config.useSimulatedData, getDataLimit]);

  // Set up real-time subscriptions
  const setupSubscriptions = useCallback(() => {
    // Clear existing subscriptions
    subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
    subscriptionsRef.current = [];

    if (!config.useSimulatedData && supabaseService.isEnabled()) {
      const subscriptions = [
        supabaseService.subscribeToCo2Intensity((payload) => {
          console.log("CO2 intensity update:", payload);
          fetchData();
        }),
        supabaseService.subscribeToGenerationMix((payload) => {
          console.log("Generation mix update:", payload);
          fetchData();
        }),
        supabaseService.subscribeToNetZeroAlignment((payload) => {
          console.log("Net-zero alignment update:", payload);
          fetchData();
        }),
      ];

      subscriptionsRef.current = subscriptions;
    }
  }, [config.useSimulatedData, fetchData]);

  // Set up auto-refresh
  const setupAutoRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    if (config.autoRefresh && config.refreshInterval > 0) {
      refreshTimeoutRef.current = setTimeout(() => {
        fetchData();
        setupAutoRefresh(); // Schedule next refresh
      }, config.refreshInterval);
    }
  }, [config.autoRefresh, config.refreshInterval, fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up subscriptions when config changes
  useEffect(() => {
    setupSubscriptions();
  }, [setupSubscriptions]);

  // Set up auto-refresh when config changes
  useEffect(() => {
    setupAutoRefresh();
  }, [setupAutoRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
    };
  }, []);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Generate new simulated data
  const generateNewSimulatedData = useCallback(() => {
    if (config.useSimulatedData) {
      const limit = getDataLimit(config.timeRange);
      const newData = dataSimulatorService.generateAllData(limit);

      const goalTracker = dataAnalysisService.computeGoalTracker(
        newData.co2Intensity,
        newData.generationMix,
        newData.netZeroAlignment
      );

      setState((prev) => ({
        ...prev,
        co2Data: newData.co2Intensity,
        genData: newData.generationMix,
        netZeroData: newData.netZeroAlignment,
        goalTracker,
        lastUpdated: new Date(),
      }));
    }
  }, [config.useSimulatedData, config.timeRange, getDataLimit]);

  // Export data to CSV
  const exportData = useCallback(() => {
    const csvData = dataSimulatorService.exportToCSV({
      co2Intensity: state.co2Data,
      generationMix: state.genData,
      netZeroAlignment: state.netZeroData,
    });

    // Create download links
    const downloadFile = (content: string, filename: string) => {
      const blob = new Blob([content], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    };

    downloadFile(csvData.co2Intensity, "co2_intensity.csv");
    downloadFile(csvData.generationMix, "generation_mix.csv");
    downloadFile(csvData.netZeroAlignment, "netzero_alignment.csv");
  }, [state.co2Data, state.genData, state.netZeroData]);

  // Get summary statistics
  const getSummaryStats = useCallback(() => {
    const co2Summary = dataAnalysisService.summarizeCo2Intensity(state.co2Data);
    const genSummary = dataAnalysisService.summarizeGenerationMix(
      state.genData
    );
    const netZeroSummary = dataAnalysisService.summarizeNetZeroAlignment(
      state.netZeroData
    );

    return {
      co2: co2Summary,
      generation: genSummary,
      netZero: netZeroSummary,
    };
  }, [state.co2Data, state.genData, state.netZeroData]);

  // Get correlation analysis
  const getCorrelationAnalysis = useCallback(() => {
    return dataAnalysisService.calculateRenewableCo2Correlation(
      state.genData,
      state.co2Data
    );
  }, [state.genData, state.co2Data]);

  return {
    ...state,
    refresh,
    generateNewSimulatedData,
    exportData,
    getSummaryStats,
    getCorrelationAnalysis,
    isSupabaseAvailable: supabaseService.isEnabled(),
    supabaseConfig: supabaseService.getConfig(),
  };
};

export default useSustainabilityData;
