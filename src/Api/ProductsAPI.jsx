const BASE_URL = 'https://fakestoreapiserver.reactbd.org/api';

// ✅ الـ API بيرجع { data: [...], totalProducts, totalPages, currentPage }
// يعني المنتجات موجودة في response.data مش في response مباشرة

export const getProduct = async () => {
    const response = await fetch(`${BASE_URL}/products`);
    const json = await response.json();
    return json.data; // ✅ بنرجع الـ array اللي جوه .data
};

export const getProductById = async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    const json = await response.json();
    // لو الـ endpoint رجع object مباشرة نرجعه، لو رجعه في .data نرجع .data
    return json.data || json;
};