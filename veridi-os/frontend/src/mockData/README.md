# Mock Data System for Veridi OS

This directory contains mock data and services for development and testing of the Veridi OS frontend.

## Files

- `mockData.ts` - Core mock data definitions and utilities
- `services/mockDataService.ts` - Service layer for switching between API and mock data
- `config/development.ts` - Development configuration

## Features

### 🎯 **Automatic Fallback**
- Automatically falls back to mock data when API is unavailable
- Seamless switching between real API and mock data
- Development toggle for easy testing

### 📊 **Realistic Data**
- 24 hours of realistic power plant data
- Multiple fuel types (Natural Gas, HFO)
- Realistic CO2 emissions and energy output calculations
- Multiple data scenarios (normal, high emissions, low emissions, peak demand)

### 🔧 **Development Tools**
- Mock data toggle component (development only)
- API connectivity testing
- Custom data generation utilities
- Multiple scenario support

## Usage

### Basic Usage
```typescript
import { mockDataService } from './services/mockDataService';

// Get power plant data (automatically uses mock if API fails)
const data = await mockDataService.getPowerPlantData();

// Get EU ETS report
const report = await mockDataService.getEUETSReport();
```

### Development Toggle
The `MockDataToggle` component provides a UI for switching between API and mock data during development.

### Custom Scenarios
```typescript
// Get different data scenarios
const scenarios = mockDataService.getMockScenarios();
const highEmissionsData = scenarios.highEmissions;
const lowEmissionsData = scenarios.lowEmissions;
```

### Environment Configuration
Set environment variables to control mock data behavior:

```bash
# Force mock data usage
VITE_USE_MOCK_DATA=true

# Set custom API URL
VITE_API_URL=http://localhost:4000
```

## Data Structure

### PowerPlantData
```typescript
interface PowerPlantData {
  timestamp: string;           // ISO timestamp
  plant_id: string;           // Plant identifier
  fuel_type: string;          // Fuel type (Natural Gas, HFO)
  fuel_consumed_liters: number; // Fuel consumption
  energy_output_mwh: number;   // Energy output
  co2_emissions_tonnes: number; // CO2 emissions
}
```

### EUETSReport
```typescript
interface EUETSReport {
  total_emissions_tonnes: number;
  reporting_period: string;
  status: string;
}
```

## Scenarios

1. **Normal**: Standard operating conditions
2. **High Emissions**: 50% higher emissions, 30% more fuel consumption
3. **Low Emissions**: 30% lower emissions, 20% less fuel consumption
4. **Peak Demand**: 40% higher energy output, 20% more fuel consumption

## Benefits

- ✅ **Offline Development**: Work without backend running
- ✅ **Consistent Testing**: Predictable data for testing
- ✅ **Scenario Testing**: Test different operational conditions
- ✅ **API Fallback**: Graceful degradation when API is unavailable
- ✅ **Development Tools**: Easy switching between data sources
