import React, { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AnalysisService } from "../services/analysisService";

interface ScatterData {
  renewable_percentage: number;
  co2_intensity: number;
  plant_name: string;
  region: string;
}

const ScatterPage: React.FC = () => {
  const [data, setData] = useState<ScatterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScatterData();
  }, []);

  const loadScatterData = async () => {
    try {
      setLoading(true);
      setError(null);

      const analysis = await AnalysisService.getScatterAnalysis();
      const scatterData = analysis.data || [];

      setData(scatterData);
    } catch (err) {
      console.error("Error loading scatter data:", err);
      setError("Failed to load renewables vs CO₂ data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">
            Loading renewables vs CO₂ data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-error-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            Error Loading Data
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">{error}</p>
          <button onClick={loadScatterData} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="section-header fade-in">
          <h1 className="section-title">Renewables vs CO₂ Intensity</h1>
          <p className="section-subtitle">
            Correlation analysis showing the relationship between renewable
            energy percentage and CO₂ intensity across power plants
          </p>
        </div>

        {/* Main Chart */}
        <div className="glass-card-hover rounded-2xl p-8 card-hover mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">📈</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Scatter Plot Analysis
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Interactive visualization of renewable energy vs emissions
                correlation
              </p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart
                data={data}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  dataKey="renewable_percentage"
                  name="Renewable %"
                  unit="%"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis
                  type="number"
                  dataKey="co2_intensity"
                  name="CO₂ Intensity"
                  unit=" kg/MWh"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: any, name: string) => [
                    `${value}${name === "Renewable %" ? "%" : " kg/MWh"}`,
                    name,
                  ]}
                  labelFormatter={(_: string, payload: any[]) => {
                    if (payload && payload[0]) {
                      return `Plant: ${payload[0].payload.plant_name}`;
                    }
                    return "";
                  }}
                />
                <Scatter
                  dataKey="co2_intensity"
                  fill="#22c55e"
                  fillOpacity={0.6}
                  stroke="#16a34a"
                  strokeWidth={2}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                Data Points
              </h3>
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">📊</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              {data.length}
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Power plants analyzed
            </p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                Avg Renewable %
              </h3>
              <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🌱</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              {data.length > 0
                ? (
                    data.reduce(
                      (sum, item) => sum + item.renewable_percentage,
                      0
                    ) / data.length
                  ).toFixed(1)
                : "0.0"}
              %
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Average renewable energy
            </p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                Avg CO₂ Intensity
              </h3>
              <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🌍</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              {data.length > 0
                ? (
                    data.reduce((sum, item) => sum + item.co2_intensity, 0) /
                    data.length
                  ).toFixed(1)
                : "0.0"}
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              kg CO₂ per MWh
            </p>
          </div>
        </div>

        {/* Insights */}
        <div className="glass-card-hover rounded-2xl p-8 card-hover mb-8">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
            Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-success-500 to-success-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white">
                    Negative Correlation
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Higher renewable energy percentage correlates with lower CO₂
                    intensity
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">📈</span>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white">
                    Clear Trend
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    The scatter plot shows a clear downward trend as renewable
                    percentage increases
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🎯</span>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white">
                    Strategic Value
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Data supports renewable energy investment decisions and
                    sustainability goals
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">📊</span>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white">
                    Compliance Support
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Evidence for regulatory compliance and sustainability
                    reporting requirements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Note */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex">
            <svg
              className="w-5 h-5 text-yellow-400 mt-0.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> This correlation analysis provides evidence
              that renewable integration lowers emissions, supporting climate
              strategy narratives and sustainability disclosures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScatterPage;
