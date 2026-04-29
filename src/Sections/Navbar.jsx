import { FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { IoFlowerOutline } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useTheme } from '../Context/ThemeContext';
import { useAuth } from '../Context/AuthContext';
import { logout } from '../supabase/authService';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/products' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const userName = user?.user_metadata?.name || 'Profile';
  const userAvatar = user?.user_metadata?.avatar_url;

  // ← اقفل الـ dropdown لو ضغط بره
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setIsOpen(false);
    navigate('/Auth');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="body-font sticky top-0 z-50 px-4 pt-4"
    >
      <div className="
        container mx-auto flex py-4 px-3 sm:px-5 items-center 
        rounded-[2rem]
        border border-white/20 dark:border-white/10
        bg-white/70 dark:bg-[#121212]/70
        backdrop-blur-md
        shadow-lg
        transition-colors duration-300
      ">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="/" className="flex items-center group gap-1 sm:gap-2 no-underline">
            <IoFlowerOutline className="text-2xl sm:text-4xl text-[#D4AF37] group-hover:text-[#B8860B] group-hover:rotate-45 transition-all duration-500 transform" />
            <h1 className="text-lg sm:text-2xl font-black tracking-tighter">
              <span className="text-[#D4AF37] group-hover:text-[#B8860B] transition-all duration-500">GOLDEN</span>
              <span className="text-gray-800 dark:text-gray-300 inline transition-colors duration-300"> FLOWER</span>
            </h1>
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-grow items-center justify-center font-semibold">
          <ul className="flex list-none gap-2">
            {navLinks.map((item) => (
              <li key={item.label} className="group cursor-pointer px-5 py-1.5 border-2 border-transparent rounded-[30px] hover:border-[#D4AF37] transition-all duration-300 flex items-center justify-center">
                <Link to={item.to} className="text-gray-600 dark:text-gray-300 transition-colors duration-300 group-hover:text-[#D4AF37]">
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
            className="hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
            onClick={toggleTheme}
          >
            {isDark ? <MdOutlineLightMode size={20} /> : <MdDarkMode size={20} />}
          </button>

          {/* Cart */}
          <Link to="/Cart" className="relative group p-1">
            <FaCartShopping className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 hover:text-[#B8860B] transition-all duration-300" />
            <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartItems?.length || 0}
            </span>
          </Link>

          {/* ── User Section ── */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            {user ? (
              // ← لو logged in — بيظهر Avatar + Dropdown
              <>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#D4AF37]/40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {userAvatar ? (
                      <img src={userAvatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <FiUser size={14} className="text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  <FiChevronDown
                    size={14}
                    className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{userName}</p>
                        <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                      </div>

                      {/* Profile Link */}
                      <Link
                        to="/userProfile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#D4AF37] transition-colors"
                      >
                        <FiUser size={13} />
                        Profile
                      </Link>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <FiLogOut size={13} />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              // ← لو مش logged in — بيظهر أيقونة اليوزر
              <Link to="/Auth" className="relative group p-1">
                <FaUser className="text-xl text-gray-700 dark:text-gray-300 hover:text-[#B8860B] transition-all duration-300" />
              </Link>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-1 text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>

      {/* ── Mobile Sidebar ── */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-[#121212] z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="flex flex-col p-6 h-full text-gray-800 dark:text-white transition-colors duration-300">

          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-[#D4AF37]">Menu</span>
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 dark:text-gray-300 hover:text-red-500 transition-colors">
              <FaTimes size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-4 font-semibold text-lg">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="py-2 border-b border-gray-50 dark:border-gray-700 hover:text-[#D4AF37] transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-10 flex flex-col gap-4">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-white border border-gray-100 dark:border-gray-700 transition-all duration-300"
            >
              <span className="font-medium">{isDark ? "Light Mode" : "Dark Mode"}</span>
              {isDark ? <MdOutlineLightMode className="text-yellow-500" size={22} /> : <MdDarkMode size={22} />}
            </button>

            <hr className="my-2 border-gray-100 dark:border-gray-700" />

            {user ? (
              // ← لو logged in في الموبايل
              <>
                <Link
                  to="/userProfile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors hover:border-[#D4AF37]"
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#D4AF37]/40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    {userAvatar ? (
                      <img src={userAvatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <FiUser size={14} className="text-gray-500" />
                    )}
                  </div>
                  {/* Name */}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{userName}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">View Profile</span>
                  </div>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-200 dark:border-red-800 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FiLogOut size={15} />
                  Log Out
                </button>
              </>
            ) : (
              // ← لو مش logged in في الموبايل
              <>
                <Link to="/Auth" onClick={() => setIsOpen(false)} className="w-full py-3 text-center border border-[#D4AF37] text-[#D4AF37] rounded-xl font-bold">
                  Log In
                </Link>
                <Link to="/Auth" onClick={() => setIsOpen(false)} className="w-full py-3 text-center bg-[#D4AF37] text-white rounded-xl font-bold shadow-md shadow-yellow-100">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[55] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </motion.header>
  );
};

export default Header;