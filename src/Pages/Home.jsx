import { Hero } from '../Sections/Hero';
import BestSellers from '../Sections/Best';
import Feature from '../Sections/Feature';
import Cta from '../Sections/Cta';
import Products from '../Sections/Product';

const Home = () => {
    return (
        <> {/* لازم القوس الفاضي ده أو div يلم كل السكاشن */}
            <Hero />
            <BestSellers />
            <Feature />
            <Cta />
            <Products />
        </>
    );
};
export default Home;