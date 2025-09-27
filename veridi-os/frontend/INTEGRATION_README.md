# Veridi OS Frontend - Comprehensive Sustainability Intelligence Platform

## Overview

This frontend integrates all Python sustainability intelligence components (`analysis/`, `simulator/`, `streamlit_app/`, `supabase/`) into a modern React/TypeScript application. It provides real-time sustainability metrics, goal tracking, and comprehensive analytics for power sector decarbonization.

## 🚀 Features

### Core Sustainability Intelligence

- **Real-time CO₂ Intensity Tracking** - Live monitoring of emissions per kWh
- **Generation Mix Analysis** - Comprehensive view of renewable vs fossil generation
- **Net-Zero Alignment Tracking** - Progress toward 2050 net-zero targets
- **Goal Tracker** - Real-time Alignment Index, YTD Carbon Budget, Decarbonization Velocity
- **2050 Pathway Visualization** - Target emissions trajectory and ETA calculations

### Advanced Analytics

- **Correlation Analysis** - Renewable share vs CO₂ intensity relationships
- **Trend Analysis** - Historical patterns and forecasting
- **Statistical Summaries** - Comprehensive data insights
- **Real-time Subscriptions** - Live data updates via Supabase

### Data Sources

- **Supabase Integration** - Real database connectivity with fallback
- **Simulated Data** - Realistic data generation for development/demo
- **CSV Export** - Data export capabilities
- **Mock Data Fallback** - Ensures functionality without database

## 🏗️ Architecture

### Services Layer

```
src/services/
├── supabaseService.ts      # Supabase client & data operations
├── dataAnalysisService.ts  # Python analysis algorithms (JS implementation)
├── dataSimulatorService.ts # Python simulator functionality (JS implementation)
└── dataService.ts          # Fallback service with mock data
```

### Components Layer

```
src/components/
├── SustainabilityDashboard.tsx  # Main comprehensive dashboard
├── CO2IntensityChart.tsx       # CO₂ intensity visualization
├── GenerationMixChart.tsx       # Generation mix charts
├── NetZeroAlignmentChart.tsx   # Net-zero progress tracking
├── GoalTracker.tsx             # Goal tracking metrics
├── ScatterChart.tsx            # Correlation analysis
└── SustainabilityKPIs.tsx      # Key performance indicators
```

### Hooks Layer

```
src/hooks/
└── useSustainabilityData.ts    # Comprehensive data management hook
```

## 🔧 Python Integration

### Analysis Module Integration

- **Goal Tracker Algorithm** - Complete JavaScript implementation of `analysis/goal_tracker.py`
- **Metrics Calculations** - Statistical analysis from `analysis/metrics.py`
- **Data Access Patterns** - Supabase connectivity from `analysis/data_access.py`

### Simulator Module Integration

- **Data Generation** - Realistic simulation from `simulator/simulate.py`
- **Bias Functions** - Weather, diurnal, and operational variations from `simulator/bias.py`
- **Configuration Management** - Environment-based config from `simulator/config.py`

### Streamlit App Integration

- **Home.py** - Main dashboard converted to React components
- **Scatter.py** - Correlation analysis converted to React charts
- **NetZero.py** - Net-zero tracking converted to React visualizations

### Supabase Integration

- **Database Schema** - Complete SQL schema from `supabase/sql/`
- **Real-time Subscriptions** - Live data updates
- **Data Operations** - CRUD operations with error handling

## 📊 Key Components

### Comprehensive Sustainability Dashboard

The main dashboard (`SustainabilityDashboard.tsx`) provides:

1. **Goal Tracker Section**

   - Real-time Alignment Index (RAI)
   - YTD Carbon Budget tracking
   - Decarbonization Velocity analysis
   - 2050 Pathway visualization

2. **KPI Cards**

   - Current CO₂ intensity
   - Renewable share percentage
   - Net-zero alignment percentage

3. **Interactive Charts**

   - CO₂ intensity time series
   - Generation mix stacked area chart
   - Current mix pie chart
   - Renewables vs CO₂ scatter plot

4. **Real-time Features**
   - Live data updates
   - Auto-refresh capabilities
   - Error handling and fallbacks

### Data Management Hook

The `useSustainabilityData` hook provides:

