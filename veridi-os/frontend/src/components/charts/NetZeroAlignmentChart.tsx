import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { NetZeroAlignmentRecord } from '../types';

interface NetZeroAlignmentChartProps {
  data: NetZeroAlignmentRecord[];
  loading?: boolean;
}

const NetZeroAlignmentChart: React.FC<NetZeroAlignmentChartProps> = ({ data, loading = false }) => {
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

  const formatTooltipValue = (value: number) => {
    return `${value.toFixed(1)} Mt`;
  };

  const formatAlignmentTooltip = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Net-Zero Trajectory Alignment
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Annual actual vs target emissions for alignment with a 2050 net-zero pathway. 
        Supports CSRD/ESRS narrative on progress.
      </p>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ value: 'Emissions (Mt)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              labelFormatter={(value) => `Year: ${value}`}
              formatter={(value: number, name: string) => {
                if (name === 'alignment_pct') {
                  return [formatAlignmentTooltip(value), 'Alignment %'];
                }
                return [formatTooltipValue(value), name];
              }}
            />
            <Line 
              type="monotone" 
              dataKey="actual_emissions_mt" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Actual Emissions"
            />
            <Line 
              type="monotone" 
              dataKey="target_emissions_mt" 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              name="Target Emissions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <strong>How to read this:</strong> Actual above target → behind; below target → ahead of plan. 
        Aligns with ESRS climate metrics and long-term decarbonization plans.
      </div>
    </div>
  );
};

export default NetZeroAlignmentChart;
