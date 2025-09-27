// Development configuration for Veridi OS

export const developmentConfig = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  
  // Mock Data Configuration
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true' || 
               import.meta.env.NODE_ENV === 'development',
  
  // Development Features
  showMockDataToggle: import.meta.env.NODE_ENV === 'development',
  enableConsoleLogging: import.meta.env.NODE_ENV === 'development',
  
  // Mock Data Scenarios
  mockScenarios: {
    normal: 'normal',
    highEmissions: 'highEmissions',
    lowEmissions: 'lowEmissions',
    peakDemand: 'peakDemand'
  }
};

// Environment variables documentation
export const envVars = {
  VITE_API_URL: 'Backend API URL (default: http://localhost:4000)',
  VITE_USE_MOCK_DATA: 'Force mock data usage (true/false)',
  NODE_ENV: 'Environment (development/production)'
};
