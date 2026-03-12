import { getProduct } from "../Api/ProductsAPI";
import { useState, useEffect, useMemo, useCallback } from 'react'
import ProductCard from "../Components/ProductCard";
import ProductCardSkeleton from "../Components/ProductCardSkeleton";

const PRODUCT_NOTES = ["Floral", "Luxury"];

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sort, setSort] = useState('');

    const alloptions = useMemo(() => {
        const categorylist = products.map(item => item.category);
        const uniqueCategories = [...new Set(categorylist)];
        return ["All", ...uniqueCategories];
    }, [products]);

    const sortedProducts = useMemo(() => {
        const filtered = selectedCategory === 'All'
            ? products
            : products.filter(p => p.category === selectedCategory);

        return [...filtered].sort((a, b) => {
            if (sort === "low-to-high") return a.price - b.price;
            if (sort === "high-to-low") return b.price - a.price;
            return 0;
        });
    }, [products, selectedCategory, sort]);

    const handleCategoryChange = useCallback((cat) => {
        setSelectedCategory(cat);
    }, []);

    const handleSortChange = useCallback((e) => {
        setSort(e.target.value);
    }, []);

    useEffect(() => {
        getProduct()
            .then(res => {
                // ✅ الـ API بيرجع الـ array مباشرة مش في .data
                setProducts(res);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Our Collection</h1>
                <div className="h-1 w-20 bg-yellow-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 italic">Handpicked flowers and fashion for your golden moments</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-evenly items-center sm:items-end gap-4 mb-10 max-w-7xl mx-auto px-4">

                {/* Category Pills */}
                <div className="relative w-full sm:w-auto">
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2 ml-1 font-bold">
                        category
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {alloptions.map(cat => {
                            const isActive = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`py-2 px-4 rounded-full border text-[12px] tracking-widest capitalize transition-all duration-200
                                        ${isActive
                                            ? "bg-yellow-600 text-white border-yellow-600"
                                            : "bg-transparent text-gray-500 border-gray-300 hover:border-gray-400 hover:text-gray-700"
                                        }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Sort By */}
                <div className="relative w-full sm:w-64">
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2 ml-1 font-bold">
                        Sort By
                    </label>
                    <select
                        onChange={handleSortChange}
                        className="w-full bg-white border border-gray-200 text-gray-800 py-3 px-4 pr-8 rounded-xl 
                            appearance-none cursor-pointer focus:outline-none focus:border-[#D4AF37] 
                            transition-all duration-300 text-xs font-serif italic tracking-wider shadow-sm hover:shadow-md"
                    >
                        <option value="">Default</option>
                        <option value="high-to-low">Price: High to Low</option>
                        <option value="low-to-high">Price: Low to High</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-[#D4AF37]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>

            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))
                    : sortedProducts.map((item, index) => (
                        <ProductCard
                            key={item._id}
                            product={item}
                            index={index}
                            notes={PRODUCT_NOTES}
                        />
                    ))}
            </div>

        </div>
    );
}

export default Products;