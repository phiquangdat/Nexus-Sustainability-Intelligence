import React from 'react';
import NetZeroAlignmentChart from '../components/NetZeroAlignmentChart';
import type { NetZeroAlignmentRecord } from '../types';

const NetZeroPage: React.FC = () => {
  // Mock data for demonstration - in real app this would come from API/Redux
  const mockData: NetZeroAlignmentRecord[] = [
    { year: 2020, actual_emissions_mt: 45.2, target_emissions_mt: 48.0, alignment_pct: 106.2 },
    { year: 2021, actual_emissions_mt: 42.8, target_emissions_mt: 45.0, alignment_pct: 105.1 },
    { year: 2022, actual_emissions_mt: 39.5, target_emissions_mt: 42.0, alignment_pct: 106.3 },
    { year: 2023, actual_emissions_mt: 36.2, target_emissions_mt: 39.0, alignment_pct: 107.7 },
    { year: 2024, actual_emissions_mt: 32.8, target_emissions_mt: 36.0, alignment_pct: 109.8 },
    { year: 2025, actual_emissions_mt: 29.5, target_emissions_mt: 33.0, alignment_pct: 111.9 },
    { year: 2030, actual_emissions_mt: 20.0, target_emissions_mt: 25.0, alignment_pct: 125.0 },
    { year: 2035, actual_emissions_mt: 12.5, target_emissions_mt: 15.0, alignment_pct: 120.0 },
    { year: 2040, actual_emissions_mt: 6.0, target_emissions_mt: 8.0, alignment_pct: 133.3 },
    { year: 2045, actual_emissions_mt: 2.0, target_emissions_mt: 3.0, alignment_pct: 150.0 },
    { year: 2050, actual_emissions_mt: 0.0, target_emissions_mt: 0.0, alignment_pct: 100.0 },
  ];

  // Calculate current status
  const currentYear = mockData.find(d => d.year === 2024);
  const isOnTrack = currentYear ? currentYear.alignment_pct >= 100 : false;
  const yearsAhead = currentYear ? Math.round((currentYear.alignment_pct - 100) * 0.1) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Net-Zero Trajectory Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Track progress toward net-zero emissions by 2050. This analysis shows annual actual vs target emissions 
            for alignment with IPCC 1.5°C pathway, supporting CSRD/ESRS climate disclosures and long-term 
            decarbonization planning.
          </p>
        </div>

        {/* Status Overview */}
        <div className={`border rounded-lg p-6 mb-8 ${isOnTrack ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${isOnTrack ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
              <h2 className={`text-lg font-semibold ${isOnTrack ? 'text-green-900' : 'text-red-900'}`}>
                {isOnTrack ? 'On Track for Net-Zero' : 'Behind Net-Zero Target'}
              </h2>
              <p className={`text-sm ${isOnTrack ? 'text-green-700' : 'text-red-700'}`}>
                {isOnTrack 
                  ? `Currently ${yearsAhead} years ahead of the required trajectory`
                  : 'Additional action required to meet 2050 net-zero target'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {currentYear?.alignment_pct.toFixed(1)}%
              </div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Current Alignment
              </div>
              <div className="text-xs text-gray-500">
                {currentYear?.year} actual vs target
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {currentYear?.actual_emissions_mt.toFixed(1)} Mt
              </div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Current Emissions
              </div>
              <div className="text-xs text-gray-500">
                Annual CO₂ emissions
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                26 years
              </div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Years to Net-Zero
              </div>
              <div className="text-xs text-gray-500">
                Time remaining to 2050
              </div>
            </div>
          </div>
        </div>

        {/* Net-Zero Chart */}
        <NetZeroAlignmentChart data={mockData} />

        {/* Pathway Details */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">2050 Pathway Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Target Trajectory</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">2025 Target:</span>
                  <span className="font-medium">33.0 Mt CO₂</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2030 Target:</span>
                  <span className="font-medium">25.0 Mt CO₂</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2040 Target:</span>
                  <span className="font-medium">8.0 Mt CO₂</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2050 Target:</span>
                  <span className="font-medium text-green-600">0.0 Mt CO₂</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Required Actions</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Accelerate renewable energy deployment</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Phase out fossil fuel generation</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Implement carbon capture technologies</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Enhance energy efficiency measures</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Compliance Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Regulatory Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">CSRD/ESRS Requirements</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Climate-related disclosures</li>
                <li>• Transition plan reporting</li>
                <li>• Scope 1 & 2 emissions tracking</li>
                <li>• Net-zero pathway alignment</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">EU ETS MRV</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Monitoring & reporting obligations</li>
                <li>• Verification requirements</li>
                <li>• Baseline emissions tracking</li>
                <li>• Compliance monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetZeroPage;
