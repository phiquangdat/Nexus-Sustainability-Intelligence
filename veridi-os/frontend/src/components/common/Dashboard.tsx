import { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import {
  fetchPowerPlantData,
  fetchPowerPlantsSummary,
  selectDataLoading,
  selectDataError,
  selectDataSummary,
  selectChartData,
  selectEnergyData,
} from "../state/dataSlice";
import ChartSkeleton from "./ChartSkeleton";
import DataCardSkeleton from "./DataCardSkeleton";
import AIInsight from "./AIInsight";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectDataLoading);
  const error = useAppSelector(selectDataError);
  const summaryData = useAppSelector(selectDataSummary);
  const co2Data = useAppSelector(selectChartData);
  const energyData = useAppSelector(selectEnergyData);

  useEffect(() => {
    dispatch(fetchPowerPlantData());
    dispatch(fetchPowerPlantsSummary());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Power Plant Dashboard
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton type="line" />
          <ChartSkeleton type="bar" />
        </div>
        <div className="mt-6">
          <DataCardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-lg font-semibold mb-2">Failed to Load Data</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchPowerPlantData())}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Power Plant Dashboard
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CO2 Emissions Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            CO2 Emissions Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={co2Data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="emissions"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Energy Output Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            Total Energy Output by Plant
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="plant" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="energy" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Summary */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Data Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {summaryData.totalPoints}
            </div>
            <div className="text-sm text-gray-600">Data Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {summaryData.totalEnergy.toFixed(1)} MWh
            </div>
            <div className="text-sm text-gray-600">Total Energy Output</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {summaryData.totalEmissions.toFixed(1)} t
            </div>
            <div className="text-sm text-gray-600">Total CO2 Emissions</div>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-6">
        <AIInsight />
      </div>
    </div>
  );
};

export default Dashboard;
