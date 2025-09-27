import React, { memo, useMemo, useCallback } from 'react';

// Higher-order component for memoization
export const withMemo = (Component: React.ComponentType<any>, areEqual?: (prevProps: any, nextProps: any) => boolean) => {
  return memo(Component, areEqual);
};

// Hook for expensive calculations
export const useExpensiveCalculation = (calculation: () => any, dependencies: React.DependencyList) => {
  return useMemo(calculation, dependencies);
};

// Hook for memoized callbacks
export const useMemoizedCallback = (callback: (...args: any[]) => any, dependencies: React.DependencyList) => {
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