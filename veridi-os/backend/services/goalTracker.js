// Goal Tracker Algorithm - JavaScript implementation of Python goal_tracker.py
// This implements the same logic as the Python version for sustainability intelligence

class GoalTracker {
  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  // Convert timestamp to UTC Date
  toUTC(timestamp) {
    return new Date(timestamp);
  }

  // Compute goal tracker metrics
  computeGoalTracker(co2Data, genData, netZeroData, baseYearFromData = true) {
    const result = {};
    
    if (!co2Data || !genData || co2Data.length === 0 || genData.length === 0) {
      return { error: "insufficient_data" };
    }

    // Sort data by timestamp
    const co2Sorted = [...co2Data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const genSorted = [...genData].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Determine base year
    let baseYear = this.currentYear;
    if (baseYearFromData) {
      if (netZeroData && netZeroData.length > 0) {
        baseYear = Math.min(...netZeroData.map(d => d.year));
      } else {
        const co2MinYear = Math.min(...co2Sorted.map(d => new Date(d.timestamp).getFullYear()));
        const genMinYear = Math.min(...genSorted.map(d => new Date(d.timestamp).getFullYear()));
        baseYear = Math.min(co2MinYear, genMinYear);
      }
    }

    // Get target emissions for current year
    let annualTargetTons = null;
    if (netZeroData && netZeroData.length > 0) {
      const currentYearData = netZeroData.find(d => d.year === this.currentYear);
      if (currentYearData) {
        annualTargetTons = currentYearData.target_emissions_mt * 1000000; // Convert Mt to tons
      }
    }

    // Get latest CO2 intensity
    const latestCo2 = co2Sorted[co2Sorted.length - 1];
    const I_latest = latestCo2.co2_intensity_g_per_kwh;

    // Estimate base intensity
    let I_base = I_latest;
    const baseYearData = co2Sorted.filter(d => new Date(d.timestamp).getFullYear() === baseYear);
    if (baseYearData.length > 0) {
      const intensities = baseYearData.map(d => d.co2_intensity_g_per_kwh);
      intensities.sort((a, b) => a - b);
      I_base = intensities[Math.floor(intensities.length / 2)]; // Median
    }

    // Estimate target intensity for current year
    let I_target = null;
    if (annualTargetTons && netZeroData && netZeroData.length > 0) {
      const baseYearNetZero = netZeroData.find(d => d.year === baseYear);
      if (baseYearNetZero && baseYearNetZero.actual_emissions_mt > 0) {
        I_target = I_base * (annualTargetTons / (baseYearNetZero.actual_emissions_mt * 1000000));
      }
    }

    // Real-time Alignment Index
    if (I_target && I_latest > 0) {
      result.rai_pct = Math.round((100.0 * I_target / I_latest) * 10) / 10;
    }

    // YTD Carbon Budget Tracker
    const thisYearGenData = genSorted.filter(d => new Date(d.timestamp).getFullYear() === this.currentYear);
    if (thisYearGenData.length >= 2 && annualTargetTons) {
      let totalEmissionsTons = 0;
      
      for (let i = 1; i < thisYearGenData.length; i++) {
        const prev = thisYearGenData[i - 1];
        const curr = thisYearGenData[i];
        
        // Find corresponding CO2 intensity
        const timeDiff = Math.abs(new Date(curr.timestamp) - new Date(prev.timestamp));
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        // Find nearest CO2 data point
        let co2Intensity = I_latest;
        for (const co2 of co2Sorted) {
          const co2Time = new Date(co2.timestamp);
          const genTime = new Date(curr.timestamp);
          if (Math.abs(co2Time - genTime) <= 20 * 60 * 1000) { // 20 minutes tolerance
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
      const daysElapsed = Math.max(1, (now - startOfYear) / (1000 * 60 * 60 * 24));
      const ytdBudgetTons = annualTargetTons * (daysElapsed / 365);
      
      const dailyAvgTons = totalEmissionsTons / daysElapsed;
      const daysAhead = dailyAvgTons > 0 ? (ytdBudgetTons - totalEmissionsTons) / dailyAvgTons : 0;

      result.budget = {
        ytd_tons: Math.round(totalEmissionsTons),
        ytd_budget_tons: Math.round(ytdBudgetTons),
        days_ahead: Math.round(daysAhead * 10) / 10
      };
    }

    // Decarbonization Velocity
    if (co2Sorted.length >= 10 && I_target) {
      // Use last 7 days of data for velocity calculation
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentData = co2Sorted.filter(d => new Date(d.timestamp) >= sevenDaysAgo);
      
      if (recentData.length >= 10) {
        // Simple linear regression for slope
        const n = recentData.length;
        const x = recentData.map((d, i) => i);
        const y = recentData.map(d => d.co2_intensity_g_per_kwh);
        
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const slopePerDay = slope; // Assuming data points are daily
        const v_actual = -slopePerDay * 365; // g/kWh per year (positive means decreasing)
        
        // Required velocity to reach target by year-end
        const endOfYear = new Date(this.currentYear + 1, 0, 1);
        const daysLeft = Math.max(1, (endOfYear - new Date()) / (1000 * 60 * 60 * 24));
        const v_required = Math.max(0, (I_latest - I_target) * (365 / daysLeft));
        
        result.velocity = {
          v_actual_g_per_kwh_per_yr: Math.round(v_actual * 10) / 10,
          v_required_g_per_kwh_per_yr: Math.round(v_required * 10) / 10,
          on_track: v_actual >= v_required
        };
      }
    }

    // 2050 Pathway
    const pathway = {};
    
    // ETA to near-zero
    if (result.velocity && result.velocity.v_actual_g_per_kwh_per_yr > 0) {
      const yearsToZero = I_latest / result.velocity.v_actual_g_per_kwh_per_yr;
      pathway.eta_year = Math.round(this.currentYear + yearsToZero);
    }

    // Target series
    if (netZeroData && netZeroData.length > 0) {
      const series = [...netZeroData]
        .filter(d => d.target_emissions_mt !== null)
        .map(d => ({ year: d.year, target_emissions_mt: d.target_emissions_mt }));
      
      // Ensure 2050 target is 0
      if (!series.find(d => d.year === 2050)) {
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
}

module.exports = GoalTracker;
