import React, { memo, useMemo, useCallback } from 'react';

// Higher-order component for memoization
export const withMemo = <P extends Record<string, unknown>>(
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
export const useMemoizedCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T, 
  dependencies: React.DependencyList
): T => {
  return useCallback(callback, dependencies);
};

// Component wrapper for conditional rendering optimization
interface ConditionalRenderProps {
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ConditionalRender = memo(({ condition, children, fallback = null }: ConditionalRenderProps) => {
  return condition ? <>{children}</> : <>{fallback}</>;
});

ConditionalRender.displayName = 'ConditionalRender';
