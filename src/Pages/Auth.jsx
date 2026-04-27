import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { IoFlowerOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { login, signUp } from '../supabase/authService';
import { supabase } from '../supabase/supabaseClient';

export default function Auth() {
    const [tab, setTab] = useState('login'); // 'login' | 'register' | 'forgot'
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [forgotEmail, setForgotEmail] = useState('');

    // ━━━━ Login ━━━━
    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(loginData.email, loginData.password);
            navigate('/userProfile');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [loginData, navigate]);

    // ━━━━ Register ━━━━
    const handleRegister = useCallback(async (e) => {
        e.preventDefault();
        setError('');

        // ← تأكد إن الباسورد والكونفيرم متطابقين
        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await signUp(registerData.email, registerData.password, registerData.name);
            setError('✅ Account created! You can sign in now.');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [registerData]);

    // ━━━━ Forgot Password ━━━━
    const handleForgotPassword = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail);
            if (error) throw error;
            setError('✅ Reset link sent! Check your email.');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [forgotEmail]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] flex items-center justify-center px-4 py-16 transition-colors duration-500">

            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-20">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#D4AF37]/20 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#D4AF37]/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md z-10"
            >
                {/* Logo */}
                <div
                    onClick={() => navigate('/')}
                    className="flex flex-col items-center justify-center gap-2 mb-10 cursor-pointer group"
                >
                    <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.5 }}>
                        <IoFlowerOutline className="text-4xl text-[#D4AF37]" />
                    </motion.div>
                    <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white transition-colors">
                        <span className="text-[#D4AF37]">GOLDEN</span> FLOWER
                    </span>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-[#141414] rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-500">

                    {/* Tabs — مش بيظهروا في الـ forgot */}
                    {tab !== 'forgot' && (
                        <div className="flex border-b border-gray-100 dark:border-white/5">
                            {['login', 'register'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => { setTab(t); setError(''); }}
                                    className={`flex-1 py-5 text-[11px] font-black uppercase tracking-[0.2em] relative transition-colors duration-300
                                        ${tab === t
                                            ? 'text-gray-900 dark:text-white'
                                            : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                                        }`}
                                >
                                    {t === 'login' ? 'Sign In' : 'Sign Up'}
                                    {tab === t && (
                                        <motion.div
                                            layoutId="authTab"
                                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="p-8 sm:p-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={tab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                            >

                                {/* ━━━━ Forgot Password View ━━━━ */}
                                {tab === 'forgot' && (
                                    <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
                                        {/* Back Button */}
                                        <button
                                            type="button"
                                            onClick={() => { setTab('login'); setError(''); }}
                                            className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors text-[10px] font-black uppercase tracking-widest w-fit"
                                        >
                                            <FiArrowLeft size={13} /> Back to Sign In
                                        </button>

                                        <div className="text-center mb-2">
                                            <h2 className="text-2xl font-serif italic text-gray-900 dark:text-white transition-colors">
                                                Reset Password
                                            </h2>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Enter your email and we'll send you a reset link
                                            </p>
                                            <div className="h-px w-8 bg-[#D4AF37] mx-auto mt-3" />
                                        </div>

                                        {/* Error / Success */}
                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`text-xs text-center px-4 py-3 rounded-xl font-medium
                                                    ${error.startsWith('✅')
                                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                                        : 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                                                    }`}
                                            >
                                                {error}
                                            </motion.p>
                                        )}

                                        {/* Email Input */}
                                        <div className="relative group">
                                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={16} />
                                            <input
                                                type="email"
                                                placeholder="Email address"
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#1C1C1C] border border-transparent dark:border-white/5 rounded-2xl text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/5 transition-all"
                                                value={forgotEmail}
                                                onChange={e => setForgotEmail(e.target.value)}
                                            />
                                        </div>

                                        {/* Submit */}
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
                                            {loading ? 'Sending...' : 'Send Reset Link'}
                                            {!loading && <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />}
                                        </motion.button>
                                    </form>
                                )}

                                {/* ━━━━ Login / Register View ━━━━ */}
                                {tab !== 'forgot' && (
                                    <form onSubmit={tab === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-5">

                                        <div className="text-center mb-2">
                                            <h2 className="text-2xl font-serif italic text-gray-900 dark:text-white transition-colors">
                                                {tab === 'login' ? 'Welcome back' : 'Join the elite'}
                                            </h2>
                                            <div className="h-px w-8 bg-[#D4AF37] mx-auto mt-2" />
                                        </div>

                                        {/* Error / Success */}
                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`text-xs text-center px-4 py-3 rounded-xl font-medium
                                                    ${error.startsWith('✅')
                                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                                        : 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                                                    }`}
                                            >
                                                {error}
                                            </motion.p>
                                        )}

                                        <div className="space-y-4">

                                            {/* Name — Register فقط */}
                                            {tab === 'register' && (
                                                <div className="relative group">
                                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={16} />
                                                    <input
                                                        type="text"
                                                        placeholder="Full name"
                                                        required
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#1C1C1C] border border-transparent dark:border-white/5 rounded-2xl text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/5 transition-all"
                                                        value={registerData.name}
                                                        onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                                                    />
                                                </div>
                                            )}

                                            {/* Email */}
                                            <div className="relative group">
                                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={16} />
                                                <input
                                                    type="email"
                                                    placeholder="Email address"
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#1C1C1C] border border-transparent dark:border-white/5 rounded-2xl text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/5 transition-all"
                                                    value={tab === 'login' ? loginData.email : registerData.email}
                                                    onChange={e => tab === 'login'
                                                        ? setLoginData({ ...loginData, email: e.target.value })
                                                        : setRegisterData({ ...registerData, email: e.target.value })
                                                    }
                                                />
                                            </div>

                                            {/* Password */}
                                            <div className="relative group">
                                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={16} />
                                                <input
                                                    type={showPass ? 'text' : 'password'}
                                                    placeholder="Password"
                                                    required
                                                    className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-[#1C1C1C] border border-transparent dark:border-white/5 rounded-2xl text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/5 transition-all"
                                                    value={tab === 'login' ? loginData.password : registerData.password}
                                                    onChange={e => tab === 'login'
                                                        ? setLoginData({ ...loginData, password: e.target.value })
                                                        : setRegisterData({ ...registerData, password: e.target.value })
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPass(!showPass)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                                >
                                                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                                </button>
                                            </div>

                                            {/* ← Confirm Password — Register فقط */}
                                            {tab === 'register' && (
                                                <div className="relative group">
                                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={16} />
                                                    <input
                                                        type={showConfirmPass ? 'text' : 'password'}
                                                        placeholder="Confirm password"
                                                        required
                                                        className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-[#1C1C1C] border border-transparent dark:border-white/5 rounded-2xl text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/5 transition-all"
                                                        value={registerData.confirmPassword}
                                                        onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                                    >
                                                        {showConfirmPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* ← Forgot Password Link */}
                                        {tab === 'login' && (
                                            <div className="text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => { setTab('forgot'); setError(''); }}
                                                    className="text-[10px] text-gray-400 hover:text-[#D4AF37] transition-colors uppercase tracking-[0.2em] font-black"
                                                >
                                                    Forgot password?
                                                </button>
                                            </div>
                                        )}

                                        {/* Submit Button */}
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
                                            {loading ? 'Please wait...' : (tab === 'login' ? 'Sign In' : 'Create Account')}
                                            {!loading && <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />}
                                        </motion.button>

                                        {tab === 'register' && (
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-relaxed px-4">
                                                By creating an account, you agree to our
                                                <span className="text-gray-900 dark:text-white font-bold cursor-pointer hover:text-[#D4AF37] transition-colors"> Terms </span>
                                                and
                                                <span className="text-gray-900 dark:text-white font-bold cursor-pointer hover:text-[#D4AF37] transition-colors"> Privacy Policy</span>.
                                            </p>
                                        )}
                                    </form>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/products')}
                    className="w-full text-center text-[10px] text-gray-400 hover:text-gray-800 dark:text-gray-600 dark:hover:text-gray-400 uppercase tracking-[0.2em] font-black mt-8 transition-all flex items-center justify-center gap-2 group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Back to shop
                </button>
            </motion.div>
        </div>
    );
}