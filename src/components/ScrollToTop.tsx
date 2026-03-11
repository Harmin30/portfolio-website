"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          // The "Ghost" style: Transparent background, thin border
          className="fixed bottom-8 right-8 z-50 p-3.5 
                     bg-white/10 dark:bg-black/20 
                     backdrop-blur-sm
                     border border-zinc-200/50 dark:border-zinc-800/50
                     text-zinc-900 dark:text-zinc-100 
                     rounded-full shadow-sm
                     group flex items-center justify-center"
        >
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r="19"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="1.5"
            />
            <motion.circle
              cx="20"
              cy="20"
              r="19"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="1"
              pathLength="1"
              strokeLinecap="round"
              style={{ pathLength: smoothProgress }}
            />
          </svg>

          <ArrowUp size={18} strokeWidth={2} className="relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}