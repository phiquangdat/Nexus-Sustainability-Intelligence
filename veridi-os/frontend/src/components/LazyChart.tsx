import { Suspense, lazy, useState, useEffect } from 'react';
import ChartSkeleton from './ChartSkeleton';
import type { ChartData, EnergyData } from '../types';

// Lazy load the chart components
const LineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })));
const BarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })));
const XAxis = lazy(() => import('recharts').then(module => ({ default: module.XAxis })));
const YAxis = lazy(() => import('recharts').then(module => ({ default: module.YAxis })));
const Tooltip = lazy(() => import('recharts').then(module => ({ default: module.Tooltip })));
const Legend = lazy(() => import('recharts').then(module => ({ default: module.Legend })));
const Line = lazy(() => import('recharts').then(module => ({ default: module.Line })));
const Bar = lazy(() => import('recharts').then(module => ({ default: module.Bar })));

interface LazyChartProps {
  data: ChartData[] | EnergyData[];
  type: 'line' | 'bar';
  title: string;
  height?: number;
}

const LazyChart = ({ data, type, title, height = 300 }: LazyChartProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Intersection Observer to load chart when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`chart-${type}-${title.replace(/\s+/g, '-').toLowerCase()}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [type, title]);

  if (!isVisible) {
    return <ChartSkeleton height={height} type={type} />;
  }

  return (
    <div
      id={`chart-${type}-${title.replace(/\s+/g, "-").toLowerCase()}`}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <Suspense fallback={<ChartSkeleton height={height} type={type} />}>
        <div style={{ height: `${height}px` }}>
          {type === "line" ? (
            <LineChart data={data as ChartData[]} width={800} height={height}>
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="emissions"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          ) : (
            <BarChart data={data as EnergyData[]} width={800} height={height}>
              <XAxis dataKey="plant" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="energy" fill="#10b981" />
            </BarChart>
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default LazyChart;
