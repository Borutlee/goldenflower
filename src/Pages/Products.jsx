import { getProduct } from "../Api/ProductsAPI";
import { useState, useEffect, useMemo, useCallback } from 'react';
import ProductCard from "../Components/ProductCard";
import ProductCardSkeleton from "../Components/ProductCardSkeleton";
import Select from 'react-select';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../Context/ThemeContext';

const PRODUCT_NOTES = ["Floral", "Luxury"];

const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'high-to-low', label: 'Price: High to Low' },
    { value: 'low-to-high', label: 'Price: Low to High' },
];

function Products() {
    const [searchParams] = useSearchParams();
    const { isDark } = useTheme();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sort, setSort] = useState('');

    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        }
    }, [searchParams]);

    const customStyles = {
        control: (base, state) => ({
            ...base,
            background: isDark ? "#1f2937" : "#ffffff",
            borderColor: state.isFocused ? "#D4AF37" : isDark ? "#374151" : "#d1d5db",
            borderRadius: "0.75rem",
            padding: "2px",
            boxShadow: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": { borderColor: "#D4AF37" }
        }),
        menu: (base) => ({
            ...base,
            background: isDark ? "#1f2937" : "#ffffff",
            borderRadius: "0.75rem",
            overflow: "hidden",
            zIndex: 50,
            border: isDark ? "none" : "1px solid #e5e7eb",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }),
        option: (base, state) => ({
            ...base,
            background: state.isSelected ? "#D4AF37" : state.isFocused
                ? isDark ? "#374151" : "#f3f4f6"
                : "transparent",
            color: state.isSelected ? "white" : isDark ? "#d1d5db" : "#374151",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "serif",
            "&:active": { background: "#D4AF37" }
        }),
        singleValue: (base) => ({
            ...base,
            color: "#D4AF37",
            fontStyle: "italic",
            fontSize: "12px",
            fontFamily: "serif"
        }),
        placeholder: (base) => ({
            ...base,
            color: isDark ? "#9ca3af" : "#6b7280",
            fontSize: "12px",
            fontFamily: "serif"
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (base) => ({
            ...base,
            color: "#D4AF37",
            "&:hover": { color: "#D4AF37" }
        })
    };

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

    const handleCategoryChange = useCallback((cat) => setSelectedCategory(cat), []);

    useEffect(() => {
        getProduct()
            .then(res => {
                setProducts(res);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="bg-gray-50 dark:bg-[#121212] min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">

            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                    Our Collection
                </h1>
                <div className="h-1 w-20 bg-yellow-600 mx-auto" />
                <p className="mt-4 text-gray-600 dark:text-gray-400 italic transition-colors duration-300">
                    Handpicked flowers and fashion for your golden moments
                </p>
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
                                            : "bg-transparent text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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
                    <Select
                        options={sortOptions}
                        defaultValue={sortOptions[0]}
                        onChange={(selected) => setSort(selected.value)}
                        styles={customStyles}
                        isSearchable={false}
                        placeholder="Select Sort"
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
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