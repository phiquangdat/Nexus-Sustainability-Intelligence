import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { analysisService } from "../../services/api/analysisService";

interface CO2IntensityData {
  date: string;
  intensity: number;
}

const CO2IntensityChart: React.FC = () => {
  const [data, setData] = useState<CO2IntensityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCO2Data();
  }, []);

  const loadCO2Data = async () => {
    try {
      setLoading(true);
      setError(null);

      const analysis = await analysisService.getAnalysis(200);
      const co2Data = analysis.rawData.co2 || [];

      // Transform data for chart
      const chartData = co2Data.map((item: any) => ({
        date: item.date || item.timestamp,
        intensity: item.intensity || item.co2_intensity || 0,
      }));

      setData(chartData);
    } catch (err) {
      console.error("Error loading CO2 intensity data:", err);
      setError("Failed to load CO2 intensity data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">CO₂ Intensity Trend</h3>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">CO₂ Intensity Trend</h3>
        <div className="text-red-600 text-center py-8">
          <p>{error}</p>
          <button
            onClick={loadCO2Data}
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
      <h3 className="text-lg font-semibold mb-4">CO₂ Intensity Trend</h3>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No CO₂ intensity data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              label={{
                value: "kg CO₂/MWh",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={(value) => [
                `${Number(value).toFixed(2)} kg CO₂/MWh`,
                "Intensity",
              ]}
              labelFormatter={(date) => `Date: ${date}`}
            />
            <Line
              type="monotone"
              dataKey="intensity"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CO2IntensityChart;
