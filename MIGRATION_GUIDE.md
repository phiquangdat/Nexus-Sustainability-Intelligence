# Migration Guide: Converting Standalone Modules to Full Stack

This guide documents the successful conversion of the standalone Python modules (`analysis/`, `simulator/`, `streamlit_app/`, `supabase/`) into a comprehensive full-stack application integrated with the existing `veridi-os` platform.

## Migration Summary

| Original Module  | Converted To                    | Status      |
| ---------------- | ------------------------------- | ----------- |
| `analysis/`      | Backend service + API endpoints | ✅ Complete |
| `simulator/`     | Backend service + API endpoints | ✅ Complete |
| `streamlit_app/` | React components + pages        | ✅ Complete |
| `supabase/`      | Integrated database schema      | ✅ Complete |

## Detailed Migration

### 1. Analysis Module (`analysis/`)

**Original Structure:**

```
analysis/
├── __init__.py
├── cli.py
├── data_access.py
├── goal_tracker.py
└── metrics.py
```

**Converted To:**

- **Backend Service**: `veridi-os/backend/services/analysisService.js`
- **Frontend Service**: `veridi-os/frontend/src/services/analysisService.ts`
- **API Endpoints**: Added to `veridi-os/backend/server.js`

**Key Changes:**

- Python → JavaScript/Node.js conversion
- CLI interface → REST API endpoints
- Direct Supabase access → Service layer abstraction
- Pandas/numpy → Native JavaScript calculations

**New API Endpoints:**

- `GET /api/analysis` - Comprehensive analysis
- `GET /api/analysis/summaries` - Analysis summaries only
- `GET /api/analysis/goal-tracker` - Goal tracker metrics

### 2. Simulator Module (`simulator/`)

**Original Structure:**

```
simulator/
├── __init__.py
├── bias.py
├── config.py
├── models.py
├── simulate.py
├── storage.py
└── supabase_client.py
```

**Converted To:**

- **Backend Service**: `veridi-os/backend/services/simulatorService.js`
- **API Endpoints**: Added to `veridi-os/backend/server.js`

**Key Changes:**

- Python → JavaScript/Node.js conversion
- CLI interface → REST API endpoints
- File-based configuration → Environment variables
- CSV output → Supabase integration

**New API Endpoints:**

- `POST /api/simulator/run-once` - Run simulation once
- `POST /api/simulator/generate-historical` - Generate historical data
- `POST /api/simulator/start-continuous` - Start continuous simulation
- `GET /api/simulator/config` - Get simulator configuration

### 3. Streamlit App (`streamlit_app/`)

**Original Structure:**

```
streamlit_app/
├── __init__.py
├── Home.py
├── NetZero.py
├── Scatter.py
└── lib.py
```

**Converted To:**

- **React Pages**: `veridi-os/frontend/src/pages/NetZeroPage.tsx`, `ScatterPage.tsx`
- **Enhanced Dashboard**: Updated `veridi-os/frontend/src/components/SustainabilityDashboard.tsx`
- **Service Integration**: `veridi-os/frontend/src/services/analysisService.ts`

**Key Changes:**

- Python Streamlit → React/TypeScript
- Plotly → Recharts
- Streamlit widgets → React components
- Direct database access → API service calls

**New Frontend Routes:**

- `/sustainability/netzero` - Net-zero trajectory visualization
- `/sustainability/scatter` - Correlation analysis
- `/sustainability` - Enhanced dashboard

### 4. Supabase Schema (`supabase/`)

**Original Structure:**

```
supabase/sql/
├── 01_schema_tables.sql
├── 02_indexes.sql
├── 03_rls_policies.sql
└── 04_realtime.sql
```

**Converted To:**

- **Comprehensive Schema**: `veridi-os/backend/comprehensive-supabase-schema.sql`
- **Enhanced Database Service**: Updated `veridi-os/backend/services/databaseService.js`

**Key Changes:**

- Integrated with existing power plant data
- Added views for common queries
- Enhanced RLS policies
- Added sample data for development

## Configuration Changes

### Backend Configuration

**Environment Variables Added:**

