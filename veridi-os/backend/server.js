const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const mockData = require("./mockData");
const DatabaseService = require("./services/databaseService");
const GoalTracker = require("./services/goalTracker");
const DataSimulator = require("./services/dataSimulator");

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize database service
const dbService = new DatabaseService();
const goalTracker = new GoalTracker();
const dataSimulator = new DataSimulator();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  if (process.env.ENABLE_LOGGING === "true") {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// Swagger UI setup
const swaggerDocument = YAML.load(path.join(__dirname, "openapi.yaml"));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Veridi OS API Documentation",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: "list",
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  })
);

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Veridi OS Backend API is running!",
    database: dbService.isSupabaseAvailable() ? "Supabase" : "Mock Data",
    timestamp: new Date().toISOString(),
    documentation: "Visit /api-docs for interactive API documentation",
  });
});

// Redirect to API docs
app.get("/docs", (req, res) => {
  res.redirect("/api-docs");
});

// Database connection test endpoint
app.get("/api/health", async (req, res) => {
  try {
    const connectionTest = await dbService.testConnection();
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      database: connectionTest,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// API endpoints
app.get("/api/data", async (req, res) => {
  try {
    if (dbService.isSupabaseAvailable()) {
      const data = await dbService.getPowerPlantData(
        parseInt(req.query.limit) || 1000
      );
      res.json(data);
    } else {
      // Fallback to mock data
      res.json(mockData);
    }
  } catch (error) {
    console.error("Error fetching power plant data:", error);
    res.status(500).json({
      error: "Failed to fetch power plant data",
      fallback: "Using mock data",
    });
    // Fallback to mock data on error
    res.json(mockData);
  }
});

// Get power plants summary
app.get("/api/plants/summary", async (req, res) => {
  try {
    if (dbService.isSupabaseAvailable()) {
      const data = await dbService.getPowerPlantsSummary();
      res.json(data);
    } else {
      res.status(503).json({ 
        error: 'Database not configured',
        message: 'Supabase connection required for this endpoint'
      });
    }
  } catch (error) {
    console.error('Error fetching power plants summary:', error);
    res.status(500).json({ error: 'Failed to fetch power plants summary' });
  }
});

// Get recent emissions
app.get("/api/emissions/recent", async (req, res) => {
  try {
    if (dbService.isSupabaseAvailable()) {
      const data = await dbService.getRecentEmissions(parseInt(req.query.limit) || 100);
      res.json(data);
    } else {
      res.status(503).json({ 
        error: 'Database not configured',
        message: 'Supabase connection required for this endpoint'
      });
    }
  } catch (error) {
    console.error('Error fetching recent emissions:', error);
    res.status(500).json({ error: 'Failed to fetch recent emissions' });
  }
});

// Generate EU ETS report
app.post("/api/reports/eu-ets", async (req, res) => {
  try {
    if (dbService.isSupabaseAvailable()) {
      const { startDate, endDate } = req.body;
      const report = await dbService.generateEUETSReport(
        startDate || "2024-07-01",
        endDate || "2024-10-01"
      );
      res.json(report);
    } else {
      // Fallback to mock calculation
      const totalEmissions = mockData.reduce(
        (sum, record) => sum + record.co2_emissions_tonnes,
        0
      );

      res.json({
        id: "mock-1",
        reporting_period: "Q3 2024",
        total_emissions_tonnes: Math.round(totalEmissions * 100) / 100,
        status: "Compliant",
        generated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error generating EU ETS report:", error);
    res.status(500).json({ error: "Failed to generate EU ETS report" });
  }
});

// Get EU ETS reports
app.get("/api/reports/eu-ets", async (req, res) => {
  try {
    if (dbService.isSupabaseAvailable()) {
      const reports = await dbService.getEUETSReports(
        parseInt(req.query.limit) || 50
      );
      res.json(reports);
    } else {
      res.status(503).json({
        error: "Database not configured",
        message: "Supabase connection required for this endpoint",
      });
    }
  } catch (error) {
    console.error("Error fetching EU ETS reports:", error);
    res.status(500).json({ error: "Failed to fetch EU ETS reports" });
  }
});

// Insert new power plant data
app.post("/api/data", async (req, res) => {
  try {
    if (dbService.isSupabaseAvailable()) {
      const result = await dbService.insertPowerPlantData(req.body);
      res.status(201).json(result);
    } else {
      res.status(503).json({
        error: "Database not configured",
        message: "Supabase connection required for this endpoint",
      });
    }
  } catch (error) {
    console.error("Error inserting power plant data:", error);
    res.status(500).json({ error: "Failed to insert power plant data" });
  }
});

// Get plant emissions summary
app.get("/api/plants/:plantId/emissions", async (req, res) => {
  try {
    if (dbService.isSupabaseAvailable()) {
      const { plantId } = req.params;
      const { hours } = req.query;
      const summary = await dbService.getPlantEmissionsSummary(
        plantId,
        parseInt(hours) || 24
      );
      res.json(summary);
    } else {
      res.status(503).json({
        error: "Database not configured",
        message: "Supabase connection required for this endpoint",
      });
    }
  } catch (error) {
    console.error("Error getting plant emissions summary:", error);
    res.status(500).json({ error: "Failed to get plant emissions summary" });
  }
});

// Sustainability Intelligence Endpoints

// Get CO2 intensity data
app.get("/api/sustainability/co2-intensity", async (req, res) => {
  try {
    if (dbService.isSupabaseAvailable()) {
      const data = await dbService.getCo2IntensityData(
        parseInt(req.query.limit) || 1000,
        req.query.order || "timestamp"
      );
      res.json(data);
    } else {
      // Use data simulator for realistic data
      const limit = parseInt(req.query.limit) || 1000;
      const allData = dataSimulator.generateAllData(limit);
      res.json(allData.co2Intensity);
    }
  } catch (error) {
    console.error("Error fetching CO2 intensity data:", error);
    res.status(500).json({ error: "Failed to fetch CO2 intensity data" });
  }
});

// Get generation mix data
app.get("/api/sustainability/generation-mix", async (req, res) => {
  try {
    if (dbService.isSupabaseAvailable()) {
      const data = await dbService.getGenerationMixData(
        parseInt(req.query.limit) || 1000,
        req.query.order || "timestamp"
      );
      res.json(data);
    } else {
      // Use data simulator for realistic data
      const limit = parseInt(req.query.limit) || 1000;
      const allData = dataSimulator.generateAllData(limit);
      res.json(allData.generationMix);
    }
  } catch (error) {
    console.error("Error fetching generation mix data:", error);
    res.status(500).json({ error: "Failed to fetch generation mix data" });
  }
});

// Get net-zero alignment data
app.get("/api/sustainability/netzero-alignment", async (req, res) => {
  try {
    if (dbService.isSupabaseAvailable()) {
      const data = await dbService.getNetZeroAlignmentData(
        parseInt(req.query.limit) || 100,
        req.query.order || "year"
      );
      res.json(data);
    } else {
      // Use data simulator for realistic data
      const netZeroData = dataSimulator.generateNetZeroAlignmentData();
      res.json(netZeroData);
    }
  } catch (error) {
    console.error("Error fetching net-zero alignment data:", error);
    res.status(500).json({ error: "Failed to fetch net-zero alignment data" });
  }
});

// Get goal tracker metrics
app.get("/api/sustainability/goal-tracker", async (req, res) => {
  try {
    if (dbService.isSupabaseAvailable()) {
      const data = await dbService.getGoalTrackerMetrics();
      res.json(data);
    } else {
      // Use goal tracker with simulated data
      const limit = parseInt(req.query.limit) || 1000;
      const allData = dataSimulator.generateAllData(limit);
      const goalTrackerData = goalTracker.computeGoalTracker(
        allData.co2Intensity,
        allData.generationMix,
        allData.netZeroAlignment
      );
      res.json(goalTrackerData);
    }
  } catch (error) {
    console.error("Error fetching goal tracker metrics:", error);
    res.status(500).json({ error: "Failed to fetch goal tracker metrics" });
  }
});

// Get sustainability KPIs summary
app.get("/api/sustainability/kpis", async (req, res) => {
  try {
    if (dbService.isSupabaseAvailable()) {
      const data = await dbService.getSustainabilityKPIs();
      res.json(data);
    } else {
      // Generate KPIs from simulated data
      const allData = dataSimulator.generateAllData(100);
      const latestCo2 = allData.co2Intensity[allData.co2Intensity.length - 1];
      const latestGen = allData.generationMix[allData.generationMix.length - 1];
      const latestNetZero = allData.netZeroAlignment[allData.netZeroAlignment.length - 1];
      
      res.json({
        co2_intensity: {
          current: latestCo2.co2_intensity_g_per_kwh,
          trend: "decreasing",
          change_pct: -5.2
        },
        renewable_share: {
          current: latestGen.renewable_share_pct,
          trend: "increasing",
          change_pct: 3.1
        },
        netzero_alignment: {
          current: latestNetZero.alignment_pct,
          trend: "on_track",
          change_pct: 2.3
        }
      });
    }
  } catch (error) {
    console.error("Error fetching sustainability KPIs:", error);
    res.status(500).json({ error: "Failed to fetch sustainability KPIs" });
  }
});


// Legacy health check endpoint for backward compatibility
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: dbService.isSupabaseAvailable() ? "Supabase" : "Mock Data",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Veridi OS Backend API is running on port ${PORT}`);
  console.log(
    `📊 Database: ${dbService.isSupabaseAvailable() ? "Supabase" : "Mock Data"}`
  );
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
