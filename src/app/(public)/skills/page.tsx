"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skill } from "@/types";
import { Loader2 } from "lucide-react";

const categories = ["frontend", "backend", "database", "tools"] as const;

const getIconSlug = (name: string) => {
  const normalized = name.toLowerCase().trim();
  const map: Record<string, string> = {
    html: "html5",
    css: "css3",
    js: "javascript",
    ts: "typescript",
    next: "nextdotjs",
    node: "nodedotjs",
    gemini: "googlegemini",
    chatgpt: "openai",
    openai: "openai",
    perplexity: "perplexity",
    claude: "anthropic",
    net: "dotnet",
    ".net": "dotnet",
    aspnet: "dotnet",
    aspdotnetcoremvc: "dotnet",
    "asp.net core mvc": "dotnet",
    "sql server": "microsoftsqlserver",
    "sql server management studio": "microsoftsqlserver",
    ssms: "microsoftsqlserver",
    "visual studio": "visualstudio",
    vscode: "visualstudiocode",
    photoshop: "adobephotoshop",
    lightroom: "adobelightroom",
    premiere: "adobepremierepro",
    "after effects": "adobeaftereffects",
    "da vinci": "davinciresolve",
    capcut: "capcut",
    figma: "figma",
  };
  if (map[normalized]) return map[normalized];
  return normalized
    .replace(/\s+/g, "")
    .replace(/\.js/g, "dotjs")
    .replace(/\./g, "dot")
    .replace(/[^a-z0-9]/g, "");
};

// Icons whose brand color is black/very dark — need light override in dark mode
const DARK_ICONS = new Set([
  "github",
  "x",
  "xdotcom",
  "notion",
  "vercel",
  "nextdotjs",
  "figma",
  "openai",
  "anthropic",
  "apple",
  "stripe",
  "linear",
  "raycast",
  "microsoftsqlserver",
  "visualstudio",
  "visualstudiocode",
  "dotnet",
  "adobephotoshop",
  "adobelightroom",
  "adobepremierepro",
  "adobeaftereffects",
  "capcut",
  "davinciresolve",
  "perplexity",
]);

