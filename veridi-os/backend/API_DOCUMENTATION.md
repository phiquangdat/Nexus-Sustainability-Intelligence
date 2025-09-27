# Veridi OS API Documentation

## Overview

The Veridi OS API provides comprehensive endpoints for accessing power plant data, generating sustainability reports, and managing real-time emissions data. This RESTful API is built with Express.js and integrates with Supabase for enterprise-grade database operations, while maintaining backward compatibility with mock data fallback.

## Base URL

```
http://localhost:4000
```

## Database Integration

The API supports two modes of operation:

- **Supabase Mode**: Real-time database operations with PostgreSQL
- **Mock Data Mode**: Fallback mode using pre-generated mock data

The API automatically detects the database configuration and switches modes accordingly.

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible. Future versions will include JWT-based authentication for production deployments.

## Content Type

All responses are returned as JSON with the `Content-Type: application/json` header.

## Environment Configuration

The API behavior depends on environment variables:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SUPABASE_URL` | Supabase project URL | Yes (for DB) | - |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | Yes (for DB) | - |
| `PORT` | Server port | No | 4000 |
| `NODE_ENV` | Environment | No | development |
| `ENABLE_LOGGING` | Request logging | No | false |

## Endpoints

### 1. Root Endpoint

Basic API information and database status.

**Endpoint:** `GET /`

**Response:**

```json
{
  "message": "Veridi OS Backend API is running!",
  "database": "Supabase",
  "timestamp": "2024-09-27T14:30:00.000Z"
}
```

**Response Fields:**
- `message` (string): API status message
- `database` (string): Database type ("Supabase" or "Mock Data")
- `timestamp` (string): Current server timestamp

**Status Codes:**
- `200 OK` - API is running

---

### 2. Health Check

Comprehensive health check with database connection status.

**Endpoint:** `GET /api/health`

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-09-27T14:30:00.000Z",
  "database": {
    "connected": true,
    "message": "Database connection successful"
  }
}
```

**Response Fields:**
- `status` (string): Health status ("OK" or "ERROR")
- `timestamp` (string): Current server timestamp
- `database` (object): Database connection details
  - `connected` (boolean): Connection status
  - `message` (string): Connection message

**Status Codes:**
- `200 OK` - Server is healthy
- `500 Internal Server Error` - Server error

---

### 3. Power Plant Data

Retrieve power plant operational data from the database.

**Endpoint:** `GET /api/data`

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 1000, max: 10000)

**Description:** Returns an array of power plant data points with fuel consumption, energy output, and CO2 emissions information. Data is ordered by timestamp (newest first).

**Response:**

```json
[
  {
    "id": "uuid-1234-5678-9abc",
    "plant_id": "Vaasa-Plant-A",
    "timestamp": "2024-09-20T00:00:00.000Z",
    "fuel_consumed_liters": 3250.45,
    "energy_output_mwh": 1425.3,
    "co2_emissions_tonnes": 650.09,
    "created_at": "2024-09-20T00:00:00.000Z",
    "power_plants": {
      "id": "Vaasa-Plant-A",
      "name": "Vaasa Plant A",
      "fuel_type": "Natural Gas"
    }
  }
]
```

**Response Fields:**
- `id` (string): Unique record identifier
- `plant_id` (string): Power plant identifier
- `timestamp` (string): ISO 8601 timestamp of the data point
- `fuel_consumed_liters` (number): Amount of fuel consumed in liters
- `energy_output_mwh` (number): Energy output in megawatt-hours
- `co2_emissions_tonnes` (number): CO2 emissions in tonnes
- `created_at` (string): Record creation timestamp
- `power_plants` (object): Plant metadata
  - `id` (string): Plant identifier
  - `name` (string): Plant display name
  - `fuel_type` (string): Fuel type ("Natural Gas", "HFO", "Coal", "Renewable")

**Status Codes:**
- `200 OK` - Data retrieved successfully
- `500 Internal Server Error` - Database error (falls back to mock data)

---

### 4. Power Plants Summary

Get aggregated power plant data and statistics.

**Endpoint:** `GET /api/plants/summary`

**Description:** Returns aggregated data for all power plants including totals, averages, and metadata.

**Response:**

```json
[
  {
    "id": "uuid-plant-1",
    "name": "Vaasa Plant A",
    "location": "Vaasa, Finland",
    "fuel_type": "Natural Gas",
    "capacity_mw": 150.0,
    "data_points": 168,
    "total_energy_output": 245000.5,
    "total_co2_emissions": 122500.25,
    "avg_energy_output": 1458.33,
    "avg_co2_emissions": 729.17,
    "last_data_timestamp": "2024-09-20T23:00:00.000Z"
  }
]
```

