import React from "react";
import { Link } from "react-router-dom";

interface FooterProps {
  theme: "light" | "dark";
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`${
        theme === "dark"
          ? "bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-800"
          : "bg-white/95 backdrop-blur-sm border-t border-neutral-200"
      } mt-auto`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
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
            <p
              className={`text-sm ${
                theme === "dark" ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              Advanced sustainability monitoring and compliance platform for
              power plants and energy systems.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-neutral-900"
              }`}
            >
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Dashboard", href: "/" },
                { label: "Sustainability", href: "/sustainability" },
                { label: "Regulations", href: "/regulations" },
                { label: "Reports", href: "/reports" },
                { label: "Analytics", href: "/analytics" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={`text-sm transition-colors duration-200 hover:text-primary-600 ${
                      theme === "dark"
                        ? "text-neutral-400 hover:text-primary-400"
                        : "text-neutral-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-neutral-900"
              }`}
            >
              Resources
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Documentation", href: "/docs" },
                { label: "API Reference", href: "/api" },
                { label: "Support", href: "/support" },
                { label: "Community", href: "/community" },
                { label: "Changelog", href: "/changelog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={`text-sm transition-colors duration-200 hover:text-primary-600 ${
                      theme === "dark"
                        ? "text-neutral-400 hover:text-primary-400"
                        : "text-neutral-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-neutral-900"
              }`}
            >
              Contact
            </h3>
            <div className="space-y-2">
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                The Nexus Team
              </p>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Sustainability Intelligence Platform
              </p>
              <div className="flex space-x-4">
                <a
                  href="mailto:contact@nexus-sustainability.com"
                  className={`text-sm transition-colors duration-200 hover:text-primary-600 ${
                    theme === "dark"
                      ? "text-neutral-400 hover:text-primary-400"
                      : "text-neutral-600"
                  }`}
                >
                  📧 Contact
                </a>
                <a
                  href="https://github.com/nexus-sustainability"
                  className={`text-sm transition-colors duration-200 hover:text-primary-600 ${
                    theme === "dark"
                      ? "text-neutral-400 hover:text-primary-400"
                      : "text-neutral-600"
                  }`}
                >
                  🐙 GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={`mt-8 pt-8 border-t ${
            theme === "dark" ? "border-neutral-800" : "border-neutral-200"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p
              className={`text-sm ${
                theme === "dark" ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              © {currentYear} The Nexus Team. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className={`text-sm transition-colors duration-200 hover:text-primary-600 ${
                  theme === "dark"
                    ? "text-neutral-400 hover:text-primary-400"
                    : "text-neutral-600"
                }`}
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className={`text-sm transition-colors duration-200 hover:text-primary-600 ${
                  theme === "dark"
                    ? "text-neutral-400 hover:text-primary-400"
                    : "text-neutral-600"
                }`}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
