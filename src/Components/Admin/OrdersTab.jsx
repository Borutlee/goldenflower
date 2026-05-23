import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import { toast } from 'react-toastify';
import { FiX, FiUser, FiPhone, FiMapPin, FiClock, FiShoppingBag, FiMail, FiLayers, FiSearch, FiFilter } from 'react-icons/fi';

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
    const [searchTerm, setSearchTerm] = useState(''); // لفلترة البحث
    const [activeTab, setActiveTab] = useState('Pending'); // التاب النشطة حالياً

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error) setOrders(data || []);
        setLoading(false);
    };

    const handleUpdateStatus = async (id, status, e) => {
        if (e) e.stopPropagation();
        const { error } = await supabase.from('orders').update({ status }).eq('id', id);
        if (error) { toast.error(error.message); return; }
        toast.success(`Order marked as ${status}`);
        
        if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder(prev => ({ ...prev, status }));
        }
        fetchOrders();
    };

    // دالة لجلب عدد الأوردرات في كل حالة
    const getCount = (status) => {
        if (status === 'Finished') {
            return orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled').length;
        }
        return orders.filter(o => o.status === status).length;
    };

    // دالة البحث والفلترة النهائية
    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.phone?.includes(searchTerm) ||
            order.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesTab = 
            activeTab === 'Finished' 
                ? (order.status === 'Delivered' || order.status === 'Cancelled')
                : order.status === activeTab;

        return matchesSearch && matchesTab;
    });

    const getParsedItems = (itemsField) => {
        if (!itemsField) return [];
        if (Array.isArray(itemsField)) return itemsField;
        try { return JSON.parse(itemsField); } catch (e) { return []; }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header Section مع البحث */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-serif italic font-bold text-gray-900 dark:text-white">
                        Orders Terminal
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Manage your boutique flow and customer fulfillment</p>
                </div>
                
                <div className="relative group">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by name, phone or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-80 pl-10 pr-4 py-2.5 bg-white dark:bg-[#141414] border border-gray-100 dark:border-white/5 rounded-xl text-xs outline-none focus:border-[#D4AF37]/50 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Tabs System - التقسيمة الاحترافية */}
            <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-gray-100 dark:border-white/5 pb-1">
                {['Pending', 'Processing', 'Shipped', 'Finished'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-2
                            ${activeTab === tab 
                                ? 'text-[#D4AF37]' 
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    >
                        {tab}
                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === tab ? 'bg-[#D4AF37]/10' : 'bg-gray-100 dark:bg-white/5'}`}>
                            {getCount(tab)}
                        </span>
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] animate-fade-in" />
                        )}
                    </button>
                ))}
            </div>

            {/* Orders Grid */}
            {loading ? (
                <div className="text-center py-24 text-gray-400 animate-pulse">Synchronizing database...</div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-[#141414] rounded-3xl border border-dashed border-gray-200 dark:border-white/5">
                    <FiLayers className="w-10 h-10 mx-auto text-gray-200 dark:text-white/5 mb-4" />
                    <p className="text-gray-400 font-serif italic text-sm">No {activeTab.toLowerCase()} orders found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {filteredOrders.map(order => (
                        <div 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 p-5 cursor-pointer hover:shadow-xl hover:border-[#D4AF37]/20 transition-all duration-300 group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h4 className="text-xs font-black text-gray-900 dark:text-white group-hover:text-[#D4AF37] transition-colors uppercase tracking-tight">
                                        {order.customer_name || 'Guest User'}
                                    </h4>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                                        <FiPhone className="text-[9px]" /> {order.phone || 'No Phone'}
                                    </div>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-5 h-12 overflow-hidden items-start">
                                {getParsedItems(order.items).map((item, i) => (
                                    <span key={i} className="text-[9px] bg-gray-50 dark:bg-[#1c1c1c] border border-gray-100 dark:border-white/5 px-2 py-1 rounded-md text-gray-500">
                                        {item.title || item.name || 'Product'} <span className="text-[#D4AF37] font-bold">x{item.quantity}</span>
                                    </span>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                                <div className="text-[10px] text-gray-400">
                                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="text-xs font-black text-gray-900 dark:text-white">
                                    {order.total} <span className="text-[9px] font-normal text-gray-400">EGP</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ==================== 📦 Pop-up Window 📦 ==================== */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-xl rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-[#161616]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37]">
                                    <FiShoppingBag />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Review Order</h3>
                                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{selectedOrder.id.slice(0,12)}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/5 text-gray-400 transition-all">
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto space-y-8">
                            
                            <div className="grid grid-cols-2 gap-8">
                                {/* Customer Column */}
                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.2em]">Receiver</h5>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-400"><FiUser size={14}/></div>
                                            <span className="text-xs font-bold dark:text-gray-200">{selectedOrder.customer_name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-400"><FiPhone size={14}/></div>
                                            <span className="text-xs font-mono font-bold text-blue-500">{selectedOrder.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Logistic Column */}
                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.2em]">Logistics</h5>
                                    <div className="space-y-3 text-xs">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-400 shrink-0"><FiMapPin size={14}/></div>
                                            <div>
                                                <p className="font-bold dark:text-gray-200">{selectedOrder.governorate}</p>
                                                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{selectedOrder.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.2em]">Package Content</h5>
                                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden divide-y divide-gray-200 dark:divide-white/5 border border-gray-100 dark:border-white/5">
                                    {getParsedItems(selectedOrder.items).map((item, i) => (
                                        <div key={i} className="p-4 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white dark:bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#D4AF37] border border-gray-100 dark:border-white/5 text-[10px] font-black">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold dark:text-white">{item.title || item.name || 'Product'}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">{item.price} EGP per unit</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-black text-[#D4AF37]">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="p-8 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#161616] flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Grand Total</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">{selectedOrder.total} <span className="text-[10px] font-normal">EGP</span></p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <select 
                                    value={selectedOrder.status}
                                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                                    className="px-4 py-2.5 bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#D4AF37] transition-all cursor-pointer"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}