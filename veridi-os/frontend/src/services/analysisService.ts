// Analysis Service - Integrates Python analysis/goal_tracker.py functionality
// Provides goal tracking, RAI calculations, and sustainability metrics

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

class AnalysisService {
  private static instance: AnalysisService;

  static getInstance(): AnalysisService {
    if (!AnalysisService.instance) {
      AnalysisService.instance = new AnalysisService();
    }
    return AnalysisService.instance;
  }

  /**
   * Compute goal tracker metrics - equivalent to Python compute_goal_tracker
   */
  computeGoalTracker(
    co2Data: Co2IntensityRecord[],
    genData: GenerationMixRecord[],
    nzData: NetZeroAlignmentRecord[],
    baseYearFromData: boolean = true
  ): GoalTrackerResult {
    const result: GoalTrackerResult = {};

    if (!co2Data.length || !genData.length) {
      return { error: "insufficient_data" };
    }

    // Convert to UTC timestamps
    const co2Sorted = [...co2Data].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const genSorted = [...genData].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const now = new Date();
    const currentYear = now.getFullYear();

    // Determine base year
    let baseYear = currentYear;
    if (baseYearFromData) {
      if (nzData.length > 0) {
        baseYear = Math.min(...nzData.map((d) => d.year));
      } else {
        const co2MinYear = new Date(co2Sorted[0].timestamp).getFullYear();
        const genMinYear = new Date(genSorted[0].timestamp).getFullYear();
        baseYear = Math.min(co2MinYear, genMinYear);
      }
    }

    // Get current year target emissions
    const currentYearTarget = nzData.find(
      (d) => d.year === currentYear
    )?.target_emissions_mt;
    const annualTargetTons = currentYearTarget
      ? currentYearTarget * 1_000_000
      : null;

    // Latest CO2 intensity
    const latestCo2 = co2Sorted[co2Sorted.length - 1];
    const iLatest = latestCo2.co2_intensity_g_per_kwh;

    // Base intensity from base year
    const baseYearCo2 = co2Sorted.filter(
      (d) => new Date(d.timestamp).getFullYear() === baseYear
    );
    const iBase =
      baseYearCo2.length > 0
        ? this.median(baseYearCo2.map((d) => d.co2_intensity_g_per_kwh))
        : iLatest;

    // Target intensity calculation
    let iTarget: number | null = null;
    if (annualTargetTons) {
      const baseYearActual = nzData.find(
        (d) => d.year === baseYear
      )?.actual_emissions_mt;
      if (baseYearActual && baseYearActual > 0) {
        iTarget = iBase * (annualTargetTons / (baseYearActual * 1_000_000));
      }
    }

    // Real-time Alignment Index
    if (iTarget && iLatest > 0) {
      result.rai_pct = Math.round(((100.0 * iTarget) / iLatest) * 10) / 10;
    }

    // YTD Carbon Budget Tracker
    const currentYearGen = genSorted.filter(
      (d) => new Date(d.timestamp).getFullYear() === currentYear
    );

    if (currentYearGen.length >= 2 && annualTargetTons) {
      // Merge generation and CO2 data
      const merged = this.mergeGenerationAndCo2(currentYearGen, co2Sorted);

      if (merged.length >= 2) {
        const co2YtdTons = merged.reduce((sum, d) => sum + d.tons, 0);

        // Calculate YTD budget
        const startOfYear = new Date(currentYear, 0, 1);
        const daysElapsed = Math.max(
          1,
          (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
        );
        const ytdBudgetTons = annualTargetTons * (daysElapsed / 365);

        const dailyAvgTons = co2YtdTons / daysElapsed;
        const daysAhead =
          dailyAvgTons > 0 ? (ytdBudgetTons - co2YtdTons) / dailyAvgTons : 0;

        result.budget = {
          ytd_tons: Math.round(co2YtdTons),
          ytd_budget_tons: Math.round(ytdBudgetTons),
          days_ahead: Math.round(daysAhead * 10) / 10,
        };
      }
    }

    // Decarbonization velocity
    if (co2Sorted.length >= 10 && iTarget) {
      const velocity = this.calculateVelocity(
        co2Sorted,
        iLatest,
        iTarget,
        currentYear
      );
      if (velocity) {
        result.velocity = velocity;
      }
    }

    // 2050 pathway
    const pathway: any = {};

    if (result.velocity) {
      const vActual = result.velocity.v_actual_g_per_kwh_per_yr;
      if (vActual > 0) {
        const yearsToZero = Math.max(0, iLatest / vActual);
        pathway.eta_year = Math.round(currentYear + yearsToZero);
      }
    }

    if (nzData.length > 0) {
      const series = nzData
        .map((d) => ({
          year: d.year,
          target_emissions_mt: d.target_emissions_mt,
        }))
        .sort((a, b) => a.year - b.year);

      // Add 2050 target if not present
      if (!series.find((s) => s.year === 2050)) {
        series.push({ year: 2050, target_emissions_mt: 0 });
      }

      pathway.series = series;
    }

    if (Object.keys(pathway).length > 0) {
      result.pathway = pathway;
    }

    return result;
  }

  /**
   * Calculate summary metrics for CO2 intensity data
   */
  summarizeCo2Intensity(data: Co2IntensityRecord[]): {
    count: number;
    min_gco2_kwh: number;
    max_gco2_kwh: number;
    avg_gco2_kwh: number;
  } {
    if (!data.length) {
      return { count: 0, min_gco2_kwh: 0, max_gco2_kwh: 0, avg_gco2_kwh: 0 };
    }

    const values = data.map((d) => d.co2_intensity_g_per_kwh);
    return {
      count: data.length,
      min_gco2_kwh: Math.min(...values),
      max_gco2_kwh: Math.max(...values),
      avg_gco2_kwh: values.reduce((sum, val) => sum + val, 0) / values.length,
    };
  }

  /**
   * Calculate summary metrics for generation mix data
   */
  summarizeGenerationMix(data: GenerationMixRecord[]): {
    count: number;
    avg_total_mw: number;
    avg_renewable_share_pct: number;
  } {
    if (!data.length) {
      return { count: 0, avg_total_mw: 0, avg_renewable_share_pct: 0 };
    }

    const renewableShares = data.map((d) => d.renewable_share_pct);
    const totalMw = data.map((d) => d.total_mw);

    return {
      count: data.length,
      avg_total_mw: totalMw.reduce((sum, val) => sum + val, 0) / totalMw.length,
      avg_renewable_share_pct:
        renewableShares.reduce((sum, val) => sum + val, 0) /
        renewableShares.length,
    };
  }

  /**
   * Calculate summary metrics for net-zero alignment data
   */
  summarizeNetZeroAlignment(data: NetZeroAlignmentRecord[]): {
    count: number;
    latest_alignment_pct: number;
  } {
    if (!data.length) {
      return { count: 0, latest_alignment_pct: 0 };
    }

    const sorted = [...data].sort((a, b) => a.year - b.year);
    return {
      count: data.length,
      latest_alignment_pct: sorted[sorted.length - 1].alignment_pct,
    };
  }

  // Helper methods
  private median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private mergeGenerationAndCo2(
    genData: GenerationMixRecord[],
    co2Data: Co2IntensityRecord[]
  ): Array<{ timestamp: Date; mwh: number; tons: number }> {
    const merged: Array<{ timestamp: Date; mwh: number; tons: number }> = [];

    for (let i = 1; i < genData.length; i++) {
      const current = genData[i];
      const previous = genData[i - 1];

      const currentTime = new Date(current.timestamp);
      const previousTime = new Date(previous.timestamp);

      // Find closest CO2 intensity
      const closestCo2 = co2Data.reduce((closest, co2) => {
        const co2Time = new Date(co2.timestamp);
        const closestTime = new Date(closest.timestamp);
        const currentDiff = Math.abs(currentTime.getTime() - co2Time.getTime());
        const closestDiff = Math.abs(
          currentTime.getTime() - closestTime.getTime()
        );
        return currentDiff < closestDiff ? co2 : closest;
      });

      const dtHours =
        (currentTime.getTime() - previousTime.getTime()) / (1000 * 60 * 60);
      const mwh = current.total_mw * dtHours;
      const tons = mwh * closestCo2.co2_intensity_g_per_kwh * 0.001;

      merged.push({
        timestamp: currentTime,
        mwh,
        tons,
      });
    }

    return merged;
  }

  private calculateVelocity(
    co2Data: Co2IntensityRecord[],
    iLatest: number,
    iTarget: number,
    currentYear: number
  ): {
    v_actual_g_per_kwh_per_yr: number;
    v_required_g_per_kwh_per_yr: number;
    on_track: boolean;
  } | null {
    // Use last 7 days of data for velocity calculation
    const endTime = new Date(co2Data[co2Data.length - 1].timestamp);
    const startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentData = co2Data.filter(
      (d) => new Date(d.timestamp) >= startTime
    );

    if (recentData.length < 10) {
      return null;
    }

    // Calculate slope (linear regression)
    const times = recentData.map((d) => new Date(d.timestamp).getTime());
    const values = recentData.map((d) => d.co2_intensity_g_per_kwh);

    const slope = this.calculateSlope(times, values);
    const vActual = -slope * 365 * 24 * 60 * 60 * 1000; // Convert to g/kWh per year

    // Required velocity to reach target by year-end
    const endOfYear = new Date(currentYear + 1, 0, 1);
    const daysLeft = Math.max(
      1,
      (endOfYear.getTime() - endTime.getTime()) / (1000 * 60 * 60 * 24)
    );
    const vRequired = Math.max(0, (iLatest - iTarget) * (365 / daysLeft));

    return {
      v_actual_g_per_kwh_per_yr: Math.round(vActual * 10) / 10,
      v_required_g_per_kwh_per_yr: Math.round(vRequired * 10) / 10,
      on_track: vActual >= vRequired,
    };
  }

  private calculateSlope(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);

    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }
}

// Export singleton instance
export const analysisService = AnalysisService.getInstance();
export default analysisService;
