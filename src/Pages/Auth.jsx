import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { IoFlowerOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
    const [tab, setTab] = useState('login'); // 'login' | 'register'
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    // ━━━━ Form State ━━━━
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

    // ━━━━ Handlers - هتربطهم بـ Firebase ━━━━
    const handleLogin = useCallback((e) => {
        e.preventDefault();
        // TODO: Firebase login
        console.log('login:', loginData);
    }, [loginData]);

    const handleRegister = useCallback((e) => {
        e.preventDefault();
        // TODO: Firebase register
        console.log('register:', registerData);
    }, [registerData]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-16">

            {/* ── Card ── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center gap-2 mb-10 cursor-pointer group"
                >
                    <IoFlowerOutline className="text-3xl text-[#D4AF37] group-hover:rotate-45 transition-all duration-500" />
                    <span className="text-xl font-black tracking-tighter text-gray-900">
                        <span className="text-[#D4AF37]">GOLDEN</span> FLOWER
                    </span>
                </div>

                {/* Card */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">

                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                        {['login', 'register'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 py-4 text-[11px] font-black uppercase tracking-[0.2em] relative transition-colors duration-300
                                    ${tab === t ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {t === 'login' ? 'Sign In' : 'Sign Up'}
                                {tab === t && (
                                    <motion.div
                                        layoutId="authTab"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Forms */}
                    <div className="p-8">
                        <AnimatePresence mode="wait">

                            {/* ── Login ── */}
                            {tab === 'login' && (
                                <motion.form
                                    key="login"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                    onSubmit={handleLogin}
                                    className="flex flex-col gap-4"
                                >
                                    <div className="text-center mb-2">
                                        <h2 className="text-2xl font-serif italic text-gray-900">Welcome back</h2>
                                        <div className="h-px w-10 bg-[#D4AF37] mx-auto mt-2" />
                                    </div>

                                    {/* Email */}
                                    <div className="relative">
                                        <FiMail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            value={loginData.email}
                                            onChange={e => setLoginData(p => ({ ...p, email: e.target.value }))}
                                            required
                                            className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-800 placeholder-gray-500 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="relative">
                                        <FiLock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="Password"
                                            value={loginData.password}
                                            onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
                                            required
                                            className="w-full pl-10 pr-10 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-800 placeholder-gray-500 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(s => !s)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                                        >
                                            {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                        </button>
                                    </div>

                                    {/* Forgot */}
                                    <div className="text-right">
                                        <button type="button" className="text-[11px] text-gray-400 hover:text-[#D4AF37] transition-colors uppercase tracking-widest font-bold">
                                            Forgot password?
                                        </button>
                                    </div>

                                    {/* Submit */}
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 rounded-2xl font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-[#D4AF37] transition-all duration-300 mt-2 group"
                                    >
                                        Sign In
                                        <FiArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
                                    </motion.button>

                                    {/* Switch */}
                                    <p className="text-center text-xs text-gray-400 mt-2">
                                        Don't have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => setTab('register')}
                                            className="text-[#D4AF37] font-bold hover:underline"
                                        >
                                            Sign Up
                                        </button>
                                    </p>
                                </motion.form>
                            )}

                            {/* ── Register ── */}
                            {tab === 'register' && (
                                <motion.form
                                    key="register"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    onSubmit={handleRegister}
                                    className="flex flex-col gap-4"
                                >
                                    <div className="text-center mb-2">
                                        <h2 className="text-2xl font-serif italic text-gray-900">Join us</h2>
                                        <div className="h-px w-10 bg-[#D4AF37] mx-auto mt-2" />
                                    </div>

                                    {/* Name */}
                                    <div className="relative">
                                        <FiUser size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Full name"
                                            value={registerData.name}
                                            onChange={e => setRegisterData(p => ({ ...p, name: e.target.value }))}
                                            required
                                            className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-800 placeholder-gray-500 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="relative">
                                        <FiMail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            value={registerData.email}
                                            onChange={e => setRegisterData(p => ({ ...p, email: e.target.value }))}
                                            required
                                            className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-800 placeholder-gray-500 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="relative">
                                        <FiLock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="Password"
                                            value={registerData.password}
                                            onChange={e => setRegisterData(p => ({ ...p, password: e.target.value }))}
                                            required
                                            className="w-full pl-10 pr-10 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-800 placeholder-gray-500 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(s => !s)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                                        >
                                            {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                        </button>
                                    </div>

                                    {/* Terms */}
                                    <p className="text-[11px] text-gray-300 text-center leading-relaxed">
                                        By signing up you agree to our{' '}
                                        <span className="text-[#D4AF37] font-bold cursor-pointer">Terms</span>
                                        {' '}&{' '}
                                        <span className="text-[#D4AF37] font-bold cursor-pointer">Privacy Policy</span>
                                    </p>

                                    {/* Submit */}
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 rounded-2xl font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-[#D4AF37] transition-all duration-300 mt-1 group"
                                    >
                                        Create Account
                                        <FiArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
                                    </motion.button>

                                    {/* Switch */}
                                    <p className="text-center text-xs text-gray-400 mt-2">
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => setTab('login')}
                                            className="text-[#D4AF37] font-bold hover:underline"
                                        >
                                            Sign In
                                        </button>
                                    </p>
                                </motion.form>
                            )}

                        </AnimatePresence>
                    </div>
                </div>

                {/* Back to shop */}
                <button
                    onClick={() => navigate('/Golden-Flower/products')}
                    className="w-full text-center text-[11px] text-gray-400 hover:text-gray-600 uppercase tracking-widest font-bold mt-6 transition-colors"
                >
                    ← Back to Shop
                </button>
            </motion.div>
        </div>
    );
}