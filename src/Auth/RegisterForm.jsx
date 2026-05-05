import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiUser, FiPhone } from 'react-icons/fi';
import { signUp } from '../supabase/authService';
import { Input, PasswordInput, SubmitButton, isValidEmail } from './AuthInput';

export default function RegisterForm() {
    const [registerData, setRegisterData] = useState({
        firstName: '', lastName: '', phone: '', email: '', password: '', confirmPassword: ''
    });
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = useCallback(async (e) => {
        e.preventDefault();
        if (!isValidEmail(registerData.email)) {
            toast.error('Please use a valid email (Gmail, Yahoo, Outlook...)');
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

    const set = (field) => (e) => setRegisterData({ ...registerData, [field]: e.target.value });

    return (
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="text-center mb-2">
                <h2 className="text-2xl font-serif italic text-gray-900 dark:text-white">Join the elite</h2>
                <div className="h-px w-8 bg-[#D4AF37] mx-auto mt-2" />
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <Input icon={FiUser} type="text" placeholder="First name" required value={registerData.firstName} onChange={set('firstName')} />
                    <Input icon={FiUser} type="text" placeholder="Last name" required value={registerData.lastName} onChange={set('lastName')} />
                </div>
                <Input
                    icon={FiPhone}
                    type="tel"
                    placeholder="Phone number"
                    value={registerData.phone}
                    onChange={e => setRegisterData({ ...registerData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                />
                <Input icon={FiMail} type="email" placeholder="Email address" required value={registerData.email} onChange={set('email')} />
                <PasswordInput show={showPass} onToggle={() => setShowPass(!showPass)} placeholder="Password" required value={registerData.password} onChange={set('password')} />
                <PasswordInput show={showConfirmPass} onToggle={() => setShowConfirmPass(!showConfirmPass)} placeholder="Confirm password" required value={registerData.confirmPassword} onChange={set('confirmPassword')} />
            </div>

            <SubmitButton label="Create Account" loading={loading} />

            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-relaxed px-4">
                By creating an account, you agree to our
                <span className="text-gray-900 dark:text-white font-bold cursor-pointer hover:text-[#D4AF37] transition-colors"> Terms </span>
                and
                <span className="text-gray-900 dark:text-white font-bold cursor-pointer hover:text-[#D4AF37] transition-colors"> Privacy Policy</span>.
            </p>
        </form>
    );
}
