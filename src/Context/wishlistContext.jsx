import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient'; // 👈 تأكد إن اسم الملف ومساره عندك صح

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1️⃣ أول ما الأبلكيشن يفتح، بنجيب الـ Wishlist لليوزر من الداتابيس
    useEffect(() => {
        fetchWishlist();

        // لو فتحت من كذا جهاز، الـ Realtime هيعمل Sync للمفضلة تلقائياً
        const wishlistSubscription = supabase
            .channel('public:wishlist')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'wishlist' }, () => {
                fetchWishlist();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(wishlistSubscription);
        };
    }, []);

    // دالة جلب البيانات وعمل الـ Join مع جدول المنتجات
    const fetchWishlist = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setWishlistItems([]);
                return;
            }

            // بنجيب السطور وبنربطها ببيانات المنتج الأساسية
            const { data, error } = await supabase
                .from('wishlist')
                .select(`
                    id,
                    product_id,
                    products (*) 
                `)
                .eq('user_id', user.id);

            if (error) throw error;

            // 🔁 بنهيكل المصفوفة عشان الـ UI يفهمها كمنتجات عادية
            // مهم: بنسيب legacy_id جوه الأوبجكت عشان ProductCard وباقي الكومبوننتس
            // (اللي شغالة بالـ legacy_id) تقدر تتعرف على المنتج بسهولة
            const formattedProducts = data.map(item => ({
                ...item.products,
                wishlist_row_id: item.id,
                product_uuid: item.product_id, // 👈 الـ UUID الحقيقي محفوظ هنا
            }));

            setWishlistItems(formattedProducts);
        } catch (error) {
            console.error('Error fetching wishlist:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // 🔁 دالة جديدة: تترجم legacy_id (1-20) إلى الـ UUID الحقيقي بتاع المنتج في سوبابيس
    const getProductUUID = async (legacyId) => {
        const { data, error } = await supabase
            .from('products')
            .select('id')
            .eq('legacy_id', legacyId)
            .single();

        if (error || !data) {
            console.error('Could not resolve product UUID for legacy_id:', legacyId, error?.message);
            return null;
        }

        return data.id;
    };

    // 2️⃣ إضافة منتج للمفضلة في سوبابيز
    const addToWishlist = async (product) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert('برجاء تسجيل الدخول أولاً لحفظ المنتجات!');
                return;
            }

            // 🔁 الـ ID اللي جاي من الفرونت إند (ProductCard) هو legacy_id بسيط (1, 2, 3...)
            const legacyId = product.id || product.product_id;

            // 🔁 لازم نترجمه للـ UUID الحقيقي قبل أي insert في جدول wishlist
            const productUUID = await getProductUUID(legacyId);
            if (!productUUID) {
                alert('حصل خطأ، المنتج ده غير موجود في قاعدة البيانات.');
                return;
            }

            // تحديث متفائل سريع في الـ UI عشان اليوزر ما يحسش ببطء
            setWishlistItems(prev => [...prev, { ...product, product_uuid: productUUID }]);

            const { error } = await supabase
                .from('wishlist')
                .insert([{ user_id: user.id, product_id: productUUID }]);

            if (error) {
                fetchWishlist(); // لو فشل بنرجع الداتا القديمة
                if (error.code !== '23505') throw error; // 23505 تعني إنه مضاف بالفعل
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error.message);
        }
    };

    // 3️⃣ حذف منتج من المفضلة في سوبابيز
    const removeFromWishlist = async (legacyId) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 🔁 لازم الـ UUID الحقيقي برضو عشان نحذف الصف الصحيح
            const productUUID = await getProductUUID(legacyId);
            if (!productUUID) return;

            // تحديث سريع متفائل في الـ UI
            setWishlistItems(prev => prev.filter(item => (item.id !== legacyId && item.product_id !== legacyId)));

            const { error } = await supabase
                .from('wishlist')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productUUID);

            if (error) {
                fetchWishlist(); // تراجع لو حصل مشكلة في الحذف
                throw error;
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error.message);
        }
    };

    // 4️⃣ الـ Toggle الذكي
    const toggleWishlist = async (product) => {
        const legacyId = product.id || product.product_id;
        const exists = wishlistItems.some(item => (item.id === legacyId || item.product_id === legacyId));

        if (exists) {
            await removeFromWishlist(legacyId);
        } else {
            await addToWishlist(product);
        }
    };

    const isWishlisted = (id) => {
        return wishlistItems.some(item => (item.id === id || item.product_id === id));
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, loading, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}