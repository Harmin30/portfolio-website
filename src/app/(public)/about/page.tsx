"use client";

import { useEffect, useState, useRef } from "react";
import {
  motion,
  useInView,
  useAnimation,
  Variants,
  useScroll,
  useSpring,
} from "framer-motion";
import type { About, EducationItem, ExperienceItem } from "@/types";
import {
  Loader,
  Download,
  Briefcase,
  BookOpen,
  ArrowRight,
  Sparkles,
  Crown,
} from "lucide-react";

// Hook to detect mobile devices
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    setIsMobile(mobileRegex.test(userAgent));
  }, []);

  return isMobile;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 15 },
  },
};

function ScrollAnimatedSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 60 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  const [about, setAbout] = useState<About | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile(); // Check if device is mobile

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch("/api/about");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setAbout(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] flex flex-col items-center justify-center">
        <Loader className="animate-spin text-blue-500 mb-4" size={32} />
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">
          Loading...
        </p>
      </div>
    );
  }

  // Common image classes with hover effects
  const imageClassesDefault =
    "w-full h-full object-cover grayscale-[100%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.2s] ease-out";
  
  // Image classes for mobile: colorful and no hover effect
  const imageClassesMobile =
    "w-full h-full object-cover grayscale-0 scale-100 transition-none";

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-500/20 blur-[150px] rounded-full animate-pulse" />
      </div>

      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-40"
      >
        <header className="relative mb-32">
          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold"
            >
              <Sparkles size={18} />
              <span className="text-xs uppercase tracking-[0.4em]">
                Full Stack Developer
              </span>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-8"
            >
              Who <br />{" "}
              <span className="text-zinc-300 dark:text-zinc-800 italic font-medium tracking-tight">
                I Am.
              </span>
            </motion.h1>
          </div>
        </header>

        {/* Hero Section */}
        <ScrollAnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-40">
            <div className="lg:col-span-7 space-y-10">
              <h2 className="text-4xl font-bold tracking-tight">About Me</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-xl md:text-2xl leading-relaxed font-light">
                {about?.about_text ||
                  "I'm a developer who loves building clean and useful things for the web."}
              </p>
              <motion.div
                whileHover={isMobile ? {} : { x: 10 }} // Disable hover movement on mobile
                className="inline-flex items-center gap-4 text-blue-600 dark:text-blue-400 font-black cursor-pointer group"
              >
                <span className="text-sm uppercase tracking-widest border-b-2 border-current pb-1">
                  Let&apos;s build something
                </span>
                <ArrowRight
                  size={20}
                  className={
                    isMobile
                      ? "transition-none"
                      : "group-hover:translate-x-2 transition-transform"
                  }
                />
              </motion.div>
            </div>

            <div className={`lg:col-span-5 relative ${isMobile ? "" : "group"}`}>
              <div
                className={`absolute inset-0 bg-blue-500/20 blur-3xl rounded-full ${
                  isMobile
                    ? "opacity-100" // Fully visible on mobile
                    : "group-hover:bg-blue-500/40 transition-all duration-700"
                }`}
              />
              <div
                className={`relative aspect-square rounded-[3.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-2xl ${
                  isMobile
                    ? "transition-none" // No hover effect on mobile
                    : "transition-all duration-500"
                }`}
              >
                <div className="w-full h-full rounded-[2.8rem] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {about?.profile_photo ? (
                    <img
                      src={about.profile_photo}
                      alt="Profile"
                      className={
                        isMobile ? imageClassesMobile : imageClassesDefault
                      }
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-400 italic font-mono uppercase tracking-tighter">
                      Loading photo...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>

        {/* Timeline Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Education */}
          <ScrollAnimatedSection delay={0.1}>
            <div className="space-y-12">
              <div className="flex items-center gap-4 group">
                <div
                  className={`p-3 bg-blue-500/10 rounded-2xl text-blue-500 ${
                    isMobile ? "" : "group-hover:rotate-12"
                  } transition-transform`}
                >
                  <BookOpen size={24} />
                </div>
                <h3 className="text-3xl font-bold tracking-tight">Education</h3>
              </div>

              <div className="space-y-4 border-l-2 border-dashed border-zinc-200 dark:border-zinc-800 ml-6 pl-10 relative">
                {Array.isArray(about?.education) &&
                  (about.education as EducationItem[]).map((edu, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`relative group text-left p-6 rounded-3xl ${
                        isMobile
                          ? "bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
                          : "hover:bg-white dark:hover:bg-zinc-900/50 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                      } transition-all duration-500`}
                    >
                      <div
                        className={`absolute -left-[53px] top-6 p-1.5 rounded-full bg-white dark:bg-[#050505] border-2 border-blue-500 text-blue-500 z-10 ${
                          isMobile
                            ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            : "group-hover:scale-125 group-hover:bg-blue-500 group-hover:text-white"
                        } transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]`}
                      >
                        <Crown
                          size={14}
                          fill="currentColor"
                          fillOpacity={0.2}
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">
                          {edu.year}
                        </span>
                        <h4 className="text-xl font-bold tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                          {edu.degree}
                        </h4>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                          {edu.school}
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </ScrollAnimatedSection>

          {/* Experience */}
          <ScrollAnimatedSection delay={0.2}>
            <div className="space-y-12">
              <div className="flex items-center gap-4 group">
                <div
                  className={`p-3 bg-purple-500/10 rounded-2xl text-purple-500 ${
                    isMobile ? "" : "group-hover:rotate-12"
                  } transition-transform`}
                >
                  <Briefcase size={24} />
                </div>
                <h3 className="text-3xl font-bold tracking-tight">
                  Experience
                </h3>
              </div>

              <div className="space-y-4 border-l-2 border-dashed border-zinc-200 dark:border-zinc-800 ml-6 pl-10 relative">
                {Array.isArray(about?.experience) &&
                  (about.experience as ExperienceItem[]).map((exp, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`relative group text-left p-6 rounded-3xl ${
                        isMobile
                          ? "bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
                          : "hover:bg-white dark:hover:bg-zinc-900/50 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                      } transition-all duration-500`}
                    >
                      <div
                        className={`absolute -left-[53px] top-6 p-1.5 rounded-full bg-white dark:bg-[#050505] border-2 border-purple-500 text-purple-500 z-10 ${
                          isMobile
                            ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                            : "group-hover:scale-125 group-hover:bg-purple-500 group-hover:text-white"
                        } transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.5)]`}
                      >
                        <Crown
                          size={14}
                          fill="currentColor"
                          fillOpacity={0.2}
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em]">
                          {exp.year}
                        </span>
                        <h4 className="text-xl font-bold tracking-tight leading-tight group-hover:text-purple-600 transition-colors">
                          {exp.title}
                        </h4>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                          {exp.company}
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </ScrollAnimatedSection>
        </div>

        {/* CTA Section */}
        {about?.resume_link && (
          <ScrollAnimatedSection delay={0.3}>
            <motion.div
              whileHover={isMobile ? {} : { y: -10 }} // Disable hover movement on mobile
              className={`mt-40 ${
                isMobile ? "" : "group"
              } relative overflow-hidden rounded-[4rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 backdrop-blur-3xl transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/10`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 ${
                  isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                } transition-opacity duration-700`}
              />

              <div className="relative p-12 md:p-20 flex flex-col items-center text-center space-y-8">
                <div
                  className={`inline-flex p-4 bg-zinc-100 dark:bg-zinc-900 rounded-3xl ${
                    isMobile ? "" : "group-hover:rotate-[360deg]"
                  } transition-transform duration-[1s]`}
                >
                  <Sparkles className="text-blue-500" size={32} />
                </div>

                <div className="max-w-2xl space-y-4">
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
                    Want to see <br />{" "}
                    <span className="italic text-zinc-400 dark:text-zinc-600 font-medium tracking-tight">
                      more?
                    </span>
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-lg font-light leading-relaxed">
                    You can find more about my work and history in my resume.
                  </p>
                </div>

                <motion.a
                  href={about?.resume_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={isMobile ? {} : { scale: 1.05 }}
                  whileTap={isMobile ? {} : { scale: 0.95 }}
                  className="relative px-12 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black rounded-full overflow-hidden transition-all shadow-xl group/btn"
                >
                  <span className="relative z-10 flex items-center gap-3 text-lg">
                    <Download size={22} className="group-hover/btn:bounce" />
                    Download Resume
                  </span>
                  <div
                    className={`absolute inset-0 bg-blue-500 ${
                      isMobile
                        ? "translate-y-0"
                        : "translate-y-full group-hover/btn:translate-y-0"
                    } transition-transform duration-300`}
                  />
                </motion.a>
              </div>
            </motion.div>
          </ScrollAnimatedSection>
        )}
      </motion.main>
    </div>
  );
}