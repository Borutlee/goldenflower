import { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FiTruck, FiShoppingBag, FiTag, FiX, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useCart } from '../Context/CartContext'; // 👈 استيراد الكونتكست بتاعك هنا

export default function Checkout() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 💡 سحب البيانات والفانكشنز من السلة الحقيقية بتاعتك
    const { cartItems, clearCart } = useCart();

    // 🔁 حالة اليوزر (مسجل دخول ولا Guest)
    const [user, setUser] = useState(null);
    const [checkingUser, setCheckingUser] = useState(true);

    // 🔁 حالة كود الخصم
    const [promoInput, setPromoInput] = useState('');
    const [promoLoading, setPromoLoading] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState(null); // الكود بعد ما يتطبق بنجاح
    const [promoError, setPromoError] = useState('');

    // حساب الحسابات ديناميكياً بناءً على عطور العميل
    const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const shipping = cartItems.length > 0 ? 50 : 0; // 50 جنيه شحن لو السلة مش فاضية

    // 🔁 حساب قيمة الخصم بناءً على الكود المُطبّق (لو موجود)
    // الخصم بيتطبق على subtotal + shipping سوا، حسب طلب صاحب المشروع
    const discountAmount = appliedPromo
        ? appliedPromo.type === 'percentage'
            ? ((subtotal + shipping) * appliedPromo.discount) / 100
            : Math.min(appliedPromo.discount, subtotal + shipping)
        : 0;

    const total = subtotal + shipping - discountAmount;

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        governorate: '',
        address: '',
    });

    // 1️⃣ نتأكد هل اليوزر مسجل دخول ولا Guest
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setCheckingUser(false);
        };
        checkUser();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2️⃣ تطبيق كود الخصم: التحقق من 4 شروط سوا
    const handleApplyPromo = async () => {
        if (!promoInput.trim()) return;
        if (!user) return; // أمان إضافي، الزرار أصلاً مش هيظهر للـ Guest

        setPromoLoading(true);
        setPromoError('');

        try {
            // أ. هل الكود موجود وفعّال؟
            const { data: promo, error: promoFetchError } = await supabase
                .from('promo_codes')
                .select('*')
                .eq('code', promoInput.trim().toUpperCase())
                .eq('active', true)
                .single();

            if (promoFetchError || !promo) {
                setPromoError('Invalid or inactive promo code.');
                return;
            }

            // ب. هل دلوقتي ضمن فترة الصلاحية؟
            const now = new Date();
            if (promo.valid_from && new Date(promo.valid_from) > now) {
                setPromoError('This promo code is not active yet.');
                return;
            }
            if (promo.valid_until && new Date(promo.valid_until) < now) {
                setPromoError('This promo code has expired.');
                return;
            }

            // ج. هل اليوزر ده استخدم الكود قبل كده أكتر من الحد المسموح؟
            const { count, error: usageError } = await supabase
                .from('promo_code_usage')
                .select('*', { count: 'exact', head: true })
                .eq('promo_code_id', promo.id)
                .eq('user_id', user.id);

            if (usageError) {
                setPromoError('Could not verify promo usage. Try again.');
                return;
            }

            const usageLimit = promo.usage_limit_per_user || 1;
            if (count >= usageLimit) {
                setPromoError(`You've already used this code the maximum (${usageLimit}) times.`);
                return;
            }

            // كل الشروط تمام: نطبّق الكود
            setAppliedPromo(promo);
            toast.success(`Promo "${promo.code}" applied!`);
        } catch (err) {
            console.error('Promo check error:', err);
            setPromoError('Something went wrong, please try again.');
        } finally {
            setPromoLoading(false);
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoInput('');
        setPromoError('');
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // حماية: لو السلة فاضية نمنع الـ submit
        if (cartItems.length === 0) {
            return toast.error("Your cart is empty! Add some perfumes first.");
        }

        setLoading(true);

        // 🔁 NEW: نخصم الستوك أولاً لكل منتج في الكارت، قبل أي حاجة تانية.
        // بنستخدم decrement_stock (RPC) عشان الخصم يحصل بأمان حتى لو
        // أكتر من عميل بيشتروا في نفس اللحظة (atomic check + update في قاعدة البيانات نفسها).
        // لو منتج واحد فشل (مفيش كمية كافية)، نوقف العملية كلها ونرجّع
        // أي منتجات سبق خصمها قبل الفشل ده (rollback يدوي).
        const decrementedItems = []; // عشان نعرف نرجّعهم لو حصل فشل في النص

        for (const item of cartItems) {
            const legacyId = item.product.legacy_id ?? item.product.id;
            const { data: success, error: stockError } = await supabase
                .rpc('decrement_stock', { p_legacy_id: legacyId, p_quantity: item.quantity });

            if (stockError || !success) {
                // فشل: نرجّع كل اللي خصمناه قبل كده في اللوب ده
                for (const done of decrementedItems) {
                    await supabase.rpc('increment_stock', {
                        p_legacy_id: done.legacyId,
                        p_quantity: done.quantity,
                    });
                }
                toast.error(`"${item.product.name}" is out of stock or quantity not available.`);
                setLoading(false);
                return;
            }

            decrementedItems.push({ legacyId, quantity: item.quantity });
        }

        try {
            // 1. نجيب اليوزر الحالي لو مسجل دخول
            const { data: { user: currentUser } } = await supabase.auth.getUser();

            // 2. نجهز المنتجات على شكل مصفوفة (Array) عشان تدخل في خانة الـ items الـ jsonb
            const orderItemsFormatted = cartItems.map(item => ({
                id: item.product._id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price
            }));

            // 3. نبعت الداتا للـ Supabase بالعواميد المظبوطة لجدولك
            const { data, error } = await supabase
                .from('orders')
                .insert([{
                    user_id: currentUser?.id || null,             // لو زائر هينزل null وعادي جداً
                    user_email: currentUser?.email || "guest@goldenflower.com", // إيميله لو موجود
                    items: orderItemsFormatted,            // المنتجات متجمعة هنا جوه الـ jsonb
                    total: total,                          // إجمالي الحساب (بعد الخصم لو فيه)
                    customer_name: formData.fullName,      // اسم العميل الحقيقي من الفورم
                    phone: formData.phone,                 // تليفونه
                    governorate: formData.governorate,     // محافظته
                    address: formData.address,             // عنوانه
                    status: 'Pending'                      // حالة الأوردر تبدأ Pending
                }])
                .select();

            if (error) {
                // 🔁 NEW: فشل إنشاء الأوردر بعد ما خصمنا الستوك فعلاً → لازم نرجّعه
                for (const done of decrementedItems) {
                    await supabase.rpc('increment_stock', {
                        p_legacy_id: done.legacyId,
                        p_quantity: done.quantity,
                    });
                }
                throw error;
            }

            // 4. 🔁 لو فيه كود خصم مُطبّق وفعلاً عندنا يوزر، نسجّل إن الكود ده استُخدم
            if (appliedPromo && currentUser) {
                const { error: usageInsertError } = await supabase
                    .from('promo_code_usage')
                    .insert([{ promo_code_id: appliedPromo.id, user_id: currentUser.id }]);

                if (usageInsertError) {
                    // ما نوقفش الأوردر عشان الـ usage تسجيل فشل، بس نسجل في الكونسول للمراجعة
                    console.error('Failed to record promo usage:', usageInsertError.message);
                }
            }

            // 5. نجاح الأوردر وتصفير السلة
            toast.success("💥 Order placed! We'll call you soon to confirm.");
            clearCart(); // تصفير السلة بتاعتك من الـ Context والـ LocalStorage

            // تحويل العميل لصفحة البروفايل
            navigate('/userProfile');

        } catch (err) {
            console.error("Supabase Error:", err);
            toast.error(err.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0e0e0e] text-gray-900 dark:text-white py-12 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* الجزء الشمال: فورم بيانات الشحن */}
                <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
                    <div className="bg-white dark:bg-[#141414] border border-gray-100 dark:border-white/5 p-6 rounded-2xl shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                            <FiTruck className="text-[#D4AF37]" /> Shipping Details
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 font-bold block mb-1">Full Name</label>
                                <input type="text" name="fullName" required onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#1c1c1c] border border-gray-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]/50" placeholder="Ahmed Mohamed" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 font-bold block mb-1">Phone Number</label>
                                    <input type="tel" name="phone" required onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#1c1c1c] border border-gray-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]/50" placeholder="010xxxxxxx" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-bold block mb-1">Governorate</label>
                                    <input type="text" name="governorate" required onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#1c1c1c] border border-gray-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]/50" placeholder="Cairo" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 font-bold block mb-1">Full Address</label>
                                <input type="text" name="address" required onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#1c1c1c] border border-gray-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]/50" placeholder="Street, Building, Floor..." />
                            </div>
                        </div>

                        <div className="mt-6 p-3.5 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl text-xs text-gray-400">
                            💵 <span className="font-bold text-[#D4AF37]">Payment:</span> Cash on Delivery (COD).
                        </div>
                    </div>

                    <button type="submit" disabled={loading || cartItems.length === 0} className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-40">
                        {loading ? "Placing Order..." : "Confirm Order"}
                    </button>
                </form>

                {/* الجزء اليمين: ملخص المنتجات الحقيقية من الـ Cart */}
                <div className="lg:col-span-5">
                    <div className="bg-white dark:bg-[#141414] border border-gray-100 dark:border-white/5 p-6 rounded-2xl shadow-sm sticky top-8">
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <FiShoppingBag className="text-[#D4AF37]" /> Order Summary
                        </h3>

                        <div className="divide-y divide-gray-100 dark:divide-white/5 max-h-[300px] overflow-y-auto pr-1">
                            {cartItems.length === 0 ? (
                                <p className="text-xs text-gray-400 py-4 text-center">Your cart is empty.</p>
                            ) : (
                                cartItems.map(item => (
                                    <div key={item.product._id} className="py-3 flex justify-between items-center text-xs">
                                        <div>
                                            <p className="font-bold">{item.product.name}</p>
                                            <p className="text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="font-bold">{(item.product.price * item.quantity)} EGP</span>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* 🔁 قسم كود الخصم */}
                        <div className="border-t border-gray-100 dark:border-white/5 mt-4 pt-4">
                            {checkingUser ? null : !user ? (
                                // ── Guest: رسالة + زرارين Sign In / Sign Up ──
                                <div className="bg-gray-50 dark:bg-[#1c1c1c] border border-gray-100 dark:border-white/5 rounded-xl p-3.5">
                                    <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
                                        <FiTag size={12} className="text-[#D4AF37]" />
                                        Have a promo code? Sign in to use it.
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/auth')}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-xs font-bold uppercase tracking-wide hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                                        >
                                            <FiLogIn size={12} /> Sign In
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/auth')}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wide transition-all"
                                        >
                                            <FiUserPlus size={12} /> Sign Up
                                        </button>
                                    </div>
                                </div>
                            ) : appliedPromo ? (
                                // ── كود مُطبّق فعلاً: نعرض Label الخصم ──
                                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/40 rounded-xl p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FiTag size={13} className="text-green-600 dark:text-green-400" />
                                        <span className="text-xs font-bold text-green-700 dark:text-green-400">
                                            {appliedPromo.code} applied
                                        </span>
                                    </div>
                                    <button type="button" onClick={handleRemovePromo} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <FiX size={14} />
                                    </button>
                                </div>
                            ) : (
                                // ── يوزر مسجل دخول، مفيش كود متطبّق لسه: حقل الإدخال ──
                                <div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={promoInput}
                                            onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
                                            placeholder="Promo code"
                                            className="flex-1 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-100 dark:border-white/5 rounded-xl px-3.5 py-2.5 text-xs uppercase focus:outline-none focus:border-[#D4AF37]/50"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyPromo}
                                            disabled={promoLoading || !promoInput.trim()}
                                            className="px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-[#D4AF37] text-white text-[11px] font-bold uppercase tracking-wide hover:bg-[#D4AF37] dark:hover:bg-[#B8860B] transition-all disabled:opacity-40"
                                        >
                                            {promoLoading ? '...' : 'Apply'}
                                        </button>
                                    </div>
                                    {promoError && (
                                        <p className="text-[11px] text-red-500 mt-1.5">{promoError}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-100 dark:border-white/5 mt-4 pt-4 space-y-2 text-xs">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>{subtotal} EGP</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Shipping</span>
                                <span>{shipping} EGP</span>
                            </div>
                            {/* 🔁 سطر الخصم، يظهر بس لو فيه كود مُطبّق */}
                            {appliedPromo && (
                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Discount ({appliedPromo.code})</span>
                                    <span>-{discountAmount.toFixed(2)} EGP</span>
                                </div>
                            )}
                            <div className="flex justify-between font-black text-sm pt-2 border-t border-dashed border-gray-100 dark:border-white/5">
                                <span>Total</span>
                                <span className="text-[#D4AF37]">{total.toFixed(2)} EGP</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}