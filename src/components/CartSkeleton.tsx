export default function CartSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Cart items skeleton */}
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 bg-zinc-900 p-4 rounded shadow"
        >
          {/* Image skeleton */}
          <div className="w-20 h-20 bg-gray-400 rounded" />

          {/* Details skeleton */}
          <div className="flex-1 space-y-2">
            {/* Title skeleton */}
            <div className="h-5 bg-gray-400 rounded w-1/3" />

            {/* Price skeleton */}
            <div className="h-4 bg-gray-400 rounded w-1/4 mb-2" />

            {/* Quantity controls skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-400 rounded" />
              <div className="h-8 w-12 bg-gray-400 rounded" />
              <div className="h-8 w-8 bg-gray-400 rounded" />
              <div className="h-8 w-20 bg-gray-400 rounded ml-4" />
            </div>
          </div>

          {/* Total price skeleton */}
          <div className="text-right space-y-1">
            <div className="h-5 bg-gray-400 rounded w-20" />
          </div>
        </div>
      ))}

      {/* Summary skeleton */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
        <div className="h-6 bg-gray-400 rounded w-1/4" />
        <div className="h-7 bg-gray-400 rounded w-1/4" />
      </div>

      {/* Checkout button skeleton */}
      <div className="h-10 bg-gray-400 rounded" />
    </div>
  );
}
