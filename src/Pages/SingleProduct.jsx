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
    const [wished, setWished] = useState(false);
    const [activeTab, setActiveTab] = useState('Description');
    const [activeImg, setActiveImg] = useState(0);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        setLoading(true);
        window.scrollTo(0, 0);

        // ✅ getProductById بترجع الـ object مباشرة
        getProductById(id)
            .then(res => {
                setProduct(res);
                setLoading(false);
                return getProduct();
            })
            .then(res => {
                // ✅ getProduct بترجع الـ array مباشرة
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
    const handleWish = useCallback(() => setWished(w => !w), []);

    const handleAddToCart = useCallback(() => {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }, []);

    const images = product
        ? [product.image || product.img, product.image || product.img, product.image || product.img]
        : [];

    const totalPrice = product
        ? (parseFloat(product.price) * quantity).toFixed(2)
        : '0.00';

    // ━━━━ Loading Skeleton ━━━━
    if (loading) return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse mb-10" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="aspect-square bg-gray-200 rounded-[2.5rem] animate-pulse" />
                    <div className="space-y-5 pt-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded-full animate-pulse"
                                style={{ width: `${[40, 70, 55, 90, 60, 80][i]}%` }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-400 font-serif italic text-xl">Product not found.</p>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-8">
                <motion.button
                    onClick={() => navigate(-1)}
                    whileHover={{ x: -4 }}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-800 transition-colors text-xs font-bold uppercase tracking-widest group"
                >
                    <FiArrowLeft size={15} className="transition-transform group-hover:-translate-x-1 duration-300" />
                    Back
                </motion.button>
            </div>

            {/* Main Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

                {/* Image Gallery */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex flex-col gap-4"
                >
                    <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 shadow-sm">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeImg}
                                src={images[activeImg]}
                                alt={product.name}
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
                                        ? 'bg-red-50 border-red-200 text-red-500'
                                        : 'bg-white/80 border-white/50 text-gray-400 hover:text-red-400'
                                    }`}
                            >
                                <FiHeart size={16} className={wished ? 'fill-red-500' : ''} />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="p-2.5 rounded-full bg-white/80 backdrop-blur-md border border-white/50 text-gray-400 hover:text-gray-700 shadow-sm transition-all duration-300"
                            >
                                <FiShare2 size={16} />
                            </motion.button>
                        </div>

                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full">
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

                {/* Product Info */}
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
                                        : 'text-gray-200 fill-gray-200'}
                                />
                            ))}
                        </div>
                        <span className="text-[11px] text-gray-400 font-bold">
                            {product.rating || "4.9"} · 128 reviews
                        </span>
                    </div>

                    {/* Name */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic text-gray-900 leading-tight mb-2">
                        {product.name}
                    </h1>

                    <div className="h-px w-16 bg-[#D4AF37] mb-6" />

                    {/* Notes Pills */}
                    <div className="flex flex-wrap gap-2 mb-7">
                        {(product.notes || NOTES).map((note, i) => (
                            <span key={i} className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold text-gray-500 bg-white border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
                                {i % 2 === 0
                                    ? <GiFlowerPot className="text-[#D4AF37]" size={11} />
                                    : <GiWaterDrop className="text-[#D4AF37]" size={11} />
                                }
                                {note}
                            </span>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-gray-100 mb-5">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-[11px] font-bold tracking-widest uppercase relative transition-colors
                                    ${activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
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
                                <p className="text-gray-500 text-sm leading-relaxed italic">
                                    {product.detail || product.description || "A masterfully crafted fragrance, blending rare ingredients to create an unforgettable signature scent that lingers with elegance."}
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
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-10">{n.label}</span>
                                            <span className="text-gray-600 italic">{n.value}</span>
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
                                        <p className="text-gray-500 text-sm italic">"This is my signature scent now. Lasts all day and I get compliments every time."</p>
                                        <p className="text-[10px] text-gray-300 font-bold mt-1 uppercase tracking-widest">Sara M. · Verified</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Size Selector */}
                    <div className="mb-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Size</p>
                        <div className="flex gap-2">
                            {SIZES.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedSize(s)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200
                                        ${selectedSize === s
                                            ? 'bg-gray-900 text-white border-gray-900'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
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
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Quantity</p>
                            <div className="flex items-center gap-1 border border-gray-200 rounded-xl bg-white w-fit">
                                <button onClick={handleDecrement} className="p-2.5 text-gray-400 hover:text-black transition-colors">
                                    <FiMinus size={13} />
                                </button>
                                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                                <button onClick={handleIncrement} className="p-2.5 text-gray-400 hover:text-black transition-colors">
                                    <FiPlus size={13} />
                                </button>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                            <p className="text-3xl font-extrabold text-gray-900">${totalPrice}</p>
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
                                    : 'bg-gray-900 text-white hover:bg-[#D4AF37]'
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
                                    ? 'bg-red-50 border-red-200 text-red-500'
                                    : 'bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
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
                        <h2 className="text-2xl sm:text-3xl font-serif italic text-gray-900 mb-2">You May Also Like</h2>
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