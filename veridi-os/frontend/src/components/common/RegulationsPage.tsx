import { useState } from 'react';

interface Regulation {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'upcoming' | 'expired';
  effectiveDate: string;
  complianceLevel: 'high' | 'medium' | 'low';
  requirements: string[];
  penalties: string[];
  icon: string;
  color: string;
}

const RegulationsPage = () => {
  const [selectedRegulation, setSelectedRegulation] = useState<string | null>(null);

  const regulations: Regulation[] = [
    {
      id: 'eu-ets',
      name: 'EU Emissions Trading System (EU ETS)',
      description: 'The EU ETS is a cornerstone of the European Union\'s policy to combat climate change and a key tool for reducing greenhouse gas emissions cost-effectively.',
      status: 'active',
      effectiveDate: '2005-01-01',
      complianceLevel: 'high',
      requirements: [
        'Monitor and report CO2 emissions',
        'Surrender allowances for emissions',
        'Comply with annual reporting deadlines',
        'Maintain emission monitoring plans'
      ],
      penalties: [
        '€100 per tonne of CO2 for non-compliance',
        'Additional penalties for late reporting',
        'Suspension from trading system'
      ],
      icon: '🇪🇺',
      color: 'blue'
    },
    {
      id: 'carbon-tax',
      name: 'Carbon Tax Regulations',
      description: 'National carbon tax policies that impose a direct tax on the carbon content of fossil fuels to encourage emission reductions.',
      status: 'active',
      effectiveDate: '2021-01-01',
      complianceLevel: 'high',
      requirements: [
        'Pay carbon tax on fuel consumption',
        'Report fuel usage quarterly',
        'Maintain detailed fuel consumption records',
        'Submit annual carbon tax returns'
      ],
      penalties: [
        'Interest on overdue payments',
        'Penalties for late filing',
        'Audit requirements for non-compliance'
      ],
      icon: '💰',
      color: 'green'
    },
    {
      id: 'renewable-targets',
      name: 'Renewable Energy Targets',
      description: 'Mandatory targets for renewable energy generation and consumption to promote clean energy transition.',
      status: 'active',
      effectiveDate: '2020-01-01',
      complianceLevel: 'medium',
      requirements: [
        'Achieve renewable energy targets',
        'Report renewable energy generation',
        'Submit annual progress reports',
        'Maintain renewable energy certificates'
      ],
      penalties: [
        'Financial penalties for non-compliance',
        'Reduced subsidies and incentives',
        'Public disclosure of non-compliance'
      ],
      icon: '🌱',
      color: 'green'
    },
    {
      id: 'emissions-standards',
      name: 'Industrial Emissions Standards',
      description: 'Strict limits on air pollutants and greenhouse gas emissions from industrial facilities.',
      status: 'active',
      effectiveDate: '2019-01-01',
      complianceLevel: 'high',
      requirements: [
        'Meet emission limit values',
        'Install best available techniques',
        'Monitor emissions continuously',
        'Submit regular compliance reports'
      ],
      penalties: [
        'Shutdown orders for non-compliance',
        'Criminal prosecution for violations',
        'Significant financial penalties'
      ],
      icon: '🌍',
      color: 'red'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRegulationColor = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-200 bg-blue-50';
      case 'green': return 'border-green-200 bg-green-50';
      case 'red': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Regulations & Compliance</h1>
          <p className="text-lg text-gray-600">
            Monitor and ensure compliance with environmental regulations and sustainability standards.
          </p>
        </div>

        {/* Regulations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {regulations.map((regulation) => (
            <div
              key={regulation.id}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedRegulation === regulation.id
                  ? 'ring-2 ring-green-500 shadow-lg'
                  : 'hover:shadow-md'
              } ${getRegulationColor(regulation.color)}`}
              onClick={() => setSelectedRegulation(
                selectedRegulation === regulation.id ? null : regulation.id
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{regulation.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {regulation.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Effective: {new Date(regulation.effectiveDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">
                {regulation.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(regulation.status)}`}>
                  {regulation.status.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor(regulation.complianceLevel)}`}>
                  {regulation.complianceLevel.toUpperCase()} PRIORITY
                </span>
              </div>

              {selectedRegulation === regulation.id && (
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {regulation.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Penalties:</h4>
                    <ul className="space-y-1">
                      {regulation.penalties.map((penalty, index) => (
                        <li key={index} className="text-sm text-red-700 flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          {penalty}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Compliance Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Compliance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-sm text-gray-600">Active Regulations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-gray-600">Compliance Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <div className="text-sm text-gray-600">Upcoming Deadlines</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">0</div>
              <div className="text-sm text-gray-600">Violations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulationsPage;
