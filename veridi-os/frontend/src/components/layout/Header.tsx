import React from "react";
import NotificationCenter from "../common/NotificationCenter";
import { Button } from "../ui";

interface HeaderProps {
  onMenuClick?: () => void;
  isScrolled?: boolean;
  theme?: "light" | "dark";
  onThemeToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  isScrolled = false,
  theme = "light",
  onThemeToggle,
}) => {
  return (
    <header
      className={`${
        isScrolled
          ? "backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 shadow-lg"
          : "bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600"
      } text-white shadow-2xl relative overflow-hidden transition-all duration-300`}
      style={{
        background: isScrolled
          ? undefined
          : "linear-gradient(135deg, #16a34a 0%, #2563eb 50%, #9333ea 100%)",
        backgroundSize: "200% 200%",
        animation: isScrolled
          ? "none"
          : "gradientShift 8s ease-in-out infinite",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-transparent to-accent-600/20"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white/30 rounded-full animate-float"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-white/40 rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-10 left-1/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-white/35 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-white/20 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-white/15 rounded-full animate-pulse-slow animation-delay-1500"></div>
        <div className="absolute top-2/3 left-2/3 w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce-gentle animation-delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
              aria-label="Open navigation menu"
              title="Open navigation menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="space-y-2 fade-in">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105 animate-rotate-slow">
                  <span className="text-white text-2xl font-bold">N</span>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
                    The Nexus Team
                  </h1>
                  <p className="text-primary-100 text-base lg:text-lg font-medium">
                    Sustainability Intelligence Platform
                  </p>
                  <p className="text-sm text-primary-200">
                    Advanced Power Plant Monitoring & EU ETS Compliance
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 slide-up">
            {/* Theme toggle */}
            <Button
              onClick={onThemeToggle}
              variant="ghost"
              size="sm"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </Button>

            {/* Notifications */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105">
              <NotificationCenter />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24 animate-pulse-slow animation-delay-2000"></div>
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/3 rounded-full animate-float animation-delay-1500"></div>
    </header>
  );
};

export default Header;
