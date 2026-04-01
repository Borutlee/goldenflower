import { FiFacebook, FiInstagram, FiTwitter, FiSend } from 'react-icons/fi';
import { IoFlowerOutline } from 'react-icons/io5';

const Footer = () => {
    return (
        <footer className="bg-zinc-100 dark:bg-[#0e0e0e] border-t border-zinc-200 dark:border-gray-800 pt-16 pb-8 text-gray-800 dark:text-gray-200 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Column 1: Brand Info */}
                <div className="space-y-6">
                    <a href="/" className="flex items-center group gap-1 sm:gap-2 no-underline">
                        <IoFlowerOutline className="text-2xl sm:text-4xl text-[#D4AF37] group-hover:text-[#B8860B] group-hover:rotate-45 transition-all duration-500" />
                        <h1 className="text-lg sm:text-2xl font-black tracking-tighter">
                            <span className="text-[#D4AF37] group-hover:text-[#B8860B] transition-all duration-500">GOLDEN</span>
                            <span className="text-gray-800 dark:text-gray-200 inline transition-colors duration-300"> FLOWER</span>
                        </h1>
                    </a>

                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs italic transition-colors duration-300">
                        "Where nature's beauty meets luxury fragrances. Crafting scents that define your unique presence."
                    </p>

                    <div className="flex gap-3 pt-2">
                        {[FiInstagram, FiFacebook, FiTwitter].map((Icon, i) => (
                            <a key={i} href="#" className="p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-500 dark:text-gray-400 dark:hover:text-[#D4AF37] hover:text-[#D4AF37] hover:shadow-md transition-all duration-300">
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Column 2: Shop */}
                <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-gray-900 dark:text-white transition-colors duration-300">Shop Now</h3>
                    <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {["Men's Collection", "Women's Collection", "Best Sellers", "Limited Edition"].map(link => (
                            <li key={link}>
                                <a href="#" className="hover:text-[#D4AF37] transition-colors duration-300">{link}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Support */}
                <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-gray-900 dark:text-white transition-colors duration-300">Support</h3>
                    <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {["Our Story", "Shipping Info", "Return Policy", "Contact Us"].map(link => (
                            <li key={link}>
                                <a href="#" className="hover:text-[#D4AF37] transition-colors duration-300">{link}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 4: Newsletter */}
                <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-gray-900 dark:text-white transition-colors duration-300">Join the Club</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">
                        Get early access to new launches and events.
                    </p>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full bg-white dark:bg-gray-800 border border-zinc-300 dark:border-gray-700 rounded-xl py-3 px-5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none dark:focus:border-[#D4AF37] focus:border-[#D4AF37] transition-all shadow-sm"
                        />
                        <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gray-900 dark:bg-[#D4AF37] text-white p-2.5 rounded-lg hover:bg-[#D4AF37] dark:hover:bg-[#B8860B] transition-all shadow-md">
                            <FiSend size={14} />
                        </button>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-zinc-300/50 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-bold">
                    © {new Date().getFullYear()} GOLDEN FLOWER. ALL RIGHTS RESERVED.
                </p>
            </div>
        </footer>
    );
};

export default Footer;