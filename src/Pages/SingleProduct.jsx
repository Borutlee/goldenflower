import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiArrowLeft, FiHeart, FiShoppingBag,
    FiStar, FiMinus, FiPlus, FiShare2, FiCheck
} from 'react-icons/fi';
import { GiFlowerPot, GiWaterDrop, GiPerfumeBottle } from 'react-icons/gi';
import { getProductById, getProduct } from '../Api/ProductsAPI';
import ProductCard from '../Components/ProductCard';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/wishlistContext';


const SIZES = ['30ml', '50ml', '100ml'];
const NOTES = ['Floral', 'Oud', 'Amber', 'Musk'];
const TABS = ['Description', 'Notes', 'Reviews'];

export default function SingleProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedSize, setSelectedSize] = useState('100ml');
    const [quantity, setQuantity] = useState(1);

    const { toggleWishlist, isWishlisted } = useWishlist();
    const wished = isWishlisted(product?._id);

    const [activeTab, setActiveTab] = useState('Description');
    const [activeImg, setActiveImg] = useState(0);
    const [added, setAdded] = useState(false);

    const { addToCart } = useCart();

    useEffect(() => {
        setLoading(true);
        window.scrollTo(0, 0);

        getProductById(id)
            .then(res => {
                setProduct(res);
                setLoading(false);
                return getProduct();
            })
            .then(res => {
                if (Array.isArray(res)) {
                    const filtered = res
                        .filter(p => p._id !== id)
                        .slice(0, 4);
                    setRelated(filtered);
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleDecrement = useCallback(() => setQuantity(q => Math.max(1, q - 1)), []);
    const handleIncrement = useCallback(() => setQuantity(q => q + 1), []);
    const handleWish = useCallback(() => toggleWishlist(product), [product, toggleWishlist]);
    const handleAddToCart = useCallback(() => {
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }, [product, quantity, addToCart]);

    const images = product
        ? [product.image || product.img, product.image || product.img, product.image || product.img]
        : [];

    const totalPrice = product
        ? (parseFloat(product.price) * quantity).toFixed(2)
        : '0.00';

    // ━━━━ Loading Skeleton ━━━━
    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] py-12 px-4 sm:px-8 lg:px-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse mb-10" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-[2.5rem] animate-pulse" />
                    <div className="space-y-5 pt-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"
                                style={{ width: `${[40, 70, 55, 90, 60, 80][i]}%` }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center transition-colors duration-300">
            <p className="text-gray-400 dark:text-gray-500 font-serif italic text-xl">Product not found.</p>
        </div>
    );

    return (
        <div className="bg-gray-50 dark:bg-[#121212] min-h-screen transition-colors duration-300">

            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-8">
                <motion.button
                    onClick={() => navigate(-1)}
                    whileHover={{ x: -4 }}
                    className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group"
                >
                    <FiArrowLeft size={15} className="transition-transform group-hover:-translate-x-1 duration-300" />
                    Back
                </motion.button>
            </div>

            {/* Main Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

                {/* ── Image Gallery ── */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex flex-col gap-4"
                >
                    <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeImg}
                                src={images[activeImg]}
                                alt={product.title || product.name}
                                initial={{ opacity: 0, scale: 1.04 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="w-full h-full object-cover"
                            />
                        </AnimatePresence>

                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleWish}
                                className={`p-2.5 rounded-full backdrop-blur-md border shadow-sm transition-all duration-300
                                    ${wished
                                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500'
                                        : 'bg-white/80 dark:bg-black/40 border-white/50 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:text-red-400'
                                    }`}
                            >
                                <FiHeart size={16} className={wished ? 'fill-red-500' : ''} />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="p-2.5 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-white/50 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white shadow-sm transition-all duration-300"
                            >
                                <FiShare2 size={16} />
                            </motion.button>
                        </div>

                        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                                {product.category}
                            </span>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-3">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImg(i)}
                                className={`relative flex-1 aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300
                                    ${activeImg === i ? 'border-[#D4AF37] shadow-md' : 'border-transparent opacity-60 hover:opacity-90'}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* ── Product Info ── */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                    className="flex flex-col justify-center"
                >
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <FiStar key={i} size={13}
                                    className={i < Math.round(product.rating || 4.9)
                                        ? 'text-[#D4AF37] fill-[#D4AF37]'
                                        : 'text-gray-200 dark:text-gray-700 fill-gray-200 dark:fill-gray-700'}
                                />
                            ))}
                        </div>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-bold">
                            {product.rating || "4.9"} · 128 reviews
                        </span>
                    </div>

                    {/* ✅ Title — مرة واحدة بس */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-bold text-gray-900 dark:text-white leading-tight mb-2 transition-colors duration-300">
                        {product.title || product.name}
                    </h1>

                    <div className="h-px w-16 bg-[#D4AF37] mb-6" />

                    {/* Notes Pills */}
                    <div className="flex flex-wrap gap-2 mb-7">
                        {(product.notes || NOTES).map((note, i) => (
                            <span key={i} className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-3 py-1.5 rounded-full shadow-sm transition-colors">
                                {i % 2 === 0
                                    ? <GiFlowerPot className="text-[#D4AF37]" size={11} />
                                    : <GiWaterDrop className="text-[#D4AF37]" size={11} />
                                }
                                {note}
                            </span>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-gray-100 dark:border-gray-800 mb-5 transition-colors">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-[11px] font-bold tracking-widest uppercase relative transition-colors
                                    ${activeTab === tab ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'}`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="spUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="min-h-[70px] mb-7"
                        >
                            {activeTab === 'Description' && (
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed italic transition-colors">
                                    {product.detail || product.description || "A masterfully crafted fragrance..."}
                                </p>
                            )}
                            {activeTab === 'Notes' && (
                                <div className="flex flex-col gap-2">
                                    {[
                                        { label: 'Top', value: 'Saffron, Bergamot', icon: <GiFlowerPot className="text-[#D4AF37]" size={13} /> },
                                        { label: 'Heart', value: 'Rose, Amberwood', icon: <GiWaterDrop className="text-[#D4AF37]" size={13} /> },
                                        { label: 'Base', value: 'Oud, Sandalwood, Musk', icon: <GiPerfumeBottle className="text-[#D4AF37]" size={13} /> },
                                    ].map(n => (
                                        <div key={n.label} className="flex items-center gap-3 text-sm">
                                            {n.icon}
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 w-10">{n.label}</span>
                                            <span className="text-gray-600 dark:text-gray-300 italic">{n.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'Reviews' && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-[10px] font-black text-[#D4AF37]">S</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 mb-1">
                                            {[...Array(5)].map((_, i) => <FiStar key={i} size={10} className="text-[#D4AF37] fill-[#D4AF37]" />)}
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm italic">"This is my signature scent now..."</p>
                                        <p className="text-[10px] text-gray-300 dark:text-gray-600 font-bold mt-1 uppercase tracking-widest">Sara M. · Verified</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Size Selector */}
                    <div className="mb-6">
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Size</p>
                        <div className="flex gap-2">
                            {SIZES.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedSize(s)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200
                                        ${selectedSize === s
                                            ? 'bg-gray-900 dark:bg-[#D4AF37] text-white border-gray-900 dark:border-[#D4AF37]'
                                            : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity + Price */}
                    <div className="flex items-center justify-between mb-7">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Quantity</p>
                            <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 w-fit transition-colors">
                                <button onClick={handleDecrement} className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                                    <FiMinus size={13} />
                                </button>
                                <span className="w-8 text-center text-sm font-bold dark:text-white">{quantity}</span>
                                <button onClick={handleIncrement} className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                                    <FiPlus size={13} />
                                </button>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Total</p>
                            <p className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors">${totalPrice}</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-3">
                        <motion.button
                            onClick={handleAddToCart}
                            whileTap={{ scale: 0.97 }}
                            className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-[0.2em] transition-all duration-300 shadow-md
                                ${added
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-900 dark:bg-[#D4AF37] text-white hover:bg-[#D4AF37] dark:hover:bg-[#B8860B]'
                                }`}
                        >
                            <AnimatePresence mode="wait">
                                {added ? (
                                    <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                        className="flex items-center gap-2">
                                        <FiCheck size={15} /> Added!
                                    </motion.span>
                                ) : (
                                    <motion.span key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                        className="flex items-center gap-2">
                                        <FiShoppingBag size={15} /> Add to Cart
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        <motion.button
                            onClick={handleWish}
                            whileTap={{ scale: 0.95 }}
                            className={`p-4 rounded-2xl border transition-all duration-300
                                ${wished
                                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500'
                                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-500 hover:border-red-200 dark:hover:border-red-800 hover:text-red-400'
                                }`}
                        >
                            <FiHeart size={18} className={wished ? 'fill-red-500' : ''} />
                        </motion.button>
                    </div>
                </motion.div>
            </section>

            {/* Related Products */}
            {related.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-20 pt-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-serif italic text-gray-900 dark:text-white mb-2 transition-colors">You May Also Like</h2>
                        <div className="h-px w-14 bg-[#D4AF37] mx-auto" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {related.map((item, index) => (
                            <ProductCard
                                key={item._id}
                                product={item}
                                index={index}
                            />
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}