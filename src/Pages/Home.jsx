import { Hero } from '../Sections/Hero';
import BestSellers from '../Sections/Best';
import Feature from '../Sections/Feature';
import Cta from '../Sections/Cta'; // التزمت باسم الكومبوننت بتاعك
import Products from '../Sections/Product';

// 1. استدعاء المكونات والـ Context اللي ناقصين
import ProfileHeader from '../Components/Profile/ProfileHeader'; 
import { useAuth } from '../Context/AuthContext'; 

const Home = () => {
    // 2. هنجيب بيانات اليوزر من الـ AuthContext
    const { user } = useAuth();
    
    // 3. تعريف الـ isLoggedIn بناءً على وجود الـ user
    const isLoggedIn = !!user; 

    // 4. حط عدد الأوردرات هنا (تقدر تربطه بـ state أو context الأوردرات لو عندك، أو سيبه 0 مؤقتاً)
    const ordersCount = 0; 

    return (
        <div className="min-h-screen bg-white text-black dark:bg-slate-900 dark:text-gray-100 transition-colors duration-300">
            <Hero />
            <BestSellers />
            <Feature />
            
            {/* سكشن الـ Dynamic Auth في صفحة الهوم */}
            {isLoggedIn ? (
                <section className="relative py-24 px-4 md:px-10 bg-transparent">
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0a] border border-zinc-800 py-12 px-6 sm:px-12 transition-colors duration-500 max-w-5xl mx-auto">
                        {/* استدعاء الميدر المطور بالوضعية المخصصة للهوم */}
                        <ProfileHeader isMini={true} ordersCount={ordersCount} />
                    </div>
                </section>
            ) : (
                <Cta />
            )}
            
            <Products />
        </div>
    );
};

export default Home;