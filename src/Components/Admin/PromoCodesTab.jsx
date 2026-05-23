import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabase/supabaseClient';
import { toast } from 'react-toastify';
import { FiPlus, FiX, FiSave, FiToggleLeft, FiToggleRight, FiTrash2 } from 'react-icons/fi';

const Field = ({ label, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">{label}</label>
        <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#222] text-gray-900 dark:text-white text-sm outline-none focus:border-[#D4AF37] transition-colors" {...props} />
    </div>
);

const Select = ({ label, children, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">{label}</label>
        <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#222] text-gray-900 dark:text-white text-sm outline-none focus:border-[#D4AF37] transition-colors" {...props}>
            {children}
        </select>
    </div>
);

export default function PromoCodesTab() {
    const [promoCodes, setPromoCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ code: '', discount: '', type: 'percentage' });

    useEffect(() => { fetchPromoCodes(); }, []);

    const fetchPromoCodes = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
        if (!error) setPromoCodes(data || []);
        setLoading(false);
    };

    const handleAdd = async () => {
        if (!form.code || !form.discount) { toast.error('Code and discount are required.'); return; }
        const { error } = await supabase.from('promo_codes').insert({ ...form, discount: parseFloat(form.discount) });
        if (error) { toast.error(error.message); return; }
        toast.success('Promo code added!');
        setShowForm(false);
        setForm({ code: '', discount: '', type: 'percentage' });
        fetchPromoCodes();
    };

    const handleToggle = async (id, active) => {
        const { error } = await supabase.from('promo_codes').update({ active: !active }).eq('id', id);
        if (error) { toast.error(error.message); return; }
        toast.success(active ? 'Promo deactivated!' : 'Promo activated!');
        fetchPromoCodes();
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this promo code?')) return;
        const { error } = await supabase.from('promo_codes').delete().eq('id', id);
        if (error) { toast.error(error.message); return; }
        toast.success('Promo code deleted!');
        fetchPromoCodes();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white">
                    Promo Codes <span className="text-gray-400 text-sm font-sans not-italic">({promoCodes.length})</span>
                </h2>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#B8860B] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
                    <FiPlus size={13} /> Add Code
                </motion.button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 p-6 mb-6"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">New Promo Code</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><FiX size={16} /></button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Field label="Code *" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SUMMER20" />
                            <Field label="Discount *" type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} placeholder="20" />
                            <Select label="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed ($)</option>
                            </Select>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                Cancel
                            </button>
                            <motion.button whileTap={{ scale: 0.97 }} onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                                <FiSave size={13} /> Save
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
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
                                <button onClick={() => handleToggle(promo.id, promo.active)} className="p-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
                                    {promo.active ? <FiToggleRight size={16} className="text-[#D4AF37]" /> : <FiToggleLeft size={16} />}
                                </button>
                                <button onClick={() => handleDelete(promo.id)} className="p-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                                    <FiTrash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}