import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Co2IntensityRecord } from "../../types";

interface CO2IntensityChartProps {
  data: Co2IntensityRecord[];
  loading?: boolean;
}

const CO2IntensityChart: React.FC<CO2IntensityChartProps> = ({
  data,
  loading = false,
}) => {
  // Transform data for chart
  const chartData = data.map((item) => ({
    date: new Date(item.timestamp).toLocaleDateString(),
    intensity: item.co2_intensity,
    plant_name: item.plant_name,
  }));

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
          CO₂ Intensity Trend
        </h3>
        <div className="animate-pulse">
          <div className="h-64 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
        CO₂ Intensity Trend
      </h3>

      {chartData.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          No CO₂ intensity data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#666" }}
              stroke="#666"
            />
            <YAxis
              label={{
                value: "kg CO₂/MWh",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#666" },
              }}
              stroke="#666"
            />
            <Tooltip
              formatter={(value) => [
                `${Number(value).toFixed(2)} kg CO₂/MWh`,
                "Intensity",
              ]}
              labelFormatter={(date) => `Date: ${date}`}
              contentStyle={{
                backgroundColor: "#f8f9fa",
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
              }}
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
