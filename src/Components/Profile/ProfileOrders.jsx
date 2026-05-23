import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import { FiClock, FiShoppingBag, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function ProfileOrders({ onOrdersFetched }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const fetchUserOrders = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user && user.email) {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_email', user.email)
                    .order('created_at', { ascending: false });

                if (!error) {
                    setOrders(data || []);
                    // بنبعت العدد للملف الأب عشان نحدث عداد الـ "0 ORDERS"
                    if (onOrdersFetched) onOrdersFetched(data?.length || 0);
                }
            }
        } catch (error) {
            console.error("Error fetching user orders:", error);
        }
        setLoading(false);
    };

    const getParsedItems = (itemsField) => {
        if (!itemsField) return [];
        if (Array.isArray(itemsField)) return itemsField;
        try { return JSON.parse(itemsField); } catch (e) { return []; }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': 
                return { text: 'Pending', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', icon: <FiClock /> };
            case 'Processing': 
                return { text: 'Processing', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: <FiShoppingBag /> };
            case 'Shipped': 
                return { text: 'Shipped', color: 'text-purple-400 bg-purple-400/10 border-purple-200/20', icon: <FiTruck /> };
            case 'Delivered': 
                return { text: 'Delivered', color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: <FiCheckCircle /> };
            case 'Cancelled': 
                return { text: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: <FiXCircle /> };
            default: 
                return { text: 'Pending', color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: <FiClock /> };
        }
    };

    if (loading) return <div className="text-center py-12 text-gray-400 text-xs font-mono">Loading history...</div>;

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-4 border border-dashed border-gray-800 rounded-3xl">
                <FiShoppingBag size={30} className="text-gray-700" />
                <p className="text-gray-500 font-serif italic text-sm">No orders yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-w-xl mx-auto">
            {orders.map((order) => {
                const statusInfo = getStatusStyle(order.status);
                return (
                    <div key={order.id} className="bg-[#141414] border border-white/5 rounded-2xl p-5">
                        <div className="flex justify-between items-center pb-3 border-b border-white/5">
                            <div>
                                <span className="text-[9px] text-gray-500 block font-mono">ID: {order.id.slice(0, 8)}...</span>
                                <span className="text-[10px] text-gray-400">
                                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${statusInfo.color}`}>
                                {statusInfo.icon} <span>{statusInfo.text}</span>
                            </div>
                        </div>
                        <div className="py-3 space-y-2">
                            {getParsedItems(order.items).map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs text-gray-300">
                                    <span>{item.title || item.name || 'Product'}</span>
                                    <span className="text-gray-500">x{item.quantity || 1}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                            <span className="text-gray-500 text-[10px]">Cash On Delivery</span>
                            <span className="font-bold text-[#D4AF37]">{order.total} EGP</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}