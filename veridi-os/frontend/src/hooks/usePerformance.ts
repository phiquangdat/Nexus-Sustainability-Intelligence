import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

export const usePerformance = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    
    // Measure component load time
    const measureLoadTime = () => {
      const loadTime = performance.now() - startTime;
      
      // Get memory usage if available
      const memoryUsage = (performance as any).memory?.usedJSHeapSize;
      
      setMetrics({
        loadTime,
        renderTime: loadTime,
        memoryUsage: memoryUsage ? Math.round(memoryUsage / 1024 / 1024) : undefined
      });
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(measureLoadTime);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [componentName]);

  return metrics;
};

export const usePerformanceObserver = () => {
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      setPerformanceData(prev => [...prev, ...entries]);
    });

    try {
      observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
    } catch (error) {
      console.warn('PerformanceObserver not supported:', error);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return performanceData;
};
