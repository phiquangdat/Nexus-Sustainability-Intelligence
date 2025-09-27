# Veridi OS API Testing Guide

## 🧪 Testing Overview

This guide covers all the ways to test the Veridi OS API, from automated scripts to manual testing tools.

## 🚀 Quick Testing

### 1. Automated Test Suite
```bash
# Start the server first
cd veridi-os/backend
npm run dev

# In another terminal, run tests
npm test
```

### 2. Manual Testing with curl
```bash
# Health check
curl http://localhost:4000/health

# Get power plant data
curl http://localhost:4000/api/data

# Generate EU ETS report
curl http://localhost:4000/api/reports/eu-ets
```

### 3. Postman Collection
1. Import `Veridi_OS_API.postman_collection.json` into Postman
2. Set `base_url` variable to `http://localhost:4000`
3. Run the collection

## 📋 Test Coverage

### Endpoints Tested
- ✅ `GET /health` - Server health check
- ✅ `GET /` - Root endpoint
- ✅ `GET /api/data` - Power plant data
- ✅ `GET /api/reports/eu-ets` - EU ETS report

### Test Scenarios
- ✅ Server connectivity
- ✅ Response status codes
- ✅ JSON response format
- ✅ Data structure validation
- ✅ Error handling

## 🔧 Testing Tools

### 1. Automated Test Script (`test-api.js`)
**Features:**
- Tests all endpoints automatically
- Color-coded output
- Detailed response analysis
- Error handling and timeouts
- Summary report

**Usage:**
```bash
node test-api.js
npm test
npm run test:api
```

### 2. Postman Collection
**Features:**
- Pre-configured requests
- Example responses
- Environment variables
- Request/response validation

**Setup:**
1. Import `Veridi_OS_API.postman_collection.json`
2. Set `base_url` variable
3. Run collection

### 3. OpenAPI Specification
**Features:**
- Complete API schema
- Request/response validation
- Interactive documentation
- Client SDK generation

**Usage:**
- Import `openapi.yaml` into Swagger UI
- Use with OpenAPI Generator
- Validate API responses

## 📊 Expected Responses

### Health Check (`/health`)
```json
{
  "status": "OK",
  "timestamp": "2024-09-27T14:30:00.000Z"
}
```

### Power Plant Data (`/api/data`)
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

### EU ETS Report (`/api/reports/eu-ets`)
```json
{
  "total_emissions_tonnes": 18547.32,
  "reporting_period": "Q3 2024",
  "status": "Compliant"
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Server Not Running
**Error:** `Server is not running or not accessible`
**Solution:**
```bash
cd veridi-os/backend
npm run dev
```

#### 2. Port Already in Use
**Error:** `EADDRINUSE: address already in use :::4000`
**Solution:**
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or use different port
PORT=4001 npm run dev
```

#### 3. Connection Refused
**Error:** `ECONNREFUSED`
**Solution:**
- Check if server is running
- Verify port number
- Check firewall settings

### Debug Mode
```bash
# Run with debug logging
DEBUG=* npm run dev

# Or with verbose output
npm run dev -- --verbose
```

## 📈 Performance Testing

### Load Testing with curl
```bash
# Test multiple concurrent requests
for i in {1..10}; do
  curl http://localhost:4000/api/data &
done
wait
```

### Response Time Testing
```bash
# Measure response time
time curl -s http://localhost:4000/api/data > /dev/null
```

## 🔍 Validation Checklist

### ✅ API Health
- [ ] Server responds to health check
- [ ] All endpoints return 200 status
- [ ] JSON responses are valid
- [ ] CORS headers are present

### ✅ Data Quality
- [ ] Power plant data has required fields
- [ ] Timestamps are valid ISO format
- [ ] Numeric values are reasonable
- [ ] Plant IDs are consistent

### ✅ Error Handling
- [ ] Invalid endpoints return 404
- [ ] Server errors return 500
- [ ] Error responses include message
- [ ] Timeouts are handled gracefully

## 📝 Test Reports

### Automated Test Output
```
Veridi OS API Test Suite
Base URL: http://localhost:4000
Testing 4 endpoints...

Testing Health Check...
GET /health
✓ Success (200)
Response:
{
  "status": "OK",
  "timestamp": "2024-09-27T14:30:00.000Z"
}

Test Summary
==================================================
Health Check: ✓ PASS
Root Endpoint: ✓ PASS
Power Plant Data: ✓ PASS
EU ETS Report: ✓ PASS
==================================================
Total: 4 passed, 0 failed
All tests passed! 🎉
```

## 🚀 Continuous Integration

### GitHub Actions Example
```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd veridi-os/backend && npm install
      - run: cd veridi-os/backend && npm run dev &
      - run: sleep 5 && cd veridi-os/backend && npm test
```

## 📚 Additional Resources

- [API Documentation](./API_DOCUMENTATION.md)
- [OpenAPI Specification](./backend/openapi.yaml)
- [Postman Collection](./backend/Veridi_OS_API.postman_collection.json)
- [Mock Data System](./frontend/src/mockData/README.md)
