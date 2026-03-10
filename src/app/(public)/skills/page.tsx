"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skill } from "@/types";
import { Loader2, Terminal, Cpu, Database, Wrench, Layout, Activity, Zap, Radio } from "lucide-react";

const categories = ["frontend", "backend", "database", "tools"] as const;

const getIconSlug = (name: string) => {
  const map: Record<string, string> = {
    "js": "javascript", "javascript": "javascript", "ts": "typescript", "typescript": "typescript",
    "react": "react", "next": "nextdotjs", "nextjs": "nextdotjs", "node": "nodedotjs",
    "mongodb": "mongodb", "postgresql": "postgresql", "mysql": "mysql", "html": "html5",
    "css": "css3", "tailwind": "tailwindcss", "git": "git", "docker": "docker",
  };
  const normalized = name.toLowerCase().trim();
  return map[normalized] || normalized.replace(/\s+/g, '');
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeCat, setActiveCat] = useState<string>("frontend");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (window.innerWidth > 1024) {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10
      });
    }
  }, []);

  const filteredSkills = skills.filter((s) => s.category === activeCat);

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
    </div>
  );

// ... (rest of your imports and logic stay exactly the same)

  return (
    <motion.div 
      initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      /* FIXED: 
         - Changed pt-24 to pt-32 for better mobile spacing.
         - Changed lg:p-24 to lg:pt-44 to prevent desktop overlap.
      */
      className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 pt-32 p-4 sm:p-10 lg:pt-44 lg:p-24 overflow-hidden font-sans relative"
    >
      {/* --- PREMIUM BACKGROUND ENGINE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1] bg-[size:40px_40px] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)]" />
        <motion.div 
          animate={{ x: mousePos.x * 3, y: mousePos.y * 3 }}
          className="absolute top-[-15%] right-[-5%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* --- DYNAMIC KINETIC HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 group">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Radio size={12} className="animate-pulse" />
              <span className="text-[10px] font-mono font-black tracking-[0.5em] uppercase opacity-70">
                Live.Inventory
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.8] italic">
              STREAMS<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
                CAPABILITIES
              </span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="hidden lg:flex items-center gap-8 border-l border-zinc-200 dark:border-zinc-800 pl-8 h-16"
          >
            <div className="text-right">
              <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Signal.Strength</p>
              <p className="text-xs font-bold font-mono text-blue-600">OPTIMAL</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Last.Fetch</p>
              <p className="text-xs font-bold font-mono">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </motion.div>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-[200px_1fr] gap-12 items-start">
          {/* --- SIDEBAR NAV --- */}
          <motion.nav 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex lg:flex-col w-full gap-1 overflow-x-auto lg:overflow-visible no-scrollbar pb-4 lg:pb-0"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onMouseEnter={() => { if(window.innerWidth > 1024) setActiveCat(cat) }}
                onClick={() => setActiveCat(cat)}
                className="group relative flex-shrink-0 lg:w-full text-left py-4 px-5 rounded-xl transition-all"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <span className={`text-[11px] uppercase tracking-[0.2em] font-black transition-all ${
                    activeCat === cat ? "text-blue-600" : "text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"
                  }`}>
                    {cat}
                  </span>
                  <Activity size={10} className={`hidden lg:block transition-all ${activeCat === cat ? "text-blue-600 opacity-100" : "opacity-0 -translate-x-2"}`} />
                </div>
                {activeCat === cat && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl" />
                )}
              </button>
            ))}
          </motion.nav>

          {/* --- COMPACT GRID --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ rotateY: mousePos.x / 6, rotateX: -mousePos.y / 6, perspective: "1200px" }}
            className="w-full"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCat}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
              >
                {filteredSkills.map((skill, i) => (
                  <motion.div
                    key={skill.id}
                    whileHover={{ y: -5, translateZ: 20 }}
                    className="group relative p-5 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl transition-all duration-300 hover:border-blue-500/40 overflow-hidden"
                  >
                    <div className="relative z-10 flex flex-col gap-5">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-2.5 transition-transform group-hover:rotate-6">
                          <img 
                            src={`https://cdn.simpleicons.org/${getIconSlug(skill.name)}`}
                            alt={skill.name}
                            className="w-full h-full object-contain dark:brightness-200"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) parent.innerHTML = `<span class="text-[10px] font-bold opacity-30 uppercase">${skill.name.charAt(0)}</span>`;
                            }}
                          />
                        </div>
                        <div className="flex gap-[2px]">
                          {[1, 2, 3].map((dot) => (
                            <div 
                              key={dot}
                              className={`h-1 w-2.5 rounded-full ${
                                dot <= (skill.level === 'advanced' ? 3 : skill.level === 'intermediate' ? 2 : 1)
                                ? "bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.4)]" : "bg-zinc-200 dark:border-zinc-800"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-black uppercase tracking-tighter text-zinc-900 dark:text-zinc-100 truncate">
                          {skill.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-1 h-1 rounded-full bg-blue-600 animate-pulse" />
                          <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">{skill.level}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* --- TELEMETRY FOOTER --- */}
      <footer className="fixed bottom-8 right-8 hidden md:flex items-center gap-4 text-[9px] font-mono text-zinc-400 uppercase tracking-[0.3em] opacity-30 z-20">
        <div className="h-px w-8 bg-zinc-400" />
        <span>System_Online // Node.js_Environment</span>
      </footer>
    </motion.div>
  );
}