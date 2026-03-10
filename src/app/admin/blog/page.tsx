"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPost } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  FileText,
  Globe,
  EyeOff,
  Calendar,
  Type,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image: "",
    published: false,
    published_at: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const slug = formData.slug || generateSlug(formData.title);
      const url = editingId ? `/api/blog/${editingId}` : "/api/blog";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          slug,
          published_at: formData.published
            ? formData.published_at || new Date().toISOString()
            : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to save post");
      toast.success(editingId ? "Post updated!" : "Post created!");
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete post");
      toast.success("Post deleted!");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      image: post.image || "",
      published: post.published,
      published_at: post.published_at || new Date().toISOString(),
    });
    setEditingId(post.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image: "",
      published: false,
      published_at: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-8 w-48 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400";
  const labelClass = "block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Blog</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {posts.filter((p) => p.published).length} published · {posts.filter((p) => !p.published).length} drafts
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span>New Article</span>
        </button>
      </div>

      {/* Editor Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-[#16191f] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
              <h2 className="font-bold text-slate-800 dark:text-slate-200">{editingId ? "Edit Article" : "Write Article"}</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>Article Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} autoFocus required placeholder="How to build..." className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Custom Slug (URL Path)</label>
                  <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="how-to-build" className={inputClass} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>Featured Image URL</label>
                  <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://..." className={inputClass} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer group bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5 w-full">
                    <div
                      onClick={() => setFormData({ ...formData, published: !formData.published })}
                      className={`relative w-10 h-5 rounded-full transition-colors ${formData.published ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-700"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${formData.published ? "translate-x-5" : ""}`} />
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">
                      {formData.published ? "Set as Published" : "Keep as Draft"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Short Summary (Excerpt)</label>
                <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} placeholder="A brief hook for your readers..." className={`${inputClass} resize-none`} />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-2">
                  <label className={labelClass}>Article Content</label>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Markdown Supported</span>
                </div>
                <textarea name="content" value={formData.content} onChange={handleChange} rows={12} placeholder="Write your thoughts here..." className={`${inputClass} font-mono leading-relaxed resize-none`} />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={resetForm} className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Discard</button>
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                  <Check size={18} />
                  <span>{isSaving ? "Saving..." : editingId ? "Update Article" : "Publish Article"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Articles List */}
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#16191f] rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/5">
          <FileText size={40} className="mx-auto mb-4 text-slate-300 opacity-50" />
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">No articles written yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-white/5 transition-all hover:border-indigo-500/30 hover:shadow-sm"
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl border flex-shrink-0 ${post.published ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20" : "bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-100 dark:border-white/5"}`}>
                {post.published ? <Globe size={20} /> : <EyeOff size={20} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{post.title}</h3>
                  <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${post.published ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400" : "bg-slate-100 dark:bg-white/10 text-slate-500"}`}>
                    {post.published ? "Online" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar size={12} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                  {post.excerpt && (
                    <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md italic">
                      · {post.excerpt}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(post)} className="p-2.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}