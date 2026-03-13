"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { useNotification } from "@/lib/useNotification";

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
  const notification = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadMode, setShowUploadMode] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
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
      setProfilePhotoUrl(data.profile_photo || "");
      setResumeLink(data.resume_link || "");

      if (Array.isArray(data.education) && data.education.length > 0) {
        setEducation(data.education);
      } else if (typeof data.education === "string" && data.education.trim()) {
        try {
          const parsed = JSON.parse(data.education);
          setEducation(
            Array.isArray(parsed) && parsed.length > 0 ? parsed : [emptyEdu()],
          );
        } catch {
          setEducation([emptyEdu()]);
        }
      }

      if (Array.isArray(data.experience) && data.experience.length > 0) {
        setExperience(data.experience);
      } else if (
        typeof data.experience === "string" &&
        data.experience.trim()
      ) {
        try {
          const parsed = JSON.parse(data.experience);
          setExperience(
            Array.isArray(parsed) && parsed.length > 0 ? parsed : [emptyExp()],
          );
        } catch {
          setExperience([emptyExp()]);
        }
      }
    } catch (error) {
      console.error("Error fetching about:", error);
      notification.error("Failed to load about section");
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
      if (!response.ok)
        throw new Error(result.details || result.error || "Upload failed");
      setProfilePhoto(result.url);
      setProfilePhotoPreview(result.url);
      setProfilePhotoUrl(result.url);
      notification.success("Image uploaded!");
    } catch (error) {
      notification.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
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
      notification.success("About section saved!");
    } catch {
      notification.error("Failed to save about section");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-10 w-64 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-64 rounded-[2rem] bg-slate-100 dark:bg-slate-800 animate-pulse" />
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
            About Me
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Manage your biography and professional path.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Photo & Resume Link Row - Using 5 column grid for better balance */}
        <div className="grid md:grid-cols-5 gap-8">
          <div className={`${sectionClass} md:col-span-2 flex flex-col`}>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2">
              <ImageIcon size={18} className="text-indigo-500" />
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                Profile Identity
              </h2>
            </div>
            <div className="p-6 space-y-6 flex flex-col items-center flex-grow justify-center">
              {/* Compact Switcher */}
              <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl w-full max-w-[200px]">
                <button
                  type="button"
                  onClick={() => setShowUploadMode(false)}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                    !showUploadMode
                      ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadMode(true)}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                    showUploadMode
                      ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  UPLOAD
                </button>
              </div>

              {/* Compact Preview Container */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-2 border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-900 flex items-center justify-center shadow-inner">
                  {profilePhotoPreview ? (
                    <img
                      src={profilePhotoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle size={48} className="text-slate-200 dark:text-slate-800" />
                  )}
                  
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                      <Loader size={24} className="animate-spin text-indigo-600" />
                    </div>
                  )}
                </div>
                
                {profilePhotoPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfilePhoto("");
                      setProfilePhotoPreview("");
                      setProfilePhotoUrl("");
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-white dark:bg-slate-800 text-red-500 rounded-full shadow-lg border border-slate-100 dark:border-white/10 hover:scale-110 transition-transform"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="w-full space-y-4">
                {!showUploadMode ? (
                  <div className="space-y-2">
                    <label className={labelClass}>Image URL</label>
                    <input
                      type="url"
                      value={profilePhotoUrl}
                      onChange={(e) => {
                        const url = e.target.value;
                        setProfilePhotoUrl(url);
                        if (url) {
                          setProfilePhoto(url);
                          setProfilePhotoPreview(url);
                        }
                      }}
                      placeholder="https://..."
                      className={`${inputClass} !py-2.5`}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all group">
                      <Upload size={16} className="text-slate-400 group-hover:text-indigo-500" />
                      <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                        Select Image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`${sectionClass} md:col-span-3`}>
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2">
              <Link2 size={18} className="text-indigo-500" />
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                Credentials
              </h2>
            </div>
            <div className="p-8 space-y-6 flex flex-col justify-center h-[calc(100%-68px)]">
              <div className="space-y-1">
                <label className={labelClass}>Resume / CV URL</label>
                <input
                  type="url"
                  value={resumeLink}
                  onChange={(e) => setResumeLink(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className={inputClass}
                />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-tight">
                  Provide a direct link to your professional PDF resume or portfolio stored in the cloud.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className={sectionClass}>
          <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2">
            <UserCircle size={18} className="text-indigo-500" />
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
              Professional Bio
            </h2>
          </div>
          <div className="p-8">
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows={6}
              placeholder="Tell your professional story..."
              className={`${inputClass} resize-none leading-relaxed font-medium`}
            />
          </div>
        </div>

        {/* Education */}
        <div className={sectionClass}>
          <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-500" />
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                Education
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setEducation([...education, emptyEdu()])}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-all"
            >
              <Plus size={16} /> Add Entry
            </button>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            {education.map((edu, i) => (
              <div
                key={i}
                className="relative group grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-[1.5rem] border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01] transition-all hover:border-indigo-500/20"
              >
                <div className="space-y-1">
                  <label className={labelClass}>Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) =>
                      setEducation(
                        education.map((item, idx) =>
                          idx === i
                            ? { ...item, degree: e.target.value }
                            : item,
                        ),
                      )
                    }
                    className={inputClass}
                    placeholder="B.Tech CS"
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Institution</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) =>
                      setEducation(
                        education.map((item, idx) =>
                          idx === i
                            ? { ...item, school: e.target.value }
                            : item,
                        ),
                      )
                    }
                    className={inputClass}
                    placeholder="University Name"
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Timeline</label>
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) =>
                      setEducation(
                        education.map((item, idx) =>
                          idx === i ? { ...item, year: e.target.value } : item,
                        ),
                      )
                    }
                    className={inputClass}
                    placeholder="2020 - 2024"
                  />
                </div>
                {education.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setEducation(education.filter((_, idx) => idx !== i))
                    }
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 lg:opacity-0 lg:group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className={sectionClass}>
          <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase size={18} className="text-indigo-500" />
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                Career History
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setExperience([...experience, emptyExp()])}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-all"
            >
              <Plus size={16} /> Add Entry
            </button>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            {experience.map((exp, i) => (
              <div
                key={i}
                className="relative group grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-[1.5rem] border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01] transition-all hover:border-indigo-500/20"
              >
                <div className="space-y-1">
                  <label className={labelClass}>Job Title</label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) =>
                      setExperience(
                        experience.map((item, idx) =>
                          idx === i ? { ...item, title: e.target.value } : item,
                        ),
                      )
                    }
                    className={inputClass}
                    placeholder="Full Stack Developer"
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Organization</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) =>
                      setExperience(
                        experience.map((item, idx) =>
                          idx === i
                            ? { ...item, company: e.target.value }
                            : item,
                        ),
                      )
                    }
                    className={inputClass}
                    placeholder="Company Name"
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Duration</label>
                  <input
                    type="text"
                    value={exp.year}
                    onChange={(e) =>
                      setExperience(
                        experience.map((item, idx) =>
                          idx === i ? { ...item, year: e.target.value } : item,
                        ),
                      )
                    }
                    className={inputClass}
                    placeholder="Jan 2022 - Present"
                  />
                </div>
                {experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setExperience(experience.filter((_, idx) => idx !== i))
                    }
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 lg:opacity-0 lg:group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center sm:justify-end pt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-4 rounded-[1.5rem] bg-indigo-600 text-white text-sm font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            {isSaving ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            <span>{isSaving ? "Saving Progress..." : "Save About"}</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}