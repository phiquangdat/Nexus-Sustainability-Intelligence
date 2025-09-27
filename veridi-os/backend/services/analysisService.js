const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");

class AnalysisService {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
  }

  /**
   * Fetch data from Supabase table
   */
  async fetchTable(tableName, limit = 1000, order = "timestamp") {
    try {
      const { data, error } = await this.supabase
        .from(tableName)
        .select("*")
        .order(order, { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Summarize CO2 intensity data
   */
  summarizeCo2(data) {
    if (!data || data.length === 0) {
      return { count: 0 };
    }

    const intensities = data.map((d) => d.co2_intensity_g_per_kwh);
    return {
      count: data.length,
      min_gco2_kwh: Math.min(...intensities),
      max_gco2_kwh: Math.max(...intensities),
      avg_gco2_kwh: intensities.reduce((a, b) => a + b, 0) / intensities.length,
    };
  }

  /**
   * Summarize generation mix data
   */
  summarizeGenerationMix(data) {
    if (!data || data.length === 0) {
      return { count: 0 };
    }

    const totalMw = data.map((d) => d.total_mw);
    const renewableShares = data.map((d) => d.renewable_share_pct);

    return {
      count: data.length,
      avg_total_mw: totalMw.reduce((a, b) => a + b, 0) / totalMw.length,
      avg_renewable_share_pct:
        renewableShares.reduce((a, b) => a + b, 0) / renewableShares.length,
    };
  }

  /**
   * Summarize net-zero alignment data
   */
  summarizeNetZero(data) {
    if (!data || data.length === 0) {
      return { count: 0 };
    }

    const sortedData = data.sort((a, b) => a.year - b.year);
    return {
      count: data.length,
      latest_alignment_pct: sortedData[sortedData.length - 1].alignment_pct,
    };
  }

  /**
   * Compute goal tracker metrics
   */
  async computeGoalTracker(co2Data, genData, nzData) {
    if (!co2Data || co2Data.length === 0 || !genData || genData.length === 0) {
      return { error: "insufficient_data" };
    }

    const result = {};
    const now = new Date();
    const currentYear = now.getFullYear();

    // Sort data by timestamp
    const sortedCo2 = co2Data.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    const sortedGen = genData.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Get latest CO2 intensity
    const latestCo2 = sortedCo2[sortedCo2.length - 1];
    const I_latest = latestCo2.co2_intensity_g_per_kwh;

    // Find base year from data
    const baseYear = Math.min(
      new Date(sortedCo2[0].timestamp).getFullYear(),
      new Date(sortedGen[0].timestamp).getFullYear()
    );

    // Get annual target for current year
    const currentYearTarget = nzData.find((d) => d.year === currentYear);
    const annualTargetTons = currentYearTarget
      ? currentYearTarget.target_emissions_mt * 1000000
      : null;

    // Calculate base intensity
    const baseYearCo2 = sortedCo2.filter(
      (d) => new Date(d.timestamp).getFullYear() === baseYear
    );
    const I_base =
      baseYearCo2.length > 0
        ? baseYearCo2.reduce((sum, d) => sum + d.co2_intensity_g_per_kwh, 0) /
          baseYearCo2.length
        : I_latest;

    // Calculate target intensity
    let I_target = null;
    if (annualTargetTons && currentYearTarget) {
      const baseYearActual = nzData.find((d) => d.year === baseYear);
      if (baseYearActual && baseYearActual.actual_emissions_mt > 0) {
        I_target =
          I_base *
          (annualTargetTons / (baseYearActual.actual_emissions_mt * 1000000));
      }
    }

    // Real-time Alignment Index
    if (I_target && I_latest > 0) {
      result.rai_pct = Math.round(((100.0 * I_target) / I_latest) * 10) / 10;
    }

    // YTD Carbon Budget
    const currentYearGen = sortedGen.filter(
      (d) => new Date(d.timestamp).getFullYear() === currentYear
    );
    if (currentYearGen.length >= 2 && annualTargetTons) {
      let totalEmissions = 0;

      for (let i = 1; i < currentYearGen.length; i++) {
        const prev = currentYearGen[i - 1];
        const curr = currentYearGen[i];

        // Find corresponding CO2 intensity
        const co2Record = sortedCo2.find(
          (c) =>
            Math.abs(new Date(c.timestamp) - new Date(curr.timestamp)) <
            20 * 60 * 1000 // 20 minutes tolerance
        );

        if (co2Record) {
          const dtHours =
            (new Date(curr.timestamp) - new Date(prev.timestamp)) /
            (1000 * 60 * 60);
          const mwh = curr.total_mw * dtHours;
          const tons = mwh * co2Record.co2_intensity_g_per_kwh * 0.001;
          totalEmissions += tons;
        }
      }

      const startOfYear = new Date(currentYear, 0, 1);
      const daysElapsed = Math.max(
        1,
        (now - startOfYear) / (1000 * 60 * 60 * 24)
      );
      const ytdBudgetTons = annualTargetTons * (daysElapsed / 365);
      const dailyAvgTons = totalEmissions / daysElapsed;
      const daysAhead =
        dailyAvgTons > 0 ? (ytdBudgetTons - totalEmissions) / dailyAvgTons : 0;

      result.budget = {
        ytd_tons: Math.round(totalEmissions),
        ytd_budget_tons: Math.round(ytdBudgetTons),
        days_ahead: Math.round(daysAhead * 10) / 10,
      };
    }

    // Decarbonization velocity
    if (sortedCo2.length >= 10 && I_target) {
      const endTime = new Date(sortedCo2[sortedCo2.length - 1].timestamp);
      const startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

      const recentCo2 = sortedCo2.filter(
        (d) => new Date(d.timestamp) >= startTime
      );

      if (recentCo2.length >= 10) {
        // Simple linear regression for slope
        const n = recentCo2.length;
        const x = recentCo2.map((d, i) => i);
        const y = recentCo2.map((d) => d.co2_intensity_g_per_kwh);

        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const vActual = -slope * 365; // g/kWh per year

        const endOfYear = new Date(currentYear + 1, 0, 1);
        const daysLeft = Math.max(
          1,
          (endOfYear - endTime) / (1000 * 60 * 60 * 24)
        );
        const vRequired = Math.max(0, (I_latest - I_target) * (365 / daysLeft));

        result.velocity = {
          v_actual_g_per_kwh_per_yr: Math.round(vActual * 10) / 10,
          v_required_g_per_kwh_per_yr: Math.round(vRequired * 10) / 10,
          on_track: vActual >= vRequired,
        };

        // ETA to near-zero
        if (vActual > 0) {
          const yearsToZero = Math.max(0, I_latest / vActual);
          result.pathway = {
            eta_year: Math.round(currentYear + yearsToZero),
          };
        }
      }
    }

    // Pathway series
    if (nzData && nzData.length > 0) {
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

      if (result.pathway) {
        result.pathway.series = series;
      } else {
        result.pathway = { series };
      }
    }

    return result;
  }

  /**
   * Get comprehensive analysis
   */
  async getAnalysis(limit = 1000) {
    try {
      const [co2Data, genData, nzData] = await Promise.all([
        this.fetchTable("co2_intensity", limit),
        this.fetchTable("generation_mix", limit),
        this.fetchTable("netzero_alignment", 100),
      ]);

      const summaries = {
        co2: this.summarizeCo2(co2Data),
        generation_mix: this.summarizeGenerationMix(genData),
        netzero_alignment: this.summarizeNetZero(nzData),
      };

      const goalTracker = await this.computeGoalTracker(
        co2Data,
        genData,
        nzData
      );

      return {
        summaries,
        goalTracker,
        rawData: {
          co2: co2Data,
          generation_mix: genData,
          netzero_alignment: nzData,
        },
      };
    } catch (error) {
      console.error("Error in analysis:", error);
      throw error;
    }
  }
}

module.exports = AnalysisService;
