"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Profile } from "@/types";
import {
  Save,
  User,
  Link2,
  Info,
  Mail,
  Github,
  Linkedin,
  Code2,
  Image as ImageIcon,
  UserCircle,
} from "lucide-react";
import { useNotification } from "@/lib/useNotification";
import { ImageUploader } from "@/components/ImageUploader";

export default function AdminProfile() {
  const notification = useNotification();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    github: "",
    linkedin: "",
    leetcode: "",
    email: "",
    hero_image: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || "",
        title: data.title || "",
        bio: data.bio || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        leetcode: data.leetcode || "",
        email: data.email || "",
        hero_image: data.hero_image || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      notification.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.details ||
            responseData.error ||
            "Failed to save profile",
        );
      }

      notification.success("Identity updated");
      fetchProfile();
    } catch (error) {
      notification.error(
        error instanceof Error ? error.message : "Failed to save profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-10 w-64 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-96 rounded-[2rem] bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400";
  const labelClass =
    "block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1";
  const sectionClass =
    "rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-[#16191f] overflow-hidden shadow-sm";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-10 pb-20"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
        <div className="space-y-1 text-center sm:text-left">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">
            Identity
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Configure your public-facing persona.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Top Section: Hero Image & Info Row - 5 Column Grid */}
        <div className="grid md:grid-cols-5 gap-8">
          {/* Hero Image Card (2/5) */}
          <div className={`${sectionClass} md:col-span-2 flex flex-col`}>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2">
              <ImageIcon size={18} className="text-indigo-500" />
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                Hero Image
              </h2>
            </div>

            <div className="p-6 flex flex-col items-center flex-grow justify-center">
              <div className="w-full">
                <ImageUploader
                  value={formData.hero_image}
                  onChange={(url) =>
                    setFormData({ ...formData, hero_image: url })
                  }
                  label="Display Photo"
                  placeholder="https://..."
                  folder="hero-images"
                  labelClass={labelClass}
                  inputClass={inputClass}
                  previewClass="w-32 h-32 rounded-[2rem] mx-auto mb-6 border-2 border-slate-100 dark:border-white/10 shadow-inner"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-tight mt-4 text-center max-w-[180px]">
                Appears on the homepage hero section.
              </p>
            </div>
          </div>

          {/* Core Info Card (3/5) */}
          <div className={`${sectionClass} md:col-span-3`}>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2">
              <User size={18} className="text-indigo-500" />
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                Core Details
              </h2>
            </div>

            <div className="p-8 space-y-6 flex flex-col justify-center h-[calc(100%-60px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Full Stack Developer"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Primary Email</label>
                <div className="relative group">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="hello@domain.com"
                    className={`${inputClass} pl-12`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Biography Section */}
        <div className={sectionClass}>
          <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2">
            <Info size={18} className="text-indigo-500" />
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
              Headline Biography
            </h2>
          </div>
          <div className="p-8">
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="A high-level summary of your professional expertise..."
              className={`${inputClass} resize-none leading-relaxed font-medium`}
            />
          </div>
        </div>

        {/* Social Ecosystem */}
        <div className={sectionClass}>
          <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2">
            <Link2 size={18} className="text-indigo-500" />
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
              Professional Links
            </h2>
          </div>

          <div className="p-8 grid md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <label className={labelClass}>GitHub</label>
              <div className="relative group">
                <Github
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500"
                />
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="github.com/user"
                  className={`${inputClass} pl-12`}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>LinkedIn</label>
              <div className="relative group">
                <Linkedin
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500"
                />
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="linkedin.com/in/user"
                  className={`${inputClass} pl-12`}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>LeetCode</label>
              <div className="relative group">
                <Code2
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500"
                />
                <input
                  type="url"
                  name="leetcode"
                  value={formData.leetcode}
                  onChange={handleChange}
                  placeholder="leetcode.com/user"
                  className={`${inputClass} pl-12`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center sm:justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-4 rounded-[1.5rem] bg-indigo-600 text-white text-sm font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}