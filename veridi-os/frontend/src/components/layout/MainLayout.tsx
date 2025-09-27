import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Breadcrumb from "./Breadcrumb";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useTheme } from "../../hooks/useTheme";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"
          : "bg-gradient-to-br from-neutral-50 via-primary-50/20 to-secondary-50/20"
      } relative overflow-hidden`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
            theme === "dark"
              ? "bg-gradient-to-br from-primary-800/20 to-transparent"
              : "bg-gradient-to-br from-primary-200/30 to-transparent"
          } animate-float`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
            theme === "dark"
              ? "bg-gradient-to-tr from-secondary-800/20 to-transparent"
              : "bg-gradient-to-tr from-secondary-200/30 to-transparent"
          } animate-float animation-delay-2000`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl ${
            theme === "dark"
              ? "bg-gradient-to-r from-accent-800/10 to-transparent"
              : "bg-gradient-to-r from-accent-200/20 to-transparent"
          } animate-float animation-delay-1500`}
        ></div>

        {/* Additional floating elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-primary-300/10 to-secondary-300/10 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-accent-300/10 to-primary-300/10 rounded-full blur-2xl animate-pulse-slow animation-delay-1000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          theme={theme}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            isScrolled={isScrolled}
            theme={theme}
            onThemeToggle={toggleTheme}
          />

          {/* Navigation */}
          <Navbar theme={theme} />

          {/* Breadcrumb */}
          <Breadcrumb theme={theme} />

          {/* Main content */}
          <main className="flex-1 relative">{children || <Outlet />}</main>

          {/* Footer */}
          <Footer theme={theme} />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
