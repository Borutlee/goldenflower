import { createContext, useState , useContext } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {

    const [cartItems, setCartItems] = useState([])

    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
            const exist = prev.find(item => item.product._id === product._id);

            if (exist) {
                return prev.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }
            else {
                return [...prev, { product, quantity }]
            }
        }
        )
    }

    return (
        <CartContext.Provider value={{ cartItems, addToCart }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}