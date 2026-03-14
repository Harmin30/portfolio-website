"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Check } from "lucide-react"; // or lucide-react

export default function LandingIntro({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [isNameLoaded, setIsNameLoaded] = useState(false);
  const [canShowSuccess, setCanShowSuccess] = useState(false);

  // 1. Fetch Name (Keep logic, just trigger start)
  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setDisplayName(data.name ? data.name.toUpperCase() : "HARMIN PATEL");
        } else {
          setDisplayName("HARMIN PATEL");
        }
      } catch (error) {
        setDisplayName("HARMIN PATEL");
      } finally {
        setIsNameLoaded(true);
      }
    };
    fetchName();
  }, []);

  // 2. Faster Progress (Reduced interval from 20ms to 12ms)
  useEffect(() => {
    if (!isNameLoaded) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 1;
        clearInterval(interval);
        return 100;
      });
    }, 12);

    return () => clearInterval(interval);
  }, [isNameLoaded]);

  // 3. Snappier Success Logic (Buffers reduced significantly)
  useEffect(() => {
    if (progress === 100 && isNameLoaded) {
      const timer = setTimeout(() => {
        setCanShowSuccess(true);
        // Reduced from 1500ms to 800ms
        setTimeout(onFinish, 800);
      }, 250); 

      return () => clearTimeout(timer);
    }
  }, [progress, isNameLoaded, onFinish]);

  const nameArray = displayName.split("");
  const isComplete = canShowSuccess; 
  const pulseDuration = isComplete ? 1.5 : 4 - (progress / 100) * 3;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        scaleY: 0.005,
        scaleX: 1.2,
        opacity: 0,
        filter: "brightness(3) blur(4px)",
        transition: { duration: 0.4, ease: [0.19, 1, 0.22, 1] },
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] text-white overflow-hidden selection:bg-none"
    >
      {/* CRT Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(255,255,255,0.25)_50%)] bg-[length:100%_3px] md:bg-[length:100%_4px]" />

      <motion.div
        initial={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          borderColor: isComplete
            ? "rgba(52, 211, 153, 0.4)"
            : "rgba(255, 255, 255, 0.12)",
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-[90%] h-[85%] md:w-[85%] md:h-[80%] flex items-center justify-center border rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden transition-colors duration-700"
        style={{
          boxShadow: isComplete
            ? "inset 0 0 50px rgba(52, 211, 153, 0.12)"
            : "inset 0 0 20px rgba(255, 255, 255, 0.02)",
        }}
      >
        {/* Background Glow */}
        <motion.div
          animate={{
            scale: isComplete ? [1, 1.2, 1] : [1, 1.1, 1],
            opacity: isComplete ? 0.4 : [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: pulseDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] blur-[80px] md:blur-[130px] rounded-full transition-all duration-700 ${
            isComplete ? "bg-emerald-400/30" : "bg-blue-600/15"
          }`}
        />

        <div className="relative flex flex-col items-center z-10 px-4 w-full text-center">
          <div className="overflow-hidden py-4 min-h-[60px] md:min-h-[80px] flex items-center justify-center">
            <AnimatePresence>
              {isNameLoaded && (
                <motion.h1
                  initial="hidden"
                  animate="visible"
                  className="text-2xl sm:text-4xl md:text-5xl font-black tracking-[0.2em] md:tracking-[0.4em] flex justify-center relative"
                >
                  {nameArray.map((char, i) => (
                    <motion.span
                      key={`${displayName}-${i}`}
                      variants={{
                        hidden: {
                          y: "115%",
                          opacity: 0,
                          skewX: 15,
                          filter: "blur(5px)",
                        },
                        visible: {
                          y: 0,
                          opacity: 1,
                          skewX: 0,
                          filter: "blur(0px)",
                          transition: {
                            duration: 0.6,
                            ease: [0.22, 1, 0.36, 1],
                            delay: i * 0.02,
                          },
                        },
                      }}
                      className="inline-block relative"
                    >
                      {char === " " ? "\u00A0" : char}
                      
                      {/* Restored Shimmer Animation */}
                      <motion.span
                        animate={{
                          opacity: isComplete ? [0, 0.4, 0] : [0, 0.6, 0],
                          left: ["-150%", "250%"],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: 0.5 + i * 0.05,
                          repeatDelay: 2,
                        }}
                        className="absolute inset-0 skew-x-12 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />
                    </motion.span>
                  ))}
                </motion.h1>
              )}
            </AnimatePresence>
          </div>

          {/* Status and Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex flex-col items-center gap-4 mt-2"
          >
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                {isComplete ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                  >
                    <Check size={14} strokeWidth={3} />
                  </motion.div>
                ) : (
                  <div className="w-1 h-1 rounded-full bg-blue-500 animate-ping" />
                )}
              </AnimatePresence>
              <span
                className={`text-[8px] md:text-[9px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-bold transition-all duration-500 ${isComplete ? "text-emerald-400" : "text-zinc-500"}`}
              >
                {isComplete ? "Connection Secured" : "Establishing Connection"}
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="relative w-32 md:w-44 h-[1px] md:h-[2px] bg-zinc-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${progress}%`,
                    backgroundColor: isComplete ? "#10b981" : "#3b82f6",
                  }}
                  transition={{
                    ease: "linear",
                    duration: 0.01,
                  }}
                  className="absolute inset-0"
                  style={{
                    boxShadow: isComplete ? "0 0 15px rgba(16,185,129,0.5)" : "",
                  }}
                />
              </div>

              <div className="flex justify-between w-32 md:w-44 px-1">
                <span
                  className={`text-[6px] md:text-[7px] font-mono tracking-tighter uppercase transition-colors duration-500 ${isComplete ? "text-emerald-500" : "text-zinc-700"}`}
                >
                  {isComplete ? "SYSTEM_READY" : `LOAD_0${progress}%`}
                </span>
                <span className="text-[6px] md:text-[7px] font-mono text-zinc-800 tracking-tighter">
                  V.2.0.26
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}