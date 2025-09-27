import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { NetZeroAlignmentRecord } from "../../types";

interface NetZeroAlignmentChartProps {
  data: NetZeroAlignmentRecord[];
  loading?: boolean;
}

const NetZeroAlignmentChart: React.FC<NetZeroAlignmentChartProps> = ({
  data,
  loading = false,
}) => {
  // Transform data for chart
  const chartData = data.map((item) => ({
    plant: item.plant_name,
    alignment: item.alignment_score,
    target_year: item.net_zero_target_year,
    current_reduction: item.current_reduction_percentage,
  }));

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
          Net-Zero Alignment
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
        Net-Zero Alignment
      </h3>

      {chartData.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          No net-zero alignment data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis
              dataKey="plant"
              tick={{ fontSize: 12, fill: "#666" }}
              stroke="#666"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              label={{
                value: "Alignment Score (%)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#666" },
              }}
              stroke="#666"
            />
            <Tooltip
              formatter={(value, name) => [
                `${Number(value).toFixed(1)}%`,
                name === "alignment" ? "Alignment Score" : "Current Reduction",
              ]}
              labelFormatter={(plant) => `Plant: ${plant}`}
              contentStyle={{
                backgroundColor: "#f8f9fa",
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="alignment" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default NetZeroAlignmentChart;
