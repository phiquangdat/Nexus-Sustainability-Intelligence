// Enhanced Sustainability Dashboard - Integrates all modules and Streamlit patterns
import React, { useState, useEffect } from "react";

import { GoalTracker } from "./GoalTracker";
import CO2IntensityChart from "./CO2IntensityChart";
import GenerationMixChart from "./GenerationMixChart";
import NetZeroAlignmentChart from "./NetZeroAlignmentChart";
import ScatterChart from "./ScatterChart";

import { analysisService } from "../services/analysisService";
import type {
  Co2IntensityRecord,
  GenerationMixRecord,
  NetZeroAlignmentRecord,
  SustainabilityChartData,
} from "../types";

interface DashboardProps {
  className?: string;
}

export const SustainabilityDashboard: React.FC<DashboardProps> = ({
  className,
}) => {
  const [loading, setLoading] = useState(true);
  const [simulatorRunning, setSimulatorRunning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [kpis, setKpis] = useState({
    co2Intensity: 0,
    renewableShare: 0,
    netZeroAlignment: 0,
  });
  const [chartData, setChartData] = useState<{
    co2Data: Co2IntensityRecord[];
    genData: GenerationMixRecord[];
    nzData: NetZeroAlignmentRecord[];
    scatterData: SustainabilityChartData[];
  }>({
    co2Data: [],
    genData: [],
    nzData: [],
    scatterData: [],
  });

  useEffect(() => {
    loadDashboardData();
    checkSimulatorStatus();

    // Set up real-time updates
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch comprehensive analysis from backend
      const analysis = await analysisService.getAnalysis(100);

      // Extract data from analysis response
      const co2Data = analysis.rawData.co2 || [];
      const genData = analysis.rawData.generation_mix || [];
      const nzData = analysis.rawData.netzero_alignment || [];

      // Update KPIs
      if (co2Data.length > 0) {
        setKpis((prev) => ({
          ...prev,
          co2Intensity: co2Data[0].co2_intensity_g_per_kwh,
        }));
      }

      if (genData.length > 0) {
        setKpis((prev) => ({
          ...prev,
          renewableShare: genData[0].renewable_share_pct,
        }));
      }

      if (nzData.length > 0) {
        setKpis((prev) => ({
          ...prev,
          netZeroAlignment: nzData[0].alignment_pct,
        }));
      }

      // Update chart data
      setChartData({
        co2Data: co2Data.map((item) => ({ ...item, id: item.id || 0 })),
        genData: genData.map((item) => ({ ...item, id: item.id || 0 })),
        nzData,
        scatterData: [], // Will be generated from co2Data and genData
      });

      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkSimulatorStatus = () => {
    // Simulator status is now managed by backend
    setSimulatorRunning(false);
  };

  const toggleSimulator = async () => {
    try {
      // Use backend API for simulator control
      if (simulatorRunning) {
        // Stop continuous simulation
        await fetch("http://localhost:4000/api/simulator/stop-continuous", {
          method: "POST",
        });
      } else {
        // Start continuous simulation
        await fetch("http://localhost:4000/api/simulator/start-continuous", {
          method: "POST",
        });
      }
      setSimulatorRunning(!simulatorRunning);
    } catch (error) {
      console.error("Failed to toggle simulator:", error);
    }
  };

  const generateTestData = async () => {
    try {
      setLoading(true);
      // Use backend API to generate historical data
      await fetch("http://localhost:4000/api/simulator/generate-historical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours: 24 }),
      });

      await loadDashboardData();
    } catch (error) {
      console.error("Failed to generate test data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Sustainability Intelligence Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time view of key power-sector metrics for net-zero by 2050
            (IPCC 1.5°C)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-4 py-2 rounded font-medium flex items-center gap-2 ${
              simulatorRunning
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            onClick={toggleSimulator}
          >
            <div
              className={`w-4 h-4 ${
                simulatorRunning ? "bg-white rounded" : "bg-white rounded"
              }`}
            ></div>
            {simulatorRunning ? "Stop Simulator" : "Start Simulator"}
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded font-medium flex items-center gap-2 hover:bg-gray-50"
            onClick={generateTestData}
            disabled={loading}
          >
            <div
              className={`w-4 h-4 ${
                loading
                  ? "animate-spin bg-gray-500 rounded"
                  : "bg-gray-500 rounded"
              }`}
            ></div>
            Generate Test Data
          </button>
        </div>
      </div>

      {/* Status Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <p className="text-blue-800 text-sm">
            This prototype demonstrates integrated sustainability metrics for
            electricity/heat, enabling clear reporting and analysis. Data are
            simulated for demonstration purposes.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">CO₂ Intensity</h3>
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
          </div>
          <div className="text-2xl font-bold">
            {kpis.co2Intensity.toFixed(1)}
          </div>
          <p className="text-xs text-gray-500">gCO₂ per kWh</p>
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded mt-2">
            Lower is better
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Renewable Share</h3>
            <div className="w-4 h-4 bg-green-500 rounded"></div>
          </div>
          <div className="text-2xl font-bold">
            {kpis.renewableShare.toFixed(1)}%
          </div>
          <p className="text-xs text-gray-500">of total generation</p>
          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded mt-2">
            Higher is better
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Net-zero Alignment</h3>
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
          </div>
          <div className="text-2xl font-bold">
            {kpis.netZeroAlignment.toFixed(0)}%
          </div>
          <p className="text-xs text-gray-500">vs 2050 pathway</p>
          <span
            className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
              kpis.netZeroAlignment >= 100
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {kpis.netZeroAlignment >= 100 ? "On track" : "Behind"}
          </span>
        </div>
      </div>

      {/* Goal Tracker */}
      <GoalTracker />

      {/* Main Content Tabs */}
      <div className="space-y-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "co2-intensity", label: "CO₂ Intensity" },
              { id: "generation-mix", label: "Generation Mix" },
              { id: "net-zero", label: "Net-zero Alignment" },
              { id: "scatter", label: "Correlation Analysis" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CO2IntensityChart data={chartData.co2Data} loading={loading} />
                <GenerationMixChart
                  data={chartData.genData}
                  loading={loading}
                />
              </div>
              <NetZeroAlignmentChart
                data={chartData.nzData}
                loading={loading}
              />
            </>
          )}

          {activeTab === "co2-intensity" && (
            <CO2IntensityChart data={chartData.co2Data} loading={loading} />
          )}
          {activeTab === "generation-mix" && (
            <GenerationMixChart data={chartData.genData} loading={loading} />
          )}
          {activeTab === "net-zero" && (
            <NetZeroAlignmentChart data={chartData.nzData} loading={loading} />
          )}
          {activeTab === "scatter" && (
            <ScatterChart data={chartData.scatterData} loading={loading} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {lastUpdate ? lastUpdate.toLocaleString() : "Never"} |
        Simulator: {simulatorRunning ? "Running" : "Stopped"} | Data source:{" "}
        {"Mock Data"}
      </div>
    </div>
  );
};

export default SustainabilityDashboard;
