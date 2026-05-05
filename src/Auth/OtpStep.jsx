import { useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiArrowLeft } from 'react-icons/fi';
import { sendResetOtp } from '../../supabase/authService';
import { SubmitButton } from './AuthInput';

const OTP_COOLDOWN = 60;

export default function OtpStep({ otp, setOtp, forgotEmail, onBack, onVerify, loading, cooldown, startCooldown }) {
    const otpRefs = useRef([]);

    const handleOtpChange = (index, value) => {
        const val = value.replace(/[^0-9]/g, '').slice(-1);
        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);
        if (val && index < 5) otpRefs.current[index + 1]?.focus();
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
        otpRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

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

    return (
        <form onSubmit={onVerify} className="flex flex-col gap-6">
            <button type="button" onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors text-[10px] font-black uppercase tracking-widest w-fit">
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
                            ${cooldown > 0 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-[#D4AF37] hover:underline cursor-pointer'}`}
                    >
                        {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend'}
                    </button>
                </div>
            </div>

            <SubmitButton label="Verify Code" loading={loading} />
        </form>
    );
}