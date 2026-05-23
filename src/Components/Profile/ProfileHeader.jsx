import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiPhone, FiLogOut, FiSettings, FiLayout } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useWishlist } from '../../Context/wishlistContext';
import { logout } from '../../supabase/authService';

export default function ProfileHeader({ onOpenSettings , ordersCount}) {
    const { user } = useAuth();
    const { wishlistItems } = useWishlist();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/Auth');
    };

    const avatar = user?.user_metadata?.avatar_url;
    const firstName = user?.user_metadata?.first_name || '';
    const lastName = user?.user_metadata?.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Golden Member';
    const userEmail = user?.email || '';
    const userPhone = user?.user_metadata?.phone || '';
    const joinDate = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : '';
    const isAdmin = user?.user_metadata?.role === 'admin';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 mb-8 transition-colors duration-300"
        >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-[#D4AF37]/30 shadow-md bg-gray-100 dark:bg-gray-800">
                        {avatar ? (
                            <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <FiUser size={32} className="text-gray-400 dark:text-gray-500" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 w-full text-center sm:text-left min-w-0">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <h1 className="text-xl sm:text-2xl font-serif italic font-bold text-gray-900 dark:text-white truncate">{fullName}</h1>
                        {isAdmin && (
                            <span className="flex-shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                                Admin
                            </span>
                        )}
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 truncate">{userEmail}</p>
                    {userPhone && (
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-0.5 flex items-center gap-1.5 justify-center sm:justify-start">
                            <FiPhone size={12} /> {userPhone}
                        </p>
                    )}
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold mt-2">Member since {joinDate}</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto justify-center sm:justify-end flex-wrap">
                    {isAdmin && (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/admin')}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#B8860B] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                        >
                            <FiLayout size={13} /> Admin Panel
                        </motion.button>
                    )}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onOpenSettings}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                    >
                        <FiSettings size={13} /> Settings
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border border-red-200 dark:border-red-800 text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                        <FiLogOut size={13} /> Logout
                    </motion.button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{wishlistItems.length}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-bold mt-1">Saved Items</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{ordersCount}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-bold mt-1">Orders</p>
                </div>
            </div>
        </motion.div>
    );
}