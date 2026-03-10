"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const letter = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function LandingIntro({
  onFinish,
}: {
  onFinish: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const name = "HARMIN PATEL".split("");

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white overflow-hidden px-6"
    >
      {/* subtle background glow */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute w-[420px] h-[420px] bg-blue-500/30 blur-[140px] rounded-full"
      />

      <div className="relative text-center">

        {/* top line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
          className="origin-left h-[2px] bg-white/70 mx-auto mb-6 w-[160px]"
        />

        {/* animated name */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[0.2em]"
        >
          {name.map((char, i) => (
            <motion.span
              key={i}
              variants={letter}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.6 }}
          className="text-xs mt-3 tracking-[0.3em] text-gray-400 uppercase"
        >
          loading portfolio
        </motion.p>

        {/* loading dots */}
        <div className="flex justify-center gap-1 mt-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          ))}
        </div>

        {/* bottom line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="origin-right h-[2px] bg-white/70 mx-auto mt-6 w-[160px]"
        />

      </div>
    </motion.div>
  );
}