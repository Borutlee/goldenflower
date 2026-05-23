import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileHeader from '../Components/Profile/ProfileHeader';
import ProfileSettings from '../Components/Profile/ProfileSettings';
import ProfileWishlist from '../Components/Profile/ProfileWishlist';
import ProfileOrders from '../Components/Profile/ProfileOrders'; 
import { useWishlist } from '../Context/wishlistContext';

const TABS = ['Wishlist', 'Orders'];

export default function Profile() {
    const [activeTab, setActiveTab] = useState('Wishlist');
    const [showSettings, setShowSettings] = useState(false);
    const [ordersCount, setOrdersCount] = useState(0); 
    const { wishlistItems } = useWishlist();

    return (
        <div className="bg-gray-50 dark:bg-[#121212] min-h-screen transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" toastClassName="!rounded-2xl !font-sans !text-sm" />

            <ProfileSettings open={showSettings} onClose={() => setShowSettings(false)} ordersCount={ordersCount} />

            <div className="max-w-5xl mx-auto">

                <ProfileHeader onOpenSettings={() => setShowSettings(true)} ordersCount={ordersCount} />

                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-200 dark:border-gray-800 mb-8">
                    {TABS.map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-[11px] font-bold tracking-[0.3em] uppercase relative transition-colors
                                ${activeTab === tab ? 'text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            <span className="flex items-center gap-2">
                                {tab === 'Wishlist' ? <FiHeart size={13} /> : <FiShoppingBag size={13} />}
                                {tab}
                                
                                {tab === 'Wishlist' && wishlistItems.length > 0 && (
                                    <span className="bg-[#D4AF37] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {wishlistItems.length}
                                    </span>
                                )}

                                {tab === 'Orders' && ordersCount > 0 && (
                                    <span className="bg-[#D4AF37] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {ordersCount}
                                    </span>
                                )}
                            </span>
                            {activeTab === tab && (
                                <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        {activeTab === 'Wishlist' && <ProfileWishlist />}
                        {activeTab === 'Orders' && <ProfileOrders onOrdersFetched={(count) => setOrdersCount(count)} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}