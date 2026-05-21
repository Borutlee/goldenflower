import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import { toast } from 'react-toastify';
import { FiSearch } from 'react-icons/fi'; // استيراد أيقونة البحث

export default function UsersTab() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State لتخزين نص البحث
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

    // فلترة المستخدمين بناءً على الاسم الأول، الاسم الأخير، أو الإيميل
    const filteredUsers = users.filter(u => {
        const firstName = u.user_metadata?.first_name?.toLowerCase() || '';
        const lastName = u.user_metadata?.last_name?.toLowerCase() || '';
        const fullName = `${firstName} ${lastName}`.trim();
        const email = u.email?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
    
        return fullName.includes(search) || email.includes(search);
    });

    return (
        <div>
            {/* الهيدر الخاص بالتاب مع خانة البحث */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white">
                    Users <span className="text-gray-400 text-sm font-sans not-italic">({filteredUsers.length} / {users.length})</span>
                </h2>

                {/* شريط البحث المضاف */}
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#141414] text-gray-900 dark:text-white text-xs font-medium focus:outline-none focus:border-[#D4AF37]/50 transition-all placeholder-gray-400"
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-16 text-gray-400">Loading...</div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-16 text-gray-400 font-serif italic">
                    {searchTerm ? "No users match your search" : "No users yet"}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {/* هنا بنعرض الـ filteredUsers المشتقة بدل الـ users الأساسية */}
                    {filteredUsers.map(u => (
                        <motion.div
                            key={u.id}
                            whileHover={{ x: 4 }}
                            onClick={() => navigate(`/admin/users/${u.id}`)}
                            className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 p-4 flex items-center gap-4 cursor-pointer hover:border-[#D4AF37]/30 transition-all"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                                {u.user_metadata?.avatar_url ? (
                                    <img src={u.user_metadata.avatar_url} className="w-full h-full rounded-full object-cover" alt="avatar" />
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