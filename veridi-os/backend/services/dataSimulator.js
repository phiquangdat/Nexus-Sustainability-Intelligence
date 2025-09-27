// Data Simulator Service - JavaScript implementation of Python simulator
// Generates realistic sustainability intelligence data

class DataSimulator {
  constructor() {
    this.baseTotalMW = 7000.0;
    this.baseHydro = 950.0;
    this.baseWind = 1800.0;
    this.baseSolar = 150.0;
    this.baseNuclear = 2700.0;
    this.baseFossil = 1600.0;
  }

  // Generate random number with normal distribution
  boundedNormal(mean, std, min, max) {
    let value;
    do {
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      value = mean + std * z0;
    } while (value < min || value > max);
    return value;
  }

  // Diurnal profile for demand
  diurnalProfile(hour, minFactor = 0.85, maxFactor = 1.15) {
    const baseLoad = 0.9 + 0.1 * Math.sin((hour - 6) * Math.PI / 12);
    return Math.max(minFactor, Math.min(maxFactor, baseLoad));
  }

  // Weather variation factors
  weatherVariation() {
    return {
      wind: this.boundedNormal(1.0, 0.3, 0.2, 2.0),
      solar: this.boundedNormal(1.0, 0.4, 0.0, 2.0),
      hydro: this.boundedNormal(1.0, 0.2, 0.5, 1.5)
    };
  }

  // Planned outage factor
  plannedOutageFactor() {
    return this.boundedNormal(1.0, 0.05, 0.8, 1.0);
  }

  // Fossil price shock factor
  fossilPriceShockFactor() {
    return this.boundedNormal(1.0, 0.1, 0.7, 1.3);
  }

  // Compute CO2 intensity based on generation mix
  computeCo2Intensity(hydroMW, windMW, solarMW, nuclearMW, fossilMW, totalMW) {
    if (totalMW === 0) return 0;
    
    const renewableMW = hydroMW + windMW + solarMW;
    const renewableShare = renewableMW / totalMW;
    
    // Base intensity when all fossil (typical coal/gas mix)
    const baseIntensity = 800; // g CO2/kWh
    
    // Reduce intensity based on renewable share
    const intensity = baseIntensity * (1 - renewableShare * 0.8);
    
    // Add some variation
    const variation = this.boundedNormal(0, 50, -100, 100);
    
    return Math.max(50, intensity + variation); // Minimum 50 g/kWh
  }

  // Simulate generation mix for a given timestamp
  simulateGenerationMix(timestamp) {
    const date = new Date(timestamp);
    const hour = date.getHours();
    
    // Demand diurnal shape
    const loadFactor = this.diurnalProfile(hour);
    const weather = this.weatherVariation();
    const plannedFactor = this.plannedOutageFactor();
    const priceShock = this.fossilPriceShockFactor();
    
    // Solar day-night profile
    const solarFactor = (hour >= 8 && hour <= 18) ? 1.0 : 0.1;
    
    // Calculate generation by technology
    const hydro = Math.max(0, this.baseHydro * weather.hydro);
    const wind = Math.max(0, this.baseWind * weather.wind);
    const solar = Math.max(0, this.baseSolar * solarFactor * weather.solar);
    const nuclear = Math.max(0, this.baseNuclear * plannedFactor);
    const fossil = Math.max(0, this.baseFossil * loadFactor * priceShock);
    
    const totalMW = hydro + wind + solar + nuclear + fossil;
    const renewableSharePct = ((hydro + wind + solar) / totalMW) * 100;
    
    return {
      id: null,
      timestamp: timestamp,
      hydro_mw: Math.round(hydro * 10) / 10,
      wind_mw: Math.round(wind * 10) / 10,
      solar_mw: Math.round(solar * 10) / 10,
      nuclear_mw: Math.round(nuclear * 10) / 10,
      fossil_mw: Math.round(fossil * 10) / 10,
      total_mw: Math.round(totalMW * 10) / 10,
      renewable_share_pct: Math.round(renewableSharePct * 10) / 10
    };
  }

  // Simulate CO2 intensity for a given timestamp
  simulateCo2Intensity(timestamp, generationMix = null) {
    let co2Intensity;
    
    if (generationMix) {
      co2Intensity = this.computeCo2Intensity(
        generationMix.hydro_mw,
        generationMix.wind_mw,
        generationMix.solar_mw,
        generationMix.nuclear_mw,
        generationMix.fossil_mw,
        generationMix.total_mw
      );
    } else {
      // Generate random intensity if no generation mix provided
      co2Intensity = this.boundedNormal(300, 100, 50, 800);
    }
    
    return {
      id: null,
      timestamp: timestamp,
      co2_intensity_g_per_kwh: Math.round(co2Intensity * 10) / 10
    };
  }

  // Generate net-zero alignment data
  generateNetZeroAlignmentData() {
    const data = [];
    const currentYear = new Date().getFullYear();
    
    for (let year = 2020; year <= 2050; year += 5) {
      const targetReduction = (year - 2020) / (2050 - 2020);
      const baseEmissions = 45; // Starting emissions in Mt
      
      const targetEmissionsMt = Math.max(0, baseEmissions * (1 - targetReduction));
      const actualEmissionsMt = Math.max(0, targetEmissionsMt * (1 + (Math.random() - 0.5) * 0.2));
      const alignmentPct = Math.min(150, (targetEmissionsMt / actualEmissionsMt) * 100);
      
      data.push({
        year: year,
        actual_emissions_mt: Math.round(actualEmissionsMt * 10) / 10,
        target_emissions_mt: Math.round(targetEmissionsMt * 10) / 10,
        alignment_pct: Math.round(alignmentPct * 10) / 10
      });
    }
    
    return data;
  }

  // Generate time series data
  generateTimeSeriesData(limit = 1000, intervalMinutes = 15) {
    const co2Data = [];
    const genData = [];
    const now = new Date();
    
    for (let i = 0; i < limit; i++) {
      const timestamp = new Date(now.getTime() - (limit - i) * intervalMinutes * 60 * 1000);
      
      // Generate generation mix first
      const generationMix = this.simulateGenerationMix(timestamp.toISOString());
      genData.push(generationMix);
      
      // Generate CO2 intensity based on generation mix
      const co2Intensity = this.simulateCo2Intensity(timestamp.toISOString(), generationMix);
      co2Data.push(co2Intensity);
    }
    
    return { co2Data, genData };
  }

  // Generate all sustainability data
  generateAllData(limit = 1000) {
    const timeSeries = this.generateTimeSeriesData(limit);
    const netZeroData = this.generateNetZeroAlignmentData();
    
    return {
      co2Intensity: timeSeries.co2Data,
      generationMix: timeSeries.genData,
      netZeroAlignment: netZeroData
    };
  }
}

module.exports = DataSimulator;
