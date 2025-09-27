import React, { Suspense } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper = ({
  children,
  fallback = <LoadingSpinner size="lg" text="Loading component..." />,
}: LazyComponentProps) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export const withLazyLoading = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = (props: P) => (
    <LazyWrapper fallback={fallback}>
      <Component {...props} />
    </LazyWrapper>
  );

  LazyComponent.displayName = `withLazyLoading(${
    Component.displayName || Component.name
  })`;

  return LazyComponent;
};

export default LazyWrapper;
