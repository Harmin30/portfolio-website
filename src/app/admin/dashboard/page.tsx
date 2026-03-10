"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Zap,
  MessageSquare,
  BookOpen,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  LayoutDashboard,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    posts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectRes, skillRes, messageRes, postRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/skills"),
          fetch("/api/messages"),
          fetch("/api/blog"),
        ]);

        const projects = await projectRes.json();
        const skills = await skillRes.json();
        const messages = await messageRes.json();
        const posts = await postRes.json();

        setStats({
          projects: projects.length || 0,
          skills: skills.length || 0,
          messages: messages.length || 0,
          posts: posts.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Projects",
      value: stats.projects,
      icon: Briefcase,
      href: "/admin/projects",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-slate-200 dark:border-white/5",
    },
    {
      title: "Skills",
      value: stats.skills,
      icon: Zap,
      href: "/admin/skills",
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-500/10",
      border: "border-slate-200 dark:border-white/5",
    },
    {
      title: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      href: "/admin/messages",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-slate-200 dark:border-white/5",
    },
    {
      title: "Blog Posts",
      value: stats.posts,
      icon: BookOpen,
      href: "/admin/blog",
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-500/10",
      border: "border-slate-200 dark:border-white/5",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 md:space-y-10 pb-10"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back to your portfolio management.
          </p>
        </motion.div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-full border border-indigo-100 dark:border-indigo-500/10 w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} variants={itemVariants}>
              <Link href={card.href}>
                <div className={`group h-full p-5 md:p-6 bg-white dark:bg-[#16191f] border ${card.border} rounded-2xl transition-all hover:border-indigo-500/30 hover:shadow-sm`}>
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                      <Icon size={20} />
                    </div>
                    <ArrowUpRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.title}</p>
                    {isLoading ? (
                      <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
                    ) : (
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                        {card.value}
                      </h2>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-white dark:bg-[#16191f] border border-slate-200 dark:border-white/5 rounded-2xl p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
              <p className="text-slate-500 text-xs mt-1">Direct access to common tasks.</p>
            </div>
            <TrendingUp size={20} className="text-indigo-500" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { href: "/admin/projects", label: "Projects", icon: Briefcase, theme: "bg-indigo-600 hover:bg-indigo-700 text-white" },
              { href: "/admin/skills", label: "Skills", icon: Zap, theme: "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10" },
              { href: "/admin/blog", label: "New Post", icon: BookOpen, theme: "bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 text-white" },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <button className={`w-full p-4 ${action.theme} rounded-xl transition-all flex flex-row sm:flex-col items-center justify-center gap-3 text-sm font-semibold`}>
                  <action.icon size={20} />
                  <span>{action.label}</span>
                </button>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Short Guide Card */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-indigo-600 rounded-2xl p-6 md:p-8 text-white flex flex-col justify-between"
        >
          <div>
            <Sparkles className="mb-4 text-indigo-200" size={24} />
            <h3 className="text-xl font-bold mb-4">Launch Guide</h3>
            <div className="space-y-3">
              {[
                "Sync latest projects",
                "Refresh skill sets",
                "Check messages",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-indigo-50">
                  <CheckCircle2 size={16} className="text-indigo-200" />
                  <span className="text-xs font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Link href="/" target="_blank" className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-xs transition-all text-center">
            View Live Portfolio
          </Link>
        </motion.div>
      </div>

      {/* Mini Inventory List */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="p-4 px-6 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#16191f] flex items-center gap-2">
          <Clock size={16} className="text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Inventory Overview</h3>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Projects", value: stats.projects },
            { label: "Skills", value: stats.skills },
            { label: "Messages", value: stats.messages },
            { label: "Blog Posts", value: stats.posts },
          ].map((item, i) => (
            <div key={i}>
              <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">{item.label}</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}