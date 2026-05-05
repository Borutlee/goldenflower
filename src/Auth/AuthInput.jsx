import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

export const Input = ({ icon: Icon, ...props }) => (
    <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={16} />
        <input
            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#1C1C1C] border border-transparent dark:border-white/5 rounded-2xl text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/5 transition-all"
            {...props}
        />
    </div>
);

export const PasswordInput = ({ show, onToggle, ...props }) => (
    <div className="relative group">
        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={16} />
        <input
            type={show ? 'text' : 'password'}
            className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-[#1C1C1C] border border-transparent dark:border-white/5 rounded-2xl text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/5 transition-all"
            {...props}
        />
        <button type="button" onClick={onToggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
    </div>
);

export const SubmitButton = ({ label, loading }) => (
    <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-lg transition-all duration-300 group mt-2
            ${loading
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-900 dark:bg-[#D4AF37] text-white hover:shadow-xl'
            }`}
    >
        {loading ? 'Please wait...' : label}
        {!loading && <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />}
    </motion.button>
);

// ── Email Validation ──
export const ALLOWED_DOMAINS = [
    'gmail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de',
    'outlook.com', 'hotmail.com', 'hotmail.co.uk', 'live.com', 'msn.com',
    'icloud.com', 'me.com', 'mac.com',
    'protonmail.com', 'proton.me',
    'aol.com', 'zoho.com', 'mail.com',
    'googlemail.com', 'ymail.com',
];

export const isValidEmail = (email) => {
    const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!basic) return false;
    const domain = email.split('@')[1]?.toLowerCase();
    return ALLOWED_DOMAINS.includes(domain);
};