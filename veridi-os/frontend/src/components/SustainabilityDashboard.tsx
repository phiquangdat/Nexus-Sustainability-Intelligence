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
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 ${className}`}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🌱</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Sustainability Intelligence
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Real-time monitoring of CO₂ emissions, renewable energy, and net-zero progress
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSimulator}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  simulatorRunning
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                    : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{simulatorRunning ? "⏹️" : "▶️"}</span>
                  <span>{simulatorRunning ? "Stop Simulator" : "Start Simulator"}</span>
                </span>
              </button>
              <button
                onClick={generateTestData}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="flex items-center space-x-2">
                  <span className={loading ? "animate-spin" : ""}>📊</span>
                  <span>Generate Test Data</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Alert */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">ℹ️</span>
            </div>
            <p className="text-blue-800 text-base font-medium">
              This prototype demonstrates integrated sustainability metrics for electricity/heat, enabling clear reporting and analysis. Data are simulated for demonstration purposes.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-700">CO₂ Intensity</h3>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🌍</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {kpis.co2Intensity.toFixed(1)}
            </div>
            <p className="text-sm text-gray-500 mb-4">gCO₂ per kWh</p>
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Lower is better
              </span>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📉</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-700">Renewable Share</h3>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🌱</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {kpis.renewableShare.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-500 mb-4">of total generation</p>
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Higher is better
              </span>
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📈</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-700">Net-zero Alignment</h3>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🎯</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {kpis.netZeroAlignment.toFixed(0)}%
            </div>
            <p className="text-sm text-gray-500 mb-4">vs 2050 pathway</p>
            <div className="flex items-center justify-between">
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                  kpis.netZeroAlignment >= 100
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {kpis.netZeroAlignment >= 100 ? "On track" : "Behind"}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                kpis.netZeroAlignment >= 100 
                  ? "bg-gradient-to-r from-green-400 to-green-500" 
                  : "bg-gradient-to-r from-red-400 to-red-500"
              }`}>
                <span className="text-white text-sm">
                  {kpis.netZeroAlignment >= 100 ? "✅" : "⚠️"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Goal Tracker */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <GoalTracker />
        </div>

        {/* Main Content Tabs */}
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-2">
            <nav className="flex space-x-2">
              {[
                { id: "overview", label: "Overview", icon: "📊" },
                { id: "co2-intensity", label: "CO₂ Intensity", icon: "🌍" },
                { id: "generation-mix", label: "Generation Mix", icon: "⚡" },
                { id: "net-zero", label: "Net-zero Alignment", icon: "🎯" },
                { id: "scatter", label: "Correlation Analysis", icon: "📈" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                    <CO2IntensityChart data={chartData.co2Data} loading={loading} />
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                    <GenerationMixChart data={chartData.genData} loading={loading} />
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                  <NetZeroAlignmentChart data={chartData.nzData} loading={loading} />
                </div>
              </div>
            )}

            {activeTab === "co2-intensity" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <CO2IntensityChart data={chartData.co2Data} loading={loading} />
              </div>
            )}
            {activeTab === "generation-mix" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <GenerationMixChart data={chartData.genData} loading={loading} />
              </div>
            )}
            {activeTab === "net-zero" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <NetZeroAlignmentChart data={chartData.nzData} loading={loading} />
              </div>
            )}
            {activeTab === "scatter" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <ScatterChart data={chartData.scatterData} loading={loading} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Last updated: {lastUpdate ? lastUpdate.toLocaleString() : "Never"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${simulatorRunning ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
              <span>Simulator: {simulatorRunning ? "Running" : "Stopped"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Data source: Mock Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityDashboard;
