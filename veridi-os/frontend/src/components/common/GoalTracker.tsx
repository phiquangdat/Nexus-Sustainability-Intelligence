// Enhanced Goal Tracker Component - Integrates Streamlit Home.py goal tracking functionality
import { useState, useEffect } from "react";
import { AnalysisService } from "../../services/analysisService";

interface GoalTrackerResult {
  co2ReductionProgress: number;
  renewableTargetProgress: number;
  netZeroAlignment: number;
  overallProgress: number;
}

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

      // Fetch comprehensive analysis from backend
      const dashboardData = await AnalysisService.getDashboardData();

      // Extract data from analysis response
      const co2Data = dashboardData.co2Records || [];
      const genData = dashboardData.generationMixRecords || [];
      const nzData = dashboardData.netZeroRecords || [];

      // Create a simple goal tracker result
      const result = {
        co2ReductionProgress: co2Data.length > 0 ? Math.min(100, (co2Data[0].co2_intensity / 1000) * 100) : 0,
        renewableTargetProgress: genData.length > 0 ? genData[0].renewable_percentage : 0,
        netZeroAlignment: nzData.length > 0 ? nzData[0].alignment_score : 0,
        overallProgress: 0
      };
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
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-blue-500 rounded"></div>
          <h3 className="text-lg font-semibold">
            Goal Tracker (1.5°C / Net-zero 2050)
          </h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-blue-500 rounded"></div>
          <h3 className="text-lg font-semibold">
            Goal Tracker (1.5°C / Net-zero 2050)
          </h3>
        </div>
        <div className="flex items-center gap-2 text-red-600">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (!goalTrackerData || goalTrackerData.error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-blue-500 rounded"></div>
          <h3 className="text-lg font-semibold">
            Goal Tracker (1.5°C / Net-zero 2050)
          </h3>
        </div>
        <div className="text-gray-500 text-sm">
          Insufficient data for goal tracking analysis
        </div>
      </div>
    );
  }

  const { rai_pct, budget, velocity, pathway } = goalTrackerData;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 bg-blue-500 rounded"></div>
        <h3 className="text-lg font-semibold">
          Goal Tracker (1.5°C / Net-zero 2050)
        </h3>
      </div>
      <div className="space-y-6">
        {/* Real-time Alignment Index */}
        {rai_pct !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Real-time Alignment Index
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  rai_pct >= 100
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {rai_pct}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  rai_pct >= 100 ? "bg-green-500 w-full" : "bg-red-500 w-3/4"
                }`}
              ></div>
            </div>
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
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
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
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  velocity.on_track
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {velocity.on_track ? "On track" : "Behind"}
              </span>
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
              <div className="w-4 h-4 bg-green-500 rounded"></div>
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
      </div>
    </div>
  );
};

export default GoalTracker;
