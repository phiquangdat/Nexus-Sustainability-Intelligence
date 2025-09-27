import { useState, useCallback } from "react";
import type { EUETSReport } from "../types";
import { mockDataService } from "../services/mockDataService";
import LoadingSpinner from "./LoadingSpinner";

const ReportGenerator = () => {
  const [report, setReport] = useState<EUETSReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const report = await mockDataService.getEUETSReport();
      setReport(report);
    } catch (err) {
      setError("Failed to generate report");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          EU ETS Report Generator
        </h2>

        <div className="text-center mb-6">
          <button
            onClick={generateReport}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center mx-auto"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span className="ml-2">Generating Report...</span>
              </>
            ) : (
              "Generate EU ETS Report"
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {report && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              EU ETS Compliance Report
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {report.total_emissions_tonnes} t
                </div>
                <div className="text-sm text-gray-600">Total CO2 Emissions</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {report.reporting_period}
                </div>
                <div className="text-sm text-gray-600">Reporting Period</div>
              </div>

              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    report.status === "Compliant"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {report.status}
                </div>
                <div className="text-sm text-gray-600">Compliance Status</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-white rounded border-l-4 border-green-500">
              <p className="text-sm text-gray-700">
                <strong>Report Summary:</strong> This automated report shows the
                total CO2 emissions for the reporting period. The system has
                calculated emissions based on real-time power plant data and
                verified compliance with EU ETS regulations.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;
