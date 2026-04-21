import { createContext, useState, useContext, useEffect } from 'react';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    // بنجيب الـ wishlist من localStorage لو موجودة
    const [wishlistItems, setWishlistItems] = useState(() => {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    // كل ما الـ wishlistItems تتغير بنحفظها في localStorage
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToWishlist = (product) => {
        setWishlistItems(prev => {
            const exist = prev.find(item => item._id === product._id);
            if (exist) return prev; // لو موجود مش بنضيفه تاني
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id) => {
        setWishlistItems(prev => prev.filter(item => item._id !== id));
    };

    // toggle — لو موجود يشيله، لو مش موجود يضيفه
    const toggleWishlist = (product) => {
        setWishlistItems(prev => {
            const exist = prev.find(item => item._id === product._id);
            if (exist) return prev.filter(item => item._id !== product._id);
            return [...prev, product];
        });
    };

    const isWishlisted = (id) => wishlistItems.some(item => item._id === id);

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}