import { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {

    const [cartItems, setCartItems] = useState([])

    // دالة مساعدة عشان نطلع الـ ID الصح للمنتج أياً كان اسمه في الداتابيز
    const getProductId = (product) => {
        return product?.legacy_id ?? product?.id ?? product?._id ?? product?.product_id;
    };

    const addToCart = (product, quantity = 1) => {
        if (!product) return;
        
        const productId = getProductId(product);

        setCartItems(prev => {
            // ✅ المقارنة بقت بالـ ID الموحد والآمن
            const exist = prev.find(item => getProductId(item.product) === productId);

            if (exist) {
                return prev.map(item =>
                    getProductId(item.product) === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }
            else {
                return [...prev, { product, quantity }]
            }
        });
    };

    // ✅ تعديل حذف منتج عشان يستقبل الـ ID الموحد
    const removeFromCart = id => {
        setCartItems(prev => prev.filter(item => getProductId(item.product) !== id));
    };
    
    const clearCart = () => setCartItems([]);
    
    // ✅ تعديل تحديث الكمية عشان يقارن بالـ ID الموحد
    const updatequantity = (id, quantity) => {
        setCartItems(prev => prev.map(item => getProductId(item.product) === id ? { ...item, quantity } : item))
    }

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updatequantity }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}