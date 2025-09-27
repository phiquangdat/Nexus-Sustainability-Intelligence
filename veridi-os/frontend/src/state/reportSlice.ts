import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { EUETSReport } from "../types";
import { mockDataService } from "../services/mockDataService";

// Define the state interface
interface ReportState {
  euetsReport: EUETSReport | null;
  loading: boolean;
  error: string | null;
  lastGenerated: number | null;
}

// Initial state
const initialState: ReportState = {
  euetsReport: null,
  loading: false,
  error: null,
  lastGenerated: null,
};

// Async thunk for generating EU ETS report
export const generateEUETSReport = createAsyncThunk(
  "report/generateEUETSReport",
  async (_, { rejectWithValue }) => {
    try {
      const report = await mockDataService.getEUETSReport();
      return report;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to generate EU ETS report"
      );
    }
  }
);

// Report slice
const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
    // Reset report state
    resetReport: (state) => {
      state.euetsReport = null;
      state.loading = false;
      state.error = null;
      state.lastGenerated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate report pending
      .addCase(generateEUETSReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Generate report fulfilled
      .addCase(generateEUETSReport.fulfilled, (state, action) => {
        state.loading = false;
        state.euetsReport = action.payload;
        state.error = null;
        state.lastGenerated = Date.now();
      })
      // Generate report rejected
      .addCase(generateEUETSReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError, resetReport } = reportSlice.actions;

// Export selectors
export const selectEUETSReport = (state: { report: ReportState }) =>
  state.report.euetsReport;
export const selectReportLoading = (state: { report: ReportState }) =>
  state.report.loading;
export const selectReportError = (state: { report: ReportState }) =>
  state.report.error;
export const selectLastGenerated = (state: { report: ReportState }) =>
  state.report.lastGenerated;

// Export reducer
export default reportSlice.reducer;
