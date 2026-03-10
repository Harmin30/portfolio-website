"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Github,
  ExternalLink,
  Image as ImageIcon,
  Layers,
  Link as LinkIcon,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    tech_stack: [] as string[],
    github_url: "",
    live_url: "",
  });
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
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

  const addTech = () => {
    if (techInput.trim() && !formData.tech_stack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        tech_stack: [...formData.tech_stack, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack.filter((t) => t !== tech),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!formData.title.trim()) {
        toast.error("Project title is required");
        setIsSaving(false);
        return;
      }

      if (!formData.image.trim()) {
        toast.error("Project image URL is required");
        setIsSaving(false);
        return;
      }

      const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to save project");
      }

      toast.success(editingId ? "Project updated!" : "Project added!");
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save project";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete project");
      toast.success("Project deleted!");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image || "",
      tech_stack: project.tech_stack || [],
      github_url: project.github_url || "",
      live_url: project.live_url || "",
    });
    setEditingId(project.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      tech_stack: [],
      github_url: "",
      live_url: "",
    });
    setEditingId(null);
    setShowForm(false);
    setTechInput("");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder:text-slate-400";
  const labelClass =
    "block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Projects
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {projects.length} showcase items in your collection.
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm && !editingId) resetForm();
            else {
              resetForm();
              setShowForm(true);
            }
          }}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Form Card */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-[#16191f] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
              <h2 className="font-bold text-slate-800 dark:text-slate-200">
                {editingId ? "Modify Project" : "Create Project"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>Project Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter project name"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Cover Image URL *</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Project Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Explain what this project is about..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Tech Stack</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTech();
                      }
                    }}
                    placeholder="e.g. React, Tailwind"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-6 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>GitHub Repository</label>
                  <div className="relative">
                    <Github
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="url"
                      name="github_url"
                      value={formData.github_url}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Live Preview</label>
                  <div className="relative">
                    <LinkIcon
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="url"
                      name="live_url"
                      value={formData.live_url}
                      onChange={handleChange}
                      placeholder="https://..."
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                >
                  <Check size={18} />
                  <span>
                    {isSaving
                      ? "Processing..."
                      : editingId
                        ? "Update Project"
                        : "Save Project"}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#16191f] rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/5">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-[0.2em]">
            Empty Showcase
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              className="group bg-white dark:bg-[#16191f] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none"
            >
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300">
                    <ImageIcon size={32} />
                  </div>
                )}

                <div className="absolute top-3 right-3 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 shadow-lg"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur rounded-lg text-red-500 hover:bg-red-50 shadow-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 h-8 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack?.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-md uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack && project.tech_stack.length > 3 && (
                    <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                      +{project.tech_stack.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-50 dark:border-white/5">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Github size={14} /> Repository
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <ExternalLink size={14} /> Preview
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
