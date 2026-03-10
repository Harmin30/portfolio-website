"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// 1. Added Variants type to the import
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Calendar, ArrowRight, Loader, BookOpen, PenTool } from "lucide-react";
import { BlogPost } from "@/types";

// 2. Applied Variants type to stop TypeScript errors
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  },
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/blog?published=true");
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError("Failed to load blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const featuredPost = posts[0];
  const restPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] right-[-5%] w-[35%] h-[35%] bg-amber-500/5 dark:bg-amber-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-32"
      >
        {/* Simple Header */}
        <header className="mb-16 md:mb-24">
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
              <PenTool size={16} />
              <span className="text-[10px] uppercase tracking-[0.2em]">Journal</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
              Thoughts & <br /> 
              <span className="text-zinc-400 dark:text-zinc-600 italic font-medium">Reflections.</span>
            </h1>
          </motion.div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <Loader className="animate-spin text-amber-500" size={24} />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Syncing Library</span>
          </div>
        ) : (
          <div className="space-y-20 md:space-y-32">
            
            {/* Featured Section */}
            {featuredPost && (
              <motion.div variants={itemVariants}>
                <Link href={`/blog/${featuredPost.slug}`} className="group relative block">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2rem] p-4 md:p-8 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-500 shadow-xl shadow-amber-500/5">
                    
                    {/* Image Container */}
                    <div className="lg:col-span-7 aspect-[16/9] md:aspect-[21/9] lg:aspect-auto lg:h-[400px] overflow-hidden rounded-2xl md:rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-800">
                      {featuredPost.image && (
                        <img
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>

                    {/* Text Content */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        <Calendar size={14} className="text-amber-500" />
                        {formatDate(featuredPost.published_at || featuredPost.created_at)}
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white border-b-2 border-amber-500/20 pb-1 group-hover:border-amber-500 transition-all">
                        Read Featured Post <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Grid Section */}
            {restPosts.length > 0 && (
              <div className="space-y-12">
                <motion.div variants={itemVariants} className="flex items-center gap-4">
                  <h3 className="text-2xl font-bold tracking-tight">Latest Entries</h3>
                  <div className="h-px flex-grow bg-zinc-200 dark:bg-zinc-800" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {restPosts.map((post) => (
                    <motion.div key={post.id} variants={itemVariants} className="group">
                      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                        <div className="aspect-[16/10] mb-6 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/50">
                          {post.image && (
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
                           <span className="text-amber-500">•</span>
                           {formatDate(post.published_at || post.created_at)}
                        </div>
                        <h4 className="text-xl font-bold mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed line-clamp-2 mb-6">
                          {post.excerpt}
                        </p>
                        <div className="mt-auto flex items-center gap-2 text-xs font-bold text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                           View Post <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.main>
    </div>
  );
}