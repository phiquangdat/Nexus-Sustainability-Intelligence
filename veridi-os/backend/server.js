const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const mockData = require("./mockData");
const DatabaseService = require("./services/databaseService");

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize database service
const dbService = new DatabaseService();

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
