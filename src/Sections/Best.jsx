import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../Components/ProductCard';
import { getProduct } from '../Api/ProductsAPI';

const BestSellers = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const allProducts = await getProduct(); // بيجيب كل المنتجات
                const top3 = [...allProducts]
                    .sort((a, b) => b.rating - a.rating) // بيرتب من الأعلى للأقل
                    .slice(0, 3); // بياخد أول 3
                setBestSellers(top3);
            } catch (error) {
                console.error("Failed to fetch best sellers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBestSellers();
    }, []);

    return (
        <section className="body-font bg-[#fafafa] dark:bg-[#0e0e0e] transition-colors duration-300 py-24 overflow-hidden">
            <div className="container px-5 mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col text-center w-full mb-16"
                >
                    <h2 className="text-xs text-[#D4AF37] tracking-[0.3em] font-bold mb-2 uppercase">
                        Signature Collection
                    </h2>
                    <h1 className="sm:text-4xl text-3xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
                        BEST <span className="text-[#D4AF37]">PERFUMES</span>
                    </h1>
                    <div className="flex mt-3 justify-center">
                        <div className="w-12 h-[2px] rounded-full bg-[#D4AF37]" />
                    </div>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {loading ? (
                        // مؤقتاً — لو عندك ProductCardSkeleton حطها هنا
                        <p className="text-center col-span-3 text-gray-400">Loading...</p>
                    ) : (
                        bestSellers.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                            >
                                <ProductCard product={product} size={14} />
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default BestSellers;