**Response Fields:**
- `id` (string): Plant unique identifier
- `name` (string): Plant name
- `location` (string): Plant location
- `fuel_type` (string): Primary fuel type
- `capacity_mw` (number): Plant capacity in megawatts
- `data_points` (number): Number of data records
- `total_energy_output` (number): Total energy output in MWh
- `total_co2_emissions` (number): Total CO2 emissions in tonnes
- `avg_energy_output` (number): Average energy output in MWh
- `avg_co2_emissions` (number): Average CO2 emissions in tonnes
- `last_data_timestamp` (string): Timestamp of most recent data

**Status Codes:**
- `200 OK` - Summary retrieved successfully
- `503 Service Unavailable` - Database not configured

---

### 5. Recent Emissions

Get recent emissions data from the last 24 hours.

**Endpoint:** `GET /api/emissions/recent`

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 100, max: 1000)

**Description:** Returns recent emissions data for monitoring and real-time analysis.

**Response:**

```json
[
  {
    "plant_name": "Vaasa Plant A",
    "fuel_type": "Natural Gas",
    "timestamp": "2024-09-20T23:00:00.000Z",
    "co2_emissions_tonnes": 650.09,
    "energy_output_mwh": 1425.3,
    "fuel_consumed_liters": 3250.45
  }
]
```

**Response Fields:**
- `plant_name` (string): Plant display name
- `fuel_type` (string): Fuel type used
- `timestamp` (string): Data timestamp
- `co2_emissions_tonnes` (number): CO2 emissions in tonnes
- `energy_output_mwh` (number): Energy output in MWh
- `fuel_consumed_liters` (number): Fuel consumed in liters

**Status Codes:**
- `200 OK` - Recent emissions retrieved successfully
- `503 Service Unavailable` - Database not configured

---

### 6. Generate EU ETS Report

Generate a new EU ETS compliance report.

**Endpoint:** `POST /api/reports/eu-ets`

**Request Body:**

```json
{
  "startDate": "2024-07-01",
  "endDate": "2024-10-01"
}
```

**Request Fields:**
- `startDate` (optional): Report start date in YYYY-MM-DD format (default: "2024-07-01")
- `endDate` (optional): Report end date in YYYY-MM-DD format (default: "2024-10-01")

**Description:** Calculates total CO2 emissions for the specified period and generates a compliance report stored in the database.

**Response:**

```json
{
  "id": "uuid-report-1234",
  "reporting_period": "Q3 2024",
  "total_emissions_tonnes": 15420.567,
  "status": "Compliant",
  "generated_at": "2024-09-27T14:30:00.000Z",
  "created_at": "2024-09-27T14:30:00.000Z"
}
```

**Response Fields:**
- `id` (string): Report unique identifier
- `reporting_period` (string): Reporting period (e.g., "Q3 2024")
- `total_emissions_tonnes` (number): Total CO2 emissions for the period
- `status` (string): Compliance status ("Compliant", "Non-Compliant", "Pending")
- `generated_at` (string): Report generation timestamp
- `created_at` (string): Record creation timestamp

**Status Codes:**
- `200 OK` - Report generated successfully
- `400 Bad Request` - Invalid date format
- `500 Internal Server Error` - Report generation failed

---

### 7. Get EU ETS Reports

Retrieve all EU ETS compliance reports.

**Endpoint:** `GET /api/reports/eu-ets`

**Query Parameters:**
- `limit` (optional): Number of reports to return (default: 50, max: 500)

**Description:** Returns all generated EU ETS reports ordered by generation date (newest first).

**Response:**

```json
[
  {
    "id": "uuid-report-1234",
    "reporting_period": "Q3 2024",
    "total_emissions_tonnes": 15420.567,
    "status": "Compliant",
    "generated_at": "2024-09-27T14:30:00.000Z",
    "created_at": "2024-09-27T14:30:00.000Z"
  }
]
```

**Status Codes:**
- `200 OK` - Reports retrieved successfully
- `503 Service Unavailable` - Database not configured

---

### 8. Insert Power Plant Data

Add new power plant data record.

**Endpoint:** `POST /api/data`

**Request Body:**

```json
{
  "plant_id": "Vaasa-Plant-A",
  "timestamp": "2024-09-20T00:00:00.000Z",
  "fuel_consumed_liters": 3250.45,
  "energy_output_mwh": 1425.3,
  "co2_emissions_tonnes": 650.09
}
```

