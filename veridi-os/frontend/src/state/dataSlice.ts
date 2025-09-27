import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { PowerPlantData, PowerPlantSummary } from "../types";
import { dataService } from "../services/api/dataService";

// Define the state interface
interface DataState {
  powerPlantData: PowerPlantData[];
  powerPlants: PowerPlantSummary[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

// Initial state
const initialState: DataState = {
  powerPlantData: [],
  powerPlants: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunk for fetching power plant data
export const fetchPowerPlantData = createAsyncThunk(
  "data/fetchPowerPlantData",
  async (_, { rejectWithValue }) => {
    try {
      const data = await dataService.getPowerPlantData();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch power plant data"
      );
    }
  }
);

// Async thunk for fetching power plants summary
export const fetchPowerPlantsSummary = createAsyncThunk(
  "data/fetchPowerPlantsSummary",
  async (_, { rejectWithValue }) => {
    try {
      // For now, return empty array since we don't have this in mock data
      return [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch power plants summary"
      );
    }
  }
);

// Async thunk for fetching recent emissions
export const fetchRecentEmissions = createAsyncThunk(
  "data/fetchRecentEmissions",
  async (_, { rejectWithValue }) => {
    try {
      // For now, return empty array since we don't have this in mock data
      return [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch recent emissions"
      );
    }
  }
);

// Data slice
const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
    // Reset data state
    resetData: (state) => {
      state.powerPlantData = [];
      state.powerPlants = [];
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },
    // Update specific data point (for real-time updates)
    updateDataPoint: (
      state,
      action: PayloadAction<{ id: string; data: PowerPlantData }>
    ) => {
      const { id, data } = action.payload;
      const index = state.powerPlantData.findIndex(item => item.id === id);
      if (index !== -1) {
        state.powerPlantData[index] = data;
      }
    },
    // Add new data point
    addDataPoint: (state, action: PayloadAction<PowerPlantData>) => {
      state.powerPlantData.unshift(action.payload);
    },
    // Remove data point
    removeDataPoint: (state, action: PayloadAction<string>) => {
      state.powerPlantData = state.powerPlantData.filter(
        item => item.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch power plant data
      .addCase(fetchPowerPlantData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPowerPlantData.fulfilled, (state, action) => {
        state.loading = false;
        state.powerPlantData = action.payload;
        state.error = null;
        state.lastFetched = Date.now();
      })
      .addCase(fetchPowerPlantData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch power plants summary
      .addCase(fetchPowerPlantsSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPowerPlantsSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.powerPlants = action.payload;
        state.error = null;
      })
      .addCase(fetchPowerPlantsSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch recent emissions
      .addCase(fetchRecentEmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentEmissions.fulfilled, (state, action) => {
        state.loading = false;
        // Convert recent emissions to power plant data format
        const convertedData = action.payload.map((emission: any) => ({
          id: `${emission.plant_name}-${emission.timestamp}`,
          plant_id: emission.plant_name,
          timestamp: emission.timestamp,
          fuel_consumed_liters: emission.fuel_consumed_liters,
          energy_output_mwh: emission.energy_output_mwh,
          co2_emissions_tonnes: emission.co2_emissions_tonnes,
          created_at: emission.timestamp,
          power_plants: {
            id: emission.plant_name,
            name: emission.plant_name,
            fuel_type: emission.fuel_type,
          },
        }));
        state.powerPlantData = [...convertedData, ...state.powerPlantData];
        state.error = null;
      })
      .addCase(fetchRecentEmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError, resetData, updateDataPoint, addDataPoint, removeDataPoint } =
  dataSlice.actions;

// Export selectors
export const selectPowerPlantData = (state: { data: DataState }) =>
  state.data.powerPlantData;
export const selectPowerPlants = (state: { data: DataState }) =>
  state.data.powerPlants;
export const selectDataLoading = (state: { data: DataState }) =>
  state.data.loading;
export const selectDataError = (state: { data: DataState }) => state.data.error;
export const selectLastFetched = (state: { data: DataState }) =>
  state.data.lastFetched;

// Computed selectors
export const selectDataSummary = (state: { data: DataState }) => {
  const data = state.data.powerPlantData;
  return {
    totalPoints: data.length,
    totalEnergy: data.reduce((sum, item) => sum + item.energy_output_mwh, 0),
    totalEmissions: data.reduce((sum, item) => sum + item.co2_emissions_tonnes, 0),
    uniquePlants: new Set(data.map(item => item.plant_id)).size,
  };
};

export const selectChartData = (state: { data: DataState }) => {
  const data = state.data.powerPlantData;
  return data.map(item => ({
    timestamp: new Date(item.timestamp).toLocaleTimeString(),
    emissions: item.co2_emissions_tonnes,
    plant: item.power_plants?.name || item.plant_id,
  }));
};

export const selectEnergyData = (state: { data: DataState }) => {
  const data = state.data.powerPlantData;
  const plantTotals = data.reduce((acc, item) => {
    const plantName = item.power_plants?.name || item.plant_id;
    acc[plantName] = (acc[plantName] || 0) + item.energy_output_mwh;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(plantTotals).map(([plant, energy]) => ({
    plant,
    energy,
  }));
};

// Export reducer
export default dataSlice.reducer;