- **Unified Data State** - Single source of truth for all sustainability data
- **Real-time Subscriptions** - Automatic updates from Supabase
- **Simulated Data Generation** - Fallback data when database unavailable
- **Export Capabilities** - CSV export functionality
- **Statistical Analysis** - Built-in correlation and summary calculations

## 🛠️ Configuration

### Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Data Source Configuration
VITE_DEFAULT_DATA_SOURCE=simulated
VITE_AUTO_REFRESH_ENABLED=true
VITE_REFRESH_INTERVAL=30000

# Simulator Configuration
VITE_SIM_TIMEZONE=UTC
VITE_SIM_STEP_MINUTES=15
VITE_SIM_RANDOM_SEED=

# Development Settings
VITE_ENABLE_LOGGING=true
VITE_ENABLE_DEBUG_MODE=false
```

### Data Sources

1. **Supabase** - Primary data source with real-time capabilities
2. **Simulated** - Realistic data generation for development
3. **Mock** - Fallback data for offline functionality

## 🚀 Usage

### Basic Usage

```tsx
import SustainabilityDashboard from "./components/SustainabilityDashboard";

function App() {
  return <SustainabilityDashboard />;
}
```

### Advanced Usage with Hook

```tsx
import { useSustainabilityData } from "./hooks/useSustainabilityData";

function CustomDashboard() {
  const { co2Data, genData, goalTracker, loading, error, refresh, exportData } =
    useSustainabilityData({
      timeRange: "7d",
      useSimulatedData: false,
      autoRefresh: true,
      refreshInterval: 30000,
    });

  // Use data in your components
}
```

### Service Usage

```tsx
import { supabaseService } from "./services/supabaseService";
import { dataAnalysisService } from "./services/dataAnalysisService";
import { dataSimulatorService } from "./services/dataSimulatorService";

// Fetch data
const co2Data = await supabaseService.fetchCo2IntensityData(1000);

// Analyze data
const goalTracker = dataAnalysisService.computeGoalTracker(
  co2Data,
  genData,
  netZeroData
);

// Generate simulated data
const simulatedData = dataSimulatorService.generateAllData(1000);
```

## 📈 Performance Features

- **Lazy Loading** - Components load on demand
- **Memoization** - Optimized re-renders
- **Virtual Scrolling** - Efficient large dataset handling
- **Error Boundaries** - Isolated error handling
- **Loading States** - Smooth user experience
- **Real-time Optimization** - Efficient subscription management

## 🔄 Real-time Capabilities

- **Supabase Subscriptions** - Live data updates
- **Auto-refresh** - Configurable refresh intervals
- **Connection Management** - Automatic reconnection
- **Fallback Handling** - Graceful degradation

## 📊 Data Export

- **CSV Export** - All data types exportable
- **Statistical Summaries** - Built-in analysis
- **Correlation Analysis** - Renewable vs CO₂ relationships
- **Goal Tracker Metrics** - Comprehensive tracking data

## 🧪 Testing

The integrated frontend supports:

- **Unit Tests** - Service and hook testing
- **Integration Tests** - Component testing
- **E2E Tests** - Full workflow testing
- **Mock Data** - Consistent test data

## 🚀 Deployment

### Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Docker Deployment

```bash
docker build -t veridi-os-frontend .
docker run -p 3000:3000 veridi-os-frontend
```

## 🔗 Integration Points

### Backend API

- RESTful endpoints for data operations
- Real-time WebSocket connections
- Authentication and authorization

### Database

- Supabase PostgreSQL database
- Real-time subscriptions
- Row-level security

### External Services

- Weather data APIs (for realistic simulation)
- Market data feeds (for price signals)
- Regulatory compliance APIs

## 📚 Documentation

- **API Documentation** - Comprehensive API reference
- **Component Documentation** - React component guides
- **Service Documentation** - Service layer documentation
- **Hook Documentation** - Custom hook usage guides

## 🎯 Future Enhancements

- **Machine Learning Integration** - Predictive analytics
- **Advanced Visualizations** - 3D charts and interactive maps
- **Mobile Optimization** - Responsive design improvements
- **Offline Support** - Progressive Web App capabilities
- **Multi-tenant Support** - Enterprise features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This frontend successfully integrates all Python sustainability intelligence components into a modern, scalable React application while maintaining the original functionality and adding enhanced real-time capabilities.
