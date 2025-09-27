import { useState, useEffect, useMemo } from "react";

interface AIInsightData {
  id: string;
  title: string;
  alert: string;
  recommendation: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  category: "emissions" | "efficiency" | "compliance" | "cost";
  timestamp: Date;
}

const AIInsight = () => {
  const [currentInsight, setCurrentInsight] = useState<AIInsightData | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const insights: AIInsightData[] = useMemo(
    () => [
      {
        id: "1",
        title: "Predictive Alert & Recommendation",
        alert:
          "Based on current operational data and forecasted demand, we predict a 75% chance of exceeding your weekly CO₂ emissions allowance in 48 hours.",
        recommendation:
          "Advise shifting 10% of energy load from Plant A (HFO) to Plant C (Natural Gas) between 8 PM and 11 PM to remain compliant and save an estimated €12,000 in carbon credits.",
        confidence: 87,
        impact: "high",
        category: "emissions",
        timestamp: new Date(),
      },
      {
        id: "2",
        title: "Efficiency Optimization Opportunity",
        alert:
          "Plant B is operating at 15% below optimal efficiency during peak hours (2-4 PM).",
        recommendation:
          "Adjust fuel-air ratio and increase maintenance frequency to improve efficiency by 8% and reduce operational costs by €3,500 monthly.",
        confidence: 92,
        impact: "medium",
        category: "efficiency",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: "3",
        title: "Cost Reduction Alert",
        alert:
          "Current fuel mix is 20% more expensive than optimal configuration for current demand patterns.",
        recommendation:
          "Switch to 70% Natural Gas / 30% HFO ratio during off-peak hours to reduce fuel costs by €8,200 per week while maintaining output.",
        confidence: 78,
        impact: "high",
        category: "cost",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
    ],
    []
  );

  useEffect(() => {
    // Set initial insight
    setCurrentInsight(insights[0]);

    // Simulate AI analysis every 30 seconds
    const interval = setInterval(() => {
      setIsAnalyzing(true);
      setTimeout(() => {
        const randomInsight =
          insights[Math.floor(Math.random() * insights.length)];
        setCurrentInsight(randomInsight);
        setIsAnalyzing(false);
      }, 2000);
    }, 30000);

    return () => clearInterval(interval);
  }, [insights]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "emissions":
        return "🌍";
      case "efficiency":
        return "⚡";
      case "compliance":
        return "📋";
      case "cost":
        return "💰";
      default:
        return "🤖";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "emissions":
        return "border-red-500";
      case "efficiency":
        return "border-yellow-500";
      case "compliance":
        return "border-blue-500";
      case "cost":
        return "border-green-500";
      default:
        return "border-gray-500";
    }
  };

  if (!currentInsight) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border-l-4 border-gray-400">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>

          {/* Footer skeleton */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="flex space-x-3">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border-l-4 ${getCategoryColor(
        currentInsight.category
      )} transition-all duration-700 hover:shadow-xl hover:scale-[1.02] backdrop-blur-sm overflow-hidden group`}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(255,255,255,0.1)_100%)]"></div>
      </div>
      {/* Header with enhanced styling */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-30"></div>
            <span className="relative text-3xl mr-4 drop-shadow-lg">
              {getCategoryIcon(currentInsight.category)}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Insight
              </span>
              {isAnalyzing && (
                <div className="ml-3 flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                  <span className="ml-2 text-sm font-medium text-blue-600 animate-pulse">
                    Analyzing...
                  </span>
                </div>
              )}
            </h3>
            <p className="text-sm font-medium text-gray-600 mt-1">
              {currentInsight.title}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${getImpactColor(
              currentInsight.impact
            )} border`}
          >
            {currentInsight.impact.toUpperCase()} IMPACT
          </span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-600">
              {currentInsight.confidence}% confidence
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 space-y-4">
        {/* Enhanced Alert Section */}
        <div className="relative bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
          <div className="flex items-start relative z-10">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
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
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-yellow-800 uppercase tracking-wide mb-2">
                Alert
              </h4>
              <p className="font-semibold text-yellow-900 leading-relaxed">
                {currentInsight.alert}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Recommendation Section */}
        <div className="relative bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
          <div className="flex items-start relative z-10">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-2">
                Recommendation
              </h4>
              <p className="text-green-900 leading-relaxed">
                {currentInsight.recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="relative z-10 mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">
                Last updated: {currentInsight.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="group relative px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
              <span className="relative z-10 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Details
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button className="group relative px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105">
              <span className="relative z-10 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Apply Recommendation
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsight;
