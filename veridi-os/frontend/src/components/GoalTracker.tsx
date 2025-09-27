import React from 'react';
import type { GoalTracker } from '../types';

interface GoalTrackerProps {
  data: GoalTracker;
  loading?: boolean;
}

const GoalTrackerComponent: React.FC<GoalTrackerProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Goal Tracker (1.5°C / Net-zero 2050)
        </h3>
        <div className="text-red-600">
          Error: {data.error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Goal Tracker (1.5°C / Net-zero 2050)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Real-time Alignment Index */}
        {data.rai_pct !== undefined && (
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {data.rai_pct}%
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              Real-time Alignment Index
            </div>
            <div className="text-xs text-gray-500">
              Target intensity vs current intensity. 100% means on target.
            </div>
          </div>
        )}

        {/* YTD Carbon Budget */}
        {data.budget && (
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 mb-2">
              {data.budget.days_ahead > 0 ? '+' : ''}{data.budget.days_ahead} days
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              YTD Carbon Budget
            </div>
            <div className="text-xs text-gray-500">
              {Math.round(data.budget.ytd_tons).toLocaleString()} t / {Math.round(data.budget.ytd_budget_tons).toLocaleString()} t
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Cumulative emissions vs proportional YTD budget.
            </div>
          </div>
        )}

        {/* Decarbonization Velocity */}
        {data.velocity && (
          <div className="text-center">
            <div className={`text-lg font-bold mb-2 ${data.velocity.on_track ? 'text-green-600' : 'text-red-600'}`}>
              {data.velocity.on_track ? 'On Track' : 'Behind'}
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              Decarbonization Velocity
            </div>
            <div className="text-xs text-gray-500">
              Actual: {data.velocity.v_actual_g_per_kwh_per_yr} g/kWh/yr
            </div>
            <div className="text-xs text-gray-500">
              Required: {data.velocity.v_required_g_per_kwh_per_yr} g/kWh/yr
            </div>
          </div>
        )}
      </div>

      {/* 2050 Pathway Section */}
      {data.pathway && (
        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4">
            2050 Pathway (Net-zero trajectory)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pathway Metrics */}
            <div className="space-y-4">
              {data.pathway.eta_year && (
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600 mb-2">
                    {data.pathway.eta_year}
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    ETA to near-zero
                  </div>
                  <div className="text-xs text-gray-500">
                    Year when current decline rate would reach near-zero intensity.
                  </div>
                </div>
              )}
            </div>

            {/* Pathway Sparkline */}
            {data.pathway.series && data.pathway.series.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Target Emissions Pathway (to 2050)
                </h5>
                <div className="h-32">
                  <svg width="100%" height="100%" viewBox="0 0 300 100" className="overflow-visible">
                    {data.pathway.series.map((point, index) => {
                      if (index === 0) return null;
                      const prevPoint = data.pathway!.series[index - 1];
                      const x1 = ((prevPoint.year - data.pathway!.series[0].year) / 
                                (data.pathway!.series[data.pathway!.series.length - 1].year - data.pathway!.series[0].year)) * 280 + 10;
                      const y1 = 90 - (prevPoint.target_emissions_mt / Math.max(...data.pathway!.series.map(p => p.target_emissions_mt))) * 70;
                      const x2 = ((point.year - data.pathway!.series[0].year) / 
                                (data.pathway!.series[data.pathway!.series.length - 1].year - data.pathway!.series[0].year)) * 280 + 10;
                      const y2 = 90 - (point.target_emissions_mt / Math.max(...data.pathway!.series.map(p => p.target_emissions_mt))) * 70;
                      
                      return (
                        <line
                          key={index}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#10b981"
                          strokeWidth="2"
                        />
                      );
                    })}
                    {data.pathway.series.map((point, index) => {
                      const x = ((point.year - data.pathway!.series[0].year) / 
                               (data.pathway!.series[data.pathway!.series.length - 1].year - data.pathway!.series[0].year)) * 280 + 10;
                      const y = 90 - (point.target_emissions_mt / Math.max(...data.pathway!.series.map(p => p.target_emissions_mt))) * 70;
                      
                      return (
                        <circle
                          key={index}
                          cx={x}
                          cy={y}
                          r="3"
                          fill="#10b981"
                        />
                      );
                    })}
                  </svg>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Annual targets to 2050 (0 Mt)
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* How it works expander */}
      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
          How the Goal Tracker works
        </summary>
        <div className="mt-3 text-sm text-gray-600 space-y-2">
          <p><strong>Alignment Index:</strong> compares current CO₂ intensity to this year's target intensity derived from annual targets.</p>
          <p><strong>Budget:</strong> integrates emissions from power output and intensity vs a proportional year-to-date budget.</p>
          <p><strong>Velocity:</strong> compares observed intensity decline rate vs the rate needed to meet this year's target.</p>
        </div>
      </details>
    </div>
  );
};

export default GoalTrackerComponent;
