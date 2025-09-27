import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "neutral";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}) => {
  const variantClasses = {
    success: "status-success",
    warning: "status-warning",
    error: "status-error",
    info: "status-info",
    neutral: "bg-neutral-100 text-neutral-800",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const baseClasses = "status-indicator rounded-full font-medium";
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];

  return (
    <span
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
