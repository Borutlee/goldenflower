import { FiShoppingBag } from 'react-icons/fi';

export default function ProfileOrders() {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <FiShoppingBag size={40} className="text-gray-200 dark:text-gray-700" />
            <p className="text-gray-400 dark:text-gray-500 font-serif italic text-lg">No orders yet</p>
            <p className="text-gray-300 dark:text-gray-600 text-xs uppercase tracking-widest">Your order history will appear here</p>
        </div>
    );
}