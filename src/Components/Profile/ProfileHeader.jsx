import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiPhone, FiLogOut, FiSettings, FiLayout, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useWishlist } from '../../Context/wishlistContext';
import { logout } from '../../supabase/authService';

export default function ProfileHeader({ onOpenSettings, ordersCount, isMini = false }) {
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
            /* التعديل الجوهري هنا:
               لو isMini هندي الكومبوننت خلفية سوداء فخمة (#0a0a0a) وبوردر نحيف مع شادو ناعم 
               عشان يقعد جوه الهوم بشكل يليق بـ Golden Flower ويندمج مع الـ Theme
            */
            className={`${
                isMini 
                ? 'bg-[#0a0a0a] border border-zinc-800 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)]' 
                : 'bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 mb-8'
            } rounded-[2.5rem] transition-all duration-300 w-full relative overflow-hidden`}
        >
            {/* لمسة الإضاءة الدائرية الخلفية: تظهر فقط في الهوم لكسر جمود السواد */}
            {isMini && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(212,175,55,0.04)_0%,_transparent_65%)] pointer-events-none" />
            )}

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">

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
                        <h1 className={`text-xl sm:text-2xl font-serif italic font-bold truncate ${isMini ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{fullName}</h1>
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
                <div className="flex gap-3 flex-shrink-0 w-full sm:w-auto justify-center sm:justify-end flex-wrap items-center">
                    {isAdmin && (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/admin')}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#B8860B] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                        >
                            <FiLayout size={13} /> Admin Panel
                        </motion.button>
                    )}

                    {/* زرار الـ View Profile: خليناه هنا ذهبي ممتلئ وفخم جداً ليليق بـ زِر أساسي (CTA) في الهوم */}
                    {isMini && (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ y: -3 }}
                            onClick={() => navigate('/userprofile')}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#D4AF37] hover:bg-[#bfa032] text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-[#D4AF37]/15 cursor-pointer"
                        >
                            <FiEye size={13} /> View Profile
                        </motion.button>
                    )}

                    {/* زرار الـ Settings: يختفي في الهوم */}
                    {!isMini && (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={onOpenSettings}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                        >
                            <FiSettings size={13} /> Settings
                        </motion.button>
                    )}

                    {/* زرار تسجيل الخروج */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 border rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            isMini 
                            ? 'border-zinc-800 text-red-400/80 hover:bg-red-950/20 hover:text-red-400 hover:border-red-900/50' 
                            : 'border-red-200 dark:border-red-800 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                    >
                        <FiLogOut size={13} /> Logout
                    </motion.button>
                </div>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-2 gap-4 mt-10 pt-6 border-t ${isMini ? 'border-zinc-900' : 'border-gray-100 dark:border-gray-800'}`}>
                <div className="text-center border-r border-zinc-900/50 dark:border-zinc-800/50">
                    <p className={`text-3xl font-serif font-bold ${isMini ? 'text-[#D4AF37]' : 'text-gray-900 dark:text-white'}`}>{wishlistItems.length}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-bold mt-1">Saved Items</p>
                </div>
                <div className="text-center">
                    <p className={`text-3xl font-serif font-bold ${isMini ? 'text-[#D4AF37]' : 'text-gray-900 dark:text-white'}`}>{ordersCount}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-bold mt-1">Orders</p>
                </div>
            </div>
        </motion.div>
    );
}