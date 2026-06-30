import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import { toast } from 'react-toastify';
import {
    FiX, FiUser, FiPhone, FiMapPin, FiShoppingBag,
    FiLayers, FiSearch, FiTrash2, FiImage, FiRotateCcw, FiAlertTriangle
} from 'react-icons/fi';

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

// ✅ دالة مساعدة: ترجع الستوك لما الأوردر يتحول لـ Cancelled أو يتمسح
// وتخصم الستوك لما يرجع من Cancelled أو يتسترجع من المحذوفات
const adjustStock = async (items, direction) => {
    // direction: 'increment' = رجّع للمخزون | 'decrement' = اخصم من المخزون
    const rpcName = direction === 'increment' ? 'increment_stock' : 'decrement_stock';

    for (const item of items) {
        const legacyId = item.legacy_id ?? item.id;
        if (!legacyId || !item.quantity) continue;

        const { error } = await supabase.rpc(rpcName, {
            p_legacy_id: Number(legacyId),
            p_quantity: Number(item.quantity),
        });

        if (error) {
            console.error(`Stock ${direction} failed for item ${legacyId}:`, error.message);
        }
    }
};

export default function OrdersTab() {
    const [orders, setOrders] = useState([]);
    const [removedOrders, setRemovedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Pending');

    useEffect(() => {
        fetchOrders();
        // 🔁 كمان نمسح أي محذوفات قديمة لو الأدمن فتح الصفحة
        // ده backup لو pg_cron ما اشتغلش في التوقيت المظبوط
        supabase.rpc ? purgeOldDeletedOrders() : null;
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        // الأوردرات العادية: بس اللي deleted_at = null
        const { data: activeData } = await supabase
            .from('orders')
            .select('*')
            .is('deleted_at', null)
            .order('created_at', { ascending: false });

        // الأوردرات المحذوفة مؤقتاً: اللي deleted_at مش null
        const { data: removedData } = await supabase
            .from('orders')
            .select('*')
            .not('deleted_at', 'is', null)
            .order('deleted_at', { ascending: false });

        setOrders(activeData || []);
        setRemovedOrders(removedData || []);
        setLoading(false);
    };

    // مسح الأوردرات اللي فاتها 24 ساعة (backup إضافي جنب pg_cron)
    const purgeOldDeletedOrders = async () => {
        await supabase.rpc('purge_old_deleted_orders');
    };

    // ✅ تغيير حالة الأوردر مع منطق الستوك الذكي
    const handleUpdateStatus = async (id, newStatus, e) => {
        if (e) e.stopPropagation();

        // محتاجين الحالة القديمة عشان نقرر نعمل إيه في الستوك
        const order = orders.find(o => o.id === id);
        if (!order) return;

        const oldStatus = order.status;
        const items = getParsedItems(order.items);

        // ── منطق الستوك الذكي ──
        // لو بنتحول من حالة عادية لـ Cancelled → نرجّع الستوك
        // لو بنتحول من Cancelled لحالة عادية → نخصم الستوك تاني
        const wasActive = oldStatus !== 'Cancelled';
        const willBeActive = newStatus !== 'Cancelled';

        if (wasActive && !willBeActive) {
            // دخلنا على Cancelled → نرجّع الستوك
            await adjustStock(items, 'increment');
        } else if (!wasActive && willBeActive) {
            // خرجنا من Cancelled → نخصم الستوك تاني
            await adjustStock(items, 'decrement');
        }
        // لو الاتنين عاديين أو الاتنين Cancelled → مفيش تغيير في الستوك

        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) { toast.error(error.message); return; }
        toast.success(`Order marked as ${newStatus}`);

        if (selectedOrder?.id === id) {
            setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
        fetchOrders();
    };

    // ✅ Soft Delete: نكتب وقت الحذف في deleted_at بدل ما نمسح نهائي
    const handleDeleteOrder = async (id, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm('Move this order to Removed Orders? You can restore it within 24 hours.')) return;

        const order = orders.find(o => o.id === id);
        if (!order) return;

        const items = getParsedItems(order.items);

        // لو الأوردر مش Cancelled، نرجّع الستوك عند الحذف
        // (لو كان Cancelled أصلاً، الستوك كان رجع قبل كده)
        if (order.status !== 'Cancelled') {
            await adjustStock(items, 'increment');
        }

        const { error } = await supabase
            .from('orders')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (error) { toast.error(error.message); return; }
        toast.success('Order moved to Removed Orders (recoverable for 24h)');

        if (selectedOrder?.id === id) setSelectedOrder(null);
        fetchOrders();
    };

    // ✅ Restore: نرجّع deleted_at لـ null ونخصم الستوك تاني
    const handleRestoreOrder = async (id, e) => {
        if (e) e.stopPropagation();

        const order = removedOrders.find(o => o.id === id);
        if (!order) return;

        const items = getParsedItems(order.items);

        // لو الأوردر مش Cancelled، نخصم الستوك تاني (لأنه رجع "مطلوب")
        if (order.status !== 'Cancelled') {
            await adjustStock(items, 'decrement');
        }

        const { error } = await supabase
            .from('orders')
            .update({ deleted_at: null })
            .eq('id', id);

        if (error) { toast.error(error.message); return; }
        toast.success('Order restored successfully!');
        fetchOrders();
    };

    const getCount = (tab) => {
        if (tab === 'Removed') return removedOrders.length;
        if (tab === 'Finished') return orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled').length;
        return orders.filter(o => o.status === tab).length;
    };

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

    const filteredRemoved = removedOrders.filter(order =>
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone?.includes(searchTerm) ||
        order.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getParsedItems = (itemsField) => {
        if (!itemsField) return [];
        if (Array.isArray(itemsField)) return itemsField;
        try { return JSON.parse(itemsField); } catch (e) { return []; }
    };

    // كم الوقت فاضل قبل المسح النهائي
    const timeLeftForPurge = (deletedAt) => {
        const deletedTime = new Date(deletedAt).getTime();
        const now = Date.now();
        const diff = (deletedTime + 24 * 60 * 60 * 1000) - now;
        if (diff <= 0) return 'Expires soon';
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m left`;
    };

    const TABS = ['Pending', 'Processing', 'Shipped', 'Finished', 'Removed'];

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
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

            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-gray-100 dark:border-white/5 pb-1">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-2
                            ${activeTab === tab
                                ? tab === 'Removed' ? 'text-red-400' : 'text-[#D4AF37]'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    >
                        {tab}
                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${
                            activeTab === tab
                                ? tab === 'Removed' ? 'bg-red-500/10' : 'bg-[#D4AF37]/10'
                                : 'bg-gray-100 dark:bg-white/5'
                        }`}>
                            {getCount(tab)}
                        </span>
                        {activeTab === tab && (
                            <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab === 'Removed' ? 'bg-red-400' : 'bg-[#D4AF37]'}`} />
                        )}
                    </button>
                ))}
            </div>

            {/* ── Removed Orders Tab ── */}
            {activeTab === 'Removed' && (
                <>
                    {/* تحذير */}
                    <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-2xl px-5 py-4 mb-6">
                        <FiAlertTriangle size={16} className="text-red-400 flex-shrink-0" />
                        <p className="text-xs text-red-500 dark:text-red-400">
                            Orders here are permanently deleted after <span className="font-black">24 hours</span>. Use Restore to recover them.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-24 text-gray-400 animate-pulse">Loading...</div>
                    ) : filteredRemoved.length === 0 ? (
                        <div className="text-center py-24 bg-white dark:bg-[#141414] rounded-3xl border border-dashed border-gray-200 dark:border-white/5">
                            <FiTrash2 className="w-10 h-10 mx-auto text-gray-200 dark:text-white/5 mb-4" />
                            <p className="text-gray-400 font-serif italic text-sm">No removed orders</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredRemoved.map(order => (
                                <div
                                    key={order.id}
                                    className="bg-white dark:bg-[#141414] rounded-2xl border border-red-100 dark:border-red-900/20 p-5 opacity-75"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                                {order.customer_name || 'Guest User'}
                                            </h4>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                                                <FiPhone size={9} /> {order.phone || 'No Phone'}
                                            </div>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </div>

                                    {/* countdown */}
                                    <div className="flex items-center gap-1.5 mb-4">
                                        <FiAlertTriangle size={11} className="text-red-400" />
                                        <span className="text-[10px] text-red-400 font-bold">
                                            {timeLeftForPurge(order.deleted_at)}
                                        </span>
                                    </div>

                                    <div className="pt-3 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                                        <span className="text-xs font-black text-gray-900 dark:text-white">
                                            {order.total} <span className="text-[9px] font-normal text-gray-400">EGP</span>
                                        </span>
                                        <button
                                            onClick={(e) => handleRestoreOrder(order.id, e)}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] text-[11px] font-bold uppercase tracking-wide transition-all"
                                        >
                                            <FiRotateCcw size={12} /> Restore
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* ── Active Orders Grid ── */}
            {activeTab !== 'Removed' && (
                <>
                    {loading ? (
                        <div className="text-center py-24 text-gray-400 animate-pulse">Synchronizing database...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-24 bg-white dark:bg-[#141414] rounded-3xl border border-dashed border-gray-200 dark:border-white/5">
                            <FiLayers className="w-10 h-10 mx-auto text-gray-200 dark:text-white/5 mb-4" />
                            <p className="text-gray-400 font-serif italic text-sm">No {activeTab.toLowerCase()} orders found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredOrders.map(order => (
                                <div
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 p-5 cursor-pointer hover:shadow-xl hover:border-[#D4AF37]/20 transition-all duration-300 group relative"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-black text-gray-900 dark:text-white group-hover:text-[#D4AF37] transition-colors uppercase tracking-tight">
                                                {order.customer_name || 'Guest User'}
                                            </h4>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                                                <FiPhone size={9} /> {order.phone || 'No Phone'}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <StatusBadge status={order.status} />
                                            <button
                                                onClick={(e) => handleDeleteOrder(order.id, e)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                                title="Move to Removed Orders"
                                            >
                                                <FiTrash2 size={13} />
                                            </button>
                                        </div>
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
                </>
            )}

            {/* Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                    <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-xl rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-[#161616]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37]">
                                    <FiShoppingBag />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Review Order</h3>
                                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{selectedOrder.id.slice(0, 12)}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/5 text-gray-400 transition-all">
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.2em]">Receiver</h5>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-400"><FiUser size={14} /></div>
                                            <span className="text-xs font-bold dark:text-gray-200">{selectedOrder.customer_name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-400"><FiPhone size={14} /></div>
                                            <span className="text-xs font-mono font-bold text-blue-500">{selectedOrder.phone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.2em]">Logistics</h5>
                                    <div className="space-y-3 text-xs">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-400 shrink-0"><FiMapPin size={14} /></div>
                                            <div>
                                                <p className="font-bold dark:text-gray-200">{selectedOrder.governorate}</p>
                                                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{selectedOrder.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.2em]">Package Content</h5>
                                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden divide-y divide-gray-200 dark:divide-white/5 border border-gray-100 dark:border-white/5">
                                    {getParsedItems(selectedOrder.items).map((item, i) => (
                                        <div key={i} className="p-4 flex justify-between items-center gap-4">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                {item.image || item.image_url ? (
                                                    <img
                                                        src={item.image || item.image_url}
                                                        alt={item.title || item.name}
                                                        className="w-12 h-12 object-cover rounded-xl border border-gray-100 dark:border-white/5 bg-white shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-white dark:bg-[#1a1a1a] rounded-xl flex items-center justify-center text-gray-300 dark:text-white/10 border border-gray-100 dark:border-white/5 shrink-0">
                                                        <FiImage size={16} />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold dark:text-white truncate">{item.title || item.name || 'Product'}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">{item.price} EGP per unit</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-black text-[#D4AF37] shrink-0">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#161616] flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Grand Total</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">{selectedOrder.total} <span className="text-[10px] font-normal">EGP</span></p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => handleDeleteOrder(selectedOrder.id, e)}
                                    className="p-2.5 text-gray-400 hover:text-red-500 rounded-xl bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 hover:border-red-200 dark:hover:border-red-900/50 transition-all"
                                    title="Move to Removed Orders"
                                >
                                    <FiTrash2 size={15} />
                                </button>
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