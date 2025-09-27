import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  children?: NavItem[];
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const navigationItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/',
      icon: '📊'
    },
    {
      id: 'sustainability',
      label: 'Sustainability Intelligence',
      href: '/sustainability',
      icon: '🌱',
      children: [
        { id: 'sustainability-dashboard', label: 'Dashboard', href: '/sustainability', icon: '📊' },
        { id: 'scatter-analysis', label: 'Renewables vs CO₂', href: '/sustainability/scatter', icon: '📈' },
        { id: 'netzero-trajectory', label: 'Net-Zero Trajectory', href: '/sustainability/netzero', icon: '🎯' },
        { id: 'goal-tracker', label: 'Goal Tracker', href: '/sustainability/goal-tracker', icon: '📋' }
      ]
    },
    {
      id: 'regulations',
      label: 'Regulations',
      href: '/regulations',
      icon: '📋',
      children: [
        { id: 'eu-ets', label: 'EU ETS', href: '/regulations/eu-ets', icon: '🇪🇺' },
        { id: 'carbon-tax', label: 'Carbon Tax', href: '/regulations/carbon-tax', icon: '💰' },
        { id: 'renewable-targets', label: 'Renewable Targets', href: '/regulations/renewable-targets', icon: '🌱' },
        { id: 'emissions-standards', label: 'Emissions Standards', href: '/regulations/emissions-standards', icon: '🌍' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      href: '/reports',
      icon: '📄',
      children: [
        { id: 'compliance', label: 'Compliance Reports', href: '/reports/compliance', icon: '✅' },
        { id: 'sustainability', label: 'Sustainability Reports', href: '/reports/sustainability', icon: '🌿' },
        { id: 'carbon-footprint', label: 'Carbon Footprint', href: '/reports/carbon-footprint', icon: '👣' },
        { id: 'energy-efficiency', label: 'Energy Efficiency', href: '/reports/energy-efficiency', icon: '⚡' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/analytics',
      icon: '📈',
      children: [
        { id: 'trends', label: 'Emission Trends', href: '/analytics/trends', icon: '📊' },
        { id: 'forecasting', label: 'Forecasting', href: '/analytics/forecasting', icon: '🔮' },
        { id: 'benchmarking', label: 'Benchmarking', href: '/analytics/benchmarking', icon: '📏' },
        { id: 'alerts', label: 'Alerts & Notifications', href: '/analytics/alerts', icon: '🔔' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/settings',
      icon: '⚙️'
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleDropdownToggle = (itemId: string) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.navbar-dropdown')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3" onClick={handleLinkClick}>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Veridi OS</span>
                <p className="text-xs text-gray-500 -mt-1">Sustainability Intelligence</p>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.id} className="relative navbar-dropdown">
                {item.children ? (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(item.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        isActive(item.href) || activeDropdown === item.id
                          ? 'text-white bg-gradient-to-r from-green-500 to-blue-600 shadow-lg transform scale-105'
                          : 'text-gray-700 hover:text-green-600 hover:bg-gray-100 hover:shadow-md'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          activeDropdown === item.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown menu */}
                    {activeDropdown === item.id && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 z-50 overflow-hidden">
                        <div className="py-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              to={child.href}
                              onClick={handleLinkClick}
                              className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-all duration-300 ${
                                isActive(child.href)
                                  ? 'text-white bg-gradient-to-r from-green-500 to-blue-600 shadow-lg'
                                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                              }`}
                            >
                              <span className="text-lg">{child.icon}</span>
                              <span>{child.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive(item.href)
                        ? 'text-white bg-gradient-to-r from-green-500 to-blue-600 shadow-lg transform scale-105'
                        : 'text-gray-700 hover:text-green-600 hover:bg-gray-100 hover:shadow-md'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigationItems.map((item) => (
                <div key={item.id}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => handleDropdownToggle(item.id)}
                        className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                          isActive(item.href) || activeDropdown === item.id
                            ? 'text-green-600 bg-green-50'
                            : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                        <svg
                          className={`w-4 h-4 ml-auto transition-transform ${
                            activeDropdown === item.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {activeDropdown === item.id && (
                        <div className="pl-6 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              to={child.href}
                              onClick={handleLinkClick}
                              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                                isActive(child.href)
                                  ? 'text-green-600 bg-green-50'
                                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                              }`}
                            >
                              <span>{child.icon}</span>
                              <span>{child.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={handleLinkClick}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-green-600 bg-green-50'
                          : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
