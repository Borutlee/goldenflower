const BASE_URL = 'https://fakestoreapi.com';

// ✅ الـ API الجديد بيرجع الـ Array والـ Object مباشرة في الـ response 
// يعني مفيش حاجة اسمها json.data خلاص يا بطل

export const getProduct = async () => {
    const response = await fetch(`${BASE_URL}/products`);
    const json = await response.json();
    return json; // 👈 رجعنا الـ json مباشرة (المصفوفة كاملة)
};

export const getProductById = async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    const json = await response.json();
    return json; // 👈 رجعنا الـ json مباشرة (الأوبجكت بتاع المنتج)
};