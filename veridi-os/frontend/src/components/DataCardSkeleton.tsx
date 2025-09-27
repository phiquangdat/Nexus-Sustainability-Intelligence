const DataCardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="animate-pulse">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
        
        {/* Data summary skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2" />
              <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataCardSkeleton;
