import { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FiTruck, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../Context/CartContext'; // 👈 استيراد الكونتكست بتاعك هنا

export default function Checkout() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 💡 سحب البيانات والفانكشنز من السلة الحقيقية بتاعتك
    const { cartItems, clearCart } = useCart(); 

    // حساب الحسابات ديناميكياً بناءً على عطور العميل
    const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const shipping = cartItems.length > 0 ? 50 : 0; // 50 جنيه شحن لو السلة مش فاضية
    const total = subtotal + shipping;

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        governorate: '',
        address: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        // حماية: لو السلة فاضية نمنع الـ submit
        if (cartItems.length === 0) {
            return toast.error("Your cart is empty! Add some perfumes first.");
        }
        
        setLoading(true);
    
        try {
            // 1. نجيب اليوزر الحالي لو مسجل دخول
            const { data: { user } } = await supabase.auth.getUser();
    
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
                    user_id: user?.id || null,             // لو زائر هينزل null وعادي جداً
                    user_email: user?.email || "guest@goldenflower.com", // إيميله لو موجود
                    items: orderItemsFormatted,            // المنتجات متجمعة هنا جوه الـ jsonb
                    total: total,                          // إجمالي الحساب (اسم العامود عندك total)
                    customer_name: formData.fullName,      // اسم العميل الحقيقي من الفورم
                    phone: formData.phone,                 // تليفونه
                    governorate: formData.governorate,     // محافظته
                    address: formData.address,             // عنوانه
                    status: 'Pending'                      // حالة الأوردر تبدأ Pending
                }])
                .select();
    
            if (error) throw error;
    
            // 4. نجاح الأوردر وتصفير السلة
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

                        <div className="border-t border-gray-100 dark:border-white/5 mt-4 pt-4 space-y-2 text-xs">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>{subtotal} EGP</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Shipping</span>
                                <span>{shipping} EGP</span>
                            </div>
                            <div className="flex justify-between font-black text-sm pt-2 border-t border-dashed border-gray-100 dark:border-white/5">
                                <span>Total</span>
                                <span className="text-[#D4AF37]">{total} EGP</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}