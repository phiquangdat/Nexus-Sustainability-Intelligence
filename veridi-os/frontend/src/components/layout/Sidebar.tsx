import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  children?: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, theme }) => {
  const location = useLocation();

  const navigationItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/",
      icon: "📊",
    },
    {
      id: "sustainability",
      label: "Sustainability Intelligence",
      href: "/sustainability",
      icon: "🌱",
      children: [
        {
          id: "sustainability-dashboard",
          label: "Dashboard",
          href: "/sustainability",
          icon: "📊",
        },
        {
          id: "scatter-analysis",
          label: "Renewables vs CO₂",
          href: "/sustainability/scatter",
          icon: "📈",
        },
        {
          id: "netzero-trajectory",
          label: "Net-Zero Trajectory",
          href: "/sustainability/netzero",
          icon: "🎯",
        },
        {
          id: "goal-tracker",
          label: "Goal Tracker",
          href: "/sustainability/goal-tracker",
          icon: "📋",
        },
      ],
    },
    {
      id: "regulations",
      label: "Regulations",
      href: "/regulations",
      icon: "📋",
      children: [
        {
          id: "eu-ets",
          label: "EU ETS",
          href: "/regulations/eu-ets",
          icon: "🇪🇺",
        },
        {
          id: "carbon-tax",
          label: "Carbon Tax",
          href: "/regulations/carbon-tax",
          icon: "💰",
        },
        {
          id: "renewable-targets",
          label: "Renewable Targets",
          href: "/regulations/renewable-targets",
          icon: "🌱",
        },
        {
          id: "emissions-standards",
          label: "Emissions Standards",
          href: "/regulations/emissions-standards",
          icon: "🌍",
        },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      href: "/reports",
      icon: "📄",
      children: [
        {
          id: "compliance",
          label: "Compliance Reports",
          href: "/reports/compliance",
          icon: "✅",
        },
        {
          id: "sustainability",
          label: "Sustainability Reports",
          href: "/reports/sustainability",
          icon: "🌿",
        },
        {
          id: "carbon-footprint",
          label: "Carbon Footprint",
          href: "/reports/carbon-footprint",
          icon: "👣",
        },
        {
          id: "energy-efficiency",
          label: "Energy Efficiency",
          href: "/reports/energy-efficiency",
          icon: "⚡",
        },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      href: "/analytics",
      icon: "📈",
      children: [
        {
          id: "trends",
          label: "Emission Trends",
          href: "/analytics/trends",
          icon: "📊",
        },
        {
          id: "forecasting",
          label: "Forecasting",
          href: "/analytics/forecasting",
          icon: "🔮",
        },
        {
          id: "benchmarking",
          label: "Benchmarking",
          href: "/analytics/benchmarking",
          icon: "📏",
        },
        {
          id: "alerts",
          label: "Alerts & Notifications",
          href: "/analytics/alerts",
          icon: "🔔",
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      href: "/settings",
      icon: "⚙️",
    },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isItemActive = isActive(item.href);

    return (
      <div key={item.id} className="space-y-1">
        <Link
          to={item.href}
          onClick={onClose}
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105 ${
            isItemActive
              ? "text-white bg-gradient-to-r from-primary-500 to-secondary-600 shadow-lg"
              : `text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 ${
                  theme === "dark"
                    ? "dark:text-neutral-300 dark:hover:bg-neutral-800"
                    : ""
                }`
          } ${level > 0 ? "ml-6 text-sm" : ""}`}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </Link>

        {hasChildren && (
          <div className="space-y-1">
            {item.children!.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex md:flex-col md:w-80 md:fixed md:inset-y-0 md:z-50 ${
          theme === "dark"
            ? "bg-neutral-900/95 backdrop-blur-sm border-r border-neutral-800"
            : "bg-white/95 backdrop-blur-sm border-r border-neutral-200"
        } transition-all duration-300`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <span className="text-xl font-bold gradient-text">
                  Veridi OS
                </span>
                <p className="text-xs text-neutral-500">
                  Sustainability Intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin">
            {navigationItems.map((item) => renderNavItem(item))}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="text-xs text-neutral-500 text-center">
              © 2024 The Nexus Team
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-80 ${
          theme === "dark"
            ? "bg-neutral-900 backdrop-blur-sm border-r border-neutral-800"
            : "bg-white backdrop-blur-sm border-r border-neutral-200"
        } transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg animate-glow-pulse">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <span className="text-xl font-bold gradient-text">
                  Veridi OS
                </span>
                <p className="text-xs text-neutral-500">
                  Sustainability Intelligence
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin">
            {navigationItems.map((item) => renderNavItem(item))}
          </nav>

          {/* Mobile sidebar footer */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="text-xs text-neutral-500 text-center">
              © 2024 The Nexus Team
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
