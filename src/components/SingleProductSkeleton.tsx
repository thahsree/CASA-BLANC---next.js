export default function SingleProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left side - Images */}
        <div>
          {/* Main image skeleton */}
          <div className="relative w-full h-96 rounded overflow-hidden bg-gray-300" />

          {/* Thumbnail images skeleton */}
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="relative w-full h-24 rounded overflow-hidden bg-gray-300 border-2 border-transparent"
              />
            ))}
          </div>
        </div>

        {/* Right side - Product details */}
        <div className="space-y-4">
          {/* Title skeleton */}
          <div className="h-8 bg-gray-300 rounded w-3/4" />

          {/* Price skeleton */}
          <div className="flex gap-2 items-center">
            <div className="h-6 bg-gray-300 rounded w-1/4" />
            <div className="h-6 bg-gray-300 rounded w-1/5 line-through" />
          </div>

          {/* Add to Cart button skeleton */}
          <div className="w-full h-12 bg-gray-300 rounded" />

          {/* Secondary CTAs skeleton */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-gray-300 rounded" />
            <div className="h-10 bg-gray-300 rounded" />
          </div>

          {/* Share button skeleton */}
          <div className="w-full h-10 bg-gray-300 rounded" />

          {/* Description skeleton */}
          <div className="space-y-2 pt-4">
            <div className="h-3 bg-gray-300 rounded" />
            <div className="h-3 bg-gray-300 rounded" />
            <div className="h-3 bg-gray-300 rounded w-5/6" />
            <div className="h-3 bg-gray-300 rounded w-4/6" />
          </div>
        </div>
      </div>

      {/* Reviews section skeleton */}
      <div className="mt-12">
        <div className="h-6 bg-gray-300 rounded w-1/4 mb-4" />
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="border rounded p-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/3" />
              <div className="h-3 bg-gray-300 rounded" />
              <div className="h-3 bg-gray-300 rounded w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
