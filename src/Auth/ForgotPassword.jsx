import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { sendResetOtp, verifyResetOtp, updatePassword } from '../supabase/authService';
import { Input, SubmitButton, isValidEmail } from './AuthInput';
import OtpStep from './OtpStep';
import NewPasswordStep from './NewPasswordStep';

const OTP_COOLDOWN = 60;

export default function ForgotPassword({ onBack }) {
    const [step, setStep] = useState('email'); // 'email' | 'otp' | 'newpass'
    const [forgotEmail, setForgotEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const cooldownRef = useRef(null);

    const startCooldown = () => {
        setCooldown(OTP_COOLDOWN);
        cooldownRef.current = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    // Step 1 — Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!isValidEmail(forgotEmail)) {
            toast.error('Please use a valid email (Gmail, Yahoo, Outlook...)');
            return;
        }
        setLoading(true);
        try {
            await sendResetOtp(forgotEmail);
            toast.success('Code sent! Check your email.');
            setStep('otp');
            startCooldown();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2 — Verify OTP
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
            setStep('newpass');
        } catch {
            toast.error('Invalid or expired code.');
        } finally {
            setLoading(false);
        }
    };

    // Step 3 — Set New Password
    const handleSetNewPassword = async (e, newPassword, confirmNewPassword) => {
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
            toast.success('Password updated!');
            setTimeout(() => onBack(), 1500);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {step === 'email' && (
                <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
                    <button type="button" onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors text-[10px] font-black uppercase tracking-widest w-fit">
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

            {step === 'otp' && (
                <OtpStep
                    otp={otp}
                    setOtp={setOtp}
                    forgotEmail={forgotEmail}
                    onBack={() => setStep('email')}
                    onVerify={handleVerifyOtp}
                    loading={loading}
                    cooldown={cooldown}
                    startCooldown={startCooldown}
                />
            )}

            {step === 'newpass' && (
                <NewPasswordStep onSubmit={handleSetNewPassword} loading={loading} />
            )}
        </>
    );
}