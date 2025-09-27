# Veridi OS Backend - Supabase Integration Guide

## 🚀 Overview

The Veridi OS backend has been updated to integrate with Supabase, providing real-time database operations while maintaining backward compatibility with mock data fallback.

## 📦 Dependencies

The backend now includes:
- `@supabase/supabase-js` - Supabase client library
- `dotenv` - Environment variable management
- `express` - Web framework
- `cors` - Cross-origin resource sharing

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd veridi-os/backend
npm install
```

### 2. Environment Configuration

Copy the example environment file:
```bash
cp env.example .env
```

Update your `.env` file with Supabase credentials:
```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# API Configuration
PORT=4000
NODE_ENV=development

# Optional Features
ENABLE_LOGGING=true
ENABLE_CORS=true
```

### 3. Supabase Setup

1. **Create Supabase Project** (if not already done)
2. **Get Service Role Key**:
   - Go to Supabase Dashboard → Settings → API
   - Copy the `service_role` key (not the `anon` key)
3. **Run Database Schema**:
   - Go to SQL Editor in Supabase Dashboard
   - Run the schema from `supabase-schema.sql`

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 🛠️ API Endpoints

### Core Endpoints

#### **GET /** - Root Endpoint
- **Description**: Basic API status and database connection info
- **Response**: API status, database type, timestamp

#### **GET /api/health** - Health Check
- **Description**: Detailed health check with database connection test
- **Response**: Status, database connection details, timestamp

#### **GET /api/data** - Power Plant Data
- **Description**: Fetch power plant data from database
- **Query Parameters**:
  - `limit` (optional): Number of records to return (default: 1000)
- **Fallback**: Returns mock data if Supabase not configured

### Database-Dependent Endpoints

#### **GET /api/plants/summary** - Power Plants Summary
- **Description**: Get aggregated power plant data
- **Requires**: Supabase connection
- **Fallback**: Returns 503 error if not configured

#### **GET /api/emissions/recent** - Recent Emissions
- **Description**: Get recent emissions data (last 24 hours)
- **Query Parameters**:
  - `limit` (optional): Number of records (default: 100)
- **Requires**: Supabase connection

#### **POST /api/reports/eu-ets** - Generate EU ETS Report
- **Description**: Generate new EU ETS compliance report
- **Body**:
  ```json
  {
    "startDate": "2024-07-01",
    "endDate": "2024-10-01"
  }
  ```
- **Fallback**: Calculates from mock data if Supabase not configured

#### **GET /api/reports/eu-ets** - Get EU ETS Reports
- **Description**: Fetch all EU ETS reports
- **Query Parameters**:
  - `limit` (optional): Number of reports (default: 50)
- **Requires**: Supabase connection

#### **POST /api/data** - Insert Power Plant Data
- **Description**: Insert new power plant data record
- **Body**: Power plant data object
- **Requires**: Supabase connection

#### **GET /api/plants/:plantId/emissions** - Plant Emissions Summary
- **Description**: Get emissions summary for specific plant
- **Path Parameters**:
  - `plantId`: Power plant identifier
- **Query Parameters**:
  - `hours` (optional): Hours back to analyze (default: 24)
- **Requires**: Supabase connection

### Legacy Endpoints

#### **GET /health** - Legacy Health Check
- **Description**: Simple health check for backward compatibility
- **Response**: Basic status and database type

## 🔄 Database Service Layer

The backend includes a comprehensive `DatabaseService` class that handles:

### **Connection Management**
- Automatic Supabase connection detection
- Graceful fallback to mock data
- Connection testing and health checks

### **Data Operations**
- Power plant data CRUD operations
- EU ETS report generation and retrieval
- Aggregated data queries
- Real-time data subscriptions

### **Error Handling**
- Comprehensive error catching and logging
- Graceful degradation when database unavailable
- Detailed error responses for debugging

## 🧪 Testing

### Run API Tests
```bash
npm test
```

### Test Database Connection
```bash
node test-api-new.js
```

The test suite includes:
- ✅ Health check endpoints
- ✅ Data retrieval endpoints
- ✅ Report generation endpoints
- ✅ Database connection testing
- ✅ Error handling validation

## 🔒 Security Features

### **Environment Variables**
- Sensitive credentials stored in `.env` file
- Service role key for backend operations
- Configurable logging and CORS settings

### **Error Handling**
- No sensitive data exposed in error messages
- Detailed logging for development
- Graceful error responses for production

### **CORS Configuration**
- Configurable CORS settings
- Secure cross-origin requests
- Environment-specific configuration

## 📊 Monitoring & Logging

### **Request Logging**
- Optional request logging middleware
- Timestamp and method tracking
- Configurable via `ENABLE_LOGGING` environment variable

### **Error Logging**
- Comprehensive error logging
- Database connection status tracking
- Performance monitoring capabilities

### **Health Monitoring**
- Multiple health check endpoints
- Database connection status
- API availability monitoring

## 🚀 Deployment

### **Development**
```bash
npm run dev
```

### **Production**
```bash
npm start
```

### **Docker**
```bash
docker build -t veridi-os-backend .
docker run -p 4000:4000 veridi-os-backend
```

## 🔧 Configuration Options

### **Environment Variables**

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SUPABASE_URL` | Supabase project URL | - | Yes (for DB) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | - | Yes (for DB) |
| `PORT` | Server port | 4000 | No |
| `NODE_ENV` | Environment | development | No |
| `ENABLE_LOGGING` | Enable request logging | false | No |
| `ENABLE_CORS` | Enable CORS | true | No |

### **Feature Flags**
- **Database Mode**: Automatically detects Supabase configuration
- **Mock Data Fallback**: Graceful degradation when database unavailable
- **Logging**: Configurable request and error logging
- **CORS**: Configurable cross-origin resource sharing

## 🎯 Benefits

### **Production Ready**
- ✅ **Real Database**: PostgreSQL with Supabase
- ✅ **Scalable**: Handles high traffic loads
- ✅ **Secure**: Service role authentication
- ✅ **Reliable**: Comprehensive error handling

### **Developer Experience**
- ✅ **Easy Setup**: Simple environment configuration
- ✅ **Mock Fallback**: Works without database setup
- ✅ **Comprehensive Testing**: Full test suite included
- ✅ **Detailed Logging**: Debug-friendly error messages

### **Business Value**
- ✅ **Real-time Data**: Live database operations
- ✅ **Compliance**: Automated EU ETS reporting
- ✅ **Analytics**: Advanced data aggregation
- ✅ **Monitoring**: Health checks and status endpoints

## 🔮 Next Steps

1. **Set up Supabase project** using the provided credentials
2. **Configure environment variables** with your Supabase details
3. **Run the database schema** to create tables and sample data
4. **Test the API endpoints** using the included test suite
5. **Deploy to production** with confidence

The backend is now **enterprise-ready** with real-time database capabilities, comprehensive error handling, and production-grade monitoring! 🚀
