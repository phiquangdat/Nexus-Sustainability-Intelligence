import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "primary" | "secondary" | "accent" | "success" | "warning" | "error";
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = "primary",
  className = "",
}) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600",
    accent: "from-accent-500 to-accent-600",
    success: "from-success-500 to-success-600",
    warning: "from-warning-500 to-warning-600",
    error: "from-error-500 to-error-600",
  };

  const trendIcons = {
    up: "📈",
    down: "📉",
    neutral: "➡️",
  };

  const trendColors = {
    up: "text-success-600",
    down: "text-error-600",
    neutral: "text-neutral-600",
  };

  return (
    <div className={`metric-card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-700">{title}</h3>
        <div
          className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}
        >
          <span className="text-white text-xl">{icon}</span>
        </div>
      </div>

      <div className="text-4xl font-bold text-neutral-900 mb-2">{value}</div>

      {subtitle && <p className="text-sm text-neutral-500 mb-4">{subtitle}</p>}

      {trend && trendValue && (
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center space-x-1 text-sm font-medium ${trendColors[trend]}`}
          >
            <span>{trendIcons[trend]}</span>
            <span>{trendValue}</span>
          </span>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              trend === "up"
                ? "bg-success-100"
                : trend === "down"
                ? "bg-error-100"
                : "bg-neutral-100"
            }`}
          >
            <span
              className={`text-sm ${
                trend === "up"
                  ? "text-success-600"
                  : trend === "down"
                  ? "text-error-600"
                  : "text-neutral-600"
              }`}
            >
              {trendIcons[trend]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
