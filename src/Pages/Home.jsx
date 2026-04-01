import { Hero } from '../Sections/Hero';
import BestSellers from '../Sections/Best';
import Feature from '../Sections/Feature';
import Cta from '../Sections/Cta';
import Products from '../Sections/Product';

const Home = () => {
    return (
        <div className="min-h-screen bg-white text-black dark:bg-slate-900 dark:text-gray-100 transition-colors duration-300">
            <Hero />
            <BestSellers />
            <Feature />
            <Cta />
            <Products />
        </div>
    );
};
export default Home;