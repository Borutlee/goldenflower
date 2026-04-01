import { motion } from 'framer-motion';
import ProductCard from '../Components/ProductCard';

const BestSellers = () => {
    const perfumes = [
        {
            id: 1,
            name: "Oud Royale",
            category: "Oriental",
            price: "150.00",
            img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=500"
        },
        {
            id: 2,
            name: "Golden Amber",
            category: "Luxury Edition",
            price: "185.00",
            img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=500"
        },
        {
            id: 3,
            name: "Midnight Musk",
            category: "Night Wear",
            price: "135.00",
            img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800"
        }
    ];

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
                    {perfumes.map((perfume, index) => (
                        <motion.div
                            key={perfume.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                        >
                            <ProductCard product={perfume} size={14} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestSellers;