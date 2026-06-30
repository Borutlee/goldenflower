import { getProduct } from "../Api/ProductsAPI";
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ProductCard from "../Components/ProductCard";
import ProductCardSkeleton from "../Components/ProductCardSkeleton";
import { useSearchParams } from 'react-router-dom';
import { FiSliders, FiX, FiSearch } from 'react-icons/fi';

const PRODUCT_NOTES = ["Floral", "Luxury"];

function Products() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // ━━━━ States الفلتر ━━━━
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
    const [currentMaxPrice, setCurrentMaxPrice] = useState(5000);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sort, setSort] = useState('');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // الـ State اللي هتعرض الرقم فوق السلايدر فقط عشان نحدثه لحظياً
    const [displayMaxPrice, setDisplayMaxPrice] = useState(5000);
    
    // المرجع (Ref) بتاع السلايدر للتحكم المباشر في الـ DOM منعاً للتهنيج
    const sliderRef = useRef(null);

    // دالة الـ Debounce لمنع تقطيع السيرش
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // جلب البيانات من الـ API
    useEffect(() => {
        getProduct()
            .then(res => {
                setProducts(res);
                if (res.length > 0) {
                    const maxPrice = Math.max(...res.map(p => p.price || 0));
                    setCurrentMaxPrice(maxPrice);
                    setPriceRange(prev => ({ ...prev, max: maxPrice }));
                    setDisplayMaxPrice(maxPrice);
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

    // تفعيل اختيار الفئات المتعددة
    const handleCategoryToggle = useCallback((cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    }, []);

    // عمل ريست لكل الفلاتر
    const handleResetFilters = useCallback(() => {
        setSelectedCategories([]);
        setPriceRange({ min: 0, max: currentMaxPrice });
        setDisplayMaxPrice(currentMaxPrice);
        if (sliderRef.current) sliderRef.current.value = currentMaxPrice;
        setInStockOnly(false);
        setSearchQuery('');
        setDebouncedSearchQuery('');
        setSort('');
    }, [currentMaxPrice]);

    // ━━━━ منطق الفلترة والترتيب الذكي ━━━━
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

        result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

        if (inStockOnly) {
            result = result.filter(p => p.stock > 0);
        }

        if (sort === "low-to-high") result.sort((a, b) => a.price - b.price);
        else if (sort === "high-to-low") result.sort((a, b) => b.price - a.price);

        return result;
    }, [products, debouncedSearchQuery, selectedCategories, priceRange, inStockOnly, sort]);

    // محتوى الـ Sidebar المشترك
    const FilterSidebarContent = () => (
        <div className="flex flex-col gap-8">
            {/* Sorting Box */}
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
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
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

            {/* Price Range Slider - الحل السحري بالـ useRef والـ DOM المباشر */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">Price Range</h3>
                    <span className="text-xs font-serif italic text-[#D4AF37]">Max: EGP {displayMaxPrice}</span>
                </div>
                <input
                    ref={sliderRef}
                    type="range"
                    min="0"
                    step = '1'
                    max={currentMaxPrice}
                    defaultValue={priceRange.max}
                    // هنا بنحدث الرقم رقم برقم في الـ UI لحظياً وبنعومة تامة وبدون أي Re-render يعطل إيدك
                    onInput={(e) => setDisplayMaxPrice(Number(e.target.value))}
                    // الفلترة الحقيقية بتشتغل وتلف على المنتجات "فقط" أول ما تسيب السلايدر
                    onMouseUp={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    onTouchEnd={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-2">
                    <span>EGP 0</span>
                    <span>EGP {currentMaxPrice}</span>
                </div>
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
    );

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

                    {/* شريط البحث */}
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
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1 sticky top-24 bg-white dark:bg-[#1A1A1A] rounded-[2rem] border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                        <FilterSidebarContent />
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
                    <FilterSidebarContent />
                </div>
            </div>
            
        </div>
    );
}

export default Products;