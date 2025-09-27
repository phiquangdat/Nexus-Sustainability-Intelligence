// Comprehensive Sustainability Intelligence Dashboard
// Integrates all Streamlit functionality into React components

import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabaseService } from "../services/supabaseService";
import { dataAnalysisService } from "../services/dataAnalysisService";
import { dataSimulatorService } from "../services/dataSimulatorService";
import type {
  Co2IntensityRecord,
  GenerationMixRecord,
  NetZeroAlignmentRecord,
} from "../services/supabaseService";
import type { GoalTracker } from "../services/dataAnalysisService";

interface SustainabilityDashboardProps {
  className?: string;
}

const SustainabilityDashboard: React.FC<SustainabilityDashboardProps> = ({
  className = "",
}) => {
  // State management
  const [co2Data, setCo2Data] = useState<Co2IntensityRecord[]>([]);
  const [genData, setGenData] = useState<GenerationMixRecord[]>([]);
  const [netZeroData, setNetZeroData] = useState<NetZeroAlignmentRecord[]>([]);
  const [goalTracker, setGoalTracker] = useState<GoalTracker>({});
  const [timeRange, setTimeRange] = useState<"24h" | "7d">("24h");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useSimulatedData, setUseSimulatedData] = useState(false);

  // Calculate data limit based on time range
  const dataLimit = timeRange === "24h" ? 96 : 96 * 7;

  // Fetch data from Supabase or use simulated data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (useSimulatedData || !supabaseService.isEnabled()) {
        // Use simulated data
        const simulatedData = dataSimulatorService.generateAllData(dataLimit);
        setCo2Data(simulatedData.co2Intensity);
        setGenData(simulatedData.generationMix);
        setNetZeroData(simulatedData.netZeroAlignment);
      } else {
        // Fetch from Supabase
        const [co2, gen, netZero] = await Promise.all([
          supabaseService.fetchCo2IntensityData(dataLimit),
          supabaseService.fetchGenerationMixData(dataLimit),
          supabaseService.fetchNetZeroAlignmentData(100),
        ]);
        setCo2Data(co2);
        setGenData(gen);
        setNetZeroData(netZero);
      }

      // Compute goal tracker metrics
      if (co2Data.length > 0 && genData.length > 0) {
        const gt = dataAnalysisService.computeGoalTracker(
          co2Data,
          genData,
          netZeroData
        );
        setGoalTracker(gt);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [timeRange, useSimulatedData, dataLimit, co2Data.length, genData.length]);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time subscriptions
  useEffect(() => {
    if (!useSimulatedData && supabaseService.isEnabled()) {
      const subscriptions = [
        supabaseService.subscribeToCo2Intensity((payload) => {
          console.log("CO2 intensity update:", payload);
          fetchData();
        }),
        supabaseService.subscribeToGenerationMix((payload) => {
          console.log("Generation mix update:", payload);
          fetchData();
        }),
      ];

      return () => {
        subscriptions.forEach((sub) => sub.unsubscribe());
      };
    }
  }, [useSimulatedData, fetchData]);

  // Calculate current KPIs
  const currentCo2 =
    co2Data.length > 0
      ? co2Data[co2Data.length - 1]?.co2_intensity_g_per_kwh
      : 0;
  const currentRenewableShare =
    genData.length > 0 ? genData[genData.length - 1]?.renewable_share_pct : 0;
  const latestAlignment =
    netZeroData.length > 0
      ? netZeroData[netZeroData.length - 1]?.alignment_pct
      : 0;

  // Prepare chart data
  const co2ChartData = co2Data.map((d) => ({
    timestamp: new Date(d.timestamp).toLocaleTimeString(),
    co2_intensity_g_per_kwh: d.co2_intensity_g_per_kwh,
  }));

  const genChartData = genData.map((d) => ({
    timestamp: new Date(d.timestamp).toLocaleTimeString(),
    hydro_mw: d.hydro_mw,
    wind_mw: d.wind_mw,
    solar_mw: d.solar_mw,
    nuclear_mw: d.nuclear_mw,
    fossil_mw: d.fossil_mw,
  }));

  const currentMix =
    genData.length > 0
      ? {
          hydro: genData[genData.length - 1].hydro_mw,
          wind: genData[genData.length - 1].wind_mw,
          solar: genData[genData.length - 1].solar_mw,
          nuclear: genData[genData.length - 1].nuclear_mw,
          fossil: genData[genData.length - 1].fossil_mw,
        }
      : null;

  const pieData = currentMix
    ? [
        { name: "Hydro", value: currentMix.hydro, color: "#3B82F6" },
        { name: "Wind", value: currentMix.wind, color: "#10B981" },
        { name: "Solar", value: currentMix.solar, color: "#F59E0B" },
        { name: "Nuclear", value: currentMix.nuclear, color: "#8B5CF6" },
        { name: "Fossil", value: currentMix.fossil, color: "#EF4444" },
      ]
    : [];

  // Scatter plot data for renewables vs CO2
  const scatterData = genData
    .map((gen) => {
      const co2 = co2Data.find(
        (c) =>
          Math.abs(
            new Date(c.timestamp).getTime() - new Date(gen.timestamp).getTime()
          ) <=
          20 * 60 * 1000
      );
      return {
        renewable_share_pct: gen.renewable_share_pct,
        co2_intensity_g_per_kwh: co2?.co2_intensity_g_per_kwh || 0,
      };
    })
    .filter((d) => d.co2_intensity_g_per_kwh > 0);

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">
            Error Loading Data
          </h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sustainability Intelligence Dashboard
        </h1>
        <p className="text-gray-600 max-w-4xl">
          This prototype addresses the WISE Sustainability Intelligence
          challenge: an explorable, real‑time view of key power‑sector metrics
          to support reporting, analysis, and progress toward net‑zero by 2050
          (IPCC 1.5°C). It illustrates how integrated metrics can improve
          transparency and compliance readiness (CSRD/ESRS, EU ETS MRV).
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as "24h" | "7d")}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select time range"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useSimulatedData}
            onChange={(e) => setUseSimulatedData(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-600">Use simulated data</span>
        </label>
      </div>

      {/* Goal Tracker */}
      {goalTracker && !goalTracker.error && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Goal Tracker (1.5°C / Net‑zero 2050)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {goalTracker.rai_pct !== undefined && (
              <div className="bg-white p-4 rounded-lg shadow border">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Real‑time Alignment Index
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {goalTracker.rai_pct}%
                </p>
                <p className="text-xs text-gray-500">
                  Target intensity vs current intensity. 100% means on target.
                </p>
              </div>
            )}

            {goalTracker.budget && (
              <div className="bg-white p-4 rounded-lg shadow border">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  YTD Carbon Budget
                </h3>
                <p className="text-lg font-bold text-green-600">
                  {goalTracker.budget.ytd_tons.toLocaleString()} t /{" "}
                  {goalTracker.budget.ytd_budget_tons.toLocaleString()} t
                </p>
                <p className="text-sm text-gray-600">
                  {goalTracker.budget.days_ahead} days ahead
                </p>
                <p className="text-xs text-gray-500">
                  Cumulative emissions vs proportional YTD budget.
                </p>
              </div>
            )}

            {goalTracker.velocity && (
              <div className="bg-white p-4 rounded-lg shadow border">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Decarbonization Velocity
                </h3>
                <p className="text-lg font-bold text-purple-600">
                  {goalTracker.velocity.on_track ? "On track" : "Behind"}
                </p>
                <p className="text-sm text-gray-600">
                  Actual: {goalTracker.velocity.v_actual_g_per_kwh_per_yr}{" "}
                  g/kWh/yr
                </p>
                <p className="text-xs text-gray-500">
                  Required: {goalTracker.velocity.v_required_g_per_kwh_per_yr}{" "}
                  g/kWh/yr
                </p>
              </div>
            )}
          </div>

          {/* 2050 Pathway */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              2050 Pathway (Net‑zero trajectory)
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                {latestAlignment > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      2050 Pathway Alignment
                    </h4>
                    <p className="text-2xl font-bold text-green-600">
                      {latestAlignment.toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      Annual actual vs annual target (cap at 100%).
                    </p>
                  </div>
                )}

                {goalTracker.pathway?.eta_year && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      ETA to near‑zero
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {goalTracker.pathway.eta_year}
                    </p>
                    <p className="text-xs text-gray-500">
                      Year when current decline rate would reach near‑zero
                      intensity.
                    </p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                {goalTracker.pathway?.series && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Target emissions pathway (to 2050)
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={goalTracker.pathway.series}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="target_emissions_mt"
                          stroke="#3B82F6"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            CO₂ intensity (g/kWh)
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {currentCo2.toFixed(1)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Renewable share (%)
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {currentRenewableShare.toFixed(1)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Net-zero alignment (%)
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {latestAlignment.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* CO2 Intensity Chart */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            CO₂ intensity over time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={co2ChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="co2_intensity_g_per_kwh"
                stroke="#EF4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-500 mt-2">
            Lower is better. Expect dips when wind/solar/hydro output is high;
            spikes during outages or low renewables.
          </p>
        </div>

        {/* Generation Mix Chart */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Generation mix (MW)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={genChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="hydro_mw"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
              />
              <Area
                type="monotone"
                dataKey="wind_mw"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
              />
              <Area
                type="monotone"
                dataKey="solar_mw"
                stackId="1"
                stroke="#F59E0B"
                fill="#F59E0B"
              />
              <Area
                type="monotone"
                dataKey="nuclear_mw"
                stackId="1"
                stroke="#8B5CF6"
                fill="#8B5CF6"
              />
              <Area
                type="monotone"
                dataKey="fossil_mw"
                stackId="1"
                stroke="#EF4444"
                fill="#EF4444"
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-500 mt-2">
            Stacked by technology (MW). Weather, maintenance, and price signals
            drive shifts.
          </p>
        </div>
      </div>

      {/* Bottom Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Current Mix Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Current generation mix
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent as number) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-500 mt-2">
            Current mix snapshot. Higher renewable share typically correlates
            with lower CO₂ intensity.
          </p>
        </div>

        {/* Scatter Plot */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Renewables vs CO₂ intensity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="renewable_share_pct" name="Renewable Share %" />
              <YAxis
                dataKey="co2_intensity_g_per_kwh"
                name="CO₂ Intensity g/kWh"
              />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter dataKey="co2_intensity_g_per_kwh" fill="#3B82F6" />
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-500 mt-2">
            Inverse relationship: higher renewables → lower CO₂ intensity.
            Trendline shows expected negative slope.
          </p>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-800 font-semibold mb-2">Prototype Note</h3>
        <p className="text-blue-700">
          Data are simulated to demonstrate flows and visuals. In production,
          data integrate from plant SCADA, fuel/efficiency logs, and emissions
          inventories.
        </p>
      </div>
    </div>
  );
};

export default SustainabilityDashboard;
