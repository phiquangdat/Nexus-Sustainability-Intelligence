// Data Analysis Service - Frontend integration of Python analysis module
// Integrates goal_tracker.py, metrics.py, and data_access.py functionality

import type {
  Co2IntensityRecord,
  GenerationMixRecord,
  NetZeroAlignmentRecord,
} from "./supabaseService";

export interface GoalTrackerBudget {
  ytd_tons: number;
  ytd_budget_tons: number;
  days_ahead: number;
}

export interface GoalTrackerVelocity {
  v_actual_g_per_kwh_per_yr: number;
  v_required_g_per_kwh_per_yr: number;
  on_track: boolean;
}

export interface GoalTrackerPathway {
  eta_year?: number;
  series: Array<{
    year: number;
    target_emissions_mt: number;
  }>;
}

export interface GoalTracker {
  rai_pct?: number;
  budget?: GoalTrackerBudget;
  velocity?: GoalTrackerVelocity;
  pathway?: GoalTrackerPathway;
  error?: string;
}

export interface Co2IntensitySummary {
  count: number;
  min_gco2_kwh: number;
  max_gco2_kwh: number;
  avg_gco2_kwh: number;
}

export interface GenerationMixSummary {
  count: number;
  avg_total_mw: number;
  avg_renewable_share_pct: number;
}

export interface NetZeroSummary {
  count: number;
  latest_alignment_pct: number;
}

class DataAnalysisService {
  private currentYear: number;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  // Convert timestamp to UTC Date (unused but kept for compatibility)
  // private toUTC(timestamp: string): Date {
  //   return new Date(timestamp);
  // }

