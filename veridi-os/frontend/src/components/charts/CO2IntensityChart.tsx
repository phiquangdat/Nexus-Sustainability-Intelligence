import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Co2IntensityRecord } from '../types';

interface CO2IntensityChartProps {
  data: Co2IntensityRecord[];
  loading?: boolean;
}

const CO2IntensityChart: React.FC<CO2IntensityChartProps> = ({ data, loading = false }) => {
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
    return `${value.toFixed(1)} g/kWh`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        CO₂ Intensity Over Time
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Lower is better. Expect dips when wind/solar/hydro output is high; spikes during outages or low renewables.
      </p>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTimestamp}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ value: 'g CO₂/kWh', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              labelFormatter={(value) => `Time: ${formatTimestamp(value)}`}
              formatter={(value: number) => [formatTooltipValue(value), 'CO₂ Intensity']}
            />
            <Line 
              type="monotone" 
              dataKey="co2_intensity_g_per_kwh" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#ef4444' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <strong>What this shows:</strong> Core emissions intensity indicator for CSRD/ESRS climate metrics. 
        Downward trend = decarbonization; spikes = operational events.
      </div>
    </div>
  );
};

export default CO2IntensityChart;
