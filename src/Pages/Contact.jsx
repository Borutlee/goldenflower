import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';
import { IoFlowerOutline } from 'react-icons/io5';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' }
    })
};

const CONTACT_INFO = [
    {
        icon: <FiMail size={18} />,
        label: 'Email',
        value: 'hello@goldenflower.com',
        sub: 'We reply within 24 hours'
    },
    {
        icon: <FiPhone size={18} />,
        label: 'Phone',
        value: '+20 100 000 0000',
        sub: 'Sat – Thu, 10am – 8pm'
    },
    {
        icon: <FiMapPin size={18} />,
        label: 'Location',
        value: 'Cairo, Egypt',
        sub: 'Serving nationwide'
    },
];

const SOCIALS = [
    { icon: <FiInstagram size={18} />, label: 'Instagram' },
    { icon: <FiFacebook size={18} />, label: 'Facebook' },
    { icon: <FiTwitter size={18} />, label: 'Twitter' },
];

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleChange = useCallback((e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        console.log('form:', form);
        setSent(true);
        setTimeout(() => setSent(false), 4000);
        setForm({ name: '', email: '', subject: '', message: '' });
    }, [form]);

    return (
        // الخلفية الأساسية للموقع (Dark Mode)
        <div className="bg-white dark:bg-[#121212] min-h-screen transition-colors duration-300">

            {/* ━━━━ Hero ━━━━ */}
            <section className="bg-white dark:bg-[#1A1A1A] border-b border-gray-100 dark:border-gray-800 py-16 text-center px-4 transition-colors duration-300">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                >
                    <IoFlowerOutline className="text-4xl text-[#D4AF37] mx-auto mb-5" />
                    <p className="text-[#D4AF37] text-[11px] font-black uppercase tracking-[0.4em] mb-3">Get In Touch</p>
                    <h1 className="text-4xl sm:text-5xl font-serif italic text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                        We'd love to hear from you
                    </h1>
                    <div className="h-px w-14 bg-[#D4AF37] mx-auto mb-4" />
                    <p className="text-gray-400 dark:text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                        Have a question, a suggestion, or just want to say hi? We're always happy to connect.
                    </p>
                </motion.div>
            </section>

            {/* ━━━━ Main ━━━━ */}
            <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10">

                {/* ── Contact Info ── */}
                <div className="lg:col-span-2 flex flex-col gap-5">

                    {CONTACT_INFO.map((item, i) => (
                        <motion.div
                            key={item.label}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={i}
                            className="bg-white dark:bg-[#1A1A1A] rounded-[1.5rem] border border-gray-100 dark:border-gray-800 p-5 flex items-start gap-4 shadow-sm transition-all"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                                {item.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">{item.label}</p>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.value}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.sub}</p>
                            </div>
                        </motion.div>
                    ))}

                    {/* Socials */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={3}
                        className="bg-white dark:bg-[#1A1A1A] rounded-[1.5rem] border border-gray-100 dark:border-gray-800 p-5 shadow-sm transition-all"
                    >
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Follow Us</p>
                        <div className="flex gap-3">
                            {SOCIALS.map(s => (
                                <button
                                    key={s.label}
                                    className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] hover:border-[#D4AF37] dark:hover:border-[#D4AF37] transition-all duration-300"
                                >
                                    {s.icon}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── Form ── */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={1}
                    className="lg:col-span-3 bg-white dark:bg-[#1A1A1A] rounded-[2rem] border border-gray-100 dark:border-gray-800 p-7 sm:p-10 shadow-sm transition-all"
                >
                    <h2 className="text-2xl font-serif italic text-gray-900 dark:text-white mb-1 transition-colors">Send a Message</h2>
                    <div className="h-px w-10 bg-[#D4AF37] mb-7" />

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Name + Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Your email"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                placeholder="What's this about?"
                                required
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                            />
                        </div>

                        {/* Message */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Message</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Tell us anything..."
                                required
                                rows={5}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-[0.2em] transition-all duration-300 mt-2 group
                                ${sent
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-900 dark:bg-yellow-600 text-white hover:bg-[#D4AF37] dark:hover:bg-yellow-500 shadow-lg shadow-black/20'
                                }`}
                        >
                            {sent ? (
                                <>Message Sent! ✓</>
                            ) : (
                                <>
                                    Send Message
                                    <FiSend size={13} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                </>
                            )}
                        </motion.button>

                    </form>
                </motion.div>
            </section>

        </div>
    );
}