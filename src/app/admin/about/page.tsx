"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Loader,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  UserCircle,
  BookOpen,
  Briefcase,
  Link2,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";

interface EducationEntry {
  degree: string;
  school: string;
  year: string;
}

interface ExperienceEntry {
  title: string;
  company: string;
  year: string;
}

const emptyEdu = (): EducationEntry => ({ degree: "", school: "", year: "" });
const emptyExp = (): ExperienceEntry => ({ title: "", company: "", year: "" });

export default function AdminAbout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("");
  const [aboutText, setAboutText] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [education, setEducation] = useState<EducationEntry[]>([emptyEdu()]);
  const [experience, setExperience] = useState<ExperienceEntry[]>([emptyExp()]);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch("/api/about");
      if (!response.ok) throw new Error("Failed to fetch about");
      const data = await response.json();

      setAboutText(data.about_text || "");
      setProfilePhoto(data.profile_photo || "");
      setProfilePhotoPreview(data.profile_photo || "");
      setResumeLink(data.resume_link || "");

      if (Array.isArray(data.education) && data.education.length > 0) {
        setEducation(data.education);
      } else if (typeof data.education === "string" && data.education.trim()) {
        try {
          const parsed = JSON.parse(data.education);
          setEducation(Array.isArray(parsed) && parsed.length > 0 ? parsed : [emptyEdu()]);
        } catch {
          setEducation([emptyEdu()]);
        }
      }

      if (Array.isArray(data.experience) && data.experience.length > 0) {
        setExperience(data.experience);
      } else if (typeof data.experience === "string" && data.experience.trim()) {
        try {
          const parsed = JSON.parse(data.experience);
          setExperience(Array.isArray(parsed) && parsed.length > 0 ? parsed : [emptyExp()]);
        } catch {
          setExperience([emptyExp()]);
        }
      }
    } catch (error) {
      console.error("Error fetching about:", error);
      toast.error("Failed to load about section");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "profile-photos");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.details || result.error || "Upload failed");
      setProfilePhoto(result.url);
      setProfilePhotoPreview(result.url);
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          about_text: aboutText,
          profile_photo: profilePhoto,
          resume_link: resumeLink,
          education: education.filter((e) => e.degree || e.school),
          experience: experience.filter((e) => e.title || e.company),
        }),
      });
      if (!response.ok) throw new Error("Failed to save");
      toast.success("About section saved!");
    } catch {
      toast.error("Failed to save about section");
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
    "w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-slate-900 dark:text-slate-100";
  const labelClass =
    "block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2";
  const sectionClass =
    "rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#16191f] overflow-hidden shadow-sm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl space-y-8 pb-10"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">About Section</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your biography, career history, and education.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Profile Photo & Resume Link Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className={sectionClass}>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2">
              <ImageIcon size={16} className="text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Profile Image</h2>
            </div>
            <div className="p-6">
              {profilePhotoPreview ? (
                <div className="relative w-32 h-32 mx-auto sm:mx-0">
                  <img
                    src={profilePhotoPreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-2xl border border-slate-200 dark:border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setProfilePhoto("");
                      setProfilePhotoPreview("");
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl cursor-pointer hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all">
                  <Upload size={24} className="text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Upload Photo</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" />
                </label>
              )}
              {isUploading && (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-indigo-500 mt-3 uppercase tracking-widest">
                  <Loader size={14} className="animate-spin" />
                  <span>Uploading...</span>
                </div>
              )}
            </div>
          </div>

          <div className={sectionClass}>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2">
              <Link2 size={16} className="text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Documents</h2>
            </div>
            <div className="p-6">
              <label className={labelClass}>Resume / CV URL</label>
              <input
                type="url"
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
                placeholder="https://drive.google.com/..."
                className={inputClass}
              />
              <p className="mt-3 text-[10px] text-slate-400 font-medium leading-relaxed">
                Provide a direct link to your PDF resume (Google Drive, Dropbox, etc).
              </p>
            </div>
          </div>
        </div>

        {/* About Text */}
        <div className={sectionClass}>
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2">
            <UserCircle size={16} className="text-indigo-500" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Biography</h2>
          </div>
          <div className="p-6">
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows={6}
              placeholder="Tell your professional story..."
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>
        </div>

        {/* Education */}
        <div className={sectionClass}>
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Education</h2>
            </div>
            <button
              type="button"
              onClick={() => setEducation([...education, emptyEdu()])}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
            >
              <Plus size={14} /> Add School
            </button>
          </div>
          <div className="p-6 space-y-4">
            {education.map((edu, i) => (
              <div key={i} className="relative group grid md:grid-cols-3 gap-4 p-5 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01]">
                <div className="space-y-1">
                  <label className={labelClass}>Degree</label>
                  <input type="text" value={edu.degree} onChange={(e) => setEducation(education.map((item, idx) => idx === i ? { ...item, degree: e.target.value } : item))} className={inputClass} placeholder="B.Tech CS" />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Institution</label>
                  <input type="text" value={edu.school} onChange={(e) => setEducation(education.map((item, idx) => idx === i ? { ...item, school: e.target.value } : item))} className={inputClass} placeholder="University Name" />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Timeline</label>
                  <input type="text" value={edu.year} onChange={(e) => setEducation(education.map((item, idx) => idx === i ? { ...item, year: e.target.value } : item))} className={inputClass} placeholder="2020 - 2024" />
                </div>
                {education.length > 1 && (
                  <button type="button" onClick={() => setEducation(education.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className={sectionClass}>
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Career History</h2>
            </div>
            <button
              type="button"
              onClick={() => setExperience([...experience, emptyExp()])}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
            >
              <Plus size={14} /> Add Job
            </button>
          </div>
          <div className="p-6 space-y-4">
            {experience.map((exp, i) => (
              <div key={i} className="relative group grid md:grid-cols-3 gap-4 p-5 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01]">
                <div className="space-y-1">
                  <label className={labelClass}>Title</label>
                  <input type="text" value={exp.title} onChange={(e) => setExperience(experience.map((item, idx) => idx === i ? { ...item, title: e.target.value } : item))} className={inputClass} placeholder="Developer" />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Organization</label>
                  <input type="text" value={exp.company} onChange={(e) => setExperience(experience.map((item, idx) => idx === i ? { ...item, company: e.target.value } : item))} className={inputClass} placeholder="Tech Ltd" />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Duration</label>
                  <input type="text" value={exp.year} onChange={(e) => setExperience(experience.map((item, idx) => idx === i ? { ...item, year: e.target.value } : item))} className={inputClass} placeholder="Jan 2022 - Present" />
                </div>
                {experience.length > 1 && (
                  <button type="button" onClick={() => setExperience(experience.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-10 py-3.5 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            {isSaving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
            <span>Save About Details</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}