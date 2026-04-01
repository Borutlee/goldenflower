import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';

const Features = () => {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end 81%"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const journey = [
        {
            title: "The Eternal Sillage",
            detail: "Crafted with 30% concentration, our fragrances ensure a trail that lingers for over 48 hours. Each note is engineered to withstand the test of time, evolving beautifully on your skin from dawn to dusk.",
            label: "Durability"
        },
        {
            title: "Rare Botanical Essence",
            detail: "We source our raw materials from the legendary fields of Grasse. From hand-picked Jasmine to ethically sourced Oud, every bottle contains 100% natural oils, free from synthetic harshness.",
            label: "Quality"
        },
        {
            title: "The Royal Unboxing",
            detail: "Luxury isn't just the scent; it's the anticipation. Our signature gold-leafed packaging and magnetic-lock boxes transform every purchase into a majestic ceremony of elegance.",
            label: "Experience"
        },
        {
            title: "Concierge Logistics",
            detail: "Beauty shouldn't wait. Our dedicated white-glove delivery service ensures your fragrance arrives in temperature-controlled packaging within hours, preserved in its purest form.",
            label: "Delivery"
        }
    ];

    return (
        <section ref={containerRef} className="py-24 bg-white dark:bg-[#121212] transition-colors duration-300 relative overflow-x-hidden">
            <div className="container mx-auto px-5">

                {/* العنوان */}
                <div className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[#D4AF37] tracking-[0.4em] uppercase text-sm font-bold mb-4"
                    >
                        Our Craftsmanship
                    </motion.h2>
                    <h3 className="text-5xl font-black text-gray-900 dark:text-white transition-colors duration-300">
                        The Golden Standard
                    </h3>
                </div>

                <div className="relative max-w-4xl mx-auto">

                    {/* الخط الذهبي */}
                    <motion.div
                        style={{ scaleY }}
                        className="absolute left-0 md:left-1/2 top-0 w-[2px] h-full bg-[#D4AF37] origin-top transform md:-translate-x-1/2 z-0"
                    />

                    {/* الخط الرمادي الخلفي */}
                    <div className="absolute left-0 md:left-1/2 top-0 w-[2px] h-full bg-gray-100 dark:bg-gray-800 transform md:-translate-x-1/2 z-[-1] transition-colors duration-300" />

                    {journey.map((step, index) => (
                        <div
                            key={index}
                            className={`relative flex items-center justify-between mb-32 last:mb-0 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* المحتوى */}
                            <motion.div
                                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="w-full md:w-[45%] pl-10 md:pl-0"
                            >
                                <span className="text-[#D4AF37] font-mono text-sm font-bold mb-2 block">
                                    {step.label}
                                </span>

                                <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                                    {step.title}
                                </h4>

                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg italic transition-colors duration-300">
                                    "{step.detail}"
                                </p>
                            </motion.div>

                            {/* النقطة */}
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                viewport={{ once: true }}
                                className="absolute left-[-10px] md:left-1/2 w-5 h-5 bg-white dark:bg-[#121212] border-4 border-[#D4AF37] rounded-full z-10 md:!translate-x-[-50%] md:!translate-y-[-50%] transition-colors duration-300"
                            />

                            <div className="hidden md:block w-[45%]" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;