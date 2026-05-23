import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../../Context/wishlistContext';
import ProductCard from '../ProductCard';

export default function ProfileWishlist() {
    const { wishlistItems } = useWishlist();

    if (wishlistItems.length === 0) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <FiHeart size={40} className="text-gray-200 dark:text-gray-700" />
            <p className="text-gray-400 dark:text-gray-500 font-serif italic text-lg">No saved items yet</p>
            <p className="text-gray-300 dark:text-gray-600 text-xs uppercase tracking-widest">Start adding your favorites</p>
        </div>
    );

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {wishlistItems.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
            ))}
        </div>
    );
}