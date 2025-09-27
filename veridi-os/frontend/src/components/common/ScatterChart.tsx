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
import { analysisService } from "../../services/api/analysisService";

interface ScatterData {
  renewable_percentage: number;
  co2_intensity: number;
  plant_name: string;
  region: string;
}

const ScatterChart: React.FC = () => {
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

      const analysis = await analysisService.getAnalysis(200);
      const scatterData = analysis.rawData.scatter_data || [];

      setData(scatterData);
    } catch (err) {
      console.error("Error loading scatter data:", err);
      setError("Failed to load scatter data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          Renewables vs CO₂ Intensity
        </h3>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          Renewables vs CO₂ Intensity
        </h3>
        <div className="text-red-600 text-center py-8">
          <p>{error}</p>
          <button
            onClick={loadScatterData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">
        Renewables vs CO₂ Intensity
      </h3>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No scatter plot data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="renewable_percentage"
              name="Renewable %"
              label={{
                value: "Renewable Energy (%)",
                position: "insideBottom",
                offset: -5,
              }}
              domain={[0, 100]}
            />
            <YAxis
              type="number"
              dataKey="co2_intensity"
              name="CO₂ Intensity"
              label={{
                value: "CO₂ Intensity (kg CO₂/MWh)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value, name) => [
                `${Number(value).toFixed(2)} ${
                  name === "renewable_percentage" ? "%" : "kg CO₂/MWh"
                }`,
                name === "renewable_percentage"
                  ? "Renewable %"
                  : "CO₂ Intensity",
              ]}
              labelFormatter={(value, payload) => {
                if (payload && payload[0]) {
                  return `Plant: ${payload[0].payload.plant_name}`;
                }
                return "";
              }}
            />
            <Scatter dataKey="co2_intensity" fill="#3b82f6" r={6} />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ScatterChart;
