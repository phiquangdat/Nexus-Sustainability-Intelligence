import React from "react";
import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ScatterData } from "../../types";

interface ScatterChartProps {
  data: ScatterData[];
  loading?: boolean;
}

const ScatterChart: React.FC<ScatterChartProps> = ({
  data,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
          Renewables vs CO₂ Intensity
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
        Renewables vs CO₂ Intensity
      </h3>

      {data.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          No scatter plot data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsScatterChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis
              type="number"
              dataKey="renewable_percentage"
              name="Renewable %"
              label={{
                value: "Renewable Energy (%)",
                position: "insideBottom",
                offset: -5,
                style: { textAnchor: "middle", fill: "#666" },
              }}
              domain={[0, 100]}
              stroke="#666"
            />
            <YAxis
              type="number"
              dataKey="co2_intensity"
              name="CO₂ Intensity"
              label={{
                value: "CO₂ Intensity (kg CO₂/MWh)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#666" },
              }}
              stroke="#666"
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
              labelFormatter={(_, payload) => {
                if (payload && payload[0]) {
                  return `Plant: ${payload[0].payload.plant_name}`;
                }
                return "";
              }}
              contentStyle={{
                backgroundColor: "#f8f9fa",
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
              }}
            />
            <Scatter dataKey="co2_intensity" fill="#3b82f6" r={6} />
          </RechartsScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ScatterChart;
