import { useState, useEffect } from "react";
import { mockDataService } from "../../services/api/mockDataService";

const MockDataToggle = () => {
  const [useMockData, setUseMockData] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    // Check API connectivity on component mount
    const checkAPI = async () => {
      const connected = await mockDataService.testAPIConnectivity();
      setApiConnected(connected);
    };
    checkAPI();
  }, []);

  const handleToggle = (useMock: boolean) => {
    setUseMockData(useMock);
    mockDataService.setUseMockData(useMock);
  };

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="text-sm font-semibold mb-2">Development Tools</h3>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="api-data"
            name="data-source"
            checked={!useMockData}
            onChange={() => handleToggle(false)}
            className="text-blue-600"
          />
          <label htmlFor="api-data" className="text-sm">
            API Data {!apiConnected && <span className="text-red-500">(Offline)</span>}
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="mock-data"
            name="data-source"
            checked={useMockData}
            onChange={() => handleToggle(true)}
            className="text-blue-600"
          />
          <label htmlFor="mock-data" className="text-sm">
            Mock Data
          </label>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        API Status: {apiConnected ? "🟢 Connected" : "🔴 Disconnected"}
      </div>
    </div>
  );
};

export default MockDataToggle;
