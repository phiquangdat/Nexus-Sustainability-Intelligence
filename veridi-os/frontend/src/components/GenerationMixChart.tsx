import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { GenerationMixRecord } from '../types';

interface GenerationMixChartProps {
  data: GenerationMixRecord[];
  loading?: boolean;
  showCurrentMix?: boolean;
}

const GenerationMixChart: React.FC<GenerationMixChartProps> = ({ 
  data, 
  loading = false, 
  showCurrentMix = true 
}) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTooltipValue = (value: number) => {
    return `${value.toFixed(1)} MW`;
  };

  // Colors for different energy sources
  const colors = {
    hydro_mw: '#3b82f6',    // Blue
    wind_mw: '#10b981',     // Green
    solar_mw: '#f59e0b',    // Yellow
    nuclear_mw: '#8b5cf6',  // Purple
    fossil_mw: '#ef4444'    // Red
  };

  // Get current mix for pie chart
  const currentMix = data.length > 0 ? data[data.length - 1] : null;
  const pieData = currentMix ? [
    { name: 'Hydro', value: currentMix.hydro_mw, color: colors.hydro_mw },
    { name: 'Wind', value: currentMix.wind_mw, color: colors.wind_mw },
    { name: 'Solar', value: currentMix.solar_mw, color: colors.solar_mw },
    { name: 'Nuclear', value: currentMix.nuclear_mw, color: colors.nuclear_mw },
    { name: 'Fossil', value: currentMix.fossil_mw, color: colors.fossil_mw }
  ].filter(item => item.value > 0) : [];

  return (
    <div className="space-y-6">
      {/* Stacked Area Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Generation Mix Over Time
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Stacked by technology (MW). Weather, maintenance, and price signals
          drive shifts.
        </p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{ value: "MW", angle: -90, position: "insideLeft" }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                labelFormatter={(value) => `Time: ${formatTimestamp(value)}`}
                formatter={(value: number, name: string) => [
                  formatTooltipValue(value),
                  name,
                ]}
              />
              <Area
                type="monotone"
                dataKey="hydro_mw"
                stackId="1"
                stroke={colors.hydro_mw}
                fill={colors.hydro_mw}
                name="Hydro"
              />
              <Area
                type="monotone"
                dataKey="wind_mw"
                stackId="1"
                stroke={colors.wind_mw}
                fill={colors.wind_mw}
                name="Wind"
              />
              <Area
                type="monotone"
                dataKey="solar_mw"
                stackId="1"
                stroke={colors.solar_mw}
                fill={colors.solar_mw}
                name="Solar"
              />
              <Area
                type="monotone"
                dataKey="nuclear_mw"
                stackId="1"
                stroke={colors.nuclear_mw}
                fill={colors.nuclear_mw}
                name="Nuclear"
              />
              <Area
                type="monotone"
                dataKey="fossil_mw"
                stackId="1"
                stroke={colors.fossil_mw}
                fill={colors.fossil_mw}
                name="Fossil"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <strong>What this shows:</strong> Larger renewable area → expect lower
          CO₂ intensity. Supports ESRS disclosures on energy mix and renewable
          share.
        </div>
      </div>

      {/* Current Mix Pie Chart */}
      {showCurrentMix && currentMix && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Current Generation Mix
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Current mix snapshot. Higher renewable share typically correlates
            with lower CO₂ intensity.
          </p>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent as number) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)} MW`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <strong>What this shows:</strong> Share of output by technology
            right now. Bigger renewable slices → lower expected CO₂ intensity.
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationMixChart;
