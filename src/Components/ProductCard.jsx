import { motion } from 'framer-motion';
import { FiStar, FiArrowRight, FiEye } from "react-icons/fi";
import { GiFlowerPot, GiWaterDrop } from "react-icons/gi";
import { useState, useCallback, memo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ للتنقل لصفحة المنتج
import ProductModal from './ProductModel';

function useInView(options = {}) {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(el);
            }
        }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px", ...options });

        observer.observe(el);
        return () => observer.unobserve(el);
    }, []);

    return [ref, isInView];
}

const ProductCard = memo(({ product, size, index = 0 }) => {

    const [isOpen, setOpen] = useState(false);
    const [ref, isInView] = useInView();
    const navigate = useNavigate(); // ✅

    const handleOpen = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => setOpen(false), []);

    // ✅ بيودي على صفحة المنتج
    const handleNavigate = useCallback(() => {
        navigate(`/products/${product._id}`);
    }, [navigate, product._id]);

    return (
        <>
            {isOpen && (
                <ProductModal
                    isOpen={isOpen}
                    onClose={handleClose}
                    product={product}
                />
            )}

            <motion.div
                ref={ref}
                layout
                className="w-full group"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                exit={{ opacity: 0 }}
                transition={{
                    duration: 0.5,
                    delay: Math.min((index % 4) * 0.1, 0.3),
                    ease: "easeOut"
                }}
            >
                <div className="group bg-white border border-gray-300 p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-2">

                    {/* Image Container */}
                    <div className="relative h-64 sm:h-64 lg:h-72 rounded-[1.2rem] sm:rounded-[2rem] overflow-hidden bg-[#f9f9f9] dark:bg-zinc-800/50 mb-4 sm:mb-6 isolation-isolate">
                        <motion.img
                            loading="lazy"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            alt={product?.title || product?.name || "Product Image"}
                            className="object-cover w-full h-full block hover:will-change-transform"
                            src={product?.img || product?.image}
                        />

                        {/* Rating Badge */}
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
                            <FiStar className="text-[#D4AF37] fill-[#D4AF37]" size={10} />
                            <span className="text-[10px] font-bold dark:text-white">
                                {product.rating || "4.9"}
                            </span>
                        </div>

                        {/* Eye Button - بيفتح الـ Modal */}
                        <motion.button
                            onClick={handleOpen}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute top-12 right-3 bg-white/90 dark:bg-black/60 backdrop-blur-md p-1.5 rounded-full shadow-sm z-10 group/eye transition-colors duration-300 hover:bg-[#D4AF37]"
                        >
                            <FiEye
                                size={11}
                                className="text-gray-500 group-hover/eye:text-white transition-colors duration-300"
                            />
                        </motion.button>
                    </div>

                    {/* Info & Action Section */}
                    <div className="text-center px-1 sm:px-2">

                        {/* Category */}
                        <h3 className="text-[#D4AF37] text-[9px] sm:text-[10px] tracking-[0.3em] font-bold mb-1.5 sm:mb-2 uppercase">
                            {product.category || "Signature Scent"}
                        </h3>

                        {/* Name */}
                        <h2 className="text-gray-900 dark:text-black text-base sm:text-xl font-serif mb-1.5 sm:mb-2 italic">
                            {product.title || product.name}
                        </h2>

                        {/* Notes */}
                        <div className="flex justify-center gap-3 sm:gap-4 mb-3 sm:mb-4 opacity-70">
                            <div className="flex items-center gap-1">
                                <GiFlowerPot className="text-[#D4AF37]" size={12} />
                                <span className="text-[11px] sm:text-[13px] uppercase tracking-widest dark:text-black-500">
                                    {product.notes?.[0] ?? "Floral"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <GiWaterDrop className="text-[#D4AF37]" size={12} />
                                <span className="text-[11px] sm:text-[13px] uppercase tracking-widest dark:text-black-500">
                                    {product.notes?.[1] ?? "Oud"}
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <p className="text-gray-900 dark:text-[#D4AF37] font-bold text-base sm:text-lg mb-3 sm:mb-5">
                            ${product.price}
                        </p>

                        {/* ✅ Action Button - بيودي على صفحة المنتج */}
                        <motion.button
                            whileHover="hover"
                            whileTap={{ scale: 0.98 }}
                            className="relative w-full mt-2 sm:mt-4 py-2.5 sm:py-3 rounded-lg border border-black dark:border-[#D4AF37] bg-transparent text-black dark:text-[#D4AF37] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] overflow-hidden group"
                            onClick={handleNavigate}
                        >
                            <motion.div
                                variants={{ hover: { x: 0 } }}
                                initial={{ x: "-100%" }}
                                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                                className="absolute inset-0 bg-[#D4AF37] z-0"
                            />
                            <div className="relative z-10 flex items-center justify-center gap-2 group-hover:text-black transition-colors duration-500">
                                View Details {/* ✅ اسم أوضح من "Explore Scent" */}
                                <FiArrowRight
                                    className="opacity-70 group-hover:translate-x-1 transition-transform duration-500"
                                    size={13}
                                />
                            </div>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;