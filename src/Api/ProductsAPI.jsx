import localProducts from '../Data/Products.json'; // 👈 استيراد ملف العطور الجديد بتاعك

// جلب كل عطور الـ Golden Flower
export const getProduct = async () => {
    return localProducts; // 👈 بيرجع الـ 20 صنف كاملين فوراً
};

// جلب عطر معين بالـ ID لصفحة SingleProduct
export const getProductById = async (id) => {
    const product = localProducts.find(p => p.product_id === Number(id) || p.id === Number(id));
    return product || localProducts[0]; // لو مالاقاهوش يرجع أول عطر كحماية
};
