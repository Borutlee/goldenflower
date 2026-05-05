import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiSave, FiX, FiShoppingBag, FiHeart, FiUser, FiMail, FiCamera, FiLogOut, FiPhone } from 'react-icons/fi';
import { useWishlist } from '../Context/wishlistContext';
import { useAuth } from '../Context/AuthContext';
import { logout, updateUserProfile, uploadAvatar } from '../supabase/authService';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../Components/ProductCard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TABS = ['Wishlist', 'Orders'];

// ── خارج الـ Profile function تماماً ──

const EditInput = ({ icon: Icon, ...props }) => (
    <div className="relative">
        <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold outline-none focus:border-[#D4AF37] transition-colors"
            {...props}
        />
    </div>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function Profile() {
    const { wishlistItems } = useWishlist();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('Wishlist');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [saveLoading, setSaveLoading] = useState(false);

    const [tempData, setTempData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
    });

    const handleEdit = () => {
        setTempData({
            firstName: user?.user_metadata?.first_name || '',
            lastName: user?.user_metadata?.last_name || '',
            phone: user?.user_metadata?.phone || '',
        });
        setEditing(true);
    };

    const handleSave = async () => {
        setSaveLoading(true);
        try {
            await updateUserProfile(tempData);
            if (avatarFile) {
                await uploadAvatar(avatarFile, user.id);
                setAvatarFile(null);
            }
            toast.success('Profile updated!');
            setEditing(false);
            setAvatarPreview(null);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setAvatarPreview(null);
        setAvatarFile(null);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/Auth');
    };

    const avatar = avatarPreview || user?.user_metadata?.avatar_url;
    const firstName = user?.user_metadata?.first_name || '';
    const lastName = user?.user_metadata?.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Golden Member';
    const userEmail = user?.email || '';
    const userPhone = user?.user_metadata?.phone || '';
    const joinDate = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : '';

    return (
        <div className="bg-gray-50 dark:bg-[#121212] min-h-screen transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                theme="colored"
                toastClassName="!rounded-2xl !font-sans !text-sm"
            />

            <div className="max-w-5xl mx-auto">

                {/* ── Header Card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-8 mb-8 transition-colors duration-300"
                >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#D4AF37]/30 shadow-md bg-gray-100 dark:bg-gray-800">
                                {avatar ? (
                                    <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FiUser size={36} className="text-gray-400 dark:text-gray-500" />
                                    </div>
                                )}
                            </div>
                            {editing && (
                                <label className="absolute bottom-0 right-0 p-1.5 bg-[#D4AF37] rounded-full cursor-pointer shadow-md hover:bg-[#B8860B] transition-colors">
                                    <FiCamera size={12} className="text-white" />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                </label>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 w-full text-center sm:text-left">
                            {editing ? (
                                <div className="flex flex-col gap-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <EditInput
                                            icon={FiUser}
                                            type="text"
                                            placeholder="First name"
                                            value={tempData.firstName}
                                            onChange={e => setTempData({ ...tempData, firstName: e.target.value })}
                                        />
                                        <EditInput
                                            icon={FiUser}
                                            type="text"
                                            placeholder="Last name"
                                            value={tempData.lastName}
                                            onChange={e => setTempData({ ...tempData, lastName: e.target.value })}
                                        />
                                    </div>
                                    <EditInput
                                        icon={FiPhone}
                                        type="tel"
                                        placeholder="Phone number"
                                        value={tempData.phone}
                                        onChange={e => {
                                            const value = e.target.value;
                                            // الكود ده بيمسح أي حرف مش رقم
                                            const onlyNums = value.replace(/[^0-9]/g, '');
                                            setTempData({ ...tempData, phone: onlyNums });
                                        }}                                    />
                                    <div className="relative">
                                        <FiMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            value={userEmail}
                                            disabled
                                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-400 text-sm outline-none cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h1 className="text-2xl font-serif italic font-bold text-gray-900 dark:text-white transition-colors">
                                        {fullName}
                                    </h1>
                                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{userEmail}</p>
                                    {userPhone && (
                                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-0.5 flex items-center gap-1.5 justify-center sm:justify-start">
                                            <FiPhone size={12} /> {userPhone}
                                        </p>
                                    )}
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold mt-2">
                                        Member since {joinDate}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 flex-shrink-0">
                            {editing ? (
                                <>
                                    <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave} disabled={saveLoading}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#B8860B] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                                        <FiSave size={13} /> {saveLoading ? 'Saving...' : 'Save'}
                                    </motion.button>
                                    <motion.button whileTap={{ scale: 0.95 }} onClick={handleCancel}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                        <FiX size={13} /> Cancel
                                    </motion.button>
                                </>
                            ) : (
                                <>
                                    <motion.button whileTap={{ scale: 0.95 }} onClick={handleEdit}
                                        className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all">
                                        <FiEdit2 size={13} /> Edit
                                    </motion.button>
                                    <motion.button whileTap={{ scale: 0.95 }} onClick={handleLogout}
                                        className="flex items-center gap-1.5 px-4 py-2 border border-red-200 dark:border-red-800 text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                                        <FiLogOut size={13} /> Logout
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{wishlistItems.length}</p>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-1">Saved Items</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-1">Orders</p>
                        </div>
                    </div>
                </motion.div>

                {/* ── Tabs ── */}
                <div className="flex gap-8 border-b border-gray-200 dark:border-gray-800 mb-8 transition-colors">
                    {TABS.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
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
                            </span>
                            {activeTab === tab && (
                                <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        {activeTab === 'Wishlist' && (
                            wishlistItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 gap-4">
                                    <FiHeart size={40} className="text-gray-200 dark:text-gray-700" />
                                    <p className="text-gray-400 dark:text-gray-500 font-serif italic text-lg">No saved items yet</p>
                                    <p className="text-gray-300 dark:text-gray-600 text-xs uppercase tracking-widest">Start adding your favorites</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {wishlistItems.map((product, index) => (
                                        <ProductCard key={product._id} product={product} index={index} />
                                    ))}
                                </div>
                            )
                        )}

                        {activeTab === 'Orders' && (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <FiShoppingBag size={40} className="text-gray-200 dark:text-gray-700" />
                                <p className="text-gray-400 dark:text-gray-500 font-serif italic text-lg">No orders yet</p>
                                <p className="text-gray-300 dark:text-gray-600 text-xs uppercase tracking-widest">Your order history will appear here</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}