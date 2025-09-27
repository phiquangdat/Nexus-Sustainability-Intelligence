import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ReportGenerator from "./components/ReportGenerator";
import MockDataToggle from "./components/MockDataToggle";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Breadcrumb from "./components/Breadcrumb";
import RegulationsPage from "./components/RegulationsPage";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <Navbar />
          <Breadcrumb />
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary>
                  <Dashboard />
                  <ReportGenerator />
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
              path="/regulations/eu-ets"
              element={
                <ErrorBoundary>
                  <div className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold mb-6">
                      EU ETS Compliance
                    </h1>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <p className="text-gray-600">
                        EU ETS specific compliance information and tools.
                      </p>
                    </div>
                  </div>
                </ErrorBoundary>
              }
            />
            <Route
              path="/reports"
              element={
                <ErrorBoundary>
                  <div className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold mb-6">Reports</h1>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <p className="text-gray-600">
                        Generate and view sustainability reports.
                      </p>
                    </div>
                  </div>
                </ErrorBoundary>
              }
            />
            <Route
              path="/analytics"
              element={
                <ErrorBoundary>
                  <div className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold mb-6">Analytics</h1>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <p className="text-gray-600">
                        Advanced analytics and insights.
                      </p>
                    </div>
                  </div>
                </ErrorBoundary>
              }
            />
            <Route
              path="/settings"
              element={
                <ErrorBoundary>
                  <div className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold mb-6">Settings</h1>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <p className="text-gray-600">
                        Application settings and configuration.
                      </p>
                    </div>
                  </div>
                </ErrorBoundary>
              }
            />
          </Routes>
          <MockDataToggle />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
