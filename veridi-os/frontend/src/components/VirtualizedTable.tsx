import { useState, useEffect, useMemo } from 'react';
import type { PowerPlantData } from '../types';

interface VirtualizedTableProps {
  data: PowerPlantData[];
  height?: number;
  itemHeight?: number;
}

const VirtualizedTable = ({ data, height = 400, itemHeight = 50 }: VirtualizedTableProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(height);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      data.length
    );

    return data.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [data, scrollTop, itemHeight, containerHeight]);

  const totalHeight = data.length * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [height]);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Power Plant Data ({data.length} records)</h3>
      </div>
      
      <div
        className="overflow-auto"
        style={{ height: `${containerHeight}px` }}
        onScroll={handleScroll}
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${Math.floor(scrollTop / itemHeight) * itemHeight}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0
            }}
          >
            {visibleItems.map((item) => (
              <div
                key={item.index}
                className="flex items-center p-3 border-b hover:bg-gray-50"
                style={{ height: `${itemHeight}px` }}
              >
                <div className="flex-1 grid grid-cols-6 gap-4 text-sm">
                  <div className="font-medium">{item.plant_id}</div>
                  <div>{new Date(item.timestamp).toLocaleString()}</div>
                  <div>{item.fuel_type}</div>
                  <div className="text-right">{item.fuel_consumed_liters.toFixed(1)}L</div>
                  <div className="text-right">{item.energy_output_mwh.toFixed(1)}MWh</div>
                  <div className="text-right text-red-600">{item.co2_emissions_tonnes.toFixed(1)}t</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 text-sm text-gray-600">
        Showing {visibleItems.length} of {data.length} records
      </div>
    </div>
  );
};

export default VirtualizedTable;
