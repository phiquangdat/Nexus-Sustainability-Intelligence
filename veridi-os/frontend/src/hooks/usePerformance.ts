import { useEffect, useRef, useState } from "react";

interface PerformanceMetrics {
  renderTime: number;
  componentMountTime: number;
  memoryUsage?: number;
}

export const usePerformance = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const mountTimeRef = useRef<number>(0);
  const renderStartRef = useRef<number>(0);

  useEffect(() => {
    mountTimeRef.current = performance.now();

    return () => {
      const componentMountTime = performance.now() - mountTimeRef.current;

      // Get memory usage if available
      const memoryUsage = (performance as any).memory?.usedJSHeapSize;

      setMetrics({
        renderTime: renderStartRef.current
          ? performance.now() - renderStartRef.current
          : 0,
        componentMountTime,
        memoryUsage,
      });
    };
  }, []);

  const startRender = () => {
    renderStartRef.current = performance.now();
  };

  const endRender = () => {
    if (renderStartRef.current) {
      const renderTime = performance.now() - renderStartRef.current;
      setMetrics((prev) =>
        prev ? { ...prev, renderTime } : { renderTime, componentMountTime: 0 }
      );
    }
  };

  // Log performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && metrics) {
      console.log(`Performance metrics for ${componentName}:`, metrics);
    }
  }, [metrics, componentName]);

  return {
    metrics,
    startRender,
    endRender,
  };
};
