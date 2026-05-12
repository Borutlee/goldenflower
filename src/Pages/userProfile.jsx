import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSave, FiX, FiShoppingBag, FiHeart, FiUser, FiMail,
    FiCamera, FiLogOut, FiPhone, FiTrash2,
    FiEye, FiEyeOff, FiSettings, FiShield, FiLayout
} from 'react-icons/fi';
import { useWishlist } from '../Context/wishlistContext';
import { useAuth } from '../Context/AuthContext';
import { logout, updateUserProfile, uploadAvatar } from '../supabase/authService';
import { supabase } from '../supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../Components/ProductCard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TABS = ['Wishlist', 'Orders'];
const SETTINGS_TABS = ['General', 'Security'];

const EditInput = ({ icon: Icon, ...props }) => (
    <div className="relative">
        <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#222] text-gray-900 dark:text-white text-sm font-semibold outline-none focus:border-[#D4AF37] transition-colors"
            {...props}
        />
    </div>
);

const PasswordModal = ({ title, description, onConfirm, onClose, loading }) => {
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-4"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative w-full max-w-sm bg-white dark:bg-[#1A1A1A] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/5 p-8 z-10"
            >
                <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                    <FiX size={16} />
                </button>
                <div className="text-center mb-6">
                    <h3 className="text-xl font-serif italic text-gray-900 dark:text-white font-bold">{title}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">{description}</p>
                </div>
                <div className="relative mb-4">
                    <FiEye size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type={show ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && password && onConfirm(password)}
                        className="w-full pl-9 pr-10 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#222] text-gray-900 dark:text-white text-sm outline-none focus:border-[#D4AF37] transition-colors"
                    />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                        Cancel
                    </button>
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onConfirm(password)}
                        disabled={loading || !password}
                        className="flex-1 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Please wait...' : 'Confirm'}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function Profile() {
    const { wishlistItems } = useWishlist();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('Wishlist');

    // ━━ Settings ━━
    const [showSettings, setShowSettings] = useState(false);
    const [settingsTab, setSettingsTab] = useState('General');

    // ━━ General ━━
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [tempData, setTempData] = useState({ firstName: '', lastName: '', phone: '' });

    // ━━ Security ━━
    const [editingEmail, setEditingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [showEmailPassModal, setShowEmailPassModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [securityLoading, setSecurityLoading] = useState(false);

    const openSettings = () => {
        setTempData({
            firstName: user?.user_metadata?.first_name || '',
            lastName: user?.user_metadata?.last_name || '',
            phone: user?.user_metadata?.phone || '',
        });
        setNewEmail(user?.email || '');
        setShowSettings(true);
    };

    const closeSettings = () => {
        setShowSettings(false);
        setEditingEmail(false);
        setAvatarPreview(null);
        setAvatarFile(null);
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
            setAvatarPreview(null);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleChangeEmail = async (password) => {
        setSecurityLoading(true);
        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: user.email, password,
            });
            if (loginError) { toast.error('Incorrect password.'); return; }
            const { error } = await supabase.auth.updateUser({ email: newEmail });
            if (error) throw error;
            toast.success('Confirmation sent! Check your NEW email inbox and click the link.', { autoClose: 6000 });
            setShowEmailPassModal(false);
            setEditingEmail(false);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSecurityLoading(false);
        }
    };

    const handleDeleteAccount = async (password) => {
        setSecurityLoading(true);
        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: user.email, password,
            });
            if (loginError) { toast.error('Incorrect password.'); setSecurityLoading(false); return; }
            const { error } = await supabase.functions.invoke('delete-user');
            if (error) throw error;
            toast.success('Account deleted successfully.');
            setTimeout(() => navigate('/Auth'), 1500);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSecurityLoading(false);
        }
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

    const isAdmin = user?.user_metadata?.role === 'admin';

    return (
        <div className="bg-gray-50 dark:bg-[#121212] min-h-screen transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" toastClassName="!rounded-2xl !font-sans !text-sm" />

            {/* ━━━━ Settings Window ━━━━ */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeSettings}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1A1A1A] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/5 z-10"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 sm:px-8 pt-6 sm:pt-8 pb-0">
                                <h2 className="text-xl font-serif italic text-gray-900 dark:text-white font-bold">Settings</h2>
                                <button onClick={closeSettings} className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                                    <FiX size={16} />
                                </button>
                            </div>

                            {/* Settings Tabs */}
                            <div className="flex px-6 sm:px-8 mt-5 border-b border-gray-100 dark:border-white/5">
                                {SETTINGS_TABS.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setSettingsTab(t)}
                                        className={`flex items-center gap-2 pb-4 pr-6 text-[11px] font-black uppercase tracking-[0.2em] relative transition-colors
                                            ${settingsTab === t ? 'text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                    >
                                        {t === 'General' ? <FiUser size={12} /> : <FiShield size={12} />}
                                        {t}
                                        {settingsTab === t && (
                                            <motion.div layoutId="settingsTab" className="absolute bottom-0 left-0 right-6 h-[2px] bg-[#D4AF37]" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-6 sm:p-8">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={settingsTab}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {/* ── General Tab ── */}
                                        {settingsTab === 'General' && (
                                            <div className="flex flex-col gap-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative flex-shrink-0">
                                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 bg-gray-100 dark:bg-gray-800">
                                                            {avatar ? (
                                                                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <FiUser size={24} className="text-gray-400 dark:text-gray-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <label className="absolute bottom-0 right-0 p-1 bg-[#D4AF37] rounded-full cursor-pointer hover:bg-[#B8860B] transition-colors">
                                                            <FiCamera size={10} className="text-white" />
                                                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{fullName}</p>
                                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{userEmail}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <EditInput icon={FiUser} type="text" placeholder="First name" value={tempData.firstName} onChange={e => setTempData({ ...tempData, firstName: e.target.value })} />
                                                    <EditInput icon={FiUser} type="text" placeholder="Last name" value={tempData.lastName} onChange={e => setTempData({ ...tempData, lastName: e.target.value })} />
                                                </div>
                                                <EditInput icon={FiPhone} type="tel" placeholder="Phone number" value={tempData.phone} onChange={e => setTempData({ ...tempData, phone: e.target.value.replace(/[^0-9]/g, '') })} />
                                                <motion.button
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={handleSave}
                                                    disabled={saveLoading}
                                                    className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                                >
                                                    <FiSave size={13} /> {saveLoading ? 'Saving...' : 'Save Changes'}
                                                </motion.button>
                                            </div>
                                        )}

                                        {/* ── Security Tab ── */}
                                        {settingsTab === 'Security' && (
                                            <div className="flex flex-col gap-4">
                                                <div className="p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#222]">
                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-bold mb-3">Email Address</p>
                                                    {editingEmail ? (
                                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                                            <div className="relative flex-1">
                                                                <FiMail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                                <input
                                                                    type="email"
                                                                    value={newEmail}
                                                                    onChange={e => setNewEmail(e.target.value)}
                                                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white text-sm outline-none focus:border-[#D4AF37] transition-colors"
                                                                />
                                                            </div>
                                                            <div className="flex gap-2 flex-shrink-0">
                                                                <motion.button
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => setShowEmailPassModal(true)}
                                                                    disabled={newEmail === userEmail || !newEmail}
                                                                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#B8860B] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                                >
                                                                    Save
                                                                </motion.button>
                                                                <button
                                                                    onClick={() => { setEditingEmail(false); setNewEmail(userEmail); }}
                                                                    className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                                                >
                                                                    <FiX size={13} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                <FiMail size={13} className="text-gray-400 flex-shrink-0" />
                                                                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">{userEmail}</span>
                                                            </div>
                                                            <motion.button
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => setEditingEmail(true)}
                                                                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex-shrink-0"
                                                            >
                                                                Change
                                                            </motion.button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10">
                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-red-400 font-bold mb-1">Danger Zone</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Once deleted, your account cannot be recovered.</p>
                                                    <motion.button
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => setShowDeleteModal(true)}
                                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider transition-all"
                                                    >
                                                        <FiTrash2 size={13} /> Delete Account
                                                    </motion.button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ━━━━ Password Modals ━━━━ */}
            <AnimatePresence>
                {showEmailPassModal && (
                    <PasswordModal
                        title="Confirm Email Change"
                        description="Enter your password to update your email address."
                        onConfirm={handleChangeEmail}
                        onClose={() => setShowEmailPassModal(false)}
                        loading={securityLoading}
                    />
                )}
                {showDeleteModal && (
                    <PasswordModal
                        title="Delete Account"
                        description={<>This action is <span className="text-red-500 font-bold">permanent</span> and cannot be undone.</>}
                        onConfirm={handleDeleteAccount}
                        onClose={() => setShowDeleteModal(false)}
                        loading={securityLoading}
                    />
                )}
            </AnimatePresence>

            <div className="max-w-5xl mx-auto">

                {/* ── Header Card ── */}
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
                                onClick={openSettings}
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
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-bold mt-1">Orders</p>
                        </div>
                    </div>
                </motion.div>

                {/* ── Tabs ── */}
                <div className="flex gap-8 border-b border-gray-200 dark:border-gray-800 mb-8">
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