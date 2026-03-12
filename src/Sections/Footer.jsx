import { FiFacebook, FiInstagram, FiTwitter, FiSend } from 'react-icons/fi';
import { IoFlowerOutline } from 'react-icons/io5';

const Footer = () => {
    return (
        <footer className="bg-zinc-100 border-t border-zinc-200 pt-16 pb-8 text-gray-800">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Column 1: Brand Info */}
                <div className="space-y-6">
                    <div className="flex-shrink-0">
                        <a href="/" className="flex items-center group gap-1 sm:gap-2 no-underline">
                            <IoFlowerOutline
                                className="text-2xl sm:text-4xl text-[#D4AF37] group-hover:text-[#B8860B] group-hover:rotate-45 transition-all duration-500 transform"
                            />
                            <h1 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tighter">
                                <span className="text-[#D4AF37] group-hover:text-[#B8860B] transition-all duration-500 transform">GOLDEN</span>
                                <span className="text-gray-800 inline"> FLOWER</span>
                            </h1>
                        </a>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs italic">
                        "Where nature's beauty meets luxury fragrances. Crafting scents that define your unique presence."
                    </p>

                    <div className="flex gap-3 pt-2">
                        <a href="#" className="p-2.5 bg-white rounded-full shadow-sm text-gray-500 hover:text-[#D4AF37] hover:shadow-md transition-all">
                            <FiInstagram size={18} />
                        </a>
                        <a href="#" className="p-2.5 bg-white rounded-full shadow-sm text-gray-500 hover:text-[#D4AF37] hover:shadow-md transition-all">
                            <FiFacebook size={18} />
                        </a>
                        <a href="#" className="p-2.5 bg-white rounded-full shadow-sm text-gray-500 hover:text-[#D4AF37] hover:shadow-md transition-all">
                            <FiTwitter size={18} />
                        </a>
                    </div>
                </div>

                {/* Column 2: Shop Links */}
                <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-gray-900">Shop Now</h3>
                    <ul className="space-y-3 text-sm text-gray-500 font-medium">
                        <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Men's Collection</a></li>
                        <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Women's Collection</a></li>
                        <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Best Sellers</a></li>
                        <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Limited Edition</a></li>
                    </ul>
                </div>

                {/* Column 3: Support */}
                <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-gray-900">Support</h3>
                    <ul className="space-y-3 text-sm text-gray-500 font-medium">
                        <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Our Story</a></li>
                        <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Shipping Info</a></li>
                        <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Return Policy</a></li>
                        <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Contact Us</a></li>
                    </ul>
                </div>

                {/* Column 4: Newsletter */}
                <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-gray-900">Join the Club</h3>
                    <p className="text-sm text-gray-500 mb-4">Get early access to new launches and events.</p>
                    <div className="relative group">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full bg-white border border-zinc-300 rounded-xl py-3 px-5 text-sm outline-none focus:border-[#D4AF37] transition-all shadow-sm"
                        />
                        <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gray-900 text-white p-2.5 rounded-lg hover:bg-[#D4AF37] transition-all shadow-md">
                            <FiSend size={14} />
                        </button>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-zinc-300/50 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-bold">
                    © {new Date().getFullYear()} GOLDEN FLOWER. ALL RIGHTS RESERVED.
                </p>
            </div>
        </footer>
    );
};

export default Footer;