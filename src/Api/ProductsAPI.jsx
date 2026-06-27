import { supabase } from '../supabase/supabaseClient'; // 👈 تأكد إن المسار ده مطابق لمكان supabaseClient عندك

// 🔁 دالة بسيطة تحوّل صف سوبابيس (legacy_id, name...) لشكل يفهمه باقي الموقع (id, title...)
// كده مش محتاجين نعدل كل ProductCard/SingleProduct/Products.js تاني، الشكل النهائي زي القديم بالظبط
const formatProduct = (row) => ({
    id: row.legacy_id,          // 👈 الموقع شغال بالـ id البسيط (1, 2, 3...) في كل مكان
    db_id: row.id,               // 👈 الـ UUID الحقيقي، محتفظين به لو احتجناه (مثلاً في الـ Wishlist)
    name: row.name,
    title: row.name,             // بعض الكومبوننتس بتستخدم title، فبنوفرها هنا كمان
    description: row.description,
    price: row.price,
    old_price: row.old_price,
    image: row.image,
    category: row.category,
    rating: row.rating,
    stock: row.stock,
    availability: row.availability,
    brand: row.brand,
    unit: row.unit,
});

// جلب كل المنتجات من سوبابيس
export const getProduct = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('legacy_id', { ascending: true });

    if (error) {
        console.error('Error fetching products:', error.message);
        return [];
    }

    return data.map(formatProduct);
};

// جلب منتج واحد بالـ ID البسيط (legacy_id)
export const getProductById = async (id) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('legacy_id', Number(id))
        .single();

    if (error || !data) {
        console.error('Error fetching product by id:', error?.message);
        return null;
    }

    return formatProduct(data);
};