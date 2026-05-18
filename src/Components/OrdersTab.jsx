import { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { toast } from 'react-toastify';

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

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error) setOrders(data || []);
        setLoading(false);
    };

    const handleUpdateStatus = async (id, status) => {
        const { error } = await supabase.from('orders').update({ status }).eq('id', id);
        if (error) { toast.error(error.message); return; }
        toast.success('Status updated!');
        fetchOrders();
    };

    return (
        <div>
            <h2 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white mb-6">
                Orders <span className="text-gray-400 text-sm font-sans not-italic">({orders.length})</span>
            </h2>
            {loading ? (
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
                                        onChange={e => handleUpdateStatus(order.id, e.target.value)}
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
    );
}