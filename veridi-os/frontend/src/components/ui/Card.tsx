import React from "react";
import { cn } from "../../utils/helpers";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "green" | "blue" | "purple" | "none";
  padding?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "outlined" | "elevated";
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = true,
  glow = "none",
  padding = "md",
  variant = "default",
  ...props
}) => {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const glowClasses = {
    green: "shadow-glow",
    blue: "shadow-glow-blue",
    purple: "shadow-glow-purple",
    none: "",
  };

  const variantClasses = {
    default: "glass-card",
    outlined:
      "border-2 border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50",
    elevated: "bg-white dark:bg-neutral-900 shadow-hard",
  };

  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300",
        variantClasses[variant],
        hover && "card-hover",
        glowClasses[glow],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
