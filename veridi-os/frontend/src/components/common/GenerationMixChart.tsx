import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { analysisService } from "../../services/api/analysisService";

interface GenerationMixData {
  source: string;
  percentage: number;
  color: string;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const GenerationMixChart: React.FC = () => {
  const [data, setData] = useState<GenerationMixData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGenerationMixData();
  }, []);

  const loadGenerationMixData = async () => {
    try {
      setLoading(true);
      setError(null);

      const analysis = await analysisService.getAnalysis(200);
      const genData = analysis.rawData.generation_mix || [];

      // Transform data for chart
      const chartData = genData.map((item: any, index: number) => ({
        source: item.source || item.fuel_type || `Source ${index + 1}`,
        percentage: item.percentage || item.share || 0,
        color: COLORS[index % COLORS.length],
      }));

      setData(chartData);
    } catch (err) {
      console.error("Error loading generation mix data:", err);
      setError("Failed to load generation mix data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Generation Mix</h3>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Generation Mix</h3>
        <div className="text-red-600 text-center py-8">
          <p>{error}</p>
          <button
            onClick={loadGenerationMixData}
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
      <h3 className="text-lg font-semibold mb-4">Generation Mix</h3>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No generation mix data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ source, percentage }) =>
                `${source}: ${percentage.toFixed(1)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="percentage"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(1)}%`, "Share"]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GenerationMixChart;
