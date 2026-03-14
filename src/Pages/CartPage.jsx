import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems } = useCart();

    // ━━━━ هنا هتحط الـ functions بتاعتك ━━━━
    const handleRemove = (id) => { /* TODO */ };
    const handleIncrement = (id) => { /* TODO */ };
    const handleDecrement = (id) => { /* TODO */ };
    const handleClearCart = () => { /* TODO */ };
    const totalPrice = 0; // TODO: احسبها بنفسك

    // ━━━━ Empty State ━━━━
    if (cartItems.length === 0) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 px-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <FiShoppingBag size={32} className="text-gray-300" />
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-serif italic text-gray-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-400 text-sm">Looks like you haven't added anything yet.</p>
            </div>
            <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/Golden-Flower/products')}
                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all duration-300"
            >
                <FiShoppingBag size={14} />
                Browse Products
            </motion.button>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">

                {/* ━━━━ Header ━━━━ */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <motion.button
                            onClick={() => navigate(-1)}
                            whileHover={{ x: -4 }}
                            className="flex items-center gap-2 text-gray-400 hover:text-gray-800 transition-colors text-xs font-bold uppercase tracking-widest mb-4 group"
                        >
                            <FiArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
                            Continue Shopping
                        </motion.button>
                        <h1 className="text-3xl sm:text-4xl font-serif italic text-gray-900">Your Cart</h1>
                        <div className="h-px w-14 bg-[#D4AF37] mt-2" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                    </span>
                </div>

                {/* ━━━━ Layout: Items + Summary ━━━━ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── Cart Items ── */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <AnimatePresence>
                            {cartItems.map((item, index) => (
                                <motion.div
                                    key={item.product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -40 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="bg-white rounded-[1.5rem] border border-gray-100 p-4 sm:p-5 flex gap-4 items-center shadow-sm"
                                >
                                    {/* Thumbnail */}
                                    <div
                                        onClick={() => navigate(`/products/${item.product._id}`)}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 cursor-pointer"
                                    >
                                        <img
                                            src={item.product.image || item.product.img}
                                            alt={item.product.title || item.product.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1">
                                            {item.product.category}
                                        </p>
                                        <h3 className="font-serif italic text-gray-900 text-base sm:text-lg leading-tight truncate">
                                            {item.product.title || item.product.name}
                                        </h3>
                                        <p className="text-gray-900 font-bold text-sm mt-1">
                                            ${item.product.price}
                                        </p>
                                    </div>

                                    {/* Quantity + Remove */}
                                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                        {/* Remove */}
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleRemove(item.product._id)}
                                            className="p-1.5 text-gray-300 hover:text-red-400 transition-colors duration-200"
                                        >
                                            <FiTrash2 size={15} />
                                        </motion.button>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-1 border border-gray-100 rounded-xl bg-gray-50 p-1">
                                            <button
                                                onClick={() => handleDecrement(item.product._id)}
                                                className="p-1.5 text-gray-400 hover:text-black transition-colors"
                                            >
                                                <FiMinus size={11} />
                                            </button>
                                            <span className="w-6 text-center text-xs font-bold text-gray-900">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleIncrement(item.product._id)}
                                                className="p-1.5 text-gray-400 hover:text-black transition-colors"
                                            >
                                                <FiPlus size={11} />
                                            </button>
                                        </div>

                                        {/* Subtotal */}
                                        <p className="text-xs font-black text-gray-500">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Clear Cart */}
                        <button
                            onClick={handleClearCart}
                            className="self-start text-[11px] font-bold uppercase tracking-widest text-gray-300 hover:text-red-400 transition-colors duration-200 mt-2"
                        >
                            Clear Cart
                        </button>
                    </div>

                    {/* ── Order Summary ── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[1.5rem] border border-gray-100 p-6 shadow-sm sticky top-8">
                            <h2 className="font-serif italic text-xl text-gray-900 mb-1">Order Summary</h2>
                            <div className="h-px w-10 bg-[#D4AF37] mb-6" />

                            {/* Items breakdown */}
                            <div className="flex flex-col gap-3 mb-6">
                                {cartItems.map(item => (
                                    <div key={item.product._id} className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400 truncate max-w-[60%]">
                                            {item.product.title || item.product.name}
                                            <span className="text-gray-300 ml-1">×{item.quantity}</span>
                                        </span>
                                        <span className="text-xs font-bold text-gray-700">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-100 mb-4" />

                            {/* Total */}
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total</span>
                                <span className="text-2xl font-extrabold text-gray-900">${totalPrice}</span>
                            </div>

                            {/* Checkout Button */}
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                className="w-full flex items-center justify-center gap-2.5 bg-gray-900 text-white py-4 rounded-2xl font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-[#D4AF37] transition-all duration-300 shadow-md group"
                            >
                                Proceed to Checkout
                                <FiArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </motion.button>

                            {/* Security note */}
                            <p className="text-center text-[10px] text-gray-300 mt-4 tracking-wider uppercase">
                                Secure Checkout
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}