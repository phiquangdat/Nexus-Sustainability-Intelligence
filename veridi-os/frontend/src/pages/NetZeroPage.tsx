import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { analysisService } from "../services/analysisService";

interface NetZeroData {
  year: number;
  actual_emissions_mt: number;
  target_emissions_mt: number;
  alignment_pct: number;
}

const NetZeroPage: React.FC = () => {
  const [data, setData] = useState<NetZeroData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNetZeroData();
  }, []);

  const loadNetZeroData = async () => {
    try {
      setLoading(true);
      setError(null);

      const analysis = await analysisService.getAnalysis(200);
      const netZeroData = analysis.rawData.netzero_alignment || [];

      setData(netZeroData);
    } catch (err) {
      console.error("Error loading net-zero data:", err);
      setError("Failed to load net-zero alignment data");
    } finally {
      setLoading(false);
    }
  };

  const chartData = data.map((item) => ({
    year: item.year,
    actual: item.actual_emissions_mt,
    target: item.target_emissions_mt,
    alignment: item.alignment_pct,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading net-zero trajectory data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="text-red-600 mb-2">
              <svg
                className="w-8 h-8 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Data
            </h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={loadNetZeroData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Net-zero Trajectory
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Annual actual vs target emissions for alignment with a 2050 net-zero
            pathway. Supports CSRD/ESRS narrative on progress, with room to add
            confidence intervals and scenario overlays.
          </p>
        </div>

        {/* Info Panel */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            How to Read This Chart
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Lines</h3>
              <p className="text-sm text-blue-700">
                Actual emissions vs target pathway (Mt). The gap between lines
                shows progress toward net-zero goals.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Gap Analysis</h3>
              <p className="text-sm text-blue-700">
                Actual above target → behind schedule; below target → ahead of
                plan. This aligns with ESRS climate metrics and long-term
                decarbonization plans.
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Actual vs Target Emissions
          </h2>

          {data.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Data Available
              </h3>
              <p className="text-gray-600">
                No yearly net-zero alignment data found.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  type="number"
                  scale="linear"
                  domain={["dataMin", "dataMax"]}
                />
                <YAxis
                  label={{
                    value: "Emissions (Mt)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)} Mt`,
                    name === "actual" ? "Actual Emissions" : "Target Emissions",
                  ]}
                  labelFormatter={(year) => `Year: ${year}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
                  name="Actual Emissions"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                  name="Target Emissions"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Alignment Summary */}
        {data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Latest Alignment
              </h3>
              <div className="text-2xl font-bold text-gray-900">
                {data[data.length - 1]?.alignment_pct.toFixed(0)}%
              </div>
              <p className="text-sm text-gray-600">
                {data[data.length - 1]?.alignment_pct >= 100
                  ? "On track"
                  : "Behind target"}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Latest Actual
              </h3>
              <div className="text-2xl font-bold text-gray-900">
                {data[data.length - 1]?.actual_emissions_mt.toFixed(1)} Mt
              </div>
              <p className="text-sm text-gray-600">Current year emissions</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Latest Target
              </h3>
              <div className="text-2xl font-bold text-gray-900">
                {data[data.length - 1]?.target_emissions_mt.toFixed(1)} Mt
              </div>
              <p className="text-sm text-gray-600">Target for current year</p>
            </div>
          </div>
        )}

        {/* Data Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
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
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This data supports CSRD/ESRS climate
              metrics and can tie to EU ETS MRV baselines. The trajectory shows
              progress toward IPCC 1.5°C net-zero by 2050 goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetZeroPage;
