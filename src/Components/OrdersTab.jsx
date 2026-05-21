import { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { toast } from 'react-toastify';
import { FiX, FiUser, FiPhone, FiMapPin, FiClock, FiShoppingBag, FiMail, FiLayers } from 'react-icons/fi';

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

export default function OrdersTab() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error) setOrders(data || []);
        setLoading(false);
    };

    const handleUpdateStatus = async (id, status, e) => {
        e.stopPropagation();
        const { error } = await supabase.from('orders').update({ status }).eq('id', id);
        if (error) { toast.error(error.message); return; }
        toast.success('Status updated!');
        
        if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder(prev => ({ ...prev, status }));
        }
        fetchOrders();
    };

    const getParsedItems = (itemsField) => {
        if (!itemsField) return [];
        if (Array.isArray(itemsField)) return itemsField;
        try {
            return JSON.parse(itemsField);
        } catch (e) {
            return [];
        }
    };

    return (
        <div>
            <h2 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white mb-6">
                Orders Management <span className="text-gray-400 text-sm font-sans not-italic">({orders.length})</span>
            </h2>
            {loading ? (
                <div className="text-center py-16 text-gray-400">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-16 text-gray-400 font-serif italic">No orders yet</div>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {orders.map(order => {
                        const parsedItems = getParsedItems(order.items);
                        return (
                            <div 
                                key={order.id} 
                                onClick={() => setSelectedOrder(order)}
                                className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 p-5 cursor-pointer hover:border-[#D4AF37]/40 dark:hover:border-[#D4AF37]/40 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                    <div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white">
                                            {order.customer_name || 'Anonymous Guest'}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {order.user_email} {' • '}
                                            {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            {' • '} {order.total} EGP
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={order.status} />
                                        <select
                                            value={order.status}
                                            onChange={e => handleUpdateStatus(order.id, e.target.value, e)}
                                            className="text-[10px] font-bold uppercase px-2 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#222] text-gray-700 dark:text-gray-300 outline-none cursor-pointer"
                                        >
                                            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {parsedItems.map((item, i) => (
                                        <span key={i} className="text-[10px] bg-gray-50 dark:bg-[#222] border border-gray-100 dark:border-white/5 px-2 py-1 rounded-lg text-gray-600 dark:text-gray-400">
                                            {/* 👈 تجربة قراءة كل أشكال الـ Keys الممكنة للاسم الحقيقي */}
                                            {item.title || item.Title || item.name || item.Name || item.product?.title || item.product?.name || 'Product'} x{item.quantity || 1}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ==================== 🚨 الـ Pop-up Window 🚨 ==================== */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#141414] w-full max-w-lg rounded-2xl border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        
                        <div className="p-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-[#1a1a1a]">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FiLayers className="text-[#D4AF37]" /> Process Order
                                </h3>
                                <p className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#252525] text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all">
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-5 text-xs">
                            
                            {/* Contact */}
                            <div className="space-y-2">
                                <h4 className="text-[11px] font-black uppercase text-[#D4AF37] tracking-wider">Customer Contact</h4>
                                <div className="bg-gray-50 dark:bg-[#1c1c1c] p-4 rounded-xl space-y-3 border border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300">
                                        <FiUser className="text-gray-400 shrink-0" />
                                        <span className="font-bold text-gray-900 dark:text-white">{selectedOrder.customer_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300">
                                        <FiPhone className="text-gray-400 shrink-0" />
                                        <span className="font-mono font-bold">{selectedOrder.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300">
                                        <FiMail className="text-gray-400 shrink-0" />
                                        <span>{selectedOrder.user_email || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping */}
                            <div className="space-y-2">
                                <h4 className="text-[11px] font-black uppercase text-[#D4AF37] tracking-wider">Shipping Address</h4>
                                <div className="bg-gray-50 dark:bg-[#1c1c1c] p-4 rounded-xl space-y-3 border border-gray-100 dark:border-white/5">
                                    <div className="flex items-start gap-2.5 text-gray-700 dark:text-gray-300">
                                        <FiMapPin className="text-gray-400 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-black text-gray-900 dark:text-white text-sm">{selectedOrder.governorate || 'N/A'}</p>
                                            <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-1 leading-relaxed">{selectedOrder.address || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-gray-400 text-[10px] pt-2 border-t border-gray-200 dark:border-white/5">
                                        <FiClock />
                                        <span>Order Date: {new Date(selectedOrder.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Items Section */}
                            <div className="space-y-2">
                                <h4 className="text-[11px] font-black uppercase text-[#D4AF37] tracking-wider">Products to Pack</h4>
                                <div className="border border-gray-100 dark:border-white/5 rounded-xl divide-y divide-gray-100 dark:divide-white/5 overflow-hidden">
                                    {getParsedItems(selectedOrder.items).map((item, i) => (
                                        <div key={i} className="p-3.5 flex justify-between items-center bg-gray-50/40 dark:bg-[#1c1c1c]/40">
                                            <div className="flex items-center gap-2.5">
                                                <FiShoppingBag className="text-gray-400" />
                                                <div>
                                                    {/* 👈 هنا صيد المشكلة الأساسية، حطيت كل الاحتمالات عشان يلقط الاسم الفعلي فوراً */}
                                                    <p className="font-bold text-gray-900 dark:text-white text-[12px]">
                                                        {item.title || item.Title || item.name || item.Name || item.product?.title || item.product?.name || 'Product'}
                                                    </p>
                                                    <p className="text-gray-400 text-[10px] mt-0.5">Unit Price: {item.price || item.Price || item.product?.price || 0} EGP</p>
                                                </div>
                                            </div>
                                            <span className="font-black text-sm text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-lg">
                                                x {item.quantity || 1}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <div className="p-5 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1a1a1a] flex justify-between items-center">
                            <div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Cash Collection</span>
                                <span className="text-sm font-black text-gray-900 dark:text-white">{selectedOrder.total} EGP</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedOrder.status}
                                    onChange={e => handleUpdateStatus(selectedOrder.id, e.target.value, e)}
                                    className="text-[11px] font-bold uppercase px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#222] text-gray-700 dark:text-gray-300 outline-none cursor-pointer"
                                >
                                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}