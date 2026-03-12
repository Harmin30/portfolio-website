"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, ArrowLeft, Clock, Loader } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { BlogPost } from "@/types";

export default function BlogArticle() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const authorName = "Harmin Patel";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/blog?slug=${slug}&published=true`);
        if (!response.ok) throw new Error("Failed to fetch blog post");
        const data = await response.json();
        const foundPost = Array.isArray(data)
          ? data.find((p: BlogPost) => p.slug === slug)
          : null;
        if (!foundPost) throw new Error("Post not found");
        setPost(foundPost);
      } catch {
        setError("Article not found");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return `${Math.ceil(wordCount / wordsPerMinute)} min read`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] flex flex-col items-center justify-center">
        <Loader className="animate-spin text-amber-500 mb-4" size={32} />
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">
          Opening Journal
        </p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] flex items-center justify-center px-6">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter italic text-zinc-400">
            Lost a page?
          </h1>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-amber-600 font-bold hover:underline"
          >
            <ArrowLeft size={18} /> Return to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
      {/* Progress Bar (Subtle) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-amber-500 z-50 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
      />

      <main className="relative pb-24">
        {/* Hero Section */}
        <header className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-zinc-900">
          {!heroImageLoaded && post.image && (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800 animate-pulse" />
          )}
          {post.image && (
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: heroImageLoaded ? 0.6 : 0 }}
              transition={{ duration: 1.2 }}
              src={post.image}
              alt={post.title}
              onLoad={() => setHeroImageLoaded(true)}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] dark:from-[#050505] via-transparent to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end max-w-4xl mx-auto px-6 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-mono uppercase tracking-widest text-amber-500 dark:text-amber-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />{" "}
                  {formatDate(post.published_at || post.created_at)}
                </span>
                <span className="text-zinc-500">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {estimateReadTime(post.content || "")}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9] text-zinc-900 dark:text-white">
                {post.title}
              </h1>
            </motion.div>
          </div>
        </header>

        {/* Navigation Back Button */}
        <div className="max-w-3xl mx-auto px-6 mt-8 md:mt-12 mb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2.5 px-5 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 bg-gradient-to-r from-white/60 to-white/40 dark:from-zinc-900/60 dark:to-zinc-900/40 hover:from-white hover:to-white/80 dark:hover:from-zinc-900/80 dark:hover:to-zinc-900/60 border border-zinc-300/50 dark:border-zinc-700/50 hover:border-amber-400/50 dark:hover:border-amber-500/40 rounded-xl shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-amber-500/10 transition-all duration-300 group"
          >
            <ArrowLeft
              size={18}
              className="text-amber-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform duration-300"
            />
            <span>Back to Blog</span>
          </Link>
        </div>

        {/* Article Body */}
        <div className="max-w-3xl mx-auto px-6">
          {/* Summary/Excerpt Box */}
          {post.excerpt && (
            <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/40 dark:to-zinc-900/60 border-2 border-amber-200 dark:border-amber-900/30 shadow-lg shadow-amber-500/10 dark:shadow-lg dark:shadow-black/20 italic text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
              <span className="text-3xl text-amber-600 dark:text-amber-400 mr-2 select-none">
                &ldquo;
              </span>
              {post.excerpt}
              <span className="text-3xl text-amber-600 dark:text-amber-400 ml-2 select-none">
                &rdquo;
              </span>
            </div>
          )}

          {/* Content Area */}
          <article className="prose prose-zinc dark:prose-invert prose-lg md:prose-xl max-w-none">
            <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-sm rounded-3xl border border-zinc-200 dark:border-zinc-800/50 p-8 md:p-12 shadow-lg shadow-zinc-900/5 dark:shadow-lg dark:shadow-black/20">
              <div className="space-y-6">
                <ReactMarkdown
                  remarkPlugins={[remarkBreaks, remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight text-zinc-900 dark:text-white pt-2 pb-4 border-b-2 border-amber-500/30 dark:border-amber-500/20 mt-0 mb-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mt-8 mb-4 pt-2 pb-2 border-l-4 border-amber-500 pl-4">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl md:text-2xl font-bold text-zinc-800 dark:text-zinc-100 mt-6 mb-3">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 mt-4 mb-2">
                        {children}
                      </h4>
                    ),
                    p: ({ children }) => (
                      <p className="text-zinc-700 dark:text-zinc-300 mb-4 leading-8 text-justify">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-none mb-6 space-y-3 ml-4">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-none mb-6 space-y-3 ml-4 counter-reset: list-counter">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-zinc-700 dark:text-zinc-300 flex items-start gap-3 leading-7">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 dark:bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                          •
                        </span>
                        <span>{children}</span>
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-amber-500 pl-6 my-6 py-4 px-6 bg-amber-50/50 dark:bg-amber-950/20 rounded-r-lg italic text-zinc-600 dark:text-zinc-400 text-base">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-200 px-2 py-1 rounded font-mono text-sm font-semibold">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-zinc-900 dark:bg-zinc-950 text-zinc-100 p-6 rounded-2xl overflow-x-auto mb-6 border border-zinc-800 dark:border-zinc-700 shadow-lg">
                        <code className="font-mono text-sm leading-relaxed">
                          {children}
                        </code>
                      </pre>
                    ),
                    img: ({ src, alt }) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt={alt || "Article image"}
                        className="rounded-2xl shadow-lg shadow-zinc-900/20 dark:shadow-black/40 my-8 w-full border border-zinc-200 dark:border-zinc-800"
                      />
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-6">
                        <table className="w-full border-collapse">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-zinc-100 dark:bg-zinc-800/50">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-2 text-left font-bold text-zinc-900 dark:text-white border-b-2 border-zinc-300 dark:border-zinc-700">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">
                        {children}
                      </td>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-amber-600 dark:text-amber-400 font-semibold hover:underline transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    hr: () => (
                      <hr className="my-8 border-t-2 border-zinc-200 dark:border-zinc-800" />
                    ),
                  }}
                >
                  {post.content || ""}
                </ReactMarkdown>
              </div>
            </div>
          </article>
          {/* Footer Social / CTA */}
          {/* Define this at the top of your component or import from a config file */}

          <footer className="mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-900">
            <div className="flex justify-center">
              <div className="group flex items-center gap-4 cursor-default">
                {/* Abstract Icon */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 dark:bg-black flex items-center justify-center">
                  <div
                    className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-40"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #f59e0b 1px, transparent 1px)",
                      backgroundSize: "6px 6px",
                    }}
                  />
                  <div className="relative w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] transition-transform duration-500 group-hover:scale-150" />
                  <div className="absolute inset-0 border border-white/10 rounded-xl" />
                </div>

                <div>
                  {/* Dynamic Title from Blog Post */}
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {post.title}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-0.5">
                    Article by {authorName}
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
