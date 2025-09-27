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

interface NetZeroAlignmentData {
  year: number;
  actual_emissions_mt: number;
  target_emissions_mt: number;
  alignment_pct: number;
}

const NetZeroAlignmentChart: React.FC = () => {
  const [data, setData] = useState<NetZeroAlignmentData[]>([]);
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
      const nzData = analysis.rawData.netzero_alignment || [];

      setData(nzData);
    } catch (err) {
      console.error("Error loading net-zero alignment data:", err);
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Net-Zero Alignment</h3>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Net-Zero Alignment</h3>
        <div className="text-red-600 text-center py-8">
          <p>{error}</p>
          <button
            onClick={loadNetZeroData}
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
      <h3 className="text-lg font-semibold mb-4">Net-Zero Alignment</h3>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No net-zero alignment data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
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
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
              name="Actual Emissions"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              name="Target Emissions"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default NetZeroAlignmentChart;