**Request Fields:**
- `plant_id` (string, required): Power plant identifier
- `timestamp` (string, required): Data timestamp in ISO 8601 format
- `fuel_consumed_liters` (number, required): Fuel consumed in liters
- `energy_output_mwh` (number, required): Energy output in MWh
- `co2_emissions_tonnes` (number, required): CO2 emissions in tonnes

**Description:** Inserts a new power plant data record into the database.

**Response:**

```json
{
  "id": "uuid-new-record-1234",
  "plant_id": "Vaasa-Plant-A",
  "timestamp": "2024-09-20T00:00:00.000Z",
  "fuel_consumed_liters": 3250.45,
  "energy_output_mwh": 1425.3,
  "co2_emissions_tonnes": 650.09,
  "created_at": "2024-09-27T14:30:00.000Z"
}
```

**Status Codes:**
- `201 Created` - Record created successfully
- `400 Bad Request` - Invalid request data
- `503 Service Unavailable` - Database not configured

---

### 9. Plant Emissions Summary

Get emissions summary for a specific power plant.

**Endpoint:** `GET /api/plants/:plantId/emissions`

**Path Parameters:**
- `plantId` (string): Power plant identifier

**Query Parameters:**
- `hours` (optional): Hours back to analyze (default: 24, max: 168)

**Description:** Returns emissions summary for a specific plant over the specified time period.

**Response:**

```json
[
  {
    "plant_name": "Vaasa Plant A",
    "fuel_type": "Natural Gas",
    "total_emissions": 15600.25,
    "total_energy": 31200.5,
    "avg_emissions_per_mwh": 0.5,
    "data_points": 24
  }
]
```

**Response Fields:**
- `plant_name` (string): Plant display name
- `fuel_type` (string): Primary fuel type
- `total_emissions` (number): Total emissions in tonnes
- `total_energy` (number): Total energy output in MWh
- `avg_emissions_per_mwh` (number): Average emissions per MWh
- `data_points` (number): Number of data points analyzed

**Status Codes:**
- `200 OK` - Summary retrieved successfully
- `404 Not Found` - Plant not found
- `503 Service Unavailable` - Database not configured

---

### 10. Legacy Health Check

Simple health check for backward compatibility.

**Endpoint:** `GET /health`

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-09-27T14:30:00.000Z",
  "database": "Supabase"
}
```

**Status Codes:**
- `200 OK` - Server is healthy

---

## Data Models

### PowerPlantData

Represents a single data point from a power plant.

```typescript
interface PowerPlantData {
  id: string; // Unique record identifier
  plant_id: string; // Plant identifier
  timestamp: string; // ISO 8601 timestamp
  fuel_consumed_liters: number; // Fuel consumption in liters
  energy_output_mwh: number; // Energy output in MWh
  co2_emissions_tonnes: number; // CO2 emissions in tonnes
  created_at: string; // Record creation timestamp
  power_plants?: {
    id: string; // Plant identifier
    name: string; // Plant display name
    fuel_type: string; // Fuel type
  };
}
```

### EUETSReport

Represents an EU ETS compliance report.

```typescript
interface EUETSReport {
  id: string; // Report unique identifier
  reporting_period: string; // Reporting period
  total_emissions_tonnes: number; // Total emissions
  status: "Compliant" | "Non-Compliant" | "Pending"; // Compliance status
  generated_at: string; // Report generation timestamp
  created_at: string; // Record creation timestamp
}
```

### PowerPlantSummary

Represents aggregated power plant data.

```typescript
interface PowerPlantSummary {
  id: string; // Plant unique identifier
  name: string; // Plant name
  location: string; // Plant location
  fuel_type: string; // Primary fuel type
  capacity_mw: number; // Plant capacity in megawatts
  data_points: number; // Number of data records
  total_energy_output: number; // Total energy output in MWh
  total_co2_emissions: number; // Total CO2 emissions in tonnes
  avg_energy_output: number; // Average energy output in MWh
  avg_co2_emissions: number; // Average CO2 emissions in tonnes
  last_data_timestamp: string; // Timestamp of most recent data
}
```

---

## Error Handling

The API uses standard HTTP status codes to indicate success or failure:

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Database not configured

### Error Response Format

```json
{
  "error": "Error message",
  "message": "Detailed error description",
  "timestamp": "2024-09-27T14:30:00.000Z"
}
```

### Database Fallback Behavior

When Supabase is not configured, the API automatically falls back to mock data for compatible endpoints:

- ✅ `GET /api/data` - Returns mock data
- ✅ `POST /api/reports/eu-ets` - Calculates from mock data
- ❌ `GET /api/plants/summary` - Returns 503 error
- ❌ `GET /api/emissions/recent` - Returns 503 error
- ❌ `GET /api/reports/eu-ets` - Returns 503 error
- ❌ `POST /api/data` - Returns 503 error
- ❌ `GET /api/plants/:id/emissions` - Returns 503 error

---

## Rate Limiting

Currently, there are no rate limits implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

The API includes CORS (Cross-Origin Resource Sharing) headers to allow requests from the frontend application.

## Logging

Request logging can be enabled by setting `ENABLE_LOGGING=true` in the environment variables. This will log all incoming requests with timestamps and methods.

## Development

### Running the API

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run API tests
npm test
```

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Supabase Configuration (required for database features)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# API Configuration
PORT=4000
NODE_ENV=development

# Optional Features
ENABLE_LOGGING=true
ENABLE_CORS=true
```

### Testing

The API includes comprehensive test suites:

```bash
# Run basic API tests
npm test

# Run enhanced tests with database checks
node test-api-new.js
```

---

## Example Usage

### Using curl

```bash
# Health check
curl http://localhost:4000/api/health

# Get power plant data with limit
curl "http://localhost:4000/api/data?limit=10"

# Generate EU ETS report
curl -X POST http://localhost:4000/api/reports/eu-ets \
  -H "Content-Type: application/json" \
  -d '{"startDate": "2024-07-01", "endDate": "2024-10-01"}'

# Get plant emissions summary
curl "http://localhost:4000/api/plants/Vaasa-Plant-A/emissions?hours=48"

# Insert new data
curl -X POST http://localhost:4000/api/data \
  -H "Content-Type: application/json" \
  -d '{
    "plant_id": "Vaasa-Plant-A",
    "timestamp": "2024-09-20T00:00:00.000Z",
    "fuel_consumed_liters": 3250.45,
    "energy_output_mwh": 1425.3,
    "co2_emissions_tonnes": 650.09
  }'
```

### Using JavaScript/TypeScript

```typescript
// Fetch power plant data
const response = await fetch("http://localhost:4000/api/data?limit=100");
const data = await response.json();

// Generate EU ETS report
const reportResponse = await fetch("http://localhost:4000/api/reports/eu-ets", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    startDate: "2024-07-01",
    endDate: "2024-10-01"
  })
});
const report = await reportResponse.json();

// Get plant emissions summary
const emissionsResponse = await fetch(
  "http://localhost:4000/api/plants/Vaasa-Plant-A/emissions?hours=24"
);
const emissions = await emissionsResponse.json();
```

### Using axios

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 10000
});

// Get power plant data
const { data } = await api.get("/api/data", {
  params: { limit: 100 }
});

// Generate EU ETS report
const { data: report } = await api.post("/api/reports/eu-ets", {
  startDate: "2024-07-01",
  endDate: "2024-10-01"
});

// Get plant summary
const { data: summary } = await api.get("/api/plants/summary");
```

---

## Production Deployment

### Environment Setup

1. **Configure Supabase**:
   - Create Supabase project
   - Get service role key
   - Run database schema

2. **Set Environment Variables**:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NODE_ENV=production
   PORT=4000
   ```

3. **Deploy**:
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

---

## Future Enhancements

Planned improvements for the API:

1. **Authentication & Authorization**: JWT-based authentication with role-based access
2. **Real-time Subscriptions**: WebSocket support for live data updates
3. **Advanced Filtering**: Query parameters for complex data filtering
4. **Pagination**: Cursor-based pagination for large datasets
5. **Data Validation**: Comprehensive request validation middleware
6. **Metrics & Monitoring**: API usage metrics and performance monitoring
7. **Rate Limiting**: Implement rate limiting for production use
8. **Caching**: Redis-based caching for improved performance
9. **API Versioning**: Version management for backward compatibility
10. **OpenAPI Specification**: Complete OpenAPI 3.0 specification

---

## Support

For API support or questions:

- 📚 **Documentation**: Refer to this documentation and setup guides
- 🐛 **Issues**: Report bugs via project issue tracker
- 💬 **Contact**: Reach out to the Veridi OS development team
- 🔧 **Setup Help**: Use the `BACKEND_SETUP_GUIDE.md` for detailed setup instructions

---

## Changelog

### Version 2.0.0 (Current)
- ✅ Supabase database integration
- ✅ Enhanced API endpoints
- ✅ Real-time data operations
- ✅ Comprehensive error handling
- ✅ Production-ready features

### Version 1.0.0 (Legacy)
- ✅ Basic mock data endpoints
- ✅ Simple EU ETS report generation
- ✅ Health check endpoints
