import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../Components/ProductCard';
import { getProduct } from '../Api/ProductsAPI';
import { useNavigate } from 'react-router-dom';

const Products = () => {
    const [category, setCategory] = useState('women');
    const [allProducts, setAllProducts] = useState({ women: [], men: [] });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getProduct();

                // بنفصل المنتجات حسب الـ category
                setAllProducts({
                    women: products.filter(p => p.category === 'women').slice(0, 4),
                    men: products.filter(p => p.category === 'men').slice(0, 4),
                });
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const tabs = ['women', 'men'];

    return (
        <section className="py-24 bg-white dark:bg-[#121212] transition-colors duration-300 overflow-hidden">
            <div className="container px-5 mx-auto">

                {/* Header & Tabs */}
                <div className="flex flex-col items-center mb-20 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#D4AF37] tracking-[0.5em] uppercase text-[10px] font-bold mb-4"
                    >
                        Signature Collection
                    </motion.span>

                    <h2 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-white mb-10 italic transition-colors duration-300">
                        Our Collections
                    </h2>

                    <div className="flex gap-10 border-b border-gray-100 dark:border-gray-800 w-full max-w-xs justify-center transition-colors duration-300">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setCategory(tab)}
                                className={`relative pb-4 text-[11px] tracking-[0.4em] font-bold uppercase transition-all
                                    ${category === tab
                                        ? 'text-[#D4AF37]'
                                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tab}
                                {category === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="min-h-[600px]">
                    {loading ? (
                        <p className="text-center text-gray-400">Loading...</p>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={category}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full"
                            >
                                {allProducts[category].map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>

                {/* Explore More Button */}
                <div className="flex justify-center mt-24">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/products')}
                        className="px-14 py-4 rounded-xl bg-black dark:bg-gray-400 text-[#D4AF37] dark:text-gray-900 border-2 border-[#D4AF37] font-bold text-[12px] uppercase tracking-[0.3em] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black shadow-xl"
                    >
                        View All Collections
                    </motion.button>
                </div>

            </div>
        </section>
    );
};

export default Products;