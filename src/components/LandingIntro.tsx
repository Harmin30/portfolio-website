"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

export default function LandingIntro({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [isNameLoaded, setIsNameLoaded] = useState(false);

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

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 1;
        clearInterval(interval);
        return 100;
      });
    }, 20);

    const timer = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onFinish]);

  const nameArray = displayName.split("");
  const isComplete = progress === 100;
  const pulseDuration = isComplete ? 2 : 5 - (progress / 100) * 4.2; 

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        scaleY: 0.002,
        scaleX: 1.4,
        opacity: 0,
        filter: "brightness(4) blur(2px)",
        transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] } 
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] text-white overflow-hidden selection:bg-none"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(255,255,255,0.25)_50%)] bg-[length:100%_3px] md:bg-[length:100%_4px]" />

      {/* INTENSIFIED SUCCESS GLOW */}
      <motion.div
        animate={{
          scale: isComplete ? [1, 1.25, 1] : [1, 1.15, 1],
          opacity: isComplete ? 0.45 : [0.08, 0.2, 0.08],
        }}
        transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute w-[320px] h-[320px] md:w-[700px] md:h-[700px] blur-[100px] md:blur-[160px] rounded-full transition-all duration-1000 ${
          isComplete ? "bg-emerald-400/30" : "bg-blue-600/15"
        }`}
      />

      <div className="relative flex flex-col items-center z-10 px-4 w-full">
        <div className="overflow-hidden py-4 min-h-[60px] md:min-h-[80px] flex items-center">
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
                      hidden: { y: "115%", opacity: 0, skewX: 15, filter: "blur(5px)" },
                      visible: { 
                        y: 0, 
                        opacity: 1, 
                        skewX: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.03 } 
                      },
                    }}
                    animate={{ x: [0, -0.5, 0.5, 0] }}
                    transition={{ duration: 0.15, delay: 0.5 + (i * 0.02) }}
                    className="inline-block relative"
                  >
                    {char === " " ? "\u00A0" : char}
                    
                    <motion.span 
                      animate={{
                        opacity: isComplete ? [0, 0.6, 0] : [0, 0.7, 0],
                        left: ["-150%", "250%"]
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: 1 + (i * 0.08),
                        repeatDelay: 2.5
                      }}
                      className="absolute inset-0 skew-x-12 pointer-events-none bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                  </motion.span>
                ))}
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
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
             <span className={`text-[8px] md:text-[9px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-bold transition-all duration-700 ${isComplete ? "text-emerald-400" : "text-zinc-500"}`}>
               {isComplete ? "Connection Secured" : "Establishing Connection"}
             </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative w-32 md:w-44 h-[1px] md:h-[2px] bg-zinc-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ 
                  width: `${progress}%`,
                  backgroundColor: isComplete ? "#10b981" : "#3b82f6" 
                }}
                transition={{ ease: "easeInOut", backgroundColor: { duration: 0.6 } }}
                className="absolute inset-0"
                style={{ 
                  boxShadow: isComplete ? "0 0 20px rgba(16,185,129,0.8)" : "" 
                }}
              />
            </div>
            
            <div className="flex justify-between w-32 md:w-44 px-1">
              <span className={`text-[6px] md:text-[7px] font-mono tracking-tighter uppercase transition-colors duration-700 ${isComplete ? "text-emerald-500" : "text-zinc-700"}`}>
                {isComplete ? "SYSTEM_READY" : `LOAD_0${progress}%`}
              </span>
              <span className="text-[6px] md:text-[7px] font-mono text-zinc-800 tracking-tighter">V.2.0.26</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* GREEN BORDER - KEPT AND TRANSITION INTENSIFIED */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          borderColor: isComplete ? "rgba(52, 211, 153, 0.4)" : "rgba(255, 255, 255, 0.03)"
        }}
        transition={{ delay: 0.3, duration: 1.2 }}
        className="absolute inset-6 md:inset-12 pointer-events-none border rounded-[1.5rem] md:rounded-[2.5rem] transition-colors duration-1000"
        style={{
          boxShadow: isComplete ? "inset 0 0 40px rgba(52, 211, 153, 0.08)" : "none"
        }}
      />
    </motion.div>
  );
}