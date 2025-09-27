import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SustainabilityChartData } from '../types';

interface ScatterChartProps {
  data: SustainabilityChartData[];
  loading?: boolean;
}

const ScatterChartComponent: React.FC<ScatterChartProps> = ({ data, loading = false }) => {
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

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'co2_intensity_g_per_kwh') {
      return [`${value.toFixed(1)} g/kWh`, 'CO₂ Intensity'];
    }
    return [`${value.toFixed(1)}%`, 'Renewable Share'];
  };

  // Calculate trend line (simple linear regression)
  const calculateTrendLine = () => {
    if (data.length < 2) return [];
    
    const n = data.length;
    const sumX = data.reduce((sum, point) => sum + point.renewable_share_pct, 0);
    const sumY = data.reduce((sum, point) => sum + point.co2_intensity_g_per_kwh, 0);
    const sumXY = data.reduce((sum, point) => sum + point.renewable_share_pct * point.co2_intensity_g_per_kwh, 0);
    const sumXX = data.reduce((sum, point) => sum + point.renewable_share_pct * point.renewable_share_pct, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const minX = Math.min(...data.map(d => d.renewable_share_pct));
    const maxX = Math.max(...data.map(d => d.renewable_share_pct));
    
    return [
      { renewable_share_pct: minX, co2_intensity_g_per_kwh: slope * minX + intercept },
      { renewable_share_pct: maxX, co2_intensity_g_per_kwh: slope * maxX + intercept }
    ];
  };

  const trendLineData = calculateTrendLine();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Renewables vs CO₂ Intensity
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        As renewable share increases, CO₂ intensity tends to fall. This view tests the expected 
        decarbonization signal and supports disclosures linking energy mix to emissions outcomes.
      </p>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="renewable_share_pct" 
              label={{ value: 'Renewable Share (%)', position: 'insideBottom', offset: -5 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              dataKey="co2_intensity_g_per_kwh"
              label={{ value: 'CO₂ Intensity (g/kWh)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={formatTooltipValue}
              labelFormatter={(value) => `Renewable Share: ${value}%`}
            />
            <Scatter 
              data={data} 
              fill="#3b82f6" 
              fillOpacity={0.6}
            />
            {/* Trend line */}
            <Scatter 
              data={trendLineData} 
              fill="none"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <strong>How to read this:</strong> X-axis: renewable share (%). Y-axis: CO₂ intensity (g/kWh). 
        Trendline: expected negative slope; deviations may indicate data quality issues or unusual operations. 
        Evidence that renewable integration lowers emissions, supporting climate strategy narratives.
      </div>
    </div>
  );
};

export default ScatterChartComponent;