```bash
# Simulator Configuration
SIM_TIMEZONE=UTC
SIM_WALL_INTERVAL_SECONDS=5
SIM_STEP_MINUTES=15
SIM_RANDOM_SEED=42
OUTPUT_MODE=supabase
CSV_OUTPUT_DIR=data

# Table Names
TABLE_CO2_INTENSITY=co2_intensity
TABLE_GENERATION_MIX=generation_mix
TABLE_NETZERO_ALIGNMENT=netzero_alignment
```

**Package Dependencies Added:**

- No new dependencies required (using existing Supabase client)

### Frontend Configuration

**Environment Variables Added:**

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

**Package Dependencies Added:**

- No new dependencies required (using existing Recharts)

## Database Migration

### Schema Updates

1. **Apply Comprehensive Schema:**

   ```sql
   -- Run the comprehensive schema
   \i veridi-os/backend/comprehensive-supabase-schema.sql
   ```

2. **Verify Tables Created:**

   ```sql
   -- Check new tables
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('co2_intensity', 'generation_mix', 'netzero_alignment');
   ```

3. **Verify Sample Data:**
   ```sql
   -- Check sample data
   SELECT COUNT(*) FROM co2_intensity;
   SELECT COUNT(*) FROM generation_mix;
   SELECT COUNT(*) FROM netzero_alignment;
   ```

## Testing the Migration

### Backend Testing

1. **Start Backend Server:**

   ```bash
   cd veridi-os/backend
   npm start
   ```

2. **Test API Endpoints:**

   ```bash
   # Test analysis endpoint
   curl http://localhost:4000/api/analysis?limit=10

   # Test simulator endpoint
   curl -X POST http://localhost:4000/api/simulator/run-once

   # Test health check
   curl http://localhost:4000/api/health
   ```

### Frontend Testing

1. **Start Frontend Server:**

   ```bash
   cd veridi-os/frontend
   npm run dev
   ```

2. **Test New Pages:**
   - Navigate to `http://localhost:3000/sustainability/netzero`
   - Navigate to `http://localhost:3000/sustainability/scatter`
   - Navigate to `http://localhost:3000/sustainability`

### Docker Testing

1. **Build and Run with Docker:**

   ```bash
   cd veridi-os
   docker compose up --build
   ```

2. **Verify Services:**
   - Backend: `http://localhost:4000`
   - Frontend: `http://localhost:3000`
   - API Docs: `http://localhost:4000/api-docs`

## Rollback Plan

If you need to rollback the migration:

1. **Remove New Files:**

   ```bash
   rm veridi-os/backend/services/analysisService.js
   rm veridi-os/backend/services/simulatorService.js
   rm veridi-os/frontend/src/pages/NetZeroPage.tsx
   rm veridi-os/frontend/src/pages/ScatterPage.tsx
   rm veridi-os/frontend/src/services/analysisService.ts
   ```

2. **Revert Server Changes:**

   - Remove new service imports from `server.js`
   - Remove new API endpoints
   - Remove new service initializations

3. **Revert Database Changes:**
   ```sql
   -- Drop new tables (if needed)
   DROP TABLE IF EXISTS co2_intensity CASCADE;
   DROP TABLE IF EXISTS generation_mix CASCADE;
   DROP TABLE IF EXISTS netzero_alignment CASCADE;
   ```

## Benefits of Migration

1. **Unified Platform**: All sustainability intelligence features in one application
2. **Real-time Capabilities**: Live data simulation and analysis
3. **Scalable Architecture**: REST API design supports multiple clients
4. **Production Ready**: Comprehensive error handling and security
5. **Developer Friendly**: Clear separation of concerns and documentation

## Next Steps

1. **Production Deployment**: Configure production environment variables
2. **Data Integration**: Connect to real data sources
3. **Advanced Analytics**: Implement ML models for predictive analysis
4. **Reporting**: Add automated report generation
5. **Monitoring**: Implement comprehensive logging and monitoring

## Support

For issues or questions about the migration:

1. Check the API documentation at `/api-docs`
2. Review the comprehensive schema file
3. Test individual components using the provided curl commands
4. Check Docker logs for any container issues

The migration successfully converts all standalone Python modules into a cohesive full-stack application while maintaining all original functionality and adding new capabilities.
