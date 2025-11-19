import { useState } from "react";
import MessageCall from "./MessageCall";
import { MoreHorizontal, X } from "lucide-react";
import ChatWithAdmin from "./ChatWithAdmin";
import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';
import { motion } from "framer-motion";
export default function SupportWidget({ targetUser }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.8, transition: { duration: 0.2 } },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 font-sans">

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="flex flex-col gap-3 mb-1 items-end"
                    >
                        <motion.div variants={itemVariants}>
                            <MessageCall target={targetUser} />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <ChatWithAdmin />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={clsx(
                    "flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ease-in-out border-4",
                    isExpanded
                        ? "bg-gray-100 text-gray-600 border-gray-200 rotate-90"
                        : "bg-blue-600 text-white border-white hover:shadow-blue-500/40"
                )}
            >
                {isExpanded ? (
                    <X size={28} />
                ) : (
                    <MoreHorizontal size={28} />
                )}
            </motion.button>
        </div>
    );
}