import React from "react";
import { cn } from "../../utils/helpers";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular" | "card";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}) => {
  const baseClasses = "bg-neutral-200 dark:bg-neutral-700";

  const variantClasses = {
    text: "h-4 rounded",
    rectangular: "rounded-lg",
    circular: "rounded-full",
    card: "rounded-2xl",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
};

// Predefined skeleton components
export const SkeletonCard: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn("p-6 space-y-4", className)}>
    <Skeleton variant="rectangular" height={200} />
    <div className="space-y-2">
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
    </div>
  </div>
);

export const SkeletonMetricCard: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn("p-8 space-y-4", className)}>
    <div className="flex items-center justify-between">
      <Skeleton variant="text" width="120px" height={20} />
      <Skeleton variant="circular" width={40} height={40} />
    </div>
    <Skeleton variant="text" width="80px" height={32} />
    <Skeleton variant="text" width="100px" height={16} />
  </div>
);

export const SkeletonChart: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn("p-6 space-y-4", className)}>
    <Skeleton variant="text" width="200px" height={24} />
    <Skeleton variant="rectangular" height={300} />
    <div className="flex justify-center space-x-4">
      <Skeleton variant="circular" width={12} height={12} />
      <Skeleton variant="circular" width={12} height={12} />
      <Skeleton variant="circular" width={12} height={12} />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({
  rows = 5,
  className,
}) => (
  <div className={cn("space-y-3", className)}>
    {/* Header */}
    <div className="flex space-x-4">
      <Skeleton variant="text" width="20%" />
      <Skeleton variant="text" width="25%" />
      <Skeleton variant="text" width="30%" />
      <Skeleton variant="text" width="25%" />
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        <Skeleton variant="text" width="20%" />
        <Skeleton variant="text" width="25%" />
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" width="25%" />
      </div>
    ))}
  </div>
);

export default Skeleton;
