// Enhanced Goal Tracker Component - Integrates Streamlit Home.py goal tracking functionality
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  analysisService,
  type GoalTrackerResult,
} from "@/services/analysisService";
import { supabaseService } from "@/services/supabaseService";
import { AlertCircle, TrendingUp, Calendar, Target } from "lucide-react";

interface GoalTrackerProps {
  className?: string;
}

export const GoalTracker: React.FC<GoalTrackerProps> = ({ className }) => {
  const [goalTrackerData, setGoalTrackerData] =
    useState<GoalTrackerResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGoalTrackerData();
  }, []);

  const loadGoalTrackerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from Supabase
      const [co2Data, genData, nzData] = await Promise.all([
        supabaseService.fetchCo2IntensityData(1000),
        supabaseService.fetchGenerationMixData(1000),
        supabaseService.fetchNetZeroAlignmentData(100),
      ]);

      // Compute goal tracker metrics
      const result = analysisService.computeGoalTracker(
        co2Data,
        genData,
        nzData
      );
      setGoalTrackerData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load goal tracker data"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goal Tracker (1.5°C / Net-zero 2050)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goal Tracker (1.5°C / Net-zero 2050)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!goalTrackerData || goalTrackerData.error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goal Tracker (1.5°C / Net-zero 2050)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500 text-sm">
            Insufficient data for goal tracking analysis
          </div>
        </CardContent>
      </Card>
    );
  }

  const { rai_pct, budget, velocity, pathway } = goalTrackerData;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Goal Tracker (1.5°C / Net-zero 2050)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Real-time Alignment Index */}
        {rai_pct !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Real-time Alignment Index
              </span>
              <Badge variant={rai_pct >= 100 ? "default" : "destructive"}>
                {rai_pct}%
              </Badge>
            </div>
            <Progress value={Math.min(100, rai_pct)} className="h-2" />
            <p className="text-xs text-gray-600">
              Target intensity vs current intensity. 100% means on target.
            </p>
          </div>
        )}

        {/* YTD Carbon Budget */}
        {budget && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">YTD Carbon Budget</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {budget.days_ahead > 0 ? "+" : ""}
                  {budget.days_ahead} days
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Actual:</span>
                <span className="ml-2 font-medium">
                  {budget.ytd_tons.toLocaleString()} t
                </span>
              </div>
              <div>
                <span className="text-gray-600">Budget:</span>
                <span className="ml-2 font-medium">
                  {budget.ytd_budget_tons.toLocaleString()} t
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Cumulative emissions vs proportional YTD budget.
            </p>
          </div>
        )}

        {/* Decarbonization Velocity */}
        {velocity && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Decarbonization Velocity
              </span>
              <Badge variant={velocity.on_track ? "default" : "destructive"}>
                {velocity.on_track ? "On track" : "Behind"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Actual:</span>
                <span className="ml-2 font-medium">
                  {velocity.v_actual_g_per_kwh_per_yr} g/kWh/yr
                </span>
              </div>
              <div>
                <span className="text-gray-600">Required:</span>
                <span className="ml-2 font-medium">
                  {velocity.v_required_g_per_kwh_per_yr} g/kWh/yr
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Compares observed intensity decline rate vs the rate needed to
              meet this year's target.
            </p>
          </div>
        )}

        {/* 2050 Pathway */}
        {pathway && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">2050 Pathway</span>
            </div>
            {pathway.eta_year && (
              <div className="text-sm">
                <span className="text-gray-600">ETA to near-zero:</span>
                <span className="ml-2 font-medium">{pathway.eta_year}</span>
              </div>
            )}
            <p className="text-xs text-gray-600">
              Year when current decline rate would reach near-zero intensity.
            </p>
          </div>
        )}

        {/* How it works expander */}
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
            How the Goal Tracker works
          </summary>
          <div className="mt-2 space-y-1 text-gray-600">
            <p>
              • <strong>Alignment Index:</strong> compares current CO₂ intensity
              to this year's target intensity derived from annual targets.
            </p>
            <p>
              • <strong>Budget:</strong> integrates emissions from power output
              and intensity vs a proportional year-to-date budget.
            </p>
            <p>
              • <strong>Velocity:</strong> compares observed intensity decline
              rate vs the rate needed to meet this year's target.
            </p>
          </div>
        </details>
      </CardContent>
    </Card>
  );
};

export default GoalTracker;
