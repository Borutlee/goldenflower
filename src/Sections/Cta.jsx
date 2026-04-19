import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';


const CTA = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true }
  };

  const navigate = useNavigate();

  return (
    <section className="relative py-24 px-4 md:px-10 bg-transparent">
      {/* التعديل هنا: شيلنا bg-white وخلينا الخلفية سوداء أساسية 
          عشان نضمن إن كروم ما يقلبهاش أبيض لو النظام عندك Light Mode
      */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0a] border border-zinc-800 py-20 transition-colors duration-500">

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">

            <motion.span
              {...fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-[#D4AF37] tracking-[0.4em] uppercase text-[10px] font-bold mb-6 block"
            >
              Member Benefits
            </motion.span>

            {/* التعديل هنا: شيلنا text-gray-900 وخلينا اللون text-white صريح 
            */}
            <motion.h2
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-serif text-white leading-[1.1] mb-6"
            >
              Create Your <br />
              <span className="italic font-light text-[#D4AF37]">
                Golden Profile
              </span>
            </motion.h2>

            <motion.p
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-400 text-base md:text-lg mb-10 max-w-lg mx-auto font-light leading-relaxed"
            >
              Register now to track your luxury orders, save your favorite scents,
              and receive personalized fragrance recommendations.
            </motion.p>

            <div className="flex flex-col items-center gap-6">

              <motion.a
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.6,
                  ease: "easeOut"
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.97 }}
                onClick = {() => navigate('/Auth')}
                className="group relative overflow-hidden bg-[#D4AF37] text-white 
                    px-12 py-4 rounded-full font-bold uppercase 
                    tracking-widest text-xs
                    shadow-lg shadow-[#D4AF37]/20
                    hover:shadow-[0_10px_40px_rgba(212,175,55,0.5)]
                    transition-shadow duration-200 cursor-pointer"
                  >
                <span className="relative z-10">Create Account</span>

                <span className="absolute inset-0 
                    bg-gradient-to-r 
                    from-transparent 
                    via-white/40 
                    to-transparent 
                    -translate-x-[100%] 
                    group-hover:translate-x-[100%] 
                    transition-transform 
                    duration-500 ease-in-out" />
              </motion.a>

              <motion.a
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                onClick = {() => navigate('/Auth')}
                className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] 
                            hover:text-[#D4AF37] transition-colors 
                            border-b border-transparent hover:border-[#D4AF37] pb-1 cursor-pointer"
              >
                Already have an account? Sign In
              </motion.a>

            </div>

          </div>
        </div>

        {/* إضافة لمسة فنية: إضاءة خفيفة خلفية عشان تكسر السواد في كروم وتدي شكل Luxury */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.05)_0%,_transparent_70%)] pointer-events-none" />
      </div>
    </section>
  );
};

export default CTA;