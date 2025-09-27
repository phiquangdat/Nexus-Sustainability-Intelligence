import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { GenerationMixRecord } from "../../types";

interface GenerationMixChartProps {
  data: GenerationMixRecord[];
  loading?: boolean;
}

const GenerationMixChart: React.FC<GenerationMixChartProps> = ({
  data,
  loading = false,
}) => {
  // Transform data for chart - use the latest record
  const latestRecord = data[0];

  const chartData = latestRecord
    ? [
        {
          name: "Renewable",
          value: latestRecord.renewable_percentage,
          color: "#22c55e",
        },
        {
          name: "Fossil",
          value: latestRecord.fossil_percentage,
          color: "#ef4444",
        },
        {
          name: "Nuclear",
          value: latestRecord.nuclear_percentage,
          color: "#3b82f6",
        },
        {
          name: "Hydro",
          value: latestRecord.hydro_percentage,
          color: "#06b6d4",
        },
        { name: "Wind", value: latestRecord.wind_percentage, color: "#8b5cf6" },
        {
          name: "Solar",
          value: latestRecord.solar_percentage,
          color: "#f59e0b",
        },
      ].filter((item) => item.value > 0)
    : [];

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
          Generation Mix
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
        Generation Mix
      </h3>

      {chartData.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          No generation mix data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(Number(percent) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [
                `${Number(value).toFixed(1)}%`,
                "Percentage",
              ]}
              contentStyle={{
                backgroundColor: "#f8f9fa",
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GenerationMixChart;
