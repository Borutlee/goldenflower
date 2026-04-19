const ProductCardSkeleton = () => {
    return (
        <div className="w-full">
            <div className="bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 p-5 rounded-[2rem] transition-colors duration-300">
                {/* Image Skeleton */}
                <div className="relative h-72 rounded-[2rem] overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse mb-6">
                    {/* Rating Badge Skeleton */}
                    <div className="absolute top-4 right-4 h-6 w-14 rounded-full bg-gray-300 dark:bg-gray-600" />
                </div>
                {/* Info Section */}
                <div className="text-center px-2">
                    {/* Category */}
                    <div className="h-2.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mx-auto mb-3" />
                    {/* Name */}
                    <div className="h-5 w-40 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mx-auto mb-3" />
                    {/* Notes */}
                    <div className="flex justify-center gap-4 mb-4">
                        <div className="h-3 w-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="h-3 w-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                    {/* Price */}
                    <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mx-auto mb-5" />
                    {/* Button */}
                    <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse mt-4" />
                </div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;