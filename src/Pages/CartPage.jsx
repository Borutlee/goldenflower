import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, clearCart, updatequantity } = useCart();

    // ━━━━ Functions ━━━━
    const handleRemove = (id) => removeFromCart(id);
    const handleIncrement = (id, quantity) => updatequantity(id, quantity + 1);
    const handleDecrement = (id, currentQty) => {
        if (currentQty === 1) removeFromCart(id);
        else updatequantity(id, currentQty - 1);
    };
    const handleClearCart = () => clearCart();

    const totalPrice = cartItems.reduce((acc, item) =>
        acc + (item.product.price * item.quantity), 0
    ).toFixed(2);

    // ━━━━ Empty State ━━━━
    if (cartItems.length === 0) return (
        <div className="min-h-screen bg-white dark:bg-[#121212] flex flex-col items-center justify-center gap-6 px-4 transition-colors duration-300">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-full bg-gray-50 dark:bg-[#1A1A1A] flex items-center justify-center border border-gray-100 dark:border-gray-800"
            >
                <FiShoppingBag size={32} className="text-gray-300 dark:text-gray-600" />
            </motion.div>
            <div className="text-center">
                <h2 className="text-2xl font-serif italic text-gray-800 dark:text-white mb-2">Your cart is empty</h2>
                <p className="text-gray-400 dark:text-gray-500 text-sm">Looks like you haven't added anything yet.</p>
            </div>
            <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 bg-gray-900 dark:bg-[#D4AF37] text-white px-8 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest hover:shadow-xl transition-all duration-300"
            >
                <FiShoppingBag size={14} />
                Browse Products
            </motion.button>
        </div>
    );

    return (
        <div className="bg-gray-50 dark:bg-[#121212] min-h-screen py-12 px-4 sm:px-8 lg:px-16 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">

                {/* ━━━━ Header ━━━━ */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                    <div>
                        <motion.button
                            onClick={() => navigate(-1)}
                            whileHover={{ x: -4 }}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-4 group"
                        >
                            <FiArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
                            Continue Shopping
                        </motion.button>
                        <h1 className="text-4xl sm:text-5xl font-serif italic text-gray-900 dark:text-white">Your Cart</h1>
                        <div className="h-px w-14 bg-[#D4AF37] mt-3" />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                            Total items: {cartItems.length}
                        </span>
                    </div>
                </div>

                {/* ━━━━ Layout ━━━━ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                    {/* ── Cart Items ── */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <AnimatePresence mode='popLayout'>
                            {cartItems.map((item, index) => (
                                <motion.div
                                    key={item.product._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white dark:bg-[#1A1A1A] rounded-[2rem] border border-gray-100 dark:border-gray-800 p-4 sm:p-5 flex gap-4 items-center shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    {/* Thumbnail */}
                                    <div
                                        onClick={() => navigate(`/products/${item.product._id}`)}
                                        className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#242424] flex-shrink-0 cursor-pointer"
                                    >
                                        <img
                                            src={item.product.image || item.product.img}
                                            alt={item.product.title}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1 opacity-80">
                                            {item.product.category}
                                        </p>
                                        <h3 className="font-serif italic text-gray-900 dark:text-white text-base sm:text-lg leading-tight truncate mb-1">
                                            {item.product.title || item.product.name}
                                        </h3>
                                        <p className="text-gray-900 dark:text-gray-300 font-bold text-sm">
                                            ${item.product.price}
                                        </p>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleRemove(item.product._id)}
                                            className="p-2 text-gray-300 hover:text-red-400 dark:hover:text-red-500 transition-colors"
                                        >
                                            <FiTrash2 size={16} />
                                        </motion.button>

                                        <div className="flex items-center gap-2 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-[#242424] p-1.5 transition-colors">
                                            <button
                                                onClick={() => handleDecrement(item.product._id, item.quantity)}
                                                className="p-1 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                            >
                                                <FiMinus size={12} />
                                            </button>
                                            <span className="w-6 text-center text-xs font-black text-gray-900 dark:text-white">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleIncrement(item.product._id, item.quantity)}
                                                className="p-1 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                            >
                                                <FiPlus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <button
                            onClick={handleClearCart}
                            className="self-start text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-red-500 transition-colors mt-4 ml-2"
                        >
                            Clear Entire Cart
                        </button>
                    </div>

                    {/* ── Order Summary ── */}
                    <aside className="lg:col-span-1 sticky top-24">
                        <div className="bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-xl dark:shadow-black/20">
                            <h2 className="font-serif italic text-2xl text-gray-900 dark:text-white mb-2">Order Summary</h2>
                            <div className="h-px w-10 bg-[#D4AF37] mb-8" />

                            <div className="flex flex-col gap-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-gray-900 dark:text-gray-200 font-bold">${totalPrice}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Shipping</span>
                                    <span className="text-[#D4AF37] font-bold uppercase text-[10px] tracking-wider">Calculated at next step</span>
                                </div>
                                <div className="h-px bg-gray-50 dark:bg-[#242424] my-2" />
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Amount</span>
                                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tighter">
                                        ${totalPrice}
                                    </span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-3 bg-gray-900 dark:bg-[#D4AF37] text-white py-5 rounded-[1.5rem] font-bold uppercase text-[11px] tracking-[0.2em] hover:shadow-2xl transition-all duration-300 group"
                            >
                                Proceed to Checkout
                                <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </motion.button>

                            <div className="mt-6 flex items-center justify-center gap-4 opacity-30 dark:opacity-20">
                                <div className="h-px flex-1 bg-gray-400" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 italic">Golden Security</span>
                                <div className="h-px flex-1 bg-gray-400" />
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}