  // Compute goal tracker metrics - JavaScript implementation of Python goal_tracker.py
  public computeGoalTracker(
    co2Data: Co2IntensityRecord[],
    genData: GenerationMixRecord[],
    netZeroData: NetZeroAlignmentRecord[],
    baseYearFromData: boolean = true
  ): GoalTracker {
    const result: GoalTracker = {};

    if (!co2Data || !genData || co2Data.length === 0 || genData.length === 0) {
      return { error: "insufficient_data" };
    }

    // Sort data by timestamp
    const co2Sorted = [...co2Data].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const genSorted = [...genData].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Determine base year
    let baseYear = this.currentYear;
    if (baseYearFromData) {
      if (netZeroData && netZeroData.length > 0) {
        baseYear = Math.min(...netZeroData.map((d) => d.year));
      } else {
        const co2MinYear = Math.min(
          ...co2Sorted.map((d) => new Date(d.timestamp).getFullYear())
        );
        const genMinYear = Math.min(
          ...genSorted.map((d) => new Date(d.timestamp).getFullYear())
        );
        baseYear = Math.min(co2MinYear, genMinYear);
      }
    }

    // Get target emissions for current year
    let annualTargetTons: number | null = null;
    if (netZeroData && netZeroData.length > 0) {
      const currentYearData = netZeroData.find(
        (d) => d.year === this.currentYear
      );
      if (currentYearData) {
        annualTargetTons = currentYearData.target_emissions_mt * 1000000; // Convert Mt to tons
      }
    }

    // Get latest CO2 intensity
    const latestCo2 = co2Sorted[co2Sorted.length - 1];
    const I_latest = latestCo2.co2_intensity_g_per_kwh;

    // Estimate base intensity
    let I_base = I_latest;
    const baseYearData = co2Sorted.filter(
      (d) => new Date(d.timestamp).getFullYear() === baseYear
    );
    if (baseYearData.length > 0) {
      const intensities = baseYearData.map((d) => d.co2_intensity_g_per_kwh);
      intensities.sort((a, b) => a - b);
      I_base = intensities[Math.floor(intensities.length / 2)]; // Median
    }

    // Estimate target intensity for current year
    let I_target: number | null = null;
    if (annualTargetTons && netZeroData && netZeroData.length > 0) {
      const baseYearNetZero = netZeroData.find((d) => d.year === baseYear);
      if (baseYearNetZero && baseYearNetZero.actual_emissions_mt > 0) {
        I_target =
          I_base *
          (annualTargetTons / (baseYearNetZero.actual_emissions_mt * 1000000));
      }
    }

    // Real-time Alignment Index
    if (I_target && I_latest > 0) {
      result.rai_pct = Math.round(((100.0 * I_target) / I_latest) * 10) / 10;
    }

    // YTD Carbon Budget Tracker
    const thisYearGenData = genSorted.filter(
      (d) => new Date(d.timestamp).getFullYear() === this.currentYear
    );

    if (thisYearGenData.length >= 2 && annualTargetTons) {
      let totalEmissionsTons = 0;

      for (let i = 1; i < thisYearGenData.length; i++) {
        const prev = thisYearGenData[i - 1];
        const curr = thisYearGenData[i];

        const timeDiff = Math.abs(
          new Date(curr.timestamp).getTime() -
            new Date(prev.timestamp).getTime()
        );
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        // Find nearest CO2 data point
        let co2Intensity = I_latest;
        for (const co2 of co2Sorted) {
          const co2Time = new Date(co2.timestamp).getTime();
          const genTime = new Date(curr.timestamp).getTime();
          if (Math.abs(co2Time - genTime) <= 20 * 60 * 1000) {
            // 20 minutes tolerance
            co2Intensity = co2.co2_intensity_g_per_kwh;
            break;
          }
        }

        const mwh = curr.total_mw * hoursDiff;
        const tons = mwh * co2Intensity * 0.001; // Convert g/kWh to tons
        totalEmissionsTons += tons;
      }

      // Calculate YTD budget
      const startOfYear = new Date(this.currentYear, 0, 1);
      const now = new Date();
      const daysElapsed = Math.max(
        1,
        (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
      );
      const ytdBudgetTons = annualTargetTons * (daysElapsed / 365);

      const dailyAvgTons = totalEmissionsTons / daysElapsed;
      const daysAhead =
        dailyAvgTons > 0
          ? (ytdBudgetTons - totalEmissionsTons) / dailyAvgTons
          : 0;

      result.budget = {
        ytd_tons: Math.round(totalEmissionsTons),
        ytd_budget_tons: Math.round(ytdBudgetTons),
        days_ahead: Math.round(daysAhead * 10) / 10,
      };
    }

    // Decarbonization Velocity
    if (co2Sorted.length >= 10 && I_target) {
      // Use last 7 days of data for velocity calculation
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentData = co2Sorted.filter(
        (d) => new Date(d.timestamp) >= sevenDaysAgo
      );

      if (recentData.length >= 10) {
        // Simple linear regression for slope
        const n = recentData.length;
        const x = recentData.map((_, i) => i);
        const y = recentData.map((d) => d.co2_intensity_g_per_kwh);

        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const slopePerDay = slope; // Assuming data points are daily
        const v_actual = -slopePerDay * 365; // g/kWh per year (positive means decreasing)

        // Required velocity to reach target by year-end
        const endOfYear = new Date(this.currentYear + 1, 0, 1);
        const daysLeft = Math.max(
          1,
          (endOfYear.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        const v_required = Math.max(
          0,
          (I_latest - I_target) * (365 / daysLeft)
        );

        result.velocity = {
          v_actual_g_per_kwh_per_yr: Math.round(v_actual * 10) / 10,
          v_required_g_per_kwh_per_yr: Math.round(v_required * 10) / 10,
          on_track: v_actual >= v_required,
        };
      }
    }

    // 2050 Pathway
    const pathway: GoalTrackerPathway = {
      series: [],
    };

    // ETA to near-zero
    if (result.velocity && result.velocity.v_actual_g_per_kwh_per_yr > 0) {
      const yearsToZero = I_latest / result.velocity.v_actual_g_per_kwh_per_yr;
      pathway.eta_year = Math.round(this.currentYear + yearsToZero);
    }

    // Target series
    if (netZeroData && netZeroData.length > 0) {
      const series = [...netZeroData]
        .filter((d) => d.target_emissions_mt !== null)
        .map((d) => ({
          year: d.year,
          target_emissions_mt: d.target_emissions_mt,
        }));

      // Ensure 2050 target is 0
      if (!series.find((d) => d.year === 2050)) {
        series.push({ year: 2050, target_emissions_mt: 0.0 });
      }

      series.sort((a, b) => a.year - b.year);
      pathway.series = series;
    }

    if (Object.keys(pathway).length > 0) {
      result.pathway = pathway;
    }

    return result;
  }

  // Summarize CO2 intensity data - JavaScript implementation of Python metrics.py
  public summarizeCo2Intensity(
    data: Co2IntensityRecord[]
  ): Co2IntensitySummary {
    if (!data || data.length === 0) {
      return { count: 0, min_gco2_kwh: 0, max_gco2_kwh: 0, avg_gco2_kwh: 0 };
    }

    const intensities = data.map((d) => d.co2_intensity_g_per_kwh);
    return {
      count: data.length,
      min_gco2_kwh: Math.min(...intensities),
      max_gco2_kwh: Math.max(...intensities),
      avg_gco2_kwh:
        intensities.reduce((sum, val) => sum + val, 0) / intensities.length,
    };
  }

  // Summarize generation mix data
  public summarizeGenerationMix(
    data: GenerationMixRecord[]
  ): GenerationMixSummary {
    if (!data || data.length === 0) {
      return { count: 0, avg_total_mw: 0, avg_renewable_share_pct: 0 };
    }

    const totalMW = data.map((d) => d.total_mw);
    const renewableShares = data.map((d) => d.renewable_share_pct);

    return {
      count: data.length,
      avg_total_mw: totalMW.reduce((sum, val) => sum + val, 0) / totalMW.length,
      avg_renewable_share_pct:
        renewableShares.reduce((sum, val) => sum + val, 0) /
        renewableShares.length,
    };
  }

  // Summarize net-zero alignment data
  public summarizeNetZeroAlignment(
    data: NetZeroAlignmentRecord[]
  ): NetZeroSummary {
    if (!data || data.length === 0) {
      return { count: 0, latest_alignment_pct: 0 };
    }

    const sortedData = [...data].sort((a, b) => a.year - b.year);
    return {
      count: data.length,
      latest_alignment_pct: sortedData[sortedData.length - 1].alignment_pct,
    };
  }

  // Calculate correlation between renewable share and CO2 intensity
  public calculateRenewableCo2Correlation(
    genData: GenerationMixRecord[],
    co2Data: Co2IntensityRecord[]
  ): { correlation: number; trendline: { slope: number; intercept: number } } {
    if (!genData || !co2Data || genData.length === 0 || co2Data.length === 0) {
      return { correlation: 0, trendline: { slope: 0, intercept: 0 } };
    }

    // Merge data by timestamp
    const mergedData: Array<{
      renewable_share: number;
      co2_intensity: number;
    }> = [];

    for (const gen of genData) {
      const genTime = new Date(gen.timestamp).getTime();
      let closestCo2: Co2IntensityRecord | null = null;
      let minTimeDiff = Infinity;

      for (const co2 of co2Data) {
        const co2Time = new Date(co2.timestamp).getTime();
        const timeDiff = Math.abs(genTime - co2Time);
        if (timeDiff < minTimeDiff && timeDiff <= 20 * 60 * 1000) {
          // 20 minutes tolerance
          minTimeDiff = timeDiff;
          closestCo2 = co2;
        }
      }

      if (closestCo2) {
        mergedData.push({
          renewable_share: gen.renewable_share_pct,
          co2_intensity: closestCo2.co2_intensity_g_per_kwh,
        });
      }
    }

    if (mergedData.length < 2) {
      return { correlation: 0, trendline: { slope: 0, intercept: 0 } };
    }

    // Calculate correlation coefficient
    const n = mergedData.length;
    const sumX = mergedData.reduce((sum, d) => sum + d.renewable_share, 0);
    const sumY = mergedData.reduce((sum, d) => sum + d.co2_intensity, 0);
    const sumXY = mergedData.reduce(
      (sum, d) => sum + d.renewable_share * d.co2_intensity,
      0
    );
    const sumXX = mergedData.reduce(
      (sum, d) => sum + d.renewable_share * d.renewable_share,
      0
    );
    const sumYY = mergedData.reduce(
      (sum, d) => sum + d.co2_intensity * d.co2_intensity,
      0
    );

    const correlation =
      (n * sumXY - sumX * sumY) /
      Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    // Calculate trendline (linear regression)
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return {
      correlation: Math.round(correlation * 1000) / 1000,
      trendline: {
        slope: Math.round(slope * 1000) / 1000,
        intercept: Math.round(intercept * 1000) / 1000,
      },
    };
  }
}

// Export singleton instance
export const dataAnalysisService = new DataAnalysisService();
export default dataAnalysisService;
