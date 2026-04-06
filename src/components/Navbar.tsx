"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Command,
  Sparkles,
  UserCircle,
  FolderOpen,
  Lightbulb,
  Trophy,
  BookOpen,
  MessageSquare,
  ChevronUp,
} from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/certificates", label: "Certificates" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const mainNavTabs = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/about", label: "About", icon: UserCircle },
  { href: "/projects", label: "Projects", icon: FolderOpen },
];

const expandedNavTabs = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/about", label: "About", icon: UserCircle },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/skills", label: "Skills", icon: Lightbulb },
  { href: "/certificates", label: "Certificates", icon: Trophy },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/contact", label: "Contact", icon: MessageSquare },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [expandedNav, setExpandedNav] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Calculate scroll velocity for smooth detection
      const velocity = window.scrollY - lastScrollY;
      setScrollVelocity(velocity);

      // Always show navbar when at or near the top
      if (window.scrollY <= 10) {
        setScrollDirection("up");
      } else if (velocity > 15) {
        // Scrolling down with threshold
        setScrollDirection("down");
      } else if (velocity < -15) {
        // Scrolling up with threshold
        setScrollDirection("up");
      }
      setLastScrollY(window.scrollY);
    };

    const scrollListener = () => {
      // Debounce scroll detection with RAF for smoother updates
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    return () => {
      window.removeEventListener("scroll", scrollListener);
      cancelAnimationFrame(rafId);
    };
  }, [lastScrollY]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Get current page info
  const currentPage = expandedNavTabs.find((page) => isActive(page.href));
  const isHome = pathname === "/";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-[110] w-full transition-all duration-500 ${
          scrolled
            ? "py-4 bg-white dark:bg-[#050505] border-b border-zinc-200 dark:border-zinc-800 shadow-xl"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-2 relative z-[120]"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 transition-transform group-hover:rotate-[10deg]">
                <Command size={22} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base sm:text-lg font-black tracking-tighter uppercase">
                  Portfolio
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-5 py-2 group rounded-full"
                  >
                    <motion.span
                      animate={{ y: active ? -1 : 0 }}
                      className={`relative z-10 block text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
                        active
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-400 group-hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                    >
                      {link.label}
                    </motion.span>

                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 z-0 rounded-full 
                       bg-zinc-900/5 border border-zinc-900/10 shadow-sm
                       dark:bg-white/10 dark:border-white/10 dark:backdrop-blur-md dark:shadow-none"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                          mass: 0.5,
                        }}
                      >
                        <motion.div
                          layoutId="nav-accent-line"
                          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-[1.5px] bg-zinc-900/20 dark:bg-white/30 rounded-full"
                        />
                      </motion.div>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-3 relative z-[120]">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Floating Navigation */}
      <AnimatePresence>
        {/* HOME PAGE - Show main navigation or expanded nav */}
        {isHome && scrollDirection === "up" && !expandedNav ? (
          <motion.nav
            key="compact-nav"
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] lg:hidden will-change-transform"
          >
            {/* Main floating pill */}
            <div className="relative rounded-full bg-gradient-to-br from-white via-white/99 to-zinc-50/98 dark:bg-gradient-to-br dark:from-zinc-800/95 dark:via-zinc-900/98 dark:to-zinc-950/95 border border-zinc-200 dark:border-zinc-700/40 shadow-lg shadow-black/5 px-1.5 sm:px-2 py-1.5 sm:py-2 overflow-hidden will-change-transform backdrop-blur-md">
              {/* Navigation items */}
              <div className="relative flex items-center gap-1.5 z-10">
                {mainNavTabs.map((link) => {
                  const active = isActive(link.href);
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex flex-col items-center gap-0.5 px-2 sm:px-2.5 py-1 sm:py-1.5 relative group"
                    >
                      {active && (
                        <motion.div
                          layoutId="floating-active"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-zinc-400 to-zinc-500 dark:from-zinc-500 dark:to-zinc-600 rounded-full"
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 25,
                          }}
                        />
                      )}

                      <motion.div
                        animate={{
                          scale: active ? 1.2 : 1,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                        className={`relative z-20 transition-colors ${
                          active
                            ? "text-blue-500 dark:text-blue-400"
                            : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"
                        }`}
                      >
                        <Icon
                          size={16}
                          className="sm:size-[18px]"
                          strokeWidth={2}
                        />
                      </motion.div>

                      <motion.span
                        animate={{
                          scale: active ? 1 : 0.9,
                          opacity: active ? 1 : 0.65,
                        }}
                        className={`text-[10px] font-black uppercase tracking-wider relative z-20 ${
                          active
                            ? "text-blue-600 dark:text-blue-400 font-black"
                            : "text-zinc-700 dark:text-zinc-400"
                        }`}
                      >
                        {link.label}
                      </motion.span>
                    </Link>
                  );
                })}

                {/* Divider */}
                <div className="h-5 w-px bg-zinc-300 dark:bg-zinc-600 rounded-full mx-0.5 opacity-30" />

                {/* Expand button */}
                <motion.button
                  onClick={() => setExpandedNav(true)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: [1, 1.04, 1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  className="flex items-center justify-center px-2 py-2 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-all relative z-20"
                >
                  <motion.div
                    animate={{ rotate: expandedNav ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronUp
                      size={18}
                      strokeWidth={2.5}
                      className="text-zinc-600 dark:text-zinc-400"
                    />
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </motion.nav>
        ) : isHome && scrollDirection === "up" && expandedNav ? (
          /* HOME PAGE - Expanded Navigation Menu */
          <motion.nav
            key="expanded-nav"
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] lg:hidden will-change-transform"
          >
            {/* Expanded pill - solid background from start */}
            <div className="relative rounded-2xl bg-gradient-to-br from-white via-white/99 to-zinc-50/98 dark:bg-gradient-to-br dark:from-zinc-800/90 dark:via-zinc-900/98 dark:to-zinc-950/92 border border-zinc-200 dark:border-zinc-700/40 shadow-xl shadow-black/10 p-3 sm:p-4 md:p-5 w-72 sm:w-80 md:w-88 overflow-hidden will-change-transform backdrop-blur-md">
              <div className="relative z-10 grid grid-cols-4 gap-1.5 mb-3">
                {expandedNavTabs.map((link, idx) => {
                  const active = isActive(link.href);
                  const Icon = link.icon;

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setExpandedNav(false)}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all relative group"
                      >
                        {active && (
                          <motion.div
                            layoutId="expanded-active"
                            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-zinc-400 to-zinc-500 dark:from-zinc-500 dark:to-zinc-600 rounded-full"
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 25,
                            }}
                          />
                        )}

                        <motion.div
                          animate={{
                            scale: active ? 1.25 : 1,
                          }}
                          className={`relative z-10 transition-colors ${
                            active
                              ? "text-blue-500 dark:text-blue-400"
                              : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"
                          }`}
                        >
                          <Icon
                            size={20}
                            className="sm:size-[22px]"
                            strokeWidth={1.8}
                          />
                        </motion.div>

                        <span className="text-[8px] sm:text-[9px] font-black uppercase text-zinc-700 dark:text-zinc-200 text-center leading-tight relative z-10">
                          {link.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Close button */}
              <motion.button
                onClick={() => setExpandedNav(false)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10 w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg bg-white/70 dark:bg-white/10 hover:bg-white/95 dark:hover:bg-white/15 transition-all backdrop-blur border border-zinc-300 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-200 font-black uppercase text-[10px] sm:text-[11px] tracking-wide"
              >
                <motion.div
                  animate={{ rotate: 180 }}
                  transition={{ duration: 0 }}
                >
                  <ChevronUp
                    size={12}
                    className="sm:size-[14px]"
                    strokeWidth={2.5}
                  />
                </motion.div>
                <span className="hidden xs:inline">Close</span>
              </motion.button>
            </div>
          </motion.nav>
        ) : !isHome && scrollDirection === "up" && !expandedNav ? (
          /* NON-HOME PAGES - Minimal Pill */
          <motion.nav
            key="minimal-nav"
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] lg:hidden will-change-transform"
          >
            {/* Minimal pill */}
            <div className="relative rounded-full bg-gradient-to-br from-white via-white/99 to-zinc-50/98 dark:bg-gradient-to-br dark:from-zinc-800/95 dark:via-zinc-900/98 dark:to-zinc-950/95 border border-zinc-200 dark:border-zinc-700/40 shadow-lg shadow-black/5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 overflow-hidden flex items-center gap-1.5 sm:gap-2 will-change-transform backdrop-blur-md">
              {/* Current page display */}
              <div className="relative flex items-center gap-1.5 z-10">
                {currentPage && (
                  <>
                    <motion.div className="text-blue-500 dark:text-blue-400">
                      <currentPage.icon
                        size={16}
                        className="sm:size-[18px]"
                        strokeWidth={2.2}
                      />
                    </motion.div>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider whitespace-nowrap text-zinc-700 dark:text-zinc-200">
                      {currentPage.label}
                    </span>
                  </>
                )}
              </div>

              {/* Expand button */}
              <motion.button
                onClick={() => setExpandedNav(true)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-1.5 py-1.5 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-all relative z-10"
              >
                <motion.div
                  animate={{ rotate: expandedNav ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronUp
                    size={16}
                    strokeWidth={2.5}
                    className="text-zinc-600 dark:text-zinc-400"
                  />
                </motion.div>
              </motion.button>
            </div>
          </motion.nav>
        ) : !isHome && scrollDirection === "up" && expandedNav ? (
          /* NON-HOME PAGES - Expanded Navigation Menu */
          <motion.nav
            key="expanded-nav-non-home"
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] lg:hidden will-change-transform"
          >
            {/* Expanded pill - solid background from start */}
            <div className="relative rounded-2xl bg-gradient-to-br from-white via-white/99 to-zinc-50/98 dark:bg-gradient-to-br dark:from-zinc-800/90 dark:via-zinc-900/98 dark:to-zinc-950/92 border border-zinc-200 dark:border-zinc-700/40 shadow-xl shadow-black/10 p-3 sm:p-4 md:p-5 w-72 sm:w-80 md:w-88 overflow-hidden will-change-transform backdrop-blur-md">
              <div className="relative z-10 grid grid-cols-4 gap-1.5 mb-3">
                {expandedNavTabs.map((link, idx) => {
                  const active = isActive(link.href);
                  const Icon = link.icon;

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setExpandedNav(false)}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all relative group"
                      >
                        {active && (
                          <motion.div
                            layoutId="expanded-active-non-home"
                            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-zinc-400 to-zinc-500 dark:from-zinc-500 dark:to-zinc-600 rounded-full"
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 25,
                            }}
                          />
                        )}

                        <motion.div
                          animate={{
                            scale: active ? 1.25 : 1,
                          }}
                          className={`relative z-10 transition-colors ${
                            active
                              ? "text-blue-500 dark:text-blue-400"
                              : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"
                          }`}
                        >
                          <Icon
                            size={18}
                            className="sm:size-[20px]"
                            strokeWidth={1.8}
                          />
                        </motion.div>

                        <span className="text-[7px] sm:text-[8px] font-black uppercase text-zinc-700 dark:text-zinc-200 text-center leading-tight relative z-10">
                          {link.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Close button */}
              <motion.button
                onClick={() => setExpandedNav(false)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10 w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg bg-white/70 dark:bg-white/10 hover:bg-white/95 dark:hover:bg-white/15 transition-all backdrop-blur border border-zinc-300 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-200 font-black uppercase text-[10px] sm:text-[11px] tracking-wide"
              >
                <motion.div
                  animate={{ rotate: 180 }}
                  transition={{ duration: 0 }}
                >
                  <ChevronUp
                    size={12}
                    className="sm:size-[14px]"
                    strokeWidth={2.5}
                  />
                </motion.div>
                <span className="hidden xs:inline">Close</span>
              </motion.button>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>

      {/* Add bottom padding on mobile */}
      <style>{`
        @media (max-width: 1024px) {
          body {
            padding-bottom: 80px;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;
