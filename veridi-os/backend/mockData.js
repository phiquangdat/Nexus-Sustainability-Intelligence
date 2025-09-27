// Mock data for Veridi OS - Wärtsilä Power Plants
// Simulating hourly data from two power plants over several days

const generateMockData = () => {
  const data = [];
  const startDate = new Date("2024-09-20T00:00:00Z");
  const plantIds = ["Vaasa-Plant-A", "Vaasa-Plant-B"];
  const fuelTypes = ["Natural Gas", "HFO"];

  // Generate 100 data points (about 4 days of hourly data)
  for (let i = 0; i < 100; i++) {
    const timestamp = new Date(startDate.getTime() + i * 60 * 60 * 1000); // Add i hours
    const plantId = plantIds[i % 2]; // Alternate between plants
    const fuelType = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];

    // Simulate realistic power plant data
    const baseLoad = Math.random() * 0.3 + 0.7; // 70-100% load factor
    const fuelConsumed = (Math.random() * 2000 + 3000) * baseLoad; // 3000-5000 liters per hour
    const energyOutput = fuelConsumed * (Math.random() * 0.3 + 0.35); // 35-65% efficiency
    const co2Emissions =
      fuelConsumed * (fuelType === "Natural Gas" ? 0.2 : 0.3); // Different CO2 factors

    data.push({
      timestamp: timestamp.toISOString(),
      plant_id: plantId,
      fuel_type: fuelType,
      fuel_consumed_liters: Math.round(fuelConsumed * 100) / 100,
      energy_output_mwh: Math.round(energyOutput * 100) / 100,
      co2_emissions_tonnes: Math.round(co2Emissions * 100) / 100,
    });
  }

  return data;
};

module.exports = generateMockData();
