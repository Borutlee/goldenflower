import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiPackage, FiShoppingBag, FiTag, FiUsers, FiLogOut } from 'react-icons/fi';
import { IoFlowerOutline } from 'react-icons/io5';
import { logout } from '../supabase/authService';
import ProductsTab from '../Components/ProductsTap';
import OrdersTab from '../components/OrdersTab';
import PromoCodesTab from '../components/PromoCodesTab';
import UsersTab from '../components/UsersTab';

const TABS = [
    { id: 'products',    label: 'Products',    icon: FiPackage },
    { id: 'orders',      label: 'Orders',      icon: FiShoppingBag },
    { id: 'promo_codes', label: 'Promo Codes', icon: FiTag },
    { id: 'users',       label: 'Users',       icon: FiUsers },
];

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('products');
    const navigate = useNavigate();

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
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Admin Panel</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/')} className="text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-[#D4AF37] transition-colors">
                        View Store
                    </button>
                    <button
                        onClick={async () => { await logout(); navigate('/Auth'); }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-400 text-xs font-bold uppercase tracking-wider hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                        <FiLogOut size={12} /> Logout
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

                {/* ── Tabs ── */}
                <div className="flex gap-1 bg-white dark:bg-[#141414] rounded-2xl p-1.5 border border-gray-100 dark:border-white/5 mb-8 overflow-x-auto">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap flex-1 justify-center
                                ${activeTab === id ? 'bg-[#D4AF37] text-white shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            <Icon size={13} /> {label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'products'    && <ProductsTab />}
                        {activeTab === 'orders'      && <OrdersTab />}
                        {activeTab === 'promo_codes' && <PromoCodesTab />}
                        {activeTab === 'users'       && <UsersTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}