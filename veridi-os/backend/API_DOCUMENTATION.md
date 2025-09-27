# Veridi OS API Documentation

## Overview

The Veridi OS API provides endpoints for accessing power plant data and generating sustainability reports. This RESTful API is built with Express.js and serves as the backend for the Veridi OS sustainability intelligence platform.

## Base URL

```
http://localhost:4000
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Content Type

All responses are returned as JSON with the `Content-Type: application/json` header.

## Endpoints

### 1. Health Check

Check if the API server is running.

**Endpoint:** `GET /health`

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-09-27T14:30:00.000Z"
}
```

**Status Codes:**

- `200 OK` - Server is healthy

---

### 2. Root Endpoint

Basic API information and status.

**Endpoint:** `GET /`

**Response:**

```json
{
  "message": "Veridi OS Backend API is running!"
}
```

**Status Codes:**

- `200 OK` - API is running

---

### 3. Power Plant Data

Retrieve all power plant operational data.

**Endpoint:** `GET /api/data`

**Description:** Returns an array of power plant data points containing fuel consumption, energy output, and CO2 emissions information.

**Response:**

```json
[
  {
    "timestamp": "2024-09-20T00:00:00.000Z",
    "plant_id": "Vaasa-Plant-A",
    "fuel_type": "Natural Gas",
    "fuel_consumed_liters": 3250.45,
    "energy_output_mwh": 1425.3,
    "co2_emissions_tonnes": 650.09
  },
  {
    "timestamp": "2024-09-20T01:00:00.000Z",
    "plant_id": "Vaasa-Plant-B",
    "fuel_type": "HFO",
    "fuel_consumed_liters": 4100.2,
    "energy_output_mwh": 1640.08,
    "co2_emissions_tonnes": 1230.06
  }
]
```

**Response Fields:**

- `timestamp` (string): ISO 8601 timestamp of the data point
- `plant_id` (string): Unique identifier for the power plant
- `fuel_type` (string): Type of fuel used ("Natural Gas" or "HFO")
- `fuel_consumed_liters` (number): Amount of fuel consumed in liters
- `energy_output_mwh` (number): Energy output in megawatt-hours
- `co2_emissions_tonnes` (number): CO2 emissions in tonnes

**Status Codes:**

- `200 OK` - Data retrieved successfully

---

### 4. EU ETS Compliance Report

Generate an automated EU ETS (European Union Emissions Trading System) compliance report.

**Endpoint:** `GET /api/reports/eu-ets`

**Description:** Calculates total CO2 emissions for the reporting period and returns compliance status.

**Response:**

```json
{
  "total_emissions_tonnes": 18547.32,
  "reporting_period": "Q3 2024",
  "status": "Compliant"
}
```

**Response Fields:**

- `total_emissions_tonnes` (number): Total CO2 emissions for the period in tonnes
- `reporting_period` (string): The reporting period (e.g., "Q3 2024")
- `status` (string): Compliance status ("Compliant" or "Non-Compliant")

**Status Codes:**

- `200 OK` - Report generated successfully

---

## Data Models

### PowerPlantData

Represents a single data point from a power plant.

```typescript
interface PowerPlantData {
  timestamp: string; // ISO 8601 timestamp
  plant_id: string; // Plant identifier
  fuel_type: string; // Fuel type
  fuel_consumed_liters: number; // Fuel consumption in liters
  energy_output_mwh: number; // Energy output in MWh
  co2_emissions_tonnes: number; // CO2 emissions in tonnes
}
```

### EUETSReport

Represents an EU ETS compliance report.

```typescript
interface EUETSReport {
  total_emissions_tonnes: number; // Total emissions
  reporting_period: string; // Reporting period
  status: string; // Compliance status
}
```

## Error Handling

The API uses standard HTTP status codes to indicate success or failure:

- `200 OK` - Request successful
- `400 Bad Request` - Invalid request
- `404 Not Found` - Endpoint not found
- `500 Internal Server Error` - Server error

### Error Response Format

```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2024-09-27T14:30:00.000Z"
}
```

## Rate Limiting

Currently, there are no rate limits implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

The API includes CORS (Cross-Origin Resource Sharing) headers to allow requests from the frontend application.

## Mock Data

The API currently serves mock data for development and demonstration purposes. The mock data includes:

- 24 hours of realistic power plant data
- Two power plants: "Vaasa-Plant-A" and "Vaasa-Plant-B"
- Multiple fuel types: "Natural Gas" and "HFO"
- Realistic CO2 emissions and energy output calculations

## Development

### Running the API

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables

- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)

## Example Usage

### Using curl

```bash
# Health check
curl http://localhost:4000/health

# Get power plant data
curl http://localhost:4000/api/data

# Generate EU ETS report
curl http://localhost:4000/api/reports/eu-ets
```

### Using JavaScript/TypeScript

```typescript
// Fetch power plant data
const response = await fetch("http://localhost:4000/api/data");
const data = await response.json();

// Generate EU ETS report
const reportResponse = await fetch("http://localhost:4000/api/reports/eu-ets");
const report = await reportResponse.json();
```

### Using axios

```typescript
import axios from "axios";

// Get power plant data
const { data } = await axios.get("http://localhost:4000/api/data");

// Generate EU ETS report
const { data: report } = await axios.get(
  "http://localhost:4000/api/reports/eu-ets"
);
```

## Future Enhancements

Planned improvements for the API:

1. **Authentication & Authorization**: JWT-based authentication
2. **Data Filtering**: Query parameters for filtering data by date range, plant, etc.
3. **Pagination**: Paginated responses for large datasets
4. **Real-time Data**: WebSocket support for real-time updates
5. **Data Validation**: Request validation middleware
6. **Logging**: Comprehensive request/response logging
7. **Metrics**: API usage metrics and monitoring
8. **Rate Limiting**: Implement rate limiting for production use

## Support

For API support or questions, please refer to the project documentation or contact the development team.
