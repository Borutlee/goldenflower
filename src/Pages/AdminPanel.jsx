import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    FiPackage, FiShoppingBag, FiTag, FiUsers,
    FiPlus, FiEdit2, FiTrash2, FiX, FiSave,
    FiCheck, FiToggleLeft, FiToggleRight, FiLogOut
} from 'react-icons/fi';
import { IoFlowerOutline } from 'react-icons/io5';
import { logout } from '../supabase/authService';

// ━━ Reusable Input ━━
const Field = ({ label, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">{label}</label>
        <input
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#222] text-gray-900 dark:text-white text-sm outline-none focus:border-[#D4AF37] transition-colors"
            {...props}
        />
    </div>
);

const Select = ({ label, children, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">{label}</label>
        <select
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#222] text-gray-900 dark:text-white text-sm outline-none focus:border-[#D4AF37] transition-colors"
            {...props}
        >
            {children}
        </select>
    </div>
);

// ━━ Status Badge ━━
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

const TABS = [
    { id: 'products',     label: 'Products',     icon: FiPackage },
    { id: 'orders',       label: 'Orders',       icon: FiShoppingBag },
    { id: 'promo_codes',  label: 'Promo Codes',  icon: FiTag },
    { id: 'users',        label: 'Users',        icon: FiUsers },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('products');
    const navigate = useNavigate();

    // ━━ Products State ━━
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '', description: '', price: '', old_price: '',
        image: '', category: 'men', rating: '', in_stock: true
    });

    // ━━ Orders State ━━
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    // ━━ Promo Codes State ━━
    const [promoCodes, setPromoCodes] = useState([]);
    const [promoLoading, setPromoLoading] = useState(true);
    const [showPromoForm, setShowPromoForm] = useState(false);
    const [promoForm, setPromoForm] = useState({ code: '', discount: '', type: 'percentage' });

    // ━━ Users State ━━
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);

    // ━━━━ Fetch Data ━━━━
    useEffect(() => { fetchProducts(); }, []);
    useEffect(() => { if (activeTab === 'orders') fetchOrders(); }, [activeTab]);
    useEffect(() => { if (activeTab === 'promo_codes') fetchPromoCodes(); }, [activeTab]);
    useEffect(() => { if (activeTab === 'users') fetchUsers(); }, [activeTab]);

    const fetchProducts = async () => {
        setProductsLoading(true);
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error) setProducts(data);
        setProductsLoading(false);
    };

    const fetchOrders = async () => {
        setOrdersLoading(true);
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error) setOrders(data);
        setOrdersLoading(false);
    };

    const fetchPromoCodes = async () => {
        setPromoLoading(true);
        const { data, error } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
        if (!error) setPromoCodes(data);
        setPromoLoading(false);
    };

    const fetchUsers = async () => {
        setUsersLoading(true);
        const { data, error } = await supabase.functions.invoke('get-users');
        if (!error && data) setUsers(data.users || []);
        setUsersLoading(false);
    };

    // ━━━━ Products CRUD ━━━━
    const handleProductSubmit = async () => {
        if (!productForm.name || !productForm.price) {
            toast.error('Name and price are required.');
            return;
        }
        const payload = {
            ...productForm,
            price: parseFloat(productForm.price),
            old_price: productForm.old_price ? parseFloat(productForm.old_price) : null,
            rating: productForm.rating ? parseFloat(productForm.rating) : 0,
        };
        if (editingProduct) {
            const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
            if (error) { toast.error(error.message); return; }
            toast.success('Product updated!');
        } else {
            const { error } = await supabase.from('products').insert(payload);
            if (error) { toast.error(error.message); return; }
            toast.success('Product added!');
        }
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({ name: '', description: '', price: '', old_price: '', image: '', category: 'men', rating: '', in_stock: true });
        fetchProducts();
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            old_price: product.old_price || '',
            image: product.image || '',
            category: product.category || 'men',
            rating: product.rating || '',
            in_stock: product.in_stock ?? true,
        });
        setShowProductForm(true);
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Delete this product?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) { toast.error(error.message); return; }
        toast.success('Product deleted!');
        fetchProducts();
    };

    // ━━━━ Orders ━━━━
    const handleUpdateOrderStatus = async (id, status) => {
        const { error } = await supabase.from('orders').update({ status }).eq('id', id);
        if (error) { toast.error(error.message); return; }
        toast.success('Status updated!');
        fetchOrders();
    };

    // ━━━━ Promo Codes ━━━━
    const handleAddPromo = async () => {
        if (!promoForm.code || !promoForm.discount) {
            toast.error('Code and discount are required.');
            return;
        }
        const { error } = await supabase.from('promo_codes').insert({
            ...promoForm,
            discount: parseFloat(promoForm.discount),
        });
        if (error) { toast.error(error.message); return; }
        toast.success('Promo code added!');
        setShowPromoForm(false);
        setPromoForm({ code: '', discount: '', type: 'percentage' });
        fetchPromoCodes();
    };

    const handleTogglePromo = async (id, active) => {
        const { error } = await supabase.from('promo_codes').update({ active: !active }).eq('id', id);
        if (error) { toast.error(error.message); return; }
        toast.success(active ? 'Promo deactivated!' : 'Promo activated!');
        fetchPromoCodes();
    };

    const handleDeletePromo = async (id) => {
        if (!confirm('Delete this promo code?')) return;
        const { error } = await supabase.from('promo_codes').delete().eq('id', id);
        if (error) { toast.error(error.message); return; }
        toast.success('Promo code deleted!');
        fetchPromoCodes();
    };

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
                    <button
                        onClick={() => navigate('/')}
                        className="text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-[#D4AF37] transition-colors"
                    >
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
                                ${activeTab === id
                                    ? 'bg-[#D4AF37] text-white shadow-md'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
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

                        {/* ━━━━ Products Tab ━━━━ */}
                        {activeTab === 'products' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white">
                                        Products <span className="text-gray-400 text-sm font-sans not-italic">({products.length})</span>
                                    </h2>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm({ name: '', description: '', price: '', old_price: '', image: '', category: 'men', rating: '', in_stock: true }); }}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#B8860B] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                                    >
                                        <FiPlus size={13} /> Add Product
                                    </motion.button>
                                </div>

                                {/* Product Form */}
                                <AnimatePresence>
                                    {showProductForm && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 p-6 mb-6"
                                        >
                                            <div className="flex items-center justify-between mb-5">
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                                    {editingProduct ? 'Edit Product' : 'New Product'}
                                                </h3>
                                                <button onClick={() => setShowProductForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                                    <FiX size={16} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Field label="Name *" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} placeholder="Product name" />
                                                <Field label="Price *" type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="0.00" />
                                                <Field label="Old Price" type="number" value={productForm.old_price} onChange={e => setProductForm({ ...productForm, old_price: e.target.value })} placeholder="0.00" />
                                                <Field label="Rating" type="number" value={productForm.rating} onChange={e => setProductForm({ ...productForm, rating: e.target.value })} placeholder="0-5" />
                                                <Field label="Image URL" value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} placeholder="https://..." />
                                                <Select label="Category" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                                                    <option value="men">Men</option>
                                                    <option value="women">Women</option>
                                                    <option value="kids">Kids</option>
                                                </Select>
                                                <div className="sm:col-span-2">
                                                    <Field label="Description" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} placeholder="Product description..." />
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">In Stock</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setProductForm({ ...productForm, in_stock: !productForm.in_stock })}
                                                        className={`transition-colors ${productForm.in_stock ? 'text-[#D4AF37]' : 'text-gray-400'}`}
                                                    >
                                                        {productForm.in_stock ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 mt-5">
                                                <button onClick={() => setShowProductForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                                    Cancel
                                                </button>
                                                <motion.button whileTap={{ scale: 0.97 }} onClick={handleProductSubmit} className="flex-1 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                                                    <FiSave size={13} /> {editingProduct ? 'Update' : 'Save'}
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Products List */}
                                {productsLoading ? (
                                    <div className="text-center py-16 text-gray-400">Loading...</div>
                                ) : products.length === 0 ? (
                                    <div className="text-center py-16 text-gray-400 font-serif italic">No products yet</div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {products.map(product => (
                                            <motion.div
                                                key={product.id}
                                                layout
                                                className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 p-4 flex items-center gap-4"
                                            >
                                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <FiPackage size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{product.name}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{product.category} • ${product.price}</p>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${product.in_stock ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
                                                        {product.in_stock ? 'In Stock' : 'Out'}
                                                    </span>
                                                    <button onClick={() => handleEditProduct(product)} className="p-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
                                                        <FiEdit2 size={13} />
                                                    </button>
                                                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                                                        <FiTrash2 size={13} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ━━━━ Orders Tab ━━━━ */}
                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white mb-6">
                                    Orders <span className="text-gray-400 text-sm font-sans not-italic">({orders.length})</span>
                                </h2>
                                {ordersLoading ? (
                                    <div className="text-center py-16 text-gray-400">Loading...</div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-16 text-gray-400 font-serif italic">No orders yet</div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {orders.map(order => (
                                            <div key={order.id} className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 p-5">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-900 dark:text-white">{order.user_email}</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                                            {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            {' • '}${order.total}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <StatusBadge status={order.status} />
                                                        <select
                                                            value={order.status}
                                                            onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                                                            className="text-[10px] font-bold uppercase px-2 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#222] text-gray-700 dark:text-gray-300 outline-none cursor-pointer"
                                                        >
                                                            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                                                <option key={s} value={s}>{s}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {(order.items || []).map((item, i) => (
                                                        <span key={i} className="text-[10px] bg-gray-50 dark:bg-[#222] border border-gray-100 dark:border-white/5 px-2 py-1 rounded-lg text-gray-600 dark:text-gray-400">
                                                            {item.title || item.name} x{item.quantity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ━━━━ Promo Codes Tab ━━━━ */}
                        {activeTab === 'promo_codes' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white">
                                        Promo Codes <span className="text-gray-400 text-sm font-sans not-italic">({promoCodes.length})</span>
                                    </h2>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowPromoForm(true)}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#B8860B] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                                    >
                                        <FiPlus size={13} /> Add Code
                                    </motion.button>
                                </div>

                                {/* Promo Form */}
                                <AnimatePresence>
                                    {showPromoForm && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 p-6 mb-6"
                                        >
                                            <div className="flex items-center justify-between mb-5">
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">New Promo Code</h3>
                                                <button onClick={() => setShowPromoForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                                    <FiX size={16} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <Field label="Code *" value={promoForm.code} onChange={e => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })} placeholder="SUMMER20" />
                                                <Field label="Discount *" type="number" value={promoForm.discount} onChange={e => setPromoForm({ ...promoForm, discount: e.target.value })} placeholder="20" />
                                                <Select label="Type" value={promoForm.type} onChange={e => setPromoForm({ ...promoForm, type: e.target.value })}>
                                                    <option value="percentage">Percentage (%)</option>
                                                    <option value="fixed">Fixed ($)</option>
                                                </Select>
                                            </div>
                                            <div className="flex gap-3 mt-5">
                                                <button onClick={() => setShowPromoForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                                    Cancel
                                                </button>
                                                <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddPromo} className="flex-1 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                                                    <FiSave size={13} /> Save
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Promo List */}
                                {promoLoading ? (
                                    <div className="text-center py-16 text-gray-400">Loading...</div>
                                ) : promoCodes.length === 0 ? (
                                    <div className="text-center py-16 text-gray-400 font-serif italic">No promo codes yet</div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {promoCodes.map(promo => (
                                            <div key={promo.id} className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 p-4 flex items-center gap-4">
                                                <div className="flex-1">
                                                    <p className="font-black text-gray-900 dark:text-white tracking-wider">{promo.code}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {promo.type === 'percentage' ? `${promo.discount}% off` : `$${promo.discount} off`}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${promo.active ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                                                        {promo.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                    <button onClick={() => handleTogglePromo(promo.id, promo.active)} className="p-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
                                                        {promo.active ? <FiToggleRight size={16} className="text-[#D4AF37]" /> : <FiToggleLeft size={16} />}
                                                    </button>
                                                    <button onClick={() => handleDeletePromo(promo.id)} className="p-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                                                        <FiTrash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ━━━━ Users Tab ━━━━ */}
                        {activeTab === 'users' && (
                            <div>
                                <h2 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white mb-6">
                                    Users <span className="text-gray-400 text-sm font-sans not-italic">({users.length})</span>
                                </h2>
                                {usersLoading ? (
                                    <div className="text-center py-16 text-gray-400">Loading...</div>
                                ) : users.length === 0 ? (
                                    <div className="text-center py-16 text-gray-400 font-serif italic">No users yet</div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {users.map(u => (
                                            <div key={u.id} className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 p-4 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                                                    <FiUsers size={16} className="text-[#D4AF37]" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                                                        {u.user_metadata?.first_name} {u.user_metadata?.last_name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {u.user_metadata?.role === 'admin' && (
                                                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                                                            Admin
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}