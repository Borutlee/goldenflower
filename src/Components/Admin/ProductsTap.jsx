import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabase/supabaseClient';
import { toast } from 'react-toastify';
import { FiPackage, FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

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

const EMPTY_FORM = { name: '', description: '', price: '', old_price: '', image: '', category: 'men', rating: '', in_stock: true };

export default function ProductsTab() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error) setProducts(data || []);
        setLoading(false);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.price) { toast.error('Name and price are required.'); return; }
        const payload = {
            ...form,
            price: parseFloat(form.price),
            old_price: form.old_price ? parseFloat(form.old_price) : null,
            rating: form.rating ? parseFloat(form.rating) : 0,
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
        setShowForm(false);
        setEditingProduct(null);
        setForm(EMPTY_FORM);
        fetchProducts();
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            old_price: product.old_price || '',
            image: product.image || '',
            category: product.category || 'men',
            rating: product.rating || '',
            in_stock: product.in_stock ?? true,
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) { toast.error(error.message); return; }
        toast.success('Product deleted!');
        fetchProducts();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white">
                    Products <span className="text-gray-400 text-sm font-sans not-italic">({products.length})</span>
                </h2>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setShowForm(true); setEditingProduct(null); setForm(EMPTY_FORM); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#B8860B] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                    <FiPlus size={13} /> Add Product
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
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                {editingProduct ? 'Edit Product' : 'New Product'}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FiX size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
                            <Field label="Price *" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
                            <Field label="Old Price" type="number" value={form.old_price} onChange={e => setForm({ ...form, old_price: e.target.value })} placeholder="0.00" />
                            <Field label="Rating" type="number" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} placeholder="0-5" />
                            <Field label="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                            <Select label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                <option value="men">Men</option>
                                <option value="women">Women</option>
                                <option value="kids">Kids</option>
                            </Select>
                            <div className="sm:col-span-2">
                                <Field label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description..." />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">In Stock</label>
                                <button type="button" onClick={() => setForm({ ...form, in_stock: !form.in_stock })} className={`transition-colors ${form.in_stock ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                                    {form.in_stock ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                Cancel
                            </button>
                            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                                <FiSave size={13} /> {editingProduct ? 'Update' : 'Save'}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="text-center py-16 text-gray-400">Loading...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-16 text-gray-400 font-serif italic">No products yet</div>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {products.map(product => (
                        <motion.div key={product.id} layout className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 p-4 flex items-center gap-4">
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
                                <button onClick={() => handleEdit(product)} className="p-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
                                    <FiEdit2 size={13} />
                                </button>
                                <button onClick={() => handleDelete(product.id)} className="p-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                                    <FiTrash2 size={13} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}