import { useAppDispatch, useAppSelector } from "../../state/hooks";
import {
  generateEUETSReport,
  fetchEUETSReports,
  selectEUETSReport,
  selectReportLoading,
  selectReportError,
  selectReportsSummary,
} from "../../state/reportSlice";
import LoadingSpinner from "./LoadingSpinner";

const ReportGenerator = () => {
  const dispatch = useAppDispatch();
  const report = useAppSelector(selectEUETSReport);
  const loading = useAppSelector(selectReportLoading);
  const error = useAppSelector(selectReportError);
  const reportsSummary = useAppSelector(selectReportsSummary);

  const handleGenerateReport = () => {
    dispatch(generateEUETSReport());
  };

  const handleFetchReports = () => {
    dispatch(fetchEUETSReports());
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          EU ETS Report Generator
        </h2>

        <div className="text-center mb-6">
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" variant="white" />
                  <span className="ml-2">Generating Report...</span>
                </>
              ) : (
                "Generate EU ETS Report"
              )}
            </button>
            <button
              onClick={handleFetchReports}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              Load All Reports
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Reports Summary */}
        {reportsSummary.totalReports > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Reports Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {reportsSummary.totalReports}
                </div>
                <div className="text-sm text-gray-600">Total Reports</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {reportsSummary.compliantReports}
                </div>
                <div className="text-sm text-gray-600">Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {reportsSummary.nonCompliantReports}
                </div>
                <div className="text-sm text-gray-600">Non-Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {reportsSummary.averageEmissions.toFixed(1)} t
                </div>
                <div className="text-sm text-gray-600">Avg Emissions</div>
              </div>
            </div>
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
