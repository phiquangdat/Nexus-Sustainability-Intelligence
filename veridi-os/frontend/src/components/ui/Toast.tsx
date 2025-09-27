import React, { createContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { cn } from "../../utils/helpers";

interface Toast {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// useToast is now imported from ToastContext.ts

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => removeToast(toast.id), 300);
  };

  const typeConfig = {
    success: {
      icon: "✅",
      bgColor: "bg-success-50 dark:bg-success-900/20",
      borderColor: "border-success-200 dark:border-success-800",
      textColor: "text-success-800 dark:text-success-200",
      iconBg: "bg-success-100 dark:bg-success-800",
    },
    error: {
      icon: "❌",
      bgColor: "bg-error-50 dark:bg-error-900/20",
      borderColor: "border-error-200 dark:border-error-800",
      textColor: "text-error-800 dark:text-error-200",
      iconBg: "bg-error-100 dark:bg-error-800",
    },
    warning: {
      icon: "⚠️",
      bgColor: "bg-warning-50 dark:bg-warning-900/20",
      borderColor: "border-warning-200 dark:border-warning-800",
      textColor: "text-warning-800 dark:text-warning-200",
      iconBg: "bg-warning-100 dark:bg-warning-800",
    },
    info: {
      icon: "ℹ️",
      bgColor: "bg-secondary-50 dark:bg-secondary-900/20",
      borderColor: "border-secondary-200 dark:border-secondary-800",
      textColor: "text-secondary-800 dark:text-secondary-200",
      iconBg: "bg-secondary-100 dark:bg-secondary-800",
    },
  };

  const config = typeConfig[toast.type];

  return (
    <div
      className={cn(
        "max-w-sm w-full bg-white dark:bg-neutral-900 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden",
        "transform transition-all duration-300 ease-in-out",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div className={cn("p-4", config.bgColor)}>
        <div className="flex items-start">
          <div
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              config.iconBg
            )}
          >
            <span className="text-sm">{config.icon}</span>
          </div>
          <div className="ml-3 w-0 flex-1">
            {toast.title && (
              <p className={cn("text-sm font-medium", config.textColor)}>
                {toast.title}
              </p>
            )}
            <p
              className={cn(
                "text-sm",
                config.textColor,
                toast.title ? "mt-1" : ""
              )}
            >
              {toast.message}
            </p>
            {toast.action && (
              <div className="mt-2">
                <button
                  onClick={toast.action.onClick}
                  className={cn(
                    "text-sm font-medium hover:underline",
                    config.textColor
                  )}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleRemove}
              className={cn(
                "inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              )}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastProvider;
