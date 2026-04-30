import { supabase } from './supabaseClient';

// ── Sign Up ──
export const signUp = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name } // بنحفظ الاسم في الـ metadata
        }
    });
    if (error) throw error;
    return data;
};

// ── Login ──
export const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

// ── Logout ──
export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// ── Update Name ──
export const updateUserName = async (name) => {
    const { data, error } = await supabase.auth.updateUser({
        data: { name }
    });
    if (error) throw error;
    return data;
};

// ── Upload Avatar ──
export const uploadAvatar = async (file, userId) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    // رفع الصورة على Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from('avatar')
        .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // جيب الـ public URL
    const { data } = supabase.storage
        .from('avatar')
        .getPublicUrl(filePath);

    // حفظ الـ URL في الـ user metadata
    const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl }
    });

    if (updateError) throw updateError;
    return data.publicUrl;
};