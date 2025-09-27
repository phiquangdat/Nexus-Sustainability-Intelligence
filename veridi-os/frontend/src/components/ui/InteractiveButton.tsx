import React, { useState } from "react";
import { cn } from "../../utils/helpers";

interface InteractiveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "error"
    | "ghost"
    | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  ripple?: boolean;
  glow?: boolean;
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className,
  disabled,
  ripple = true,
  glow = false,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !disabled && !loading) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newRipple = {
        id: Date.now(),
        x,
        y,
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) =>
          prev.filter((ripple) => ripple.id !== newRipple.id)
        );
      }, 600);
    }

    onClick?.(e);
  };

  const baseClasses =
    "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-medium hover:shadow-hard hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500 transform hover:scale-105",
    secondary:
      "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-medium hover:shadow-hard hover:from-secondary-600 hover:to-secondary-700 focus:ring-secondary-500 transform hover:scale-105",
    accent:
      "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-medium hover:shadow-hard hover:from-accent-600 hover:to-accent-700 focus:ring-accent-500 transform hover:scale-105",
    success:
      "bg-gradient-to-r from-success-500 to-success-600 text-white shadow-medium hover:shadow-hard hover:from-success-600 hover:to-success-700 focus:ring-success-500 transform hover:scale-105",
    warning:
      "bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-medium hover:shadow-hard hover:from-warning-600 hover:to-warning-700 focus:ring-warning-500 transform hover:scale-105",
    error:
      "bg-gradient-to-r from-error-500 to-error-600 text-white shadow-medium hover:shadow-hard hover:from-error-600 hover:to-error-700 focus:ring-error-500 transform hover:scale-105",
    ghost:
      "text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-primary-400 dark:hover:bg-neutral-800 focus:ring-primary-500",
    outline:
      "border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-500 dark:hover:text-white focus:ring-primary-500 transform hover:scale-105",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const glowClasses = glow ? "hover:shadow-glow" : "";

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glowClasses,
        className
      )}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none rounded-full bg-white/30 animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}

      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Icon */}
      {icon && !loading && <span className="mr-2">{icon}</span>}

      {/* Content */}
      {children}
    </button>
  );
};

export default InteractiveButton;
