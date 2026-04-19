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

    // ━━━━ Handlers ━━━━
    const handleLogin = useCallback((e) => {
        e.preventDefault();
        console.log('Login logic here:', loginData);
    }, [loginData]);

    const handleRegister = useCallback((e) => {
        e.preventDefault();
        console.log('Register logic here:', registerData);
    }, [registerData]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] flex items-center justify-center px-4 py-16 transition-colors duration-500">
            
            {/* Background Decorative Elements */}
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
                {/* Logo Section */}
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

                {/* Main Auth Card */}
                <div className="bg-white dark:bg-[#141414] rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-500">
                    
                    {/* ── Tabs (The ones you requested) ── */}
                    <div className="flex border-b border-gray-100 dark:border-white/5">
                        {['login', 'register'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
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

                    {/* Forms Container */}
                    <div className="p-8 sm:p-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={tab}
                                initial={{ opacity: 0, x: tab === 'login' ? -10 : 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: tab === 'login' ? 10 : -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <form onSubmit={tab === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-5">
                                    
                                    <div className="text-center mb-2">
                                        <h2 className="text-2xl font-serif italic text-gray-900 dark:text-white transition-colors">
                                            {tab === 'login' ? 'Welcome back' : 'Join the elite'}
                                        </h2>
                                        <div className="h-px w-8 bg-[#D4AF37] mx-auto mt-2" />
                                    </div>

                                    {/* Inputs Group */}
                                    <div className="space-y-4">
                                        {tab === 'register' && (
                                            <div className="relative group">
                                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={16} />
                                                <input
                                                    type="text"
                                                    placeholder="Full name"
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#1C1C1C] border border-transparent dark:border-white/5 rounded-2xl text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/5 transition-all"
                                                    value={registerData.name}
                                                    onChange={e => setRegisterData({...registerData, name: e.target.value})}
                                                />
                                            </div>
                                        )}

                                        <div className="relative group">
                                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={16} />
                                            <input
                                                type="email"
                                                placeholder="Email address"
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#1C1C1C] border border-transparent dark:border-white/5 rounded-2xl text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/5 transition-all"
                                                value={tab === 'login' ? loginData.email : registerData.email}
                                                onChange={e => tab === 'login' 
                                                    ? setLoginData({...loginData, email: e.target.value})
                                                    : setRegisterData({...registerData, email: e.target.value})
                                                }
                                            />
                                        </div>

                                        <div className="relative group">
                                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={16} />
                                            <input
                                                type={showPass ? 'text' : 'password'}
                                                placeholder="Password"
                                                required
                                                className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-[#1C1C1C] border border-transparent dark:border-white/5 rounded-2xl text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/5 transition-all"
                                                value={tab === 'login' ? loginData.password : registerData.password}
                                                onChange={e => tab === 'login'
                                                    ? setLoginData({...loginData, password: e.target.value})
                                                    : setRegisterData({...registerData, password: e.target.value})
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
                                    </div>

                                    {tab === 'login' && (
                                        <div className="text-right">
                                            <button type="button" className="text-[10px] text-gray-400 hover:text-[#D4AF37] transition-colors uppercase tracking-[0.2em] font-black">
                                                Forgot password?
                                            </button>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-[#D4AF37] text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-lg hover:shadow-xl transition-all duration-300 group mt-2"
                                    >
                                        {tab === 'login' ? 'Sign In' : 'Create Account'}
                                        <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                                    </motion.button>

                                    {/* Terms for Register */}
                                    {tab === 'register' && (
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-relaxed px-4">
                                            By creating an account, you agree to our 
                                            <span className="text-gray-900 dark:text-white font-bold cursor-pointer hover:text-[#D4AF37] transition-colors"> Terms </span> 
                                            and 
                                            <span className="text-gray-900 dark:text-white font-bold cursor-pointer hover:text-[#D4AF37] transition-colors"> Privacy Policy</span>.
                                        </p>
                                    )}
                                </form>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Back to shop navigation */}
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