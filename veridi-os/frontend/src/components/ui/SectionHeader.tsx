import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  className = "",
}) => {
  return (
    <div className={`section-header ${className}`}>
      <div className="flex items-center justify-center space-x-4 mb-4">
        {icon && (
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">{icon}</span>
          </div>
        )}
        <div>
          <h1 className="section-title">{title}</h1>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
