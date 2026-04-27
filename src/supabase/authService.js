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