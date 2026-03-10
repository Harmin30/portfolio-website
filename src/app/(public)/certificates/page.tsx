"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ExternalLink, Loader, Award, Star } from "lucide-react";
import { Certificate } from "@/types";
import { supabase } from "@/lib/supabase";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 12 } 
  },
};

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("date_obtained", { ascending: false });
      setCertificates(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 transition-colors duration-500 selection:bg-blue-100 dark:selection:bg-blue-900/30">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        // FIXED: Increased top padding to pt-32 on mobile and md:pt-48 on desktop 
        // to prevent overlapping with the fixed navigation bar
        className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-32"
      >
        {/* Header Section */}
        <header className="mb-16 md:mb-24">
          <motion.div variants={itemVariants} className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
              <Star size={14} className="text-blue-500 fill-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Learning Path</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase">
              My <br className="md:hidden" />
              <span className="text-zinc-300 dark:text-zinc-800 italic font-medium">Archive.</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-base md:text-lg font-light">
              Official recognitions and specialized certifications I&apos;ve earned.
            </p>
          </motion.div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <Loader className="animate-spin text-blue-500" size={32} />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400">Syncing Records...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {certificates.map((cert) => (
                <motion.div
                  key={cert.id}
                  layout
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="relative h-full flex flex-col p-8 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2.5rem] hover:bg-white dark:hover:bg-zinc-900 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5">
                    
                    {/* Badge & Date */}
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-all group-hover:rotate-12 group-hover:bg-blue-600 group-hover:text-white">
                        <Award size={24} />
                      </div>
                      <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1 rounded-full uppercase tracking-widest">
                        {formatDate(cert.date_obtained)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="mb-10 space-y-2">
                      <h3 className="text-2xl font-black tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                        {cert.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="h-[1px] w-4 bg-blue-500" />
                        <p className="text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-widest">
                          {cert.issuer}
                        </p>
                      </div>
                      {cert.description && (
                        <p className="pt-2 text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2">
                          {cert.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Link */}
                    <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
                      <a
                        href={cert.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between group/link"
                      >
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover/link:text-zinc-900 dark:group-hover/link:text-white transition-colors">Verify Credential</span>
                        <ExternalLink size={18} className="text-zinc-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!isLoading && certificates.length === 0 && (
          <div className="py-20 text-center text-zinc-400 font-mono text-xs uppercase tracking-[0.3em]">
            Database Empty // No Records Found
          </div>
        )}
      </motion.main>
    </div>
  );
}