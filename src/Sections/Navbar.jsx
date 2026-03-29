import { FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { IoFlowerOutline } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../Context/CartContext'

const Header = () => {
  const [dark, setdark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/products' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const { cartItems } = useCart();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-gray-600 body-font bg-white sticky top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto flex py-4 px-3 sm:px-5 items-center border-b border-gray-200">

        {/* Logo */}
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

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-grow items-center justify-center font-semibold">
          <ul className="flex list-none gap-2">
            {navLinks.map((item) => (
              <li key={item.label} className="group cursor-pointer px-5 py-1.5 border-2 border-transparent transition-all duration-300 rounded-[30px] hover:border-[#D4AF37] flex items-center justify-center">
                <Link to={item.to} className="text-gray-600 transition-colors duration-300 group-hover:text-[#D4AF37]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Section */}
        <div className="flex items-center justify-end gap-3 sm:gap-5 flex-shrink-0 ml-auto md:ml-0">
          {/* Theme Toggle */}
          <button
            className="hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
            onClick={() => setdark(!dark)}
          >
            {dark ? <MdOutlineLightMode size={20} /> : <MdDarkMode size={20} />}
          </button>

          {/* Cart */}
          <Link to="/Cart" className="relative group p-1">
            <FaCartShopping className="text-xl sm:text-2xl text-gray-700 hover:text-[#B8860B] transition-all" />
            <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartItems?.length || 0}</span>
          </Link>

          {/* User */}
          <div className="hidden md:block relative p-1">
            <Link to="/Auth" className="relative group p-1">
              <FaUser className="text-xl text-gray-700 hover:text-[#B8860B] transition-all" />
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-1 text-gray-700 hover:text-[#D4AF37]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="flex flex-col p-6 h-full">
          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-[#D4AF37]">Menu</span>
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
              <FaTimes size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-4 font-semibold text-lg">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="hover:text-[#D4AF37] py-2 border-b border-gray-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-10 flex flex-col gap-4">
            <button
              onClick={() => setdark(!dark)}
              className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-xl text-gray-700 border border-gray-100"
            >
              <span className="font-medium">{dark ? "Light Mode" : "Dark Mode"}</span>
              {dark ? <MdOutlineLightMode className="text-yellow-500" size={22} /> : <MdDarkMode size={22} />}
            </button>
            <hr className="my-2 border-gray-100" />
            <a href="/login" className="w-full py-3 text-center border border-[#D4AF37] text-[#D4AF37] rounded-xl font-bold">Log In</a>
            <a href="/signup" className="w-full py-3 text-center bg-[#D4AF37] text-white rounded-xl font-bold shadow-md shadow-yellow-100">Sign Up</a>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[55] md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </motion.header>
  );
};

export default Header;