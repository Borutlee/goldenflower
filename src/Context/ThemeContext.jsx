import { useContext, createContext, useState, useEffect } from 'react';

// 1. خلي اسم الكونتكست يبدأ بحرف كبير (أفضل للبرمجة)
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    // الـ useEffect وظيفتها بس تغير الكلاس في الـ HTML
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    // 2. الدالة دي لازم تكون بره الـ useEffect
    const toggleTheme = () => setIsDark(prev => !prev);
    // 3. الـ return لازم يكون هنا (بره الـ useEffect)
    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);