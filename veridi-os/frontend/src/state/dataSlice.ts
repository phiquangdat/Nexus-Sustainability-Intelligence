import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { PowerPlantData } from "../types";
import { mockDataService } from "../services/mockDataService";

// Define the state interface
interface DataState {
  powerPlantData: PowerPlantData[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

// Initial state
const initialState: DataState = {
  powerPlantData: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunk for fetching power plant data
export const fetchPowerPlantData = createAsyncThunk(
  "data/fetchPowerPlantData",
  async (_, { rejectWithValue }) => {
    try {
      const data = await mockDataService.getPowerPlantData();
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
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },
    // Update specific data point (for real-time updates)
    updateDataPoint: (
      state,
      action: PayloadAction<{ index: number; data: PowerPlantData }>
    ) => {
      const { index, data } = action.payload;
      if (index >= 0 && index < state.powerPlantData.length) {
        state.powerPlantData[index] = data;
      }
    },
    // Add new data point
    addDataPoint: (state, action: PayloadAction<PowerPlantData>) => {
      state.powerPlantData.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch data pending
      .addCase(fetchPowerPlantData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fetch data fulfilled
      .addCase(fetchPowerPlantData.fulfilled, (state, action) => {
        state.loading = false;
        state.powerPlantData = action.payload;
        state.error = null;
        state.lastFetched = Date.now();
      })
      // Fetch data rejected
      .addCase(fetchPowerPlantData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError, resetData, updateDataPoint, addDataPoint } =
  dataSlice.actions;

// Export selectors
export const selectPowerPlantData = (state: { data: DataState }) =>
  state.data.powerPlantData;
export const selectDataLoading = (state: { data: DataState }) =>
  state.data.loading;
export const selectDataError = (state: { data: DataState }) => state.data.error;
export const selectLastFetched = (state: { data: DataState }) =>
  state.data.lastFetched;

// Export reducer
export default dataSlice.reducer;
