import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiArrowLeft, FiMail, FiPhone, FiCalendar, FiShoppingBag, FiTrash2, FiSlash } from 'react-icons/fi';
import { IoFlowerOutline } from 'react-icons/io5';

const StatusBadge = ({ status }) => {
    const styles = {
        Pending:    'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
        Processing: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        Shipped:    'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
        Delivered:  'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
        Cancelled:  'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-200 dark:border-red-800',
    };
    return (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.Pending}`}>
            {status}
        </span>
    );
};

export default function AdminUserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.functions.invoke('get-users');
                if (error) throw error;
                const foundUser = data?.users?.find(u => u.id === id);
                setUser(foundUser || null);

                const { data: ordersData } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', id)
                    .order('created_at', { ascending: false });
                setOrders(ordersData || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this account permanently?')) return;
        toast.error('Delete Edge Function not set up yet.');
    };

    const handleBan = async () => {
        if (!confirm('Ban this user?')) return;
        toast.error('Ban Edge Function not set up yet.');
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0e0e0e] flex items-center justify-center">
            <p className="text-gray-400">Loading...</p>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0e0e0e] flex items-center justify-center">
            <p className="text-red-400">User not found.</p>
        </div>
    );

    const fullName = `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || 'No Name';
    const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const joinDate = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const isBanned = user.banned_until && new Date(user.banned_until) > new Date();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0e0e0e] transition-colors duration-300">
            <ToastContainer position="top-right" autoClose={3000} theme="colored" toastClassName="!rounded-2xl !font-sans !text-sm" />

            {/* ── Header ── */}
            <div className="bg-white dark:bg-[#141414] border-b border-gray-100 dark:border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <IoFlowerOutline className="text-2xl text-[#D4AF37]" />
                    <div>
                        <span className="text-sm font-black tracking-tighter text-gray-900 dark:text-white">
                            <span className="text-[#D4AF37]">GOLDEN</span> FLOWER
                        </span>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">User Profile</p>
                    </div>
                </div>
                <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#D4AF37] transition-colors">
                    <FiArrowLeft size={14} /> Back to Admin
                </button>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

                {/* ── User Card ── */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 p-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                            {user.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} className="w-full h-full rounded-2xl object-cover" />
                            ) : (
                                <span className="text-xl font-black text-[#D4AF37]">{initials}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-base font-black text-gray-900 dark:text-white">{fullName}</h1>
                                {user.user_metadata?.role === 'admin' && (
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">Admin</span>
                                )}
                                {isBanned && (
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-500">Banned</span>
                                )}
                            </div>
                            <div className="mt-2 space-y-1">
                                <p className="flex items-center gap-2 text-xs text-gray-400"><FiMail size={11} /> {user.email}</p>
                                {user.user_metadata?.phone && (
                                    <p className="flex items-center gap-2 text-xs text-gray-400"><FiPhone size={11} /> {user.user_metadata.phone}</p>
                                )}
                                <p className="flex items-center gap-2 text-xs text-gray-400"><FiCalendar size={11} /> Joined {joinDate}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-white/5">
                        <motion.button whileTap={{ scale: 0.97 }} onClick={handleBan}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border
                                ${isBanned
                                    ? 'border-green-200 dark:border-green-800 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                                    : 'border-orange-200 dark:border-orange-800 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                }`}>
                            <FiSlash size={13} /> {isBanned ? 'Unban User' : 'Ban User'}
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.97 }} onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-400 text-xs font-bold uppercase tracking-wider hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                            <FiTrash2 size={13} /> Delete Account
                        </motion.button>
                    </div>
                </motion.div>

                {/* ── Orders ── */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 p-6">
                    <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FiShoppingBag size={14} className="text-[#D4AF37]" />
                        Orders <span className="text-gray-400 font-normal">({orders.length})</span>
                    </h2>
                    {orders.length === 0 ? (
                        <p className="text-center py-8 text-gray-400 font-serif italic text-sm">No orders yet</p>
                    ) : (
                        <div className="space-y-3">
                            {orders.map(order => (
                                <div key={order.id} className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1a1a1a]">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white">${order.total}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {(order.items || []).map((item, i) => (
                                            <span key={i} className="text-[10px] bg-white dark:bg-[#222] border border-gray-100 dark:border-white/5 px-2 py-1 rounded-lg text-gray-500 dark:text-gray-400">
                                                {item.title || item.name} x{item.quantity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}