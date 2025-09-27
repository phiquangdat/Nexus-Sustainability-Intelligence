import React, { useState } from 'react';
import SustainabilityKPIs from '../components/SustainabilityKPIs';
import GoalTrackerComponent from '../components/GoalTracker';
import CO2IntensityChart from '../components/CO2IntensityChart';
import GenerationMixChart from '../components/GenerationMixChart';
import type {
  Co2IntensityRecord,
  GenerationMixRecord,
  NetZeroAlignmentRecord,
} from "../types";

const SustainabilityDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d'>('24h');

  // Mock data for demonstration - in real app this would come from API/Redux
  const mockCo2Data: Co2IntensityRecord[] = [
    { id: 1, timestamp: '2024-01-01T00:00:00Z', co2_intensity_g_per_kwh: 450 },
    { id: 2, timestamp: '2024-01-01T01:00:00Z', co2_intensity_g_per_kwh: 420 },
    { id: 3, timestamp: '2024-01-01T02:00:00Z', co2_intensity_g_per_kwh: 380 },
    { id: 4, timestamp: '2024-01-01T03:00:00Z', co2_intensity_g_per_kwh: 350 },
    { id: 5, timestamp: '2024-01-01T04:00:00Z', co2_intensity_g_per_kwh: 320 },
    { id: 6, timestamp: '2024-01-01T05:00:00Z', co2_intensity_g_per_kwh: 300 },
    { id: 7, timestamp: '2024-01-01T06:00:00Z', co2_intensity_g_per_kwh: 280 },
    { id: 8, timestamp: '2024-01-01T07:00:00Z', co2_intensity_g_per_kwh: 250 },
  ];

  const mockGenerationData: GenerationMixRecord[] = [
    { id: 1, timestamp: '2024-01-01T00:00:00Z', hydro_mw: 100, wind_mw: 50, solar_mw: 25, nuclear_mw: 200, fossil_mw: 300, total_mw: 675, renewable_share_pct: 25.9 },
    { id: 2, timestamp: '2024-01-01T01:00:00Z', hydro_mw: 120, wind_mw: 80, solar_mw: 30, nuclear_mw: 200, fossil_mw: 280, total_mw: 710, renewable_share_pct: 32.4 },
    { id: 3, timestamp: '2024-01-01T02:00:00Z', hydro_mw: 110, wind_mw: 100, solar_mw: 35, nuclear_mw: 200, fossil_mw: 255, total_mw: 700, renewable_share_pct: 35.0 },
    { id: 4, timestamp: '2024-01-01T03:00:00Z', hydro_mw: 130, wind_mw: 120, solar_mw: 40, nuclear_mw: 200, fossil_mw: 210, total_mw: 700, renewable_share_pct: 41.4 },
    { id: 5, timestamp: '2024-01-01T04:00:00Z', hydro_mw: 140, wind_mw: 150, solar_mw: 45, nuclear_mw: 200, fossil_mw: 165, total_mw: 700, renewable_share_pct: 47.9 },
    { id: 6, timestamp: '2024-01-01T05:00:00Z', hydro_mw: 150, wind_mw: 180, solar_mw: 50, nuclear_mw: 200, fossil_mw: 120, total_mw: 700, renewable_share_pct: 54.3 },
    { id: 7, timestamp: '2024-01-01T06:00:00Z', hydro_mw: 160, wind_mw: 200, solar_mw: 60, nuclear_mw: 200, fossil_mw: 80, total_mw: 700, renewable_share_pct: 60.0 },
    { id: 8, timestamp: '2024-01-01T07:00:00Z', hydro_mw: 170, wind_mw: 220, solar_mw: 70, nuclear_mw: 200, fossil_mw: 40, total_mw: 700, renewable_share_pct: 65.7 },
  ];

  const mockNetZeroData: NetZeroAlignmentRecord[] = [
    { year: 2020, actual_emissions_mt: 45.2, target_emissions_mt: 48.0, alignment_pct: 106.2 },
    { year: 2021, actual_emissions_mt: 42.8, target_emissions_mt: 45.0, alignment_pct: 105.1 },
    { year: 2022, actual_emissions_mt: 39.5, target_emissions_mt: 42.0, alignment_pct: 106.3 },
    { year: 2023, actual_emissions_mt: 36.2, target_emissions_mt: 39.0, alignment_pct: 107.7 },
    { year: 2024, actual_emissions_mt: 32.8, target_emissions_mt: 36.0, alignment_pct: 109.8 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sustainability Intelligence Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Real-time sustainability metrics for electricity & heat sector. This
            prototype addresses the WISE Sustainability Intelligence challenge
            with integrated metrics supporting reporting, analysis, and progress
            toward net-zero by 2050 (IPCC 1.5°C).
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
              onChange={(e) => setTimeRange(e.target.value as "24h" | "7d")}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select time range"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <SustainabilityKPIs
          co2Data={mockCo2Data}
          generationData={mockGenerationData}
          netZeroData={mockNetZeroData}
        />

        {/* Goal Tracker */}
        <div className="mb-8">
          <GoalTrackerComponent />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* CO2 Intensity Chart */}
          <div>
            <CO2IntensityChart data={mockCo2Data} />
          </div>

          {/* Generation Mix Chart */}
          <div>
            <GenerationMixChart
              data={mockGenerationData}
              showCurrentMix={false}
            />
          </div>
        </div>

        {/* Current Mix Pie Chart */}
        <div className="mb-8">
          <GenerationMixChart data={mockGenerationData} showCurrentMix={true} />
        </div>

        {/* About Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            About This Prototype
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Objective</h3>
              <p className="text-sm text-blue-700">
                Integrate sustainability metrics for electricity/heat, enabling
                clear reporting and analysis to support CSRD/ESRS disclosures
                and operational MRV (EU ETS).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Status</h3>
              <p className="text-sm text-blue-700">
                Simulated data for demonstration. Architecture supports scaling
                to live sources and APIs for production deployment.
              </p>
            </div>
          </div>
        </div>

        {/* Data Note */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="w-5 h-5 text-yellow-400 mt-0.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-yellow-800">
              <strong>Prototype Note:</strong> Data are simulated to demonstrate
              flows and visuals. In production, data integrate from plant SCADA,
              fuel/efficiency logs, and emissions inventories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityDashboard;
