import { motion } from "framer-motion";
import { IoFlowerOutline } from "react-icons/io5";

const Preloader = () => {
    return (
        <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-white"
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "linear",
                }}
            >
                <IoFlowerOutline
                    size={96}
                    className="text-[#D4AF37]"
                />
            </motion.div>
        </motion.div>
    );
};

export default Preloader;
