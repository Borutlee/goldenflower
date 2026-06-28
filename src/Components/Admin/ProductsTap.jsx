import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabase/supabaseClient';
import { toast } from 'react-toastify';
import {
    FiPackage, FiPlus, FiEdit2, FiTrash2, FiX, FiSave,
    FiSearch, FiUpload, FiLink, FiStar, FiImage
} from 'react-icons/fi';

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

const EMPTY_FORM = {
    name: '', description: '', price: '', old_price: '',
    category: 'Men', rating: '', stock: '',
    images: [], // 🔁 array من روابط الصور، أول عنصر فيها = الصورة الرئيسية
};

const CATEGORIES = ['Men', 'Women', 'Unisex'];

export default function ProductsTab() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    // 🔁 حالة جديدة: البحث + فلتر الكاتيجوري
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // 🔁 حالة جديدة: رفع الصور (URL يدوي + ملف من الجهاز)
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error) setProducts(data || []);
        setLoading(false);
    };

    // 🔁 فلترة + بحث مع بعض، بنفس فكرة useMemo عشان ما يحسبش كل render
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
            const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase().trim());
            return matchesCategory && matchesSearch;
        });
    }, [products, searchQuery, categoryFilter]);

    // 🔁 رفع صورة من الجهاز لـ Supabase Storage، وإرجاع الرابط العام
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName);

            setForm(prev => ({ ...prev, images: [...prev.images, publicUrlData.publicUrl] }));
            toast.success('Image uploaded!');
        } catch (err) {
            toast.error(err.message || 'Failed to upload image.');
        } finally {
            setUploadingImage(false);
            e.target.value = ''; // عشان تقدر ترفع نفس الملف تاني لو احتجت
        }
    };

    // 🔁 إضافة صورة من لينك يدوي
    const handleAddImageUrl = () => {
        if (!imageUrlInput.trim()) return;
        setForm(prev => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
        setImageUrlInput('');
    };

    // 🔁 حذف صورة من القائمة (بالـ index بتاعها)
    const handleRemoveImage = (index) => {
        setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    // 🔁 تحديد صورة معينة كرئيسية: بنرتب المصفوفة بحيث تبقى هي أول عنصر
    const handleSetPrimaryImage = (index) => {
        setForm(prev => {
            const newImages = [...prev.images];
            const [selected] = newImages.splice(index, 1);
            newImages.unshift(selected);
            return { ...prev, images: newImages };
        });
    };

    const handleSubmit = async () => {
        if (!form.name || !form.price) { toast.error('Name and price are required.'); return; }

        // 🔁 image (مفرد) بيفضل دايمًا أول عنصر في images، عشان أي كومبوننت قديم يقرا image
        // لا يتأثر ويفضل شغال زي ما هو
        const payload = {
            name: form.name,
            description: form.description,
            category: form.category,
            stock: parseInt(form.stock) || 0,
            price: parseFloat(form.price),
            old_price: form.old_price ? parseFloat(form.old_price) : null,
            rating: form.rating ? parseFloat(form.rating) : 0,
            images: form.images,
            image: form.images[0] || null,
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
            category: product.category || 'Men',
            rating: product.rating || '',
            stock: product.stock ?? 0,
            // 🔁 لو المنتج له images محفوظة نستخدمها، وإلا نبني مصفوفة من image القديمة (لو موجودة)
            images: (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : []),
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
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white">
                    Products <span className="text-gray-400 text-sm font-sans not-italic">({filteredProducts.length})</span>
                </h2>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setShowForm(true); setEditingProduct(null); setForm(EMPTY_FORM); }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#B8860B] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                    <FiPlus size={13} /> Add Product
                </motion.button>
            </div>

            {/* ── 🔁 Search + Category Filter ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search products by name..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#141414] text-gray-900 dark:text-white text-sm outline-none focus:border-[#D4AF37] transition-colors"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto sm:overflow-visible">
                    {['all', ...CATEGORIES].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all
                                ${categoryFilter === cat
                                    ? 'bg-gray-900 dark:bg-[#D4AF37] text-white'
                                    : 'bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Add/Edit Form ── */}
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                            <Field label="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
                            <Field label="Price *" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
                            <Field label="Old Price" type="number" value={form.old_price} onChange={e => setForm({ ...form, old_price: e.target.value })} placeholder="0.00" />
                            <Field label="Rating" type="number" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} placeholder="0-5" />
                            <Select label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </Select>
                            <Field label="Stock Quantity" type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="e.g. 25" />
                            <div className="sm:col-span-2">
                                <Field label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description..." />
                            </div>
                        </div>

                        {/* 🔁 قسم الصور بالكامل */}
                        <div className="border-t border-gray-100 dark:border-white/5 pt-5">
                            <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400 mb-3 block">
                                Product Images
                            </label>

                            {/* معاينة الصور الحالية */}
                            {form.images.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                                    {form.images.map((img, index) => (
                                        <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                                            <img src={img} alt={`Product ${index}`} className="w-full h-full object-cover" />

                                            {/* بادچ "Main" على الصورة الرئيسية (أول عنصر) */}
                                            {index === 0 && (
                                                <span className="absolute top-1.5 left-1.5 bg-[#D4AF37] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                                    <FiStar size={9} /> Main
                                                </span>
                                            )}

                                            {/* أزرار التحكم تظهر عند الـ hover */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                                {index !== 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSetPrimaryImage(index)}
                                                        title="Set as main image"
                                                        className="p-1.5 bg-white/90 rounded-lg text-gray-700 hover:text-[#D4AF37] transition-colors"
                                                    >
                                                        <FiStar size={12} />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    title="Remove image"
                                                    className="p-1.5 bg-white/90 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <FiTrash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* رفع من الجهاز + إضافة بلينك، جنب لبعض */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* رفع من الجهاز */}
                                <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-xs font-bold uppercase tracking-wide text-gray-400 cursor-pointer hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <FiUpload size={14} />
                                    {uploadingImage ? 'Uploading...' : 'Upload from device'}
                                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploadingImage} />
                                </label>

                                {/* إضافة بلينك */}
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                                        <input
                                            type="text"
                                            value={imageUrlInput}
                                            onChange={e => setImageUrlInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
                                            placeholder="Paste image URL"
                                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#222] text-gray-900 dark:text-white text-xs outline-none focus:border-[#D4AF37] transition-colors"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddImageUrl}
                                        className="px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                    >
                                        <FiPlus size={14} />
                                    </button>
                                </div>
                            </div>

                            {form.images.length === 0 && (
                                <p className="text-[11px] text-gray-400 mt-2.5 flex items-center gap-1.5">
                                    <FiImage size={12} /> No images added yet. The first image you add becomes the main one.
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
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

            {/* ── 🔁 Product Grid (شكل جديد بالكامل، كروت بدل صفوف) ── */}
            {loading ? (
                <div className="text-center py-16 text-gray-400">Loading...</div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 text-gray-400 font-serif italic">
                    {products.length === 0 ? 'No products yet' : 'No products match your search'}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map(product => {
                        const mainImage = (product.images && product.images[0]) || product.image;
                        return (
                            <motion.div
                                key={product.id}
                                layout
                                className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                            >
                                {/* صورة المنتج فوق الكارت بالكامل */}
                                <div className="relative h-40 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                    {mainImage ? (
                                        <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <FiPackage size={28} />
                                        </div>
                                    )}

                                    {/* عدد الصور لو أكتر من واحدة */}
                                    {product.images && product.images.length > 1 && (
                                        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <FiImage size={10} /> {product.images.length}
                                        </span>
                                    )}

                                    {/* 🔁 حالة المخزون: بتتحدد تلقائيًا من الرقم نفسه، مش toggle يدوي */}
                                    <span className={`absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${product.stock > 0 ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                    </span>
                                </div>

                                {/* تفاصيل المنتج */}
                                <div className="p-4">
                                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate mb-1">{product.name}</p>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] uppercase tracking-wide text-gray-400">{product.category}</span>
                                        <div className="flex items-baseline gap-1.5">
                                            {product.old_price && (
                                                <span className="text-[10px] text-gray-400 line-through">${product.old_price}</span>
                                            )}
                                            <span className="text-sm font-black text-[#D4AF37]">${product.price}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-wide hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                                        >
                                            <FiEdit2 size={12} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="flex items-center justify-center px-3 py-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                        >
                                            <FiTrash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
