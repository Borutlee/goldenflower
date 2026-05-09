import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail } from 'react-icons/fi';
import { login } from '../supabase/authService';
import { Input, PasswordInput, SubmitButton, isValidEmail } from './AuthInput';

export default function LoginForm({ onForgot }) {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        if (!isValidEmail(loginData.email)) {
            toast.error('Please use a valid email (Gmail, Yahoo, Outlook...)');
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

    return (
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="text-center mb-2">
                <h2 className="text-2xl font-serif italic text-gray-900 dark:text-white">Welcome back</h2>
                <div className="h-px w-8 bg-[#D4AF37] mx-auto mt-2" />
            </div>

            <div className="space-y-4">
                <Input
                    icon={FiMail}
                    type="email"
                    placeholder="Email address"
                    required
                    value={loginData.email}
                    onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                />
                <PasswordInput
                    show={showPass}
                    onToggle={() => setShowPass(!showPass)}
                    placeholder="Password"
                    required
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                />
            </div>

            <div className="text-right">
                <button
                    type="button"
                    onClick={onForgot}
                    className="text-[10px] text-gray-400 hover:text-[#D4AF37] transition-colors uppercase tracking-[0.2em] font-black"
                >
                    Forgot password?
                </button>
            </div>

            <SubmitButton label="Sign In" loading={loading} />
        </form>
    );
}