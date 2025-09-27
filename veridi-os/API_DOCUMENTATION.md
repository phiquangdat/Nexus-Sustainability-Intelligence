# Veridi OS API Documentation

## 📚 Documentation Overview

This directory contains comprehensive API documentation for the Veridi OS sustainability intelligence platform.

## 📁 Documentation Files

### Core Documentation
- **[API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)** - Complete API reference with examples
- **[openapi.yaml](./backend/openapi.yaml)** - OpenAPI 3.0 specification
- **[Veridi_OS_API.postman_collection.json](./backend/Veridi_OS_API.postman_collection.json)** - Postman collection for testing

### Testing & Tools
- **[test-api.js](./backend/test-api.js)** - Automated API testing script
- **[Mock Data Documentation](./frontend/src/mockData/README.md)** - Frontend mock data system

## 🚀 Quick Start

### 1. Start the API Server
```bash
cd veridi-os/backend
npm install
npm run dev
```

### 2. Test the API
```bash
# Run automated tests
npm test

# Or manually test endpoints
curl http://localhost:4000/health
curl http://localhost:4000/api/data
curl http://localhost:4000/api/reports/eu-ets
```

### 3. Import Postman Collection
1. Open Postman
2. Import the `Veridi_OS_API.postman_collection.json` file
3. Set the `base_url` variable to `http://localhost:4000`

## 📋 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/` | Root endpoint |
| `GET` | `/api/data` | Power plant data |
| `GET` | `/api/reports/eu-ets` | EU ETS compliance report |

## 🔧 Development Tools

### API Testing Script
```bash
# Test all endpoints
node test-api.js

# Or use npm script
npm run test:api
```

### Postman Collection
- Import `Veridi_OS_API.postman_collection.json` into Postman
- Set environment variable `base_url` to your API URL
- Run the collection to test all endpoints

### OpenAPI Specification
- Use the `openapi.yaml` file with Swagger UI or other OpenAPI tools
- Generate client SDKs using OpenAPI Generator
- Validate API responses against the specification

## 📊 Data Models

### PowerPlantData
```typescript
interface PowerPlantData {
  timestamp: string;           // ISO 8601 timestamp
  plant_id: string;           // Plant identifier
  fuel_type: string;          // Fuel type (Natural Gas, HFO)
  fuel_consumed_liters: number; // Fuel consumption in liters
  energy_output_mwh: number;   // Energy output in MWh
  co2_emissions_tonnes: number; // CO2 emissions in tonnes
}
```

### EUETSReport
```typescript
interface EUETSReport {
  total_emissions_tonnes: number; // Total emissions
  reporting_period: string;        // Reporting period
  status: string;                  // Compliance status
}
```

## 🌐 Base URLs

- **Development**: `http://localhost:4000`
- **Production**: `https://api.veridi-os.com` (planned)

## 📝 Example Requests

### Health Check
```bash
curl -X GET http://localhost:4000/health
```

### Get Power Plant Data
```bash
curl -X GET http://localhost:4000/api/data
```

### Generate EU ETS Report
```bash
curl -X GET http://localhost:4000/api/reports/eu-ets
```

## 🔍 Response Examples

### Health Check Response
```json
{
  "status": "OK",
  "timestamp": "2024-09-27T14:30:00.000Z"
}
```

### Power Plant Data Response
```json
[
  {
    "timestamp": "2024-09-20T00:00:00.000Z",
    "plant_id": "Vaasa-Plant-A",
    "fuel_type": "Natural Gas",
    "fuel_consumed_liters": 3250.45,
    "energy_output_mwh": 1425.30,
    "co2_emissions_tonnes": 650.09
  }
]
```

### EU ETS Report Response
```json
{
  "total_emissions_tonnes": 18547.32,
  "reporting_period": "Q3 2024",
  "status": "Compliant"
}
```

## 🛠️ Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### Environment Variables
- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)

## 📈 Future Enhancements

### Planned Features
1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control
   - API key management

2. **Advanced Data Features**
   - Data filtering by date range, plant, fuel type
   - Pagination for large datasets
   - Real-time data via WebSockets
   - Data export functionality

3. **Monitoring & Analytics**
   - API usage metrics
   - Performance monitoring
   - Request/response logging
   - Rate limiting

4. **Security Enhancements**
   - HTTPS enforcement
   - CORS configuration
   - Input validation
   - SQL injection protection

## 🤝 Contributing

### API Development Guidelines
1. Follow RESTful conventions
2. Use consistent error responses
3. Include comprehensive documentation
4. Write tests for all endpoints
5. Update OpenAPI specification

### Testing Guidelines
1. Test all endpoints manually
2. Run automated test suite
3. Verify response formats
4. Check error handling
5. Validate data integrity

## 📞 Support

For API support or questions:
- Check the comprehensive documentation in `backend/API_DOCUMENTATION.md`
- Run the test suite to verify functionality
- Use the Postman collection for manual testing
- Refer to the OpenAPI specification for detailed schemas

## 🔗 Related Documentation

- [Frontend Mock Data System](./frontend/src/mockData/README.md)
- [Docker Configuration](./README.md#docker-configuration)
- [Project Structure](./README.md#project-structure)