function SkillIcon({ name, isDark }: { name: string; isDark: boolean }) {
  const slug = getIconSlug(name);
  const needsLightOverride = isDark && DARK_ICONS.has(slug);
  const src = needsLightOverride
    ? `https://cdn.simpleicons.org/${slug}/e4e4e7` // zinc-200 — visible but not harsh white
    : `https://cdn.simpleicons.org/${slug}`;

  const imgRef = useRef<HTMLImageElement>(null);

  // Re-fire when theme flips
  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.dataset.triedBackup = "";
      imgRef.current.src = src;
    }
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={name}
      className="w-full h-full object-contain"
      onError={(e) => {
        const t = e.currentTarget;
        if (!t.dataset.triedBackup) {
          t.dataset.triedBackup = "true";
          t.src = `https://unpkg.com/simple-icons@v13/icons/${slug}.svg`;
        } else {
          t.style.display = "none";
          const p = t.parentElement;
          if (p)
            p.innerHTML = `<span class="text-sm font-black ${isDark ? "text-blue-400" : "text-blue-600"} uppercase">${name.charAt(0)}</span>`;
        }
      }}
    />
  );
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeCat, setActiveCat] = useState<string>("frontend");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Track real-time theme
  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

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
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    }
  }, []);

  const filteredSkills = skills.filter((s) => s.category === activeCat);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 pt-32 p-4 sm:p-10 lg:pt-44 lg:p-24 overflow-x-hidden font-sans relative"
    >
      {/* ── Ambient background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <motion.div
          animate={{ x: mousePos.x * 3, y: mousePos.y * 3 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-400/8 dark:bg-blue-600/6 rounded-full blur-[130px]"
        />
        <motion.div
          animate={{ x: -mousePos.x * 2, y: -mousePos.y * 2 }}
          transition={{ type: "spring", stiffness: 30, damping: 20 }}
          className="absolute bottom-[-10%] left-[5%] w-[500px] h-[500px] dark:bg-zinc-700/10 bg-slate-300/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* ── Header ── */}
        <header className="mb-16 md:mb-24">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-100 dark:border-white/10 bg-blue-50 dark:bg-white/5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Tech.Stack
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase">
              My <br className="md:hidden" />
              <span className="text-zinc-300 dark:text-zinc-800 italic font-medium">
                Capabilities.
              </span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto md:mx-0 text-base md:text-lg font-light">
              A curated collection of technologies and frameworks I use to
              bridge the gap between complex logic and elegant design.
            </p>
          </motion.div>
        </header>

        {/* ── Layout ── */}
        <div className="flex flex-col lg:grid lg:grid-cols-[200px_1fr] gap-12 items-start">
          {/* Sidebar Nav */}
          <motion.nav
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 sm:flex sm:flex-row lg:flex-col w-full gap-2 px-1"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onMouseEnter={() => {
                  if (window.innerWidth > 1024) setActiveCat(cat);
                }}
                onClick={() => setActiveCat(cat)}
                className="group relative flex-shrink-0 lg:w-full text-left py-3 md:py-4 px-5 rounded-xl transition-all overflow-hidden"
              >
                {activeCat === cat ? (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-xl dark:shadow-none"
                    style={{
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 rounded-xl bg-transparent group-hover:bg-zinc-100 dark:group-hover:bg-white/[0.04] border border-transparent group-hover:border-zinc-200 dark:group-hover:border-white/8 transition-all duration-300" />
                )}
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <span
                    className={`text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black transition-all ${activeCat === cat ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-300"}`}
                  >
                    {cat}
                  </span>
                  {activeCat === cat && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400"
                    />
                  )}
                </div>
              </button>
            ))}
          </motion.nav>

          {/* Skills Grid */}
          <motion.div
            style={{
              rotateY: mousePos.x / 8,
              rotateX: -mousePos.y / 8,
              perspective: "1400px",
            }}
            className="w-full"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5"
              >
                {filteredSkills.map((skill, idx) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.94, y: 14 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: idx * 0.05,
                      duration: 0.38,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="group relative rounded-3xl overflow-hidden cursor-default"
                    style={{
                      background: "var(--card-bg)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1px solid var(--card-border)",
                      boxShadow: "var(--card-shadow)",
                    }}
                  >
                    {/* Hover shimmer */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                      style={{ background: "var(--card-hover-shimmer)" }}
                    />

                    <div className="relative z-10 p-5 flex flex-col gap-5">
                      <div className="flex justify-between items-start">
                        {/* Icon box */}
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center p-2.5 transition-all duration-500 group-hover:scale-110"
                          style={{
                            background: "var(--icon-bg)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid var(--icon-border)",
                            boxShadow: "var(--icon-shadow)",
                          }}
                        >
                          <SkillIcon name={skill.name} isDark={isDark} />
                        </div>

                        {/* Level bars */}
                        <div className="flex flex-col gap-[3px] pt-0.5">
                          {[1, 2, 3].map((dot) => {
                            const filled =
                              dot <=
                              (skill.level === "advanced"
                                ? 3
                                : skill.level === "intermediate"
                                  ? 2
                                  : 1);
                            return (
                              <div
                                key={dot}
                                className={`h-[5px] w-5 rounded-full transition-all ${filled ? "bg-blue-600 dark:bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" : "bg-zinc-200 dark:bg-white/10"}`}
                              />
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[10px] md:text-xs font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                          {skill.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse" />
                          <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                            {skill.level}
                          </span>
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

      <style>{`
        :root {
          --card-bg: rgba(255, 255, 255, 0.55);
          --card-border: rgba(0, 0, 0, 0.07);
          --card-shadow: 0 4px 24px rgba(0, 0, 0, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.9);
          --card-hover-shimmer: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          --icon-bg: rgba(255, 255, 255, 0.8);
          --icon-border: rgba(0, 0, 0, 0.08);
          --icon-shadow: 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1);
        }
        .dark {
          --card-bg: rgba(255, 255, 255, 0.04);
          --card-border: rgba(255, 255, 255, 0.08);
          --card-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.5);
          --card-hover-shimmer: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
          --icon-bg: rgba(255, 255, 255, 0.07);
          --icon-border: rgba(255, 255, 255, 0.12);
          --icon-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 12px rgba(0,0,0,0.3);
        }
      `}</style>
    </motion.div>
  );
}
