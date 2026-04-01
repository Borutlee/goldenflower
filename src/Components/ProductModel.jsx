import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiShoppingBag, FiHeart, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../Context/CartContext';

const ProductModal = ({ isOpen, onClose, product }) => {
    const [size, setSize] = useState('100ml');
    const [quantity, setQuantity] = useState(1);
    const [wished, setWished] = useState(false);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const totalPrice = useMemo(() => {
        if (!product) return 0;
        return (parseFloat(product?.price || 0) * quantity).toFixed(2);
    }, [product, quantity]);

    const handleViewDetails = useCallback(() => {
        onClose();
        navigate(`/products/${product._id}`);
    }, [onClose, navigate, product]);

    const handleDecrement = useCallback(() => setQuantity(q => Math.max(1, q - 1)), []);
    const handleIncrement = useCallback(() => setQuantity(q => q + 1), []);
    const handleWish = useCallback(() => setWished(w => !w), []);
    const handleAddToCart = useCallback(() => {
        addToCart(product, quantity);
        onClose();
    }, [addToCart, product, quantity, onClose]);

    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">

                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="relative bg-white dark:bg-gray-900 w-full max-w-3xl max-h-[90vh] flex flex-col md:flex-row rounded-[2rem] shadow-xl overflow-hidden text-gray-900 dark:text-white transition-colors duration-300"
                    >
                        {/* ── الصورة ── */}
                        <div className="relative w-full md:w-[45%] flex-shrink-0 overflow-hidden bg-gray-50 dark:bg-gray-800">
                            <div className="w-full aspect-[4/3] md:aspect-auto md:h-full">
                                <img
                                    src={product.image || product.img}
                                    alt={product.title || product.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>

                            {/* Category badge */}
                            <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                                    {product.category}
                                </span>
                            </div>

                            {/* Close */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 p-1.5 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors shadow-sm"
                            >
                                <FiX size={16} />
                            </button>
                        </div>

                        {/* ── التفاصيل ── */}
                        <div className="flex flex-col flex-1 overflow-y-auto overscroll-contain no-scrollbar p-5 md:p-8">

                            {/* Name */}
                            <div className="mb-4">
                                <h1 className="text-xl md:text-2xl font-serif italic text-gray-900 dark:text-white leading-tight mb-1 transition-colors duration-300">
                                    {product.title || product.name}
                                </h1>
                                <div className="h-px w-10 bg-[#D4AF37]" />
                            </div>

                            {/* Description */}
                            <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed mb-5">
                                {product.description || product.detail || "A masterfully crafted piece, designed for your golden moments."}
                            </p>

                            {/* Size */}
                            <div className="mb-4">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Size</p>
                                <div className="flex gap-2">
                                    {['50ml', '100ml'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setSize(s)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200
                                                ${size === s
                                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                                                    : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-400 border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="mb-5">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Quantity</p>
                                <div className="flex items-center gap-2 w-fit border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 p-1 transition-colors duration-300">
                                    <button onClick={handleDecrement} className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                                        <FiMinus size={12} />
                                    </button>
                                    <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-white">{quantity}</span>
                                    <button onClick={handleIncrement} className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                                        <FiPlus size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Total</p>
                                        <p className="text-xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">${totalPrice}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {/* Add to Cart */}
                                        <motion.button
                                            whileTap={{ scale: 0.96 }}
                                            onClick={handleAddToCart}
                                            className="flex items-center gap-1.5 bg-gray-900 dark:bg-[#D4AF37] text-white dark:text-gray-900 px-4 py-2.5 rounded-full font-bold uppercase text-[10px] tracking-[0.15em] hover:bg-[#D4AF37] dark:hover:bg-[#B8860B] active:scale-95 transition-all duration-300"
                                        >
                                            <FiShoppingBag size={13} />
                                            Add
                                        </motion.button>

                                        {/* Wishlist */}
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleWish}
                                            className={`p-2.5 border rounded-full transition-all duration-300
                                                ${wished
                                                    ? 'bg-red-50 border-red-200 text-red-500'
                                                    : 'border-gray-100 dark:border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-200'
                                                }`}
                                        >
                                            <FiHeart size={16} className={wished ? 'fill-red-500' : ''} />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* View Details */}
                                <button
                                    onClick={handleViewDetails}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-100 dark:border-gray-700 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 group"
                                >
                                    View Full Details
                                    <FiArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
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