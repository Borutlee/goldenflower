import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import heropic from '../imgs/heropic.png';

export const Hero = () => {
    const entranceDelay = 0.8;
    const Navigate = useNavigate();

    return (
        <section className="body-font bg-white dark:bg-[#121212] transition-colors duration-300 overflow-hidden">
            <div className="container mx-auto flex px-5 pt-10 pb-24 md:flex-row flex-col items-center">

                {/* النص */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: entranceDelay, ease: "easeOut" }}
                    className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center"
                >
                    <h1 className="title-font sm:text-6xl text-4xl mb-6 font-black text-gray-900 dark:text-white leading-[1.1] transition-colors duration-300">
                        Perfect Perfumes for
                        <br className="hidden lg:inline-block" />
                        <span className="text-[#D4AF37]"> Every Occasion</span>
                    </h1>

                    <p className="mb-8 leading-relaxed text-lg text-gray-500 dark:text-gray-400 max-w-lg transition-colors duration-300">
                        Elevate your space with our curated collection of golden-touched scents.
                        Premium fragrances that turn moments into memories.
                    </p>

                    <div className="flex justify-center gap-4">
                        <button className="inline-flex text-white bg-[#D4AF37] border-0 py-3 px-10 focus:outline-none hover:bg-[#B8860B] hover:shadow-xl hover:-translate-y-1 rounded-full text-lg font-bold transition-all duration-300 shadow-lg shadow-yellow-100/50"
                            onClick={() => Navigate('/products')}
                        >
                            Shop Now
                        </button>
                        <button className="inline-flex text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-3 px-10 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#B8860B] rounded-full text-lg font-medium transition-all duration-300"
                            onClick={() => Navigate('/about')}
                        >
                            Our Story
                        </button>
                    </div>
                </motion.div>

                {/* الصورة */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: entranceDelay + 0.3, ease: "easeOut" }}
                    className="relative w-full max-w-[320px] sm:max-w-[420px] lg:max-w-lg aspect-square mx- rounded-[2rem]"
                >
                    <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-50 dark:bg-yellow-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
                    <img
                        loading="lazy"
                        className="relative object-cover object-center rounded-[2rem] shadow-2xl transition-transform duration-500 w-full h-full hover:scale-[1.02] "
                        alt="Golden Perfume"
                        src={heropic}
                    />
                </motion.div>

            </div>
        </section>
    );
};