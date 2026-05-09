import { supabase } from './supabaseClient';

// ── Sign Up ──
export const signUp = async (email, password, firstName, lastName, phone) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                full_name: `${firstName} ${lastName}`,
                phone,
            }
        }
    });
    if (error) throw error;
    return data;
};

// ── Login ──
export const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
};

// ── Logout ──
export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// ── Update Profile ──
export const updateUserProfile = async ({ firstName, lastName, phone }) => {
    const { data, error } = await supabase.auth.updateUser({
        data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            phone,
        }
    });
    if (error) throw error;
    return data;
};

// ── Upload Avatar ──
export const uploadAvatar = async (file, userId) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`;
    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
    const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl }
    });
    if (updateError) throw updateError;
    return data.publicUrl;
};

// ── Send OTP ──
export const sendResetOtp = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: undefined,
    });
    if (error) throw error;
};

// ── Verify OTP ──
export const verifyResetOtp = async (email, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery',
    });
    if (error) throw error;
    return data;
};

// ── Set New Password ──
export const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
    });
    if (error) throw error;
    return data;
};

// ── Delete Account ──
export const deleteAccount = async (email, password) => {
    // أول حاجة نتأكد من الباسورد بـ re-login
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) throw new Error('Incorrect password.');
    // بعدين نمسح الأكونت
    const { error } = await supabase.functions.invoke('delete-user');
    if (error) throw new Error('Failed to delete account.');
};

// ── Update Email ──
export const updateUserEmail = async (newEmail, password) => {
    // تأكد من الباسورد الأول
    const { data: { user } } = await supabase.auth.getUser();
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password,
    });
    if (loginError) throw new Error('Incorrect password.');

    // غير الإيميل
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) throw error;
};