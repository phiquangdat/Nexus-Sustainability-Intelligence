interface ChartSkeletonProps {
  height?: number;
  type?: 'line' | 'bar';
}

const ChartSkeleton = ({ height = 300, type = 'line' }: ChartSkeletonProps) => {
  const renderLineSkeleton = () => (
    <div className="space-y-3">
      {/* Chart area skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-2 bg-gray-200 rounded animate-pulse"
            style={{ width: `${Math.random() * 40 + 30}%` }}
          />
        ))}
      </div>
      {/* X-axis skeleton */}
      <div className="flex justify-between">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );

  const renderBarSkeleton = () => (
    <div className="space-y-3">
      {/* Chart area skeleton */}
      <div className="flex items-end space-x-2 h-32">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded animate-pulse flex-1"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </div>
      {/* X-axis skeleton */}
      <div className="flex justify-between">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="animate-pulse">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        
        {/* Chart skeleton */}
        <div style={{ height: `${height}px` }}>
          {type === 'line' ? renderLineSkeleton() : renderBarSkeleton()}
        </div>
      </div>
    </div>
  );
};

export default ChartSkeleton;
