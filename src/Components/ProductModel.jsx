import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiShoppingBag, FiHeart, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../Context/CartContext'

const ProductModal = ({ isOpen, onClose, product }) => {
    const [activeTab, setActiveTab] = useState('Description');
    const [size, setSize] = useState('100ml');
    const [quantity, setQuantity] = useState(1);
    const [wished, setWished] = useState(false);
    const navigate = useNavigate();

    const totalPrice = useMemo(() => {
        if (!product) return 0;
        const basePrice = parseFloat(String(product?.price || "").replace('$', ''));
        return (basePrice * quantity).toFixed(2);
    }, [product, quantity]);

    const handleViewDetails = useCallback(() => {
        onClose();
        navigate(`/products/${product._id}`);
    }, [onClose, navigate, product]);

    const handleDecrement = useCallback(() => setQuantity(q => Math.max(1, q - 1)), []);
    const handleIncrement = useCallback(() => setQuantity(q => q + 1), []);
    const handleWish = useCallback(() => setWished(w => !w), []);

    const { addToCart } = useCart();

    const handleAddToCart = useCallback(() => {
        addToCart(product, quantity);
    }, [addToCart, product, quantity]);

    
    if (!product) return null;

    const tabs = {
        Description: product.detail || "A masterfully blended fragrance that captures the essence of luxury.",
        Reviews: "⭐⭐⭐⭐⭐ (4.9/5) — 'Signature scent.'",
        Details: "Top: Saffron. Heart: Amberwood."
    };



    return (
        <AnimatePresence>
            {isOpen && (
                // ✅ موبايل: bottom sheet | desktop: centered
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-6">

                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* ✅ Modal: flex-col على الموبايل | flex-row على الـ desktop */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 250 }}
                        className="relative bg-white w-full md:max-w-5xl h-[94vh] md:h-auto md:max-h-[92vh] flex flex-col md:flex-row rounded-t-[2.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden text-gray-900"
                    >

                        {/* ✅ الصورة: فوق على الموبايل | نص الشاشة على اليسار في الـ desktop */}
                        <div className="w-full md:w-1/2 h-[42vh] md:h-auto flex-shrink-0 relative overflow-hidden bg-gray-50 md:rounded-l-[2rem] md:rounded-tr-none">

                            {/* Drag Handle - موبايل بس */}
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 md:hidden">
                                <div className="w-12 h-1 bg-white/50 rounded-full" />
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-50 p-2 bg-white/20 backdrop-blur-lg border border-white/20 rounded-full shadow-lg hover:bg-white/40 transition-all text-white"
                            >
                                <FiX size={18} />
                            </button>

                            <img
                                src={product.img || product.image}
                                className="w-full h-full object-cover"
                                alt={product.name}
                                loading="lazy"
                            />
                        </div>

                        {/* ✅ التفاصيل: نص الشاشة على اليمين في الـ desktop | تحت الصورة على الموبايل */}
                        <div className="w-full md:w-1/2 flex flex-col flex-1 md:flex-none p-6 md:p-10 bg-white overflow-hidden">

                            {/* Scrollable content */}
                            <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar pr-1 pb-2">

                                {/* Category + Name */}
                                <h2 className="text-[#D4AF37] tracking-[0.15em] text-[11px] font-black mb-1.5 uppercase">
                                    {product.category || "Luxury Collection"}
                                </h2>
                                <h1 className="text-2xl md:text-3xl font-serif italic mb-5 text-gray-950 leading-tight">
                                    {product.name}
                                </h1>

                                {/* Tabs */}
                                <div className="flex border-b border-gray-100 mb-5 overflow-x-auto no-scrollbar">
                                    {Object.keys(tabs).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`pb-3 mr-6 text-[11px] font-bold tracking-widest transition-all relative whitespace-nowrap
                                                ${activeTab === tab ? 'text-black' : 'text-gray-400'}`}
                                        >
                                            {tab}
                                            {activeTab === tab && (
                                                <motion.div
                                                    layoutId="underline"
                                                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#D4AF37]"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content */}
                                <div className="min-h-[50px] mb-6">
                                    <motion.p
                                        key={activeTab}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-gray-500 text-sm leading-relaxed italic"
                                    >
                                        {tabs[activeTab]}
                                    </motion.p>
                                </div>

                                {/* Size + Quantity */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Size</label>
                                        <select
                                            value={size}
                                            onChange={(e) => setSize(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-100 text-sm rounded-2xl px-4 py-3.5 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-colors"
                                        >
                                            <option value="100ml">100ml</option>
                                            <option value="50ml">50ml</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Qty</label>
                                        <div className="flex items-center justify-between border border-gray-100 rounded-2xl p-1.5 bg-gray-50 h-[48px]">
                                            <button onClick={handleDecrement} className="p-2 text-gray-400 hover:text-black transition-colors">
                                                <FiMinus size={14} />
                                            </button>
                                            <span className="font-bold text-sm text-gray-950">{quantity}</span>
                                            <button onClick={handleIncrement} className="p-2 text-gray-400 hover:text-black transition-colors">
                                                <FiPlus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* ✅ Sticky Footer */}
                            <div className="pt-4 border-t border-gray-100 flex-shrink-0 bg-white">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Total</p>
                                        <p className="text-2xl font-extrabold text-gray-950">${totalPrice}</p>
                                    </div>
                                    <div className="flex gap-2.5">
                                        <button 
                                        onClick = {handleAddToCart}
                                        className="flex items-center gap-2 bg-black text-white px-5 py-3.5 rounded-full font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-[#D4AF37] active:scale-95 transition-all duration-300 shadow-md">
                                            <FiShoppingBag size={16} />
                                            <span>Add</span>
                                        </button>
                                        <button
                                            onClick={handleWish}
                                            className={`p-3.5 border rounded-full transition-all duration-300 active:scale-95 shadow-sm
                                                ${wished
                                                    ? 'bg-red-50 border-red-200 text-red-500'
                                                    : 'border-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'
                                                }`}
                                        >
                                            <FiHeart size={20} className={wished ? 'fill-red-500' : ''} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleViewDetails}
                                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl border border-gray-200 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:border-[#D4AF37] hover:text-[#D4AF37] active:scale-95 transition-all group"
                                >
                                    View Full Details
                                    <FiArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductModal;