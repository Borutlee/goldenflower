import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import { toast } from 'react-toastify';

export default function UsersTab() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('get-users');
            if (error) throw error;
            setUsers(data?.users || []);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white mb-6">
                Users <span className="text-gray-400 text-sm font-sans not-italic">({users.length})</span>
            </h2>
            {loading ? (
                <div className="text-center py-16 text-gray-400">Loading...</div>
            ) : users.length === 0 ? (
                <div className="text-center py-16 text-gray-400 font-serif italic">No users yet</div>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {users.map(u => (
                        <motion.div
                            key={u.id}
                            whileHover={{ x: 4 }}
                            onClick={() => navigate(`/admin/users/${u.id}`)}
                            className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 p-4 flex items-center gap-4 cursor-pointer hover:border-[#D4AF37]/30 transition-all"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                                {u.user_metadata?.avatar_url ? (
                                    <img src={u.user_metadata.avatar_url} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-sm font-black text-[#D4AF37]">
                                        {(u.user_metadata?.first_name?.[0] || u.email?.[0] || '?').toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                                    {u.user_metadata?.first_name} {u.user_metadata?.last_name}
                                </p>
                                <p className="text-xs text-gray-400 truncate">{u.email}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {u.user_metadata?.role === 'admin' && (
                                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">Admin</span>
                                )}
                                <span className="text-gray-300 dark:text-gray-600 text-xs">→</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}