import React, { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AnalysisService } from "../services/analysisService";
import type { ScatterData } from "../types";

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
      setData(analysis.scatterData || []);
    } catch (err) {
      console.error("Error loading scatter data:", err);
      setError("Failed to load scatter analysis data");
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: ScatterData }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{data.plant_name}</p>
          <p className="text-sm text-gray-600">Region: {data.region}</p>
          <p className="text-sm text-blue-600">
            Renewable: {data.renewable_percentage.toFixed(1)}%
          </p>
          <p className="text-sm text-red-600">
            CO₂ Intensity: {data.co2_intensity.toFixed(1)} g/kWh
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scatter analysis data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Data
            </h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={loadScatterData}
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Renewable Energy vs CO₂ Intensity Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Scatter plot showing the relationship between renewable energy
            percentage and CO₂ intensity across different power plants and
            regions.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Power Plant Performance Analysis
          </h2>

          {data.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Data Available
              </h3>
              <p className="text-gray-600">No scatter analysis data found.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="renewable_percentage"
                  name="Renewable %"
                  label={{
                    value: "Renewable Energy Percentage (%)",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="co2_intensity"
                  name="CO₂ Intensity"
                  label={{
                    value: "CO₂ Intensity (g/kWh)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Scatter
                  name="Power Plants"
                  dataKey="co2_intensity"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScatterPage;
