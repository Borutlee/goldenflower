import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IoFlowerOutline } from 'react-icons/io5';
import { FiArrowRight } from 'react-icons/fi';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' }
    })
};

const VALUES = [
    {
        icon: '✦',
        title: 'Crafted with Intention',
        desc: 'Every piece in our collection is handpicked with care — chosen not just for beauty, but for the feeling it creates.'
    },
    {
        icon: '◈',
        title: 'Luxury Within Reach',
        desc: 'We believe elegance shouldn\'t be exclusive. Our mission is to bring refined taste to everyday moments.'
    },
    {
        icon: '❋',
        title: 'Built on Trust',
        desc: 'We\'re a small team with big values. Honesty, quality, and your satisfaction come before everything else.'
    },
];

const STATS = [
    { number: '500+', label: 'Products Curated' },
    { number: '2', label: 'Founders' },
    { number: '1', label: 'Big Dream' },
];

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-[#121212] min-h-screen transition-colors duration-300">

            {/* ━━━━ Hero ━━━━ */}
            <section className="relative bg-gray-900 overflow-hidden py-20 sm:py-28">
                {/* Decorative Flowers */}
                <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <IoFlowerOutline
                            key={i}
                            className="absolute text-[#D4AF37]"
                            style={{
                                fontSize: `${80 + i * 40}px`,
                                top: `${[10, 50, 20, 70, 40, 80][i]}%`,
                                left: `${[5, 80, 40, 15, 65, 90][i]}%`,
                                transform: `rotate(${i * 30}deg)`
                            }}
                        />
                    ))}
                </div>

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                    >
                        <p className="text-[#D4AF37] text-[11px] font-black uppercase tracking-[0.4em] mb-6">
                            Our Story
                        </p>
                        <h1 className="text-4xl sm:text-6xl font-serif italic text-white leading-tight mb-6">
                            Born from a passion<br />for golden moments
                        </h1>
                        <div className="h-px w-16 bg-[#D4AF37] mx-auto mb-6" />
                        <p className="text-gray-400 text-base leading-relaxed max-w-xl mx-auto">
                            Golden Flower started as a simple idea between two friends — that beauty, elegance, and luxury shouldn't be out of reach for anyone.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ━━━━ Stats ━━━━ */}
            <section className="bg-white dark:bg-[#1A1A1A] border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-3 gap-6">
                    {STATS.map((s, i) => (
                        <motion.div
                            key={s.label}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={i}
                            className="text-center"
                        >
                            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-1 transition-colors">
                                {s.number}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-bold">
                                {s.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ━━━━ Story ━━━━ */}
            <section className="max-w-5xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Image */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-200 dark:bg-gray-800 relative shadow-2xl">
                            <img
                                src="https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=800"
                                alt="Golden Flower"
                                className="w-full h-full object-cover"
                            />
                            {/* Gold accent box */}
                            <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-sm px-4 py-3 rounded-2xl border border-transparent dark:border-gray-800 transition-colors">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Est. 2024</p>
                                <p className="text-sm font-serif italic text-gray-800 dark:text-gray-200">Cairo, Egypt</p>
                            </div>
                        </div>
                        {/* Decorative background box */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-[#D4AF37]/30 rounded-2xl -z-10" />
                    </motion.div>

                    {/* Text Section */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={1}
                    >
                        <p className="text-[#D4AF37] text-[11px] font-black uppercase tracking-[0.3em] mb-4">Who We Are</p>
                        <h2 className="text-3xl font-serif italic text-gray-900 dark:text-white mb-4 leading-tight transition-colors">
                            A small team with a big vision
                        </h2>
                        <div className="h-px w-10 bg-[#D4AF37] mb-6" />
                        <div className="flex flex-col gap-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed transition-colors">
                            <p>
                                We started Golden Flower because we were tired of choosing between quality and affordability. We believed there had to be a better way — and so we built it.
                            </p>
                            <p>
                                Every product you find here has been carefully selected by us personally. If it doesn't meet our standard, it doesn't make it to the collection. Simple as that.
                            </p>
                            <p>
                                We're still at the beginning of this journey, and we're grateful for every single person who shops with us and believes in what we're building.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ━━━━ Values ━━━━ */}
            <section className="bg-white dark:bg-[#1A1A1A] py-20 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <p className="text-[#D4AF37] text-[11px] font-black uppercase tracking-[0.3em] mb-3">What We Stand For</p>
                        <h2 className="text-3xl font-serif italic text-gray-900 dark:text-white transition-colors">Our Values</h2>
                        <div className="h-px w-10 bg-[#D4AF37] mx-auto mt-3" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {VALUES.map((v, i) => (
                            <motion.div
                                key={v.title}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={i}
                                className="bg-gray-50 dark:bg-[#242424] rounded-[1.5rem] p-6 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl dark:hover:shadow-black/40"
                            >
                                <span className="text-2xl text-[#D4AF37] block mb-4">{v.icon}</span>
                                <h3 className="font-serif italic text-gray-900 dark:text-white text-lg mb-2 transition-colors">{v.title}</h3>
                                <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━━ CTA ━━━━ */}
            <section className="max-w-4xl mx-auto px-6 py-20 text-center">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <IoFlowerOutline className="text-4xl text-[#D4AF37] mx-auto mb-6" />
                    <h2 className="text-3xl font-serif italic text-gray-900 dark:text-white mb-3 transition-colors">
                        Ready to explore?
                    </h2>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mb-8">
                        Discover our curated collection — handpicked for your golden moments.
                    </p>
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/products')}
                        className="inline-flex items-center gap-2 bg-gray-900 dark:bg-yellow-600 text-white px-8 py-4 rounded-full font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-[#D4AF37] dark:hover:bg-yellow-500 transition-all duration-300 group shadow-lg dark:shadow-black/30"
                    >
                        Shop the Collection
                        <FiArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.button>
                </motion.div>
            </section>

        </div>
    );
}