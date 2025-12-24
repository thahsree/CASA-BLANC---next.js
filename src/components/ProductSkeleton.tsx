export default function ProductSkeleton() {
  return (
    <div className="grid grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 gap-6 max-sm:gap-1 max-md:gap-4">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="w-full h-40 bg-gray-300" />

          {/* Content skeleton */}
          <div className="p-4 space-y-4">
            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-300 rounded w-3/4" />
            </div>

            {/* Description skeleton */}
            <div className="space-y-2 max-sm:space-y-1">
              <div className="h-2 bg-gray-300 rounded" />
              <div className="h-2 bg-gray-300 rounded w-5/6" />
            </div>

            {/* Price and button skeleton */}
            <div className="flex items-center justify-between pt-2">
              <div className="h-5 max-sm:h-2 bg-gray-300 rounded w-1/4" />
              <div className="h-9 max-sm:h-4 bg-gray-300 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
