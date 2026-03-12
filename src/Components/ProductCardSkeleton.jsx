const ProductCardSkeleton = () => {
    return (
        <div className="w-full">
            <div className="bg-white border border-gray-300 p-5 rounded-[2rem]">

                {/* Image Skeleton — نفس h-72 و rounded-[2rem] */}
                <div className="relative h-72 rounded-[2rem] overflow-hidden bg-gray-200 animate-pulse mb-6">
                    {/* Rating Badge Skeleton */}
                    <div className="absolute top-4 right-4 h-6 w-14 rounded-full bg-gray-300" />
                </div>

                {/* Info Section */}
                <div className="text-center px-2">

                    {/* Category — نفس حجم النص الصغير */}
                    <div className="h-2.5 w-24 rounded-full bg-gray-200 animate-pulse mx-auto mb-3" />

                    {/* Name */}
                    <div className="h-5 w-40 rounded-full bg-gray-200 animate-pulse mx-auto mb-3" />

                    {/* Notes — نفس الأيقونتين */}
                    <div className="flex justify-center gap-4 mb-4">
                        <div className="h-3 w-16 rounded-full bg-gray-200 animate-pulse" />
                        <div className="h-3 w-16 rounded-full bg-gray-200 animate-pulse" />
                    </div>

                    {/* Price */}
                    <div className="h-5 w-16 rounded-full bg-gray-200 animate-pulse mx-auto mb-5" />

                    {/* Button — نفس w-full */}
                    <div className="h-11 w-full rounded-lg bg-gray-200 animate-pulse mt-4" />
                </div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;