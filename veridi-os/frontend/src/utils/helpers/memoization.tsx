import React, { memo, useMemo } from 'react';

// Higher-order component for memoization
export const withMemo = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return memo(Component, areEqual);
};

// Hook for expensive calculations
export const useExpensiveCalculation = <T>(
  calculation: () => T,
  dependencies: React.DependencyList
): T => {
  return useMemo(calculation, dependencies);
};

// Hook for memoized callbacks
export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T => {
  return useMemo(() => callback, dependencies) as T;
};

// Component wrapper for conditional rendering optimization
export const ConditionalRender = memo<{
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}>(({ condition, children, fallback = null }) => {
  return condition ? <>{children}</> : <>{fallback}</>;
});

ConditionalRender.displayName = 'ConditionalRender';
