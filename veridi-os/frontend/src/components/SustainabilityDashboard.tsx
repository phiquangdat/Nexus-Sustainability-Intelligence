// Enhanced Sustainability Dashboard - Integrates all modules and Streamlit patterns
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Activity,
  Zap,
  Leaf,
  TrendingDown,
  Play,
  Pause,
  RefreshCw,
  Info,
} from "lucide-react";

import { GoalTracker } from "./GoalTracker";
import { CO2IntensityChart } from "./CO2IntensityChart";
import { GenerationMixChart } from "./GenerationMixChart";
import { NetZeroAlignmentChart } from "./NetZeroAlignmentChart";
import { ScatterChart } from "./ScatterChart";

import { supabaseService } from "@/services/supabaseService";
import { simulatorService } from "@/services/simulatorService";
import { analysisService } from "@/services/analysisService";

interface DashboardProps {
  className?: string;
}

export const SustainabilityDashboard: React.FC<DashboardProps> = ({
  className,
}) => {
  const [loading, setLoading] = useState(true);
  const [simulatorRunning, setSimulatorRunning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [kpis, setKpis] = useState({
    co2Intensity: 0,
    renewableShare: 0,
    netZeroAlignment: 0,
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

      // Fetch latest data
      const [co2Data, genData, nzData] = await Promise.all([
        supabaseService.fetchCo2IntensityData(1),
        supabaseService.fetchGenerationMixData(1),
        supabaseService.fetchNetZeroAlignmentData(1),
      ]);

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

      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkSimulatorStatus = () => {
    setSimulatorRunning(simulatorService.isSimulatorRunning());
  };

  const toggleSimulator = async () => {
    try {
      if (simulatorRunning) {
        simulatorService.stopContinuous();
      } else {
        await simulatorService.startContinuous();
      }
      setSimulatorRunning(!simulatorRunning);
    } catch (error) {
      console.error("Failed to toggle simulator:", error);
    }
  };

  const generateTestData = async () => {
    try {
      setLoading(true);
      const { co2Data, genData, nzData } =
        await simulatorService.generateHistoricalData(24);

      // Insert test data into Supabase
      if (supabaseService.isEnabled()) {
        await supabaseService.insertCo2IntensityData(co2Data);
        await supabaseService.insertGenerationMixData(genData);
        await supabaseService.insertNetZeroAlignmentData(nzData);
      }

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
          <Button
            variant={simulatorRunning ? "destructive" : "default"}
            onClick={toggleSimulator}
            className="flex items-center gap-2"
          >
            {simulatorRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {simulatorRunning ? "Stop Simulator" : "Start Simulator"}
          </Button>
          <Button
            variant="outline"
            onClick={generateTestData}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Generate Test Data
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This prototype demonstrates integrated sustainability metrics for
          electricity/heat, enabling clear reporting and analysis. Data are
          simulated for demonstration purposes.
        </AlertDescription>
      </Alert>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Intensity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.co2Intensity.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">gCO₂ per kWh</p>
            <Badge variant="secondary" className="mt-2">
              <TrendingDown className="h-3 w-3 mr-1" />
              Lower is better
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Renewable Share
            </CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.renewableShare.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">of total generation</p>
            <Badge variant="default" className="mt-2">
              <Zap className="h-3 w-3 mr-1" />
              Higher is better
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Net-zero Alignment
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.netZeroAlignment.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">vs 2050 pathway</p>
            <Badge
              variant={kpis.netZeroAlignment >= 100 ? "default" : "destructive"}
              className="mt-2"
            >
              {kpis.netZeroAlignment >= 100 ? "On track" : "Behind"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Goal Tracker */}
      <GoalTracker />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="co2-intensity">CO₂ Intensity</TabsTrigger>
          <TabsTrigger value="generation-mix">Generation Mix</TabsTrigger>
          <TabsTrigger value="net-zero">Net-zero Alignment</TabsTrigger>
          <TabsTrigger value="scatter">Correlation Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CO2IntensityChart />
            <GenerationMixChart />
          </div>
          <NetZeroAlignmentChart />
        </TabsContent>

        <TabsContent value="co2-intensity">
          <CO2IntensityChart />
        </TabsContent>

        <TabsContent value="generation-mix">
          <GenerationMixChart />
        </TabsContent>

        <TabsContent value="net-zero">
          <NetZeroAlignmentChart />
        </TabsContent>

        <TabsContent value="scatter">
          <ScatterChart />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {lastUpdate ? lastUpdate.toLocaleString() : "Never"} |
        Simulator: {simulatorRunning ? "Running" : "Stopped"} | Data source:{" "}
        {supabaseService.isEnabled() ? "Supabase" : "Mock"}
      </div>
    </div>
  );
};

export default SustainabilityDashboard;
