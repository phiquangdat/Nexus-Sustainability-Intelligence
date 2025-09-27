const express = require("express");
const cors = require("cors");
const mockData = require("./mockData");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Veridi OS Backend API is running!" });
});

// API endpoints
app.get("/api/data", (req, res) => {
  res.json(mockData);
});

app.get("/api/reports/eu-ets", (req, res) => {
  // Calculate total CO2 emissions for the entire period
  const totalEmissions = mockData.reduce(
    (sum, record) => sum + record.co2_emissions_tonnes,
    0
  );

  res.json({
    total_emissions_tonnes: Math.round(totalEmissions * 100) / 100,
    reporting_period: "Q3 2024",
    status: "Compliant",
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
