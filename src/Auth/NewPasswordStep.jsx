import { useState } from 'react';
import { PasswordInput, SubmitButton } from './AuthInput';

export default function NewPasswordStep({ onSubmit, loading }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <form onSubmit={(e) => onSubmit(e, newPassword, confirmNewPassword)} className="flex flex-col gap-5">
            <div className="text-center mb-2">
                <h2 className="text-2xl font-serif italic text-gray-900 dark:text-white">New Password</h2>
                <p className="text-xs text-gray-400 mt-2">Choose a strong password</p>
                <div className="h-px w-8 bg-[#D4AF37] mx-auto mt-3" />
            </div>
            <PasswordInput show={showNew} onToggle={() => setShowNew(!showNew)} placeholder="New password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <PasswordInput show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} placeholder="Confirm new password" required value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
            <SubmitButton label="Update Password" loading={loading} />
        </form>
    );
}