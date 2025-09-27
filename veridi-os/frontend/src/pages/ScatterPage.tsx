import React from 'react';
import ScatterChartComponent from '../components/ScatterChart';
import type { SustainabilityChartData } from '../types';

const ScatterPage: React.FC = () => {
  // Mock data for demonstration - in real app this would come from API/Redux
  const mockData: SustainabilityChartData[] = [
    { timestamp: '2024-01-01T00:00:00Z', co2_intensity_g_per_kwh: 450, renewable_share_pct: 25, hydro_mw: 100, wind_mw: 50, solar_mw: 25, nuclear_mw: 200, fossil_mw: 300, total_mw: 675 },
    { timestamp: '2024-01-01T01:00:00Z', co2_intensity_g_per_kwh: 420, renewable_share_pct: 30, hydro_mw: 120, wind_mw: 80, solar_mw: 30, nuclear_mw: 200, fossil_mw: 280, total_mw: 710 },
    { timestamp: '2024-01-01T02:00:00Z', co2_intensity_g_per_kwh: 380, renewable_share_pct: 35, hydro_mw: 110, wind_mw: 100, solar_mw: 35, nuclear_mw: 200, fossil_mw: 255, total_mw: 700 },
    { timestamp: '2024-01-01T03:00:00Z', co2_intensity_g_per_kwh: 350, renewable_share_pct: 40, hydro_mw: 130, wind_mw: 120, solar_mw: 40, nuclear_mw: 200, fossil_mw: 210, total_mw: 700 },
    { timestamp: '2024-01-01T04:00:00Z', co2_intensity_g_per_kwh: 320, renewable_share_pct: 45, hydro_mw: 140, wind_mw: 150, solar_mw: 45, nuclear_mw: 200, fossil_mw: 165, total_mw: 700 },
    { timestamp: '2024-01-01T05:00:00Z', co2_intensity_g_per_kwh: 300, renewable_share_pct: 50, hydro_mw: 150, wind_mw: 180, solar_mw: 50, nuclear_mw: 200, fossil_mw: 120, total_mw: 700 },
    { timestamp: '2024-01-01T06:00:00Z', co2_intensity_g_per_kwh: 280, renewable_share_pct: 55, hydro_mw: 160, wind_mw: 200, solar_mw: 60, nuclear_mw: 200, fossil_mw: 80, total_mw: 700 },
    { timestamp: '2024-01-01T07:00:00Z', co2_intensity_g_per_kwh: 250, renewable_share_pct: 60, hydro_mw: 170, wind_mw: 220, solar_mw: 70, nuclear_mw: 200, fossil_mw: 40, total_mw: 700 },
    { timestamp: '2024-01-01T08:00:00Z', co2_intensity_g_per_kwh: 220, renewable_share_pct: 65, hydro_mw: 180, wind_mw: 240, solar_mw: 80, nuclear_mw: 200, fossil_mw: 0, total_mw: 700 },
    { timestamp: '2024-01-01T09:00:00Z', co2_intensity_g_per_kwh: 200, renewable_share_pct: 70, hydro_mw: 190, wind_mw: 260, solar_mw: 90, nuclear_mw: 200, fossil_mw: 0, total_mw: 740 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Renewables vs CO₂ Intensity Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            This analysis demonstrates the inverse relationship between renewable energy share and carbon intensity. 
            As renewable share increases, CO₂ intensity tends to fall, providing evidence for decarbonization strategies 
            and supporting CSRD/ESRS climate disclosures.
          </p>
        </div>

        {/* Key Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Key Insights</h2>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Strong Negative Correlation:</strong> Higher renewable share consistently correlates with lower CO₂ intensity</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Decarbonization Evidence:</strong> Supports climate strategy narratives and regulatory compliance</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Operational Intelligence:</strong> Deviations from trend may indicate data quality issues or unusual operations</span>
            </li>
          </ul>
        </div>

        {/* Scatter Chart */}
        <ScatterChartComponent data={mockData} />

        {/* Methodology */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Methodology</h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 mb-4">
              This analysis uses real-time data from the sustainability intelligence platform to examine the relationship 
              between renewable energy share and carbon intensity. The scatter plot shows individual data points over time, 
              with a trend line calculated using linear regression.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Data Sources</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Generation mix data (15-minute intervals)</li>
                  <li>• CO₂ intensity calculations</li>
                  <li>• Renewable share percentages</li>
                  <li>• Real-time operational data</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Applications</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• CSRD/ESRS climate disclosures</li>
                  <li>• EU ETS MRV reporting</li>
                  <li>• Operational optimization</li>
                  <li>• Stakeholder reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScatterPage;
