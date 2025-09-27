// Enhanced Sustainability Dashboard - Integrates all modules and Streamlit patterns
import React, { useState, useEffect } from "react";

import { GoalTracker } from "./GoalTracker";
import CO2IntensityChart from "./CO2IntensityChart";
import GenerationMixChart from "./GenerationMixChart";
import NetZeroAlignmentChart from "./NetZeroAlignmentChart";
import ScatterChart from "./ScatterChart";
import { Card, Button, MetricCard } from "../ui";

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
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 ${className}`}
    >
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <Card padding="xl" glow="green">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🌱</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text">
                    Sustainability Intelligence
                  </h1>
                  <p className="text-neutral-600 text-lg">
                    Real-time monitoring of CO₂ emissions, renewable energy, and
                    net-zero progress
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleSimulator}
                variant={simulatorRunning ? "error" : "success"}
                icon={simulatorRunning ? "⏹️" : "▶️"}
              >
                {simulatorRunning ? "Stop Simulator" : "Start Simulator"}
              </Button>
              <Button
                onClick={generateTestData}
                disabled={loading}
                variant="secondary"
                loading={loading}
                icon="📊"
              >
                Generate Test Data
              </Button>
            </div>
          </div>
        </Card>

        {/* Status Alert */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">ℹ️</span>
            </div>
            <p className="text-blue-800 text-base font-medium">
              This prototype demonstrates integrated sustainability metrics for
              electricity/heat, enabling clear reporting and analysis. Data are
              simulated for demonstration purposes.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="CO₂ Intensity"
            value={kpis.co2Intensity.toFixed(1)}
            subtitle="gCO₂ per kWh"
            icon="🌍"
            trend="down"
            trendValue="Lower is better"
            color="secondary"
          />

          <MetricCard
            title="Renewable Share"
            value={`${kpis.renewableShare.toFixed(1)}%`}
            subtitle="of total generation"
            icon="🌱"
            trend="up"
            trendValue="Higher is better"
            color="success"
          />

          <MetricCard
            title="Net-zero Alignment"
            value={`${kpis.netZeroAlignment.toFixed(0)}%`}
            subtitle="vs 2050 pathway"
            icon="🎯"
            trend={kpis.netZeroAlignment >= 100 ? "up" : "down"}
            trendValue={kpis.netZeroAlignment >= 100 ? "On track" : "Behind"}
            color={kpis.netZeroAlignment >= 100 ? "success" : "error"}
          />
        </div>

        {/* Goal Tracker */}
        <Card padding="xl">
          <GoalTracker />
        </Card>

        {/* Main Content Tabs */}
        <div className="space-y-6">
          <Card padding="sm">
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
                      ? "bg-gradient-to-r from-primary-500 to-secondary-600 text-white shadow-lg transform scale-105"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>

          <div className="space-y-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card padding="lg">
                    <CO2IntensityChart
                      data={chartData.co2Data}
                      loading={loading}
                    />
                  </Card>
                  <Card padding="lg">
                    <GenerationMixChart
                      data={chartData.genData}
                      loading={loading}
                    />
                  </Card>
                </div>
                <Card padding="lg">
                  <NetZeroAlignmentChart
                    data={chartData.nzData}
                    loading={loading}
                  />
                </Card>
              </div>
            )}

            {activeTab === "co2-intensity" && (
              <Card padding="lg">
                <CO2IntensityChart data={chartData.co2Data} loading={loading} />
              </Card>
            )}
            {activeTab === "generation-mix" && (
              <Card padding="lg">
                <GenerationMixChart
                  data={chartData.genData}
                  loading={loading}
                />
              </Card>
            )}
            {activeTab === "net-zero" && (
              <Card padding="lg">
                <NetZeroAlignmentChart
                  data={chartData.nzData}
                  loading={loading}
                />
              </Card>
            )}
            {activeTab === "scatter" && (
              <Card padding="lg">
                <ScatterChart data={chartData.scatterData} loading={loading} />
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <Card padding="lg">
          <div className="flex items-center justify-center space-x-6 text-sm text-neutral-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span>
                Last updated:{" "}
                {lastUpdate ? lastUpdate.toLocaleString() : "Never"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  simulatorRunning
                    ? "bg-success-500 animate-pulse"
                    : "bg-neutral-400"
                }`}
              ></div>
              <span>Simulator: {simulatorRunning ? "Running" : "Stopped"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
              <span>Data source: Mock Data</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SustainabilityDashboard;
