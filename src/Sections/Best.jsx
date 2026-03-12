import { motion } from 'framer-motion';
import ProductCard from '../Components/ProductCard'; // تأكد من مسار الملف

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
        <section className="text-gray-600 body-font bg-[#fafafa] py-24 overflow-hidden">
            <div className="container px-5 mx-auto">

                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col text-center w-full mb-16"
                >
                    <h2 className="text-xs text-[#D4AF37] tracking-[0.3em] font-bold title-font mb-2 uppercase">Signature Collection</h2>
                    <h1 className="sm:text-4xl text-3xl font-black title-font text-gray-900 tracking-tight">
                        BEST <span className="text-[#D4AF37]">PERFUMES</span>
                    </h1>
                    <div className="flex mt-3 justify-center">
                        <div className="w-12 h-[2px] rounded-full bg-[#D4AF37] inline-flex"></div>
                    </div>
                </motion.div>

                {/* تعديل الجريد هنا: 
                    بما إن عندك 3 منتجات بس في الداتا، خليناها lg:grid-cols-3
                    لو هتزود منتج رابع خليها lg:grid-cols-4
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {perfumes.map((perfume, index) => (
                        <motion.div 
                            key={perfume.id} 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                        >
                            {/* استدعاء الكارت */}
                            <ProductCard product={perfume} size = {14} />
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default BestSellers;