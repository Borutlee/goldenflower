import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft, FiPhone } from 'react-icons/fi';
import { IoFlowerOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { login, signUp, sendResetOtp, verifyResetOtp, updatePassword } from '../supabase/authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ── Email Validation — أشهر الدومينات العالمية ──
const ALLOWED_DOMAINS = [
    'gmail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de',
    'outlook.com', 'hotmail.com', 'hotmail.co.uk', 'live.com', 'msn.com',
    'icloud.com', 'me.com', 'mac.com',
    'protonmail.com', 'proton.me',
    'aol.com', 'zoho.com', 'mail.com',
    'googlemail.com', 'ymail.com',
];

const isValidEmail = (email) => {
    const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!basic) return false;
    const domain = email.split('@')[1]?.toLowerCase();
    return ALLOWED_DOMAINS.includes(domain);
};

// ── خارج الـ Auth function تماماً ──

const Input = ({ icon: Icon, ...props }) => (
    <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={16} />
        <input
            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#1C1C1C] border border-transparent dark:border-white/5 rounded-2xl text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/5 transition-all"
            {...props}
        />
    </div>
);

const PasswordInput = ({ show, onToggle, ...props }) => (
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

const SubmitButton = ({ label, loading }) => (
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const OTP_COOLDOWN = 60; // ثانية

export default function Auth() {
    const [tab, setTab] = useState('login');
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        firstName: '', lastName: '', phone: '', email: '', password: '', confirmPassword: ''
    });

    // ━━ Forgot Password State ━━
    const [forgotStep, setForgotStep] = useState('email');
    const [forgotEmail, setForgotEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const otpRefs = useRef([]);

    // ━━ Resend Cooldown ━━
    const [cooldown, setCooldown] = useState(0);
    const cooldownRef = useRef(null);

    const startCooldown = () => {
        setCooldown(OTP_COOLDOWN);
        cooldownRef.current = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(cooldownRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // ━━━━ Login ━━━━
    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        if (!isValidEmail(loginData.email)) {
            toast.error('Please use a valid email');
            return;
        }
        setLoading(true);
        try {
            await login(loginData.email, loginData.password);
            navigate('/userProfile');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [loginData, navigate]);

    // ━━━━ Register ━━━━
    const handleRegister = useCallback(async (e) => {
        e.preventDefault();
        if (!isValidEmail(registerData.email)) {
            toast.error('Please use a valid email');
            return;
        }
        if (registerData.password !== registerData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            await signUp(
                registerData.email,
                registerData.password,
                registerData.firstName,
                registerData.lastName,
                registerData.phone,
            );
            toast.success('Account created! Redirecting...');
            setTimeout(() => navigate('/userProfile'), 1500);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [registerData, navigate]);

    // ━━━━ Step 1 — Send OTP ━━━━
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!isValidEmail(forgotEmail)) {
            toast.error('Please use a valid email');
            return;
        }
        setLoading(true);
        try {
            await sendResetOtp(forgotEmail);
            toast.success('Code sent! Check your email.');
            setForgotStep('otp');
            startCooldown();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ━━━━ Step 2 — Verify OTP ━━━━
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const token = otp.join('');
        if (token.length < 6) {
            toast.error('Please enter the full 6-digit code.');
            return;
        }
        setLoading(true);
        try {
            await verifyResetOtp(forgotEmail, token);
            toast.success('Code verified!');
            setForgotStep('newpass');
        } catch (err) {
            toast.error('Invalid or expired code.');
        } finally {
            setLoading(false);
        }
    };

    // ━━━━ Step 3 — Set New Password ━━━━
    const handleSetNewPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await updatePassword(newPassword);
            toast.success('Password updated! Redirecting...');
            setTimeout(() => {
                setTab('login');
                setForgotStep('email');
                setForgotEmail('');
                setOtp(['', '', '', '', '', '']);
                setNewPassword('');
                setConfirmNewPassword('');
            }, 1500);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ━━━━ Resend OTP ━━━━
    const handleResend = async () => {
        if (cooldown > 0) return;
        try {
            await sendResetOtp(forgotEmail);
            toast.success('New code sent!');
            setOtp(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
            startCooldown();
        } catch {
            toast.error('Failed to resend.');
        }
    };

    // ━━━━ OTP Input Logic ━━━━
    const handleOtpChange = (index, value) => {
        const val = value.replace(/[^0-9]/g, '').slice(-1);
        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);
        if (val && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        if (!pasted) return;
        const newOtp = ['', '', '', '', '', ''];
        pasted.split('').forEach((char, i) => { newOtp[i] = char; });
        setOtp(newOtp);
        const lastFilled = Math.min(pasted.length, 5);
        otpRefs.current[lastFilled]?.focus();
    };

    const resetForgot = () => {
        setForgotStep('email');
        setForgotEmail('');
        setOtp(['', '', '', '', '', '']);
        setNewPassword('');
        setConfirmNewPassword('');
        clearInterval(cooldownRef.current);
        setCooldown(0);
        setTab('login');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] flex items-center justify-center px-4 py-16 transition-colors duration-500">

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" toastClassName="!rounded-2xl !font-sans !text-sm" />

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
                                key={tab === 'forgot' ? `forgot-${forgotStep}` : tab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* ━━━━ Forgot Step 1: Email ━━━━ */}
                                {tab === 'forgot' && forgotStep === 'email' && (
                                    <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
                                        <button type="button" onClick={resetForgot} className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors text-[10px] font-black uppercase tracking-widest w-fit">
                                            <FiArrowLeft size={13} /> Back to Sign In
                                        </button>
                                        <div className="text-center mb-2">
                                            <h2 className="text-2xl font-serif italic text-gray-900 dark:text-white">Reset Password</h2>
                                            <p className="text-xs text-gray-400 mt-2">Enter your email and we'll send you a code</p>
                                            <div className="h-px w-8 bg-[#D4AF37] mx-auto mt-3" />
                                        </div>
                                        <Input icon={FiMail} type="email" placeholder="Email address" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
                                        <SubmitButton label="Send Code" loading={loading} />
                                    </form>
                                )}

                                {/* ━━━━ Forgot Step 2: OTP ━━━━ */}
                                {tab === 'forgot' && forgotStep === 'otp' && (
                                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                                        <button type="button" onClick={() => setForgotStep('email')} className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors text-[10px] font-black uppercase tracking-widest w-fit">
                                            <FiArrowLeft size={13} /> Back
                                        </button>

                                        <div className="text-center">
                                            <h2 className="text-2xl font-serif italic text-gray-900 dark:text-white">Enter Code</h2>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Sent to <span className="text-[#D4AF37] font-bold">{forgotEmail}</span>
                                            </p>
                                            <div className="h-px w-8 bg-[#D4AF37] mx-auto mt-3" />
                                        </div>

                                        {/* OTP Boxes */}
                                        <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                                            {otp.map((digit, index) => (
                                                <motion.input
                                                    key={index}
                                                    ref={el => otpRefs.current[index] = el}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={e => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={e => handleOtpKeyDown(index, e)}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-black rounded-xl sm:rounded-2xl border-2 bg-gray-50 dark:bg-[#1C1C1C] text-gray-900 dark:text-white outline-none transition-all duration-200
                                                        ${digit ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10' : 'border-gray-200 dark:border-white/10'}
                                                        focus:border-[#D4AF37] focus:shadow-lg focus:shadow-[#D4AF37]/10`}
                                                />
                                            ))}
                                        </div>

                                        {/* Cooldown + Resend */}
                                        <div className="flex flex-col items-center gap-2">
                                            {/* Countdown bar */}
                                            {cooldown > 0 && (
                                                <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-[#D4AF37] rounded-full"
                                                        initial={{ width: '100%' }}
                                                        animate={{ width: `${(cooldown / OTP_COOLDOWN) * 100}%` }}
                                                        transition={{ duration: 1, ease: 'linear' }}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                                <span>Didn't receive the code?</span>
                                                <button
                                                    type="button"
                                                    onClick={handleResend}
                                                    disabled={cooldown > 0}
                                                    className={`font-black uppercase tracking-wider transition-all
                                                        ${cooldown > 0
                                                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                            : 'text-[#D4AF37] hover:underline cursor-pointer'
                                                        }`}
                                                >
                                                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend'}
                                                </button>
                                            </div>
                                        </div>

                                        <SubmitButton label="Verify Code" loading={loading} />
                                    </form>
                                )}

                                {/* ━━━━ Forgot Step 3: New Password ━━━━ */}
                                {tab === 'forgot' && forgotStep === 'newpass' && (
                                    <form onSubmit={handleSetNewPassword} className="flex flex-col gap-5">
                                        <div className="text-center mb-2">
                                            <h2 className="text-2xl font-serif italic text-gray-900 dark:text-white">New Password</h2>
                                            <p className="text-xs text-gray-400 mt-2">Choose a strong password</p>
                                            <div className="h-px w-8 bg-[#D4AF37] mx-auto mt-3" />
                                        </div>
                                        <PasswordInput show={showNewPass} onToggle={() => setShowNewPass(!showNewPass)} placeholder="New password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                        <PasswordInput show={showConfirmNewPass} onToggle={() => setShowConfirmNewPass(!showConfirmNewPass)} placeholder="Confirm new password" required value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
                                        <SubmitButton label="Update Password" loading={loading} />
                                    </form>
                                )}

                                {/* ━━━━ Login / Register ━━━━ */}
                                {tab !== 'forgot' && (
                                    <form onSubmit={tab === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-5">
                                        <div className="text-center mb-2">
                                            <h2 className="text-2xl font-serif italic text-gray-900 dark:text-white">
                                                {tab === 'login' ? 'Welcome back' : 'Join the elite'}
                                            </h2>
                                            <div className="h-px w-8 bg-[#D4AF37] mx-auto mt-2" />
                                        </div>

                                        <div className="space-y-4">
                                            {tab === 'register' && (
                                                <>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Input icon={FiUser} type="text" placeholder="First name" required value={registerData.firstName} onChange={e => setRegisterData({ ...registerData, firstName: e.target.value })} />
                                                        <Input icon={FiUser} type="text" placeholder="Last name" required value={registerData.lastName} onChange={e => setRegisterData({ ...registerData, lastName: e.target.value })} />
                                                    </div>
                                                    <Input icon={FiPhone} type="tel" placeholder="Phone number" value={registerData.phone} onChange={e => setRegisterData({ ...registerData, phone: e.target.value.replace(/[^0-9]/g, '') })} />
                                                </>
                                            )}

                                            <Input icon={FiMail} type="email" placeholder="Email address" required
                                                value={tab === 'login' ? loginData.email : registerData.email}
                                                onChange={e => tab === 'login'
                                                    ? setLoginData({ ...loginData, email: e.target.value })
                                                    : setRegisterData({ ...registerData, email: e.target.value })}
                                            />

                                            <PasswordInput show={showPass} onToggle={() => setShowPass(!showPass)} placeholder="Password" required
                                                value={tab === 'login' ? loginData.password : registerData.password}
                                                onChange={e => tab === 'login'
                                                    ? setLoginData({ ...loginData, password: e.target.value })
                                                    : setRegisterData({ ...registerData, password: e.target.value })}
                                            />

                                            {tab === 'register' && (
                                                <PasswordInput show={showConfirmPass} onToggle={() => setShowConfirmPass(!showConfirmPass)} placeholder="Confirm password" required
                                                    value={registerData.confirmPassword}
                                                    onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                                />
                                            )}
                                        </div>

                                        {tab === 'login' && (
                                            <div className="text-right">
                                                <button type="button" onClick={() => setTab('forgot')} className="text-[10px] text-gray-400 hover:text-[#D4AF37] transition-colors uppercase tracking-[0.2em] font-black">
                                                    Forgot password?
                                                </button>
                                            </div>
                                        )}

                                        <SubmitButton label={tab === 'login' ? 'Sign In' : 'Create Account'} loading={loading} />

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

                <button onClick={() => navigate('/products')} className="w-full text-center text-[10px] text-gray-400 hover:text-gray-800 dark:text-gray-600 dark:hover:text-gray-400 uppercase tracking-[0.2em] font-black mt-8 transition-all flex items-center justify-center gap-2 group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Back to shop
                </button>
            </motion.div>
        </div>
    );
}