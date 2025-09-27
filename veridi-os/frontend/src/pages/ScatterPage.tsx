import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analysisService } from '../services/analysisService';

interface ScatterDataPoint {
  renewable_share_pct: number;
  co2_intensity_g_per_kwh: number;
  timestamp: string;
}

const ScatterPage: React.FC = () => {
  const [data, setData] = useState<ScatterDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d'>('24h');

  useEffect(() => {
    loadScatterData();
  }, [timeRange]);

  const loadScatterData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const limit = timeRange === '24h' ? 96 : 96 * 7;
      const analysis = await analysisService.getAnalysis(limit);
      
      const co2Data = analysis.rawData.co2_intensity || [];
      const genData = analysis.rawData.generation_mix || [];
      
      // Merge data on timestamp
      const mergedData: ScatterDataPoint[] = [];
      const co2Map = new Map(co2Data.map(item => [item.timestamp, item]));
      
      genData.forEach(genItem => {
        const co2Item = co2Map.get(genItem.timestamp);
        if (co2Item) {
          mergedData.push({
            renewable_share_pct: genItem.renewable_share_pct,
            co2_intensity_g_per_kwh: co2Item.co2_intensity_g_per_kwh,
            timestamp: genItem.timestamp
          });
        }
      });
      
      setData(mergedData);
    } catch (err) {
      console.error('Error loading scatter data:', err);
      setError('Failed to load correlation data');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading correlation data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="text-red-600 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
            <p className="text-red-700">{error}</p>
            <button 
              onClick={loadScatterData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Renewables vs CO₂ Intensity
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            As renewable share increases, CO₂ intensity tends to fall. This view tests the 
            expected decarbonization signal and supports disclosures linking energy mix to 
            emissions outcomes.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Time Range:
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '24h' | '7d')}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select time range"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            How to Read This Chart
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Axes</h3>
              <p className="text-sm text-blue-700">
                X-axis: renewable share (%), Y-axis: CO₂ intensity (g/kWh). 
                Each point represents a time period's energy mix and emissions intensity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Trend Analysis</h3>
              <p className="text-sm text-blue-700">
                Expected negative slope shows decarbonization signal. 
                Deviations may indicate data quality issues or unusual operations.
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Inverse Relationship: Higher Renewables → Lower CO₂ Intensity
          </h2>
          
          {data.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600">Not enough data points to show correlation.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="renewable_share_pct" 
                  name="Renewable Share"
                  label={{ value: 'Renewable Share (%)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="co2_intensity_g_per_kwh" 
                  name="CO₂ Intensity"
                  label={{ value: 'CO₂ Intensity (g/kWh)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)} ${name === 'renewable_share_pct' ? '%' : 'g/kWh'}`, 
                    name === 'renewable_share_pct' ? 'Renewable Share' : 'CO₂ Intensity'
                  ]}
                  labelFormatter={(timestamp) => `Time: ${new Date(timestamp).toLocaleString()}`}
                />
                <Scatter 
                  dataKey="co2_intensity_g_per_kwh" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  r={4}
                />
                {/* Trend line */}
                {trendLineData.length === 2 && (
                  <Scatter 
                    data={trendLineData}
                    dataKey="co2_intensity_g_per_kwh"
                    fill="#ef4444"
                    fillOpacity={0}
                    stroke="#ef4444"
                    strokeWidth={2}
                    r={0}
                    line
                  />
                )}
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Statistics */}
        {data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Data Points</h3>
              <div className="text-2xl font-bold text-gray-900">{data.length}</div>
              <p className="text-sm text-gray-600">Time periods analyzed</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Renewable Share</h3>
              <div className="text-2xl font-bold text-gray-900">
                {(data.reduce((sum, d) => sum + d.renewable_share_pct, 0) / data.length).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600">Over selected period</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Avg CO₂ Intensity</h3>
              <div className="text-2xl font-bold text-gray-900">
                {(data.reduce((sum, d) => sum + d.co2_intensity_g_per_kwh, 0) / data.length).toFixed(1)} g/kWh
              </div>
              <p className="text-sm text-gray-600">Over selected period</p>
            </div>
          </div>
        )}

        {/* Data Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This correlation analysis provides evidence that renewable 
              integration lowers emissions, supporting climate strategy narratives and 
              sustainability disclosures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScatterPage;