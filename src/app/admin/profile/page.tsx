"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Profile } from "@/types";
import { Save, User, Link2, Info, Globe, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProfile() {
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
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
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

      toast.success("Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder:text-slate-400";
  const labelClass =
    "block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-8"
    >
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Profile Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This information will be displayed on your main portfolio page.
        </p>
      </div>

      {/* Soft Indigo Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10">
        <Info
          size={18}
          className="text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0"
        />
        <p className="text-xs leading-relaxed text-indigo-800 dark:text-indigo-300/80">
          <span className="font-bold">Note:</span> Your profile photo is managed in the <span className="underline decoration-indigo-300">About</span> section. It updates across the entire site automatically.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Group */}
        <div className="bg-white dark:bg-[#16191f] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2">
            <User size={16} className="text-indigo-500" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Personal Details</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Professional Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Software Engineer"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Short Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="A brief introduction for your homepage..."
                className={`${inputClass} resize-none leading-relaxed`}
              />
            </div>

            <div className="space-y-1 md:w-1/2">
              <label className={labelClass}>Contact Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Group */}
        <div className="bg-white dark:bg-[#16191f] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2">
            <Link2 size={16} className="text-indigo-500" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Social Presence</h2>
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={labelClass}>GitHub URL</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>LeetCode URL</label>
              <input
                type="url"
                name="leetcode"
                value={formData.leetcode}
                onChange={handleChange}
                placeholder="https://leetcode.com/..."
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 min-w-[160px]"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}