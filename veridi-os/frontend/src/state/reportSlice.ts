import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { EUETSReport } from "../types";
import { DataService } from "../services/dataService";

interface ReportState {
  euetsReport: EUETSReport | null;
  reports: EUETSReport[];
  loading: boolean;
  error: string | null;
  lastGenerated: number | null;
}

const initialState: ReportState = {
  euetsReport: null,
  reports: [],
  loading: false,
  error: null,
  lastGenerated: null,
};

export const generateEUETSReport = createAsyncThunk(
  "report/generateEUETSReport",
  async (_, { rejectWithValue }) => {
    try {
      const reports = await DataService.getEUETSReports();
      return reports.length > 0 ? reports[0] : null;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to generate EU ETS report"
      );
    }
  }
);

export const fetchEUETSReports = createAsyncThunk(
  "report/fetchEUETSReports",
  async (_, { rejectWithValue }) => {
    try {
      const reports = await DataService.getEUETSReports();
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

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetReport: (state) => {
      state.euetsReport = null;
      state.reports = [];
      state.loading = false;
      state.error = null;
      state.lastGenerated = null;
    },
    setCurrentReport: (state, action) => {
      state.euetsReport = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateEUETSReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateEUETSReport.fulfilled, (state, action) => {
        state.loading = false;
        state.euetsReport = action.payload as EUETSReport;
        if (action.payload) {
          state.reports.unshift(action.payload as EUETSReport);
        }
        state.error = null;
        state.lastGenerated = Date.now();
      })
      .addCase(generateEUETSReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
      });
  },
});

export const { clearError, resetReport, setCurrentReport } =
  reportSlice.actions;

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

export const selectReportsSummary = (state: { report: ReportState }) => {
  const reports = state.report.reports;
  return {
    totalReports: reports.length,
    compliantReports: reports.filter((r) => r.status === "Compliant").length,
    nonCompliantReports: reports.filter((r) => r.status === "Non-Compliant")
      .length,
    pendingReports: reports.filter((r) => r.status === "Pending").length,
    averageEmissions:
      reports.length > 0
        ? reports.reduce((sum, r) => sum + r.total_emissions_tonnes, 0) /
          reports.length
        : 0,
  };
};

export const selectLatestReport = (state: { report: ReportState }) => {
  const reports = state.report.reports;
  return reports.length > 0 ? reports[0] : null;
};

export default reportSlice.reducer;
