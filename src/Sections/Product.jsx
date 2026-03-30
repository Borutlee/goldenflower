import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../Components/ProductCard';
import { useNavigate } from 'react-router-dom';


const Products = () => {
  const [category, setCategory] = useState('MEN');
  const navigate = useNavigate();


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // سرعنا الـ stagger شوية عشان السكرول يبقى ألطف
      },
    },
  };

  const allProducts = {
    MEN: [
      { id: 1, name: "Mystic Oud", price: "210.00", rating: "4.9", notes: ["Oud", "Leather"], img: "https://dummyimage.com/500x700/000/fff&text=Mystic+Oud" },
      { id: 2, name: "Royal Leather", price: "195.00", rating: "4.8", notes: ["Amber", "Smoke"], img: "https://dummyimage.com/500x700/000/fff&text=Royal+Leather" },
      { id: 3, name: "Desert Sand", price: "180.00", rating: "4.7", notes: ["Sand", "Spices"], img: "https://dummyimage.com/500x700/000/fff&text=Desert+Sand" },
      { id: 4, name: "Silver Birch", price: "165.00", rating: "4.9", notes: ["Wood", "Citrus"], img: "https://dummyimage.com/500x700/000/fff&text=Silver+Birch" },
    ],
    WOMEN: [
      { id: 5, name: "Golden Lily", price: "220.00", rating: "5.0", notes: ["Lily", "Musk"], img: "https://dummyimage.com/500x700/000/fff&text=Golden+Lily" },
      { id: 6, name: "Rose Velvet", price: "185.00", rating: "4.9", notes: ["Rose", "Vanilla"], img: "https://dummyimage.com/500x700/000/fff&text=Rose+Velvet" },
      { id: 7, name: "Night Jasmine", price: "210.00", rating: "4.8", notes: ["Jasmine", "Mint"], img: "https://dummyimage.com/500x700/000/fff&text=Night+Jasmine" },
      { id: 8, name: "Vanilla Sky", price: "175.00", rating: "4.7", notes: ["Vanilla", "Sugar"], img: "https://dummyimage.com/500x700/000/fff&text=Vanilla+Sky" },
    ]
  };

  return (
    <section className="py-24 bg-transparent overflow-hidden">
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
          <h2 className="text-4xl md:text-5xl font-serif text-black mb-10 italic">
            Our Collections
          </h2>

          <div className="flex gap-10 border-b border-gray-100 w-full max-w-xs justify-center">
            {['MEN', 'WOMEN'].map((tab) => (
              <button
                key={tab}
                onClick={() => setCategory(tab)}
                className={`relative pb-4 text-[11px] tracking-[0.4em] font-bold transition-all ${
                  category === tab ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-gray-600'
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

        {/* Products Grid - التعديل الجوهري هنا */}
        <div className="min-h-[600px]"> {/* ارتفاع ثابت يمنع قفزة الصفحة عند التبديل */}
          <AnimatePresence mode="wait">
            <motion.div
              key={category}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              // استخدام Grid بدلاً من flex-wrap لضمان تناسق الـ ProductCard
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full"
            >
              {allProducts[category].map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Explore More Button */}
        <div className="flex justify-center mt-24">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick = {() => navigate('/products')}
            className="px-14 py-4 rounded-xl bg-black text-[#D4AF37] border-2 border-[#D4AF37] font-bold text-[12px] uppercase tracking-[0.3em] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black shadow-xl"
          >
            View All Collections
          </motion.button>
        </div>

      </div>
    </section>
  );
};

export default Products;