import React from 'react';
import type { Co2IntensityRecord, GenerationMixRecord, NetZeroAlignmentRecord } from '../types';

interface SustainabilityKPIsProps {
  co2Data: Co2IntensityRecord[];
  generationData: GenerationMixRecord[];
  netZeroData: NetZeroAlignmentRecord[];
  loading?: boolean;
}

const SustainabilityKPIs: React.FC<SustainabilityKPIsProps> = ({ 
  co2Data, 
  generationData, 
  netZeroData, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Get current values
  const currentCo2 = co2Data.length > 0 ? co2Data[co2Data.length - 1].co2_intensity_g_per_kwh : 0;
  const currentRenewableShare = generationData.length > 0 ? generationData[generationData.length - 1].renewable_share_pct : 0;
  const latestAlignment = netZeroData.length > 0 ? netZeroData[netZeroData.length - 1].alignment_pct : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* CO2 Intensity KPI */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">CO₂ Intensity</p>
            <p className="text-2xl font-bold text-gray-900">
              {currentCo2.toFixed(1)} g/kWh
            </p>
          </div>
          <div className="text-red-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Lower is better. Core emissions intensity indicator.
        </p>
      </div>

      {/* Renewable Share KPI */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Renewable Share</p>
            <p className="text-2xl font-bold text-gray-900">
              {currentRenewableShare.toFixed(1)}%
            </p>
          </div>
          <div className="text-green-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Higher is better. Percentage from renewables.
        </p>
      </div>

      {/* Net-zero Alignment KPI */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Net-zero Alignment</p>
            <p className="text-2xl font-bold text-gray-900">
              {latestAlignment.toFixed(0)}%
            </p>
          </div>
          <div className="text-blue-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Annual progress vs net-zero pathway.
        </p>
      </div>
    </div>
  );
};

export default SustainabilityKPIs;
