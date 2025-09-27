import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { EUETSReport } from "../types";
import { dataService } from "../services/api/dataService";

// Define the state interface
interface ReportState {
  euetsReport: EUETSReport | null;
  reports: EUETSReport[];
  loading: boolean;
  error: string | null;
  lastGenerated: number | null;
}

// Initial state
const initialState: ReportState = {
  euetsReport: null,
  reports: [],
  loading: false,
  error: null,
  lastGenerated: null,
};

// Async thunk for generating EU ETS report
export const generateEUETSReport = createAsyncThunk(
  "report/generateEUETSReport",
  async (_, { rejectWithValue }) => {
    try {
      const report = await dataService.getEUETSReport();
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

// Async thunk for fetching all EU ETS reports
export const fetchEUETSReports = createAsyncThunk(
  "report/fetchEUETSReports",
  async (_, { rejectWithValue }) => {
    try {
      const reports = await dataService.getEUETSReports();
      return reports;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch EU ETS reports"
      );
    }
  }
);

// Async thunk for generating custom period report
export const generateCustomReport = createAsyncThunk(
  "report/generateCustomReport",
  async (_: { startDate: string; endDate: string; period: string }, { rejectWithValue }) => {
    try {
      // For now, just generate a standard report
      const report = await dataService.getEUETSReport();
      return report;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to generate custom report"
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
      state.reports = [];
      state.loading = false;
      state.error = null;
      state.lastGenerated = null;
    },
    // Set current report
    setCurrentReport: (state, action) => {
      state.euetsReport = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate EU ETS report
      .addCase(generateEUETSReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateEUETSReport.fulfilled, (state, action) => {
        state.loading = false;
        state.euetsReport = action.payload as EUETSReport;
        state.reports.unshift(action.payload as EUETSReport);
        state.error = null;
        state.lastGenerated = Date.now();
      })
      .addCase(generateEUETSReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch EU ETS reports
      .addCase(fetchEUETSReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEUETSReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
        state.error = null;
      })
      .addCase(fetchEUETSReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Generate custom report
      .addCase(generateCustomReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateCustomReport.fulfilled, (state, action) => {
        state.loading = false;
        state.euetsReport = action.payload as EUETSReport;
        state.reports.unshift(action.payload as EUETSReport);
        state.error = null;
        state.lastGenerated = Date.now();
      })
      .addCase(generateCustomReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError, resetReport, setCurrentReport } = reportSlice.actions;

// Export selectors
export const selectEUETSReport = (state: { report: ReportState }) =>
  state.report.euetsReport;
export const selectEUETSReports = (state: { report: ReportState }) =>
  state.report.reports;
export const selectReportLoading = (state: { report: ReportState }) =>
  state.report.loading;
export const selectReportError = (state: { report: ReportState }) =>
  state.report.error;
export const selectLastGenerated = (state: { report: ReportState }) =>
  state.report.lastGenerated;

// Computed selectors
export const selectReportsSummary = (state: { report: ReportState }) => {
  const reports = state.report.reports;
  return {
    totalReports: reports.length,
    compliantReports: reports.filter(r => r.status === 'Compliant').length,
    nonCompliantReports: reports.filter(r => r.status === 'Non-Compliant').length,
    pendingReports: reports.filter(r => r.status === 'Pending').length,
    averageEmissions: reports.length > 0 
      ? reports.reduce((sum, r) => sum + r.total_emissions_tonnes, 0) / reports.length 
      : 0,
  };
};

export const selectLatestReport = (state: { report: ReportState }) => {
  const reports = state.report.reports;
  return reports.length > 0 ? reports[0] : null;
};

// Export reducer
export default reportSlice.reducer;
