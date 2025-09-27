import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "./hooks/useTheme";
import { store } from "./state/store";
import MainLayout from "./components/layout/MainLayout";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Dashboard from "./components/common/Dashboard";
import ReportGenerator from "./components/common/ReportGenerator";
import RegulationsPage from "./components/common/RegulationsPage";
import ScatterPage from "./pages/ScatterPage";
import NetZeroPage from "./pages/NetZeroPage";
import ComprehensiveSustainabilityDashboard from "./components/common/SustainabilityDashboard";
import MockDataToggle from "./components/common/MockDataToggle";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ErrorBoundary>
          <Router>
            <MainLayout>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ErrorBoundary>
                      <ComprehensiveSustainabilityDashboard />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/regulations"
                  element={
                    <ErrorBoundary>
                      <RegulationsPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/sustainability"
                  element={
                    <ErrorBoundary>
                      <ComprehensiveSustainabilityDashboard />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/sustainability/scatter"
                  element={
                    <ErrorBoundary>
                      <ScatterPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/sustainability/netzero"
                  element={
                    <ErrorBoundary>
                      <NetZeroPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/regulations/eu-ets"
                  element={
                    <ErrorBoundary>
                      <div className="container mx-auto px-4 py-8 max-w-6xl">
                        <div className="section-header fade-in">
                          <h1 className="section-title">EU ETS Compliance</h1>
                          <p className="section-subtitle">
                            Comprehensive European Union Emissions Trading
                            System compliance monitoring and reporting
                          </p>
                        </div>
                        <div className="glass-card-hover rounded-2xl p-8 card-hover">
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <span className="text-white text-2xl">🇪🇺</span>
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                EU ETS Dashboard
                              </h2>
                              <p className="text-neutral-600 dark:text-neutral-400">
                                Monitor your carbon allowances and compliance
                                status
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="metric-card">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                                  Allowances
                                </h3>
                                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                                  <span className="text-white text-lg">📊</span>
                                </div>
                              </div>
                              <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                2,450
                              </div>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Available allowances
                              </p>
                            </div>
                            <div className="metric-card">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                                  Emissions
                                </h3>
                                <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                                  <span className="text-white text-lg">🌍</span>
                                </div>
                              </div>
                              <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                1,890
                              </div>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                tCO₂ emitted
                              </p>
                            </div>
                            <div className="metric-card">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                                  Compliance
                                </h3>
                                <div className="w-10 h-10 bg-gradient-to-r from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                                  <span className="text-white text-lg">✅</span>
                                </div>
                              </div>
                              <div className="text-3xl font-bold text-success-600 dark:text-success-400 mb-2">
                                100%
                              </div>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Compliance rate
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ErrorBoundary>
                      <div className="container mx-auto px-4 py-8 max-w-6xl">
                        <div className="section-header fade-in">
                          <h1 className="section-title">
                            Sustainability Reports
                          </h1>
                          <p className="section-subtitle">
                            Generate comprehensive reports on your
                            sustainability performance and compliance metrics
                          </p>
                        </div>
                        <div className="glass-card-hover rounded-2xl p-8 card-hover">
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <span className="text-white text-2xl">📄</span>
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                Report Generator
                              </h2>
                              <p className="text-neutral-600 dark:text-neutral-400">
                                Create detailed sustainability and compliance
                                reports
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="metric-card">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                                  Monthly Reports
                                </h3>
                                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                                  <span className="text-white text-lg">📅</span>
                                </div>
                              </div>
                              <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                12
                              </div>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Reports generated this year
                              </p>
                            </div>
                            <div className="metric-card">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                                  Compliance Score
                                </h3>
                                <div className="w-10 h-10 bg-gradient-to-r from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                                  <span className="text-white text-lg">🎯</span>
                                </div>
                              </div>
                              <div className="text-3xl font-bold text-success-600 dark:text-success-400 mb-2">
                                98%
                              </div>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Average compliance rate
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ErrorBoundary>
                      <ComprehensiveSustainabilityDashboard />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/power-plants"
                  element={
                    <ErrorBoundary>
                      <Dashboard />
                      <ReportGenerator />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ErrorBoundary>
                      <div className="container mx-auto px-4 py-8 max-w-6xl">
                        <div className="section-header fade-in">
                          <h1 className="section-title">System Settings</h1>
                          <p className="section-subtitle">
                            Configure your sustainability intelligence platform
                            preferences and system parameters
                          </p>
                        </div>
                        <div className="glass-card-hover rounded-2xl p-8 card-hover">
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-neutral-500 to-neutral-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <span className="text-white text-2xl">⚙️</span>
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                Configuration Center
                              </h2>
                              <p className="text-neutral-600 dark:text-neutral-400">
                                Manage your platform settings and preferences
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="metric-card">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                                  Data Sources
                                </h3>
                                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                                  <span className="text-white text-lg">🔗</span>
                                </div>
                              </div>
                              <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                5
                              </div>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Connected data sources
                              </p>
                            </div>
                            <div className="metric-card">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                                  Alerts
                                </h3>
                                <div className="w-10 h-10 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl flex items-center justify-center">
                                  <span className="text-white text-lg">🔔</span>
                                </div>
                              </div>
                              <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                12
                              </div>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Active notifications
                              </p>
                            </div>
                            <div className="metric-card">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                                  Users
                                </h3>
                                <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                                  <span className="text-white text-lg">👥</span>
                                </div>
                              </div>
                              <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                8
                              </div>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Active users
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ErrorBoundary>
                  }
                />
              </Routes>
            </MainLayout>
            <MockDataToggle />
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
