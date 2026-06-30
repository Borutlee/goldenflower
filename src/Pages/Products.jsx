import { getProduct } from "../Api/ProductsAPI";
import { useState, useEffect, useMemo, useCallback } from 'react';
import ProductCard from "../Components/ProductCard";
import ProductCardSkeleton from "../Components/ProductCardSkeleton";
import { useSearchParams } from 'react-router-dom';
import { FiSliders, FiX, FiSearch } from 'react-icons/fi';

const PRODUCT_NOTES = ["Floral", "Luxury"];

function Products() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // ━━━━ States الفلتر الأساسية ━━━━
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sort, setSort] = useState('');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // أقصى سعر جاي من الـ API
    const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState(5000);

    // الـ States اللي بيكتب فيها العميل (سريعة جداً ومستحيل تهرب الفوكس)
    const [inputMin, setInputMin] = useState('');
    const [inputMax, setInputMax] = useState('');

    // الـ States المفلترة الفعالية بعد الـ Debounce
    const [debouncedMin, setDebouncedMin] = useState(0);
    const [debouncedMax, setDebouncedMax] = useState(100000);

    // 1. Debounce للسيرش بار
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // 2. Debounce للـ Price Inputs
    useEffect(() => {
        const handler = setTimeout(() => {
            const min = inputMin === '' ? 0 : Number(inputMin);
            const max = inputMax === '' ? absoluteMaxPrice : Number(inputMax);
            setDebouncedMin(min);
            setDebouncedMax(max);
        }, 500);
        return () => clearTimeout(handler);
    }, [inputMin, inputMax, absoluteMaxPrice]);

    // جلب البيانات من الـ API
    useEffect(() => {
        getProduct()
            .then(res => {
                setProducts(res);
                if (res.length > 0) {
                    const maxPrice = Math.max(...res.map(p => p.price || 0));
                    setAbsoluteMaxPrice(maxPrice);
                    setDebouncedMax(maxPrice);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // ربط فئة الـ URL
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setSelectedCategories([categoryFromUrl]);
        }
    }, [searchParams]);

    // استخراج الفئات الفريدة
    const categoriesOptions = useMemo(() => {
        const list = products.map(item => item.category).filter(Boolean);
        return [...new Set(list)];
    }, [products]);

    const handleCategoryToggle = useCallback((cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    }, []);

    // ريست الفلاتر
    const handleResetFilters = useCallback(() => {
        setSelectedCategories([]);
        setInputMin('');
        setInputMax('');
        setDebouncedMin(0);
        setDebouncedMax(absoluteMaxPrice);
        setInStockOnly(false);
        setSearchQuery('');
        setDebouncedSearchQuery('');
        setSort('');
    }, [absoluteMaxPrice]);

    // ━━━━ منطق الفلترة والترتيب ━━━━
    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        if (debouncedSearchQuery.trim() !== '') {
            result = result.filter(p => 
                (p.title || p.name || '').toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            );
        }

        if (selectedCategories.length > 0) {
            result = result.filter(p => selectedCategories.includes(p.category));
        }

        result = result.filter(p => p.price >= debouncedMin && p.price <= debouncedMax);

        if (inStockOnly) {
            result = result.filter(p => p.stock > 0);
        }

        if (sort === "low-to-high") result.sort((a, b) => a.price - b.price);
        else if (sort === "high-to-low") result.sort((a, b) => b.price - a.price);

        return result;
    }, [products, debouncedSearchQuery, selectedCategories, debouncedMin, debouncedMax, inStockOnly, sort]);

    return (
        <div className="bg-gray-50 dark:bg-[#121212] min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                
                {/* ━━━━ السطر العلوي ━━━━ */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 dark:border-gray-900 pb-8 mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-serif italic text-gray-900 dark:text-white mb-2">
                            Our Collection
                        </h1>
                        <p className="text-gray-400 text-xs">
                            Discover luxury niche perfumes curated for your golden moments.
                        </p>
                    </div>

                    <div className="hidden xl:flex flex-1 justify-center px-8 text-center">
                        <p className="font-serif italic text-sm text-[#D4AF37]/80 tracking-wide max-w-md border-x border-gray-800/50 px-6 py-1">
                            "Where elegance meets fragrance, and every scent tells a golden story."
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto md:max-w-md flex-1 md:justify-end">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search fragrance..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] text-sm focus:outline-none focus:border-[#D4AF37] text-gray-900 dark:text-white transition-all shadow-sm"
                            />
                            <FiSearch className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                        </div>

                        <button
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm whitespace-nowrap"
                        >
                            <FiSliders size={14} /> Filters
                        </button>
                    </div>
                </div>

                {/* ━━━━ الهيكل الأساسي ━━━━ */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    
                    {/* Desktop Sidebar (حطينا الكود جواه علطول عشان الفوكس ميهربش) */}
                    <aside className="hidden lg:block lg:col-span-1 sticky top-24 bg-white dark:bg-[#1A1A1A] rounded-[2rem] border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                        <div className="flex flex-col gap-8">
                            {/* Sort */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100 mb-3">Sort By</h3>
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] text-xs font-serif italic text-gray-600 dark:text-gray-300 focus:outline-none focus:border-[#D4AF37] cursor-pointer shadow-sm"
                                >
                                    <option value="">Default Sorting</option>
                                    <option value="low-to-high">Price: Low to High</option>
                                    <option value="high-to-low">Price: High to Low</option>
                                </select>
                            </div>

                            {/* Categories */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100 mb-3">Categories</h3>
                                <div className="flex flex-col gap-2.5">
                                    {categoriesOptions.map(cat => (
                                        <label key={`desktop-${cat}`} className="flex items-center gap-3 cursor-pointer group text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => handleCategoryToggle(cat)}
                                                className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37]"
                                            />
                                            <span className="capitalize">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter (الـ Inputs الثابتة والطلقة) */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100 mb-3">Price Range (EGP)</h3>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={inputMin}
                                        onChange={(e) => setInputMin(e.target.value)}
                                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none focus:border-[#D4AF37] transition-colors shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-400"
                                    />
                                    <span className="text-gray-400 text-xs font-serif italic">to</span>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder={absoluteMaxPrice.toString()}
                                        value={inputMax}
                                        onChange={(e) => setInputMax(e.target.value)}
                                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none focus:border-[#D4AF37] transition-colors shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-400"
                                    />
                                </div>
                                <p className="text-[10px] text-[#D4AF37] mt-2 font-serif italic tracking-wide">
                                    Filtering: EGP {debouncedMin} - EGP {debouncedMax}
                                </p>
                            </div>

                            {/* Availability */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100 mb-3">Availability</h3>
                                <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={inStockOnly}
                                        onChange={(e) => setInStockOnly(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37]"
                                    />
                                    <span>In Stock Only</span>
                                </label>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={handleResetFilters}
                                className="w-full py-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-red-500 hover:text-red-500 transition-all duration-300"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </aside>

                    {/* منطقة عرض المنتجات */}
                    <main className="lg:col-span-3">
                        {filteredAndSortedProducts.length === 0 && !loading ? (
                            <div className="text-center py-20 bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                                <p className="font-serif italic text-gray-400 text-lg">No products match your selected criteria.</p>
                                <button onClick={handleResetFilters} className="mt-4 text-xs font-bold uppercase tracking-wider text-[#D4AF37] underline">Reset Filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                {loading
                                    ? Array.from({ length: 6 }).map((_, i) => (
                                        <ProductCardSkeleton key={i} />
                                    ))
                                    : filteredAndSortedProducts.map((item, index) => (
                                        <ProductCard
                                            key={item.id}
                                            product={item}
                                            index={index}
                                            notes={PRODUCT_NOTES}
                                        />
                                    ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* ━━━━ Mobile Filter Drawer ━━━━ */}
            <div className={`fixed inset-0 z-[150] lg:hidden transition-all duration-300 ${isMobileFilterOpen ? 'visible' : 'invisible pointer-events-none'}`}>
                <div 
                    className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0'}`} 
                    onClick={() => setIsMobileFilterOpen(false)}
                />
                
                <div className={`relative flex flex-col w-full max-w-xs h-full bg-white dark:bg-[#1A1A1A] p-6 shadow-xl overflow-y-auto z-10 transition-transform duration-300 ease-out transform ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                        <h2 className="font-serif italic text-lg text-gray-900 dark:text-white">Filters</h2>
                        <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-gray-400 hover:text-black dark:hover:text-white">
                            <FiX size={20} />
                        </button>
                    </div>
                    
                    {/* كود فلتر الموبايل منفصل تماماً عشان نضمن الثبات */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100 mb-3">Sort By</h3>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] text-xs font-serif italic text-gray-600 dark:text-gray-300 focus:outline-none"
                            >
                                <option value="">Default Sorting</option>
                                <option value="low-to-high">Price: Low to High</option>
                                <option value="high-to-low">Price: High to Low</option>
                            </select>
                        </div>

                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100 mb-3">Categories</h3>
                            <div className="flex flex-col gap-2.5">
                                {categoriesOptions.map(cat => (
                                    <label key={`mobile-${cat}`} className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() => handleCategoryToggle(cat)}
                                            className="w-4 h-4 rounded border-gray-300 text-[#D4AF37] accent-[#D4AF37]"
                                        />
                                        <span className="capitalize">{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100 mb-3">Price Range (EGP)</h3>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={inputMin}
                                    onChange={(e) => setInputMin(e.target.value)}
                                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none"
                                />
                                <span className="text-gray-400 text-xs">to</span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder={absoluteMaxPrice.toString()}
                                    value={inputMax}
                                    onChange={(e) => setInputMax(e.target.value)}
                                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100 mb-3">Availability</h3>
                            <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-[#D4AF37] accent-[#D4AF37]"
                                />
                                <span>In Stock Only</span>
                            </label>
                        </div>

                        <button
                            onClick={handleResetFilters}
                            className="w-full py-3 rounded-xl border border-dashed text-[10px] font-black uppercase tracking-widest text-gray-400"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default Products;