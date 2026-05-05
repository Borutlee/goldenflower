import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoFlowerOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from '../Auth/LoginForm';
import RegisterForm from '../Auth/RegisterForm';
import ForgotPassword from '../Auth/ForgotPassword';

export default function Auth() {
    const [tab, setTab] = useState('login'); // 'login' | 'register' | 'forgot'
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] flex items-center justify-center px-4 py-16 transition-colors duration-500">

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" toastClassName="!rounded-2xl !font-sans !text-sm" />

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
                <div onClick={() => navigate('/')} className="flex flex-col items-center justify-center gap-2 mb-10 cursor-pointer group">
                    <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.5 }}>
                        <IoFlowerOutline className="text-4xl text-[#D4AF37]" />
                    </motion.div>
                    <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">
                        <span className="text-[#D4AF37]">GOLDEN</span> FLOWER
                    </span>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-[#141414] rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-500">

                    {/* Tabs — بتظهر بس في login/register */}
                    {tab !== 'forgot' && (
                        <div className="flex border-b border-gray-100 dark:border-white/5">
                            {['login', 'register'].map(t => (
                                <button key={t} onClick={() => setTab(t)}
                                    className={`flex-1 py-5 text-[11px] font-black uppercase tracking-[0.2em] relative transition-colors duration-300
                                        ${tab === t ? 'text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
                                >
                                    {t === 'login' ? 'Sign In' : 'Sign Up'}
                                    {tab === t && (
                                        <motion.div layoutId="authTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
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
                                {tab === 'login' && <LoginForm onForgot={() => setTab('forgot')} />}
                                {tab === 'register' && <RegisterForm />}
                                {tab === 'forgot' && <ForgotPassword onBack={() => setTab('login')} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <button onClick={() => navigate('/products')} className="w-full text-center text-[10px] text-gray-400 hover:text-gray-800 dark:text-gray-600 dark:hover:text-gray-400 uppercase tracking-[0.2em] font-black mt-8 transition-all flex items-center justify-center gap-2 group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Back to shop
                </button>
            </motion.div>
        </div>
    );
}