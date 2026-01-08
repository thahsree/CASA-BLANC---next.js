export default function SingleProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Left side - Images */}
        <div>
          {/* Main image skeleton */}
          <div className="relative w-full h-[500px] max-sm:h-80 max-md:h-[400px] rounded overflow-hidden bg-zinc-700" />

          {/* Thumbnail images skeleton */}
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="relative w-full h-20 max-sm:h-16 rounded overflow-hidden bg-zinc-700 border-2 border-transparent"
              />
            ))}
          </div>
        </div>

        {/* Right side - Product details */}
        <div className="space-y-2">
          {/* Title skeleton */}
          <div className="h-12 bg-zinc-700 rounded w-4/5" />

          {/* Review stars skeleton */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="w-5 h-5 bg-zinc-700 rounded" />
              ))}
            </div>
            <div className="h-4 bg-zinc-700 rounded w-1/3" />
          </div>

          {/* Price skeleton */}
          <div className="flex gap-4 items-center mt-4">
            <div className="h-14 bg-zinc-700 rounded w-1/3" />
            <div className="h-10 bg-zinc-700 rounded w-1/4 line-through" />
          </div>

          {/* Primary CTA - Buy It Now skeleton */}
          <div className="w-full h-12 bg-zinc-700 rounded mt-4 max-sm:hidden" />

          {/* Mobile Buy It Now skeleton with product info */}
          <div className="max-sm:hidden flex items-center gap-3 mt-4 h-16 bg-zinc-700 rounded p-3">
            <div className="w-12 h-12 bg-zinc-600 rounded flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-zinc-600 rounded w-3/4" />
              <div className="h-3 bg-zinc-600 rounded w-1/2" />
            </div>
            <div className="h-4 bg-zinc-600 rounded w-20" />
          </div>

          {/* Secondary CTAs - Quantity and Add to Cart (Desktop) */}
          <div className="hidden max-sm:hidden flex gap-2 mt-4">
            <div className="h-12 bg-zinc-700 rounded w-1/4" />
            <div className="h-12 bg-zinc-700 rounded flex-1" />
          </div>

          {/* Secondary CTAs - Mobile */}
          <div className="max-sm:hidden h-10 bg-zinc-700 rounded w-full mt-4" />

          {/* Trust signal skeleton */}
          <div className="space-y-2 mt-6 pt-4">
            <div className="h-3 bg-zinc-700 rounded w-full" />
            <div className="h-3 bg-zinc-700 rounded w-3/4" />
          </div>
        </div>
      </div>

      {/* Delivery Check / Additional Info skeleton */}
      <div className="mt-8">
        <div className="h-8 bg-zinc-700 rounded w-1/3 mb-4" />
        <div className="h-32 bg-zinc-700 rounded" />
      </div>

      {/* Reviews section skeleton */}
      <div className="mt-12">
        <div className="h-8 bg-zinc-700 rounded w-1/4 mb-6" />
        <div className="space-y-4">
          {[...Array(2)].map((_, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-700 rounded p-4 space-y-3"
            >
              <div className="flex gap-2 items-center">
                <div className="h-5 bg-zinc-700 rounded w-24" />
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-zinc-700 rounded-full" />
                  ))}
                </div>
              </div>
              <div className="h-3 bg-zinc-700 rounded w-full" />
              <div className="h-3 bg-zinc-700 rounded w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
