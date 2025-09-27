const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const mockData = require("./mockData");

const app = express();
const PORT = process.env.PORT || 4000;

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
    database: "Mock Data",
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
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: {
      connected: false,
      message: "Using mock data - Supabase not configured",
    },
  });
});

// API endpoints
app.get("/api/data", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 1000;
    const data = mockData.slice(0, limit);
    res.json(data);
  } catch (error) {
    console.error("Error fetching power plant data:", error);
    res.status(500).json({
      error: "Failed to fetch power plant data",
      fallback: "Using mock data",
    });
  }
});

// Get power plants summary
app.get("/api/plants/summary", async (req, res) => {
  res.status(503).json({
    error: "Database not configured",
    message: "Supabase connection required for this endpoint",
  });
});

// Get recent emissions
app.get("/api/emissions/recent", async (req, res) => {
  res.status(503).json({
    error: "Database not configured",
    message: "Supabase connection required for this endpoint",
  });
});

// Generate EU ETS report
app.post("/api/reports/eu-ets", async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error generating EU ETS report:", error);
    res.status(500).json({ error: "Failed to generate EU ETS report" });
  }
});

// Get EU ETS reports
app.get("/api/reports/eu-ets", async (req, res) => {
  res.status(503).json({
    error: "Database not configured",
    message: "Supabase connection required for this endpoint",
  });
});

// Insert new power plant data
app.post("/api/data", async (req, res) => {
  res.status(503).json({
    error: "Database not configured",
    message: "Supabase connection required for this endpoint",
  });
});

// Get plant emissions summary
app.get("/api/plants/:plantId/emissions", async (req, res) => {
  res.status(503).json({
    error: "Database not configured",
    message: "Supabase connection required for this endpoint",
  });
});

// Legacy health check endpoint for backward compatibility
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: "Mock Data",
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
  console.log(`📊 Database: Mock Data`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`🔗 Quick link: http://localhost:${PORT}/docs`);
});
