"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Skill } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Code2,
  Server,
  Database,
  Wrench,
  BarChart3,
} from "lucide-react";
import toast from "react-hot-toast";

type Category = "frontend" | "backend" | "database" | "tools";
type Level = "beginner" | "intermediate" | "advanced";

const CATEGORY_CONFIG: Record<
  Category,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ElementType;
  }
> = {
  frontend: {
    label: "Frontend",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50/50 dark:bg-indigo-500/10",
    border: "border-indigo-100 dark:border-indigo-500/20",
    icon: Code2,
  },
  backend: {
    label: "Backend",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100/50 dark:bg-white/5",
    border: "border-slate-200 dark:border-white/10",
    icon: Server,
  },
  database: {
    label: "Database",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50/50 dark:bg-indigo-500/10",
    border: "border-indigo-100 dark:border-indigo-500/20",
    icon: Database,
  },
  tools: {
    label: "Tools",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100/50 dark:bg-white/5",
    border: "border-slate-200 dark:border-white/10",
    icon: Wrench,
  },
};

const LEVEL_CONFIG: Record<
  Level,
  { label: string; dots: number; color: string }
> = {
  beginner: { label: "Beginner", dots: 1, color: "bg-slate-300 dark:bg-slate-600" },
  intermediate: { label: "Intermediate", dots: 2, color: "bg-indigo-400" },
  advanced: { label: "Advanced", dots: 3, color: "bg-indigo-600" },
};

const CATEGORIES = Object.keys(CATEGORY_CONFIG) as Category[];
const LEVELS = Object.keys(LEVEL_CONFIG) as Level[];

function LevelDots({ level }: { level: Level }) {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.intermediate;
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`w-1 h-1 rounded-full ${n <= cfg.dots ? cfg.color : "bg-slate-200 dark:bg-white/10"}`}
        />
      ))}
    </span>
  );
}

function SkillIcon({ name }: { name: string }) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace("js", "javascript")
    .replace("ts", "typescript");
  return (
    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 overflow-hidden flex-shrink-0">
      <img
        src={`https://cdn.simpleicons.org/${slug}/gray`}
        alt={name}
        width={20}
        height={20}
        className="dark:opacity-70 dark:invert grayscale"
        onError={(e) => {
          const t = e.currentTarget;
          t.style.display = "none";
          if (t.parentElement) {
            t.parentElement.innerHTML = `<span class="text-[10px] font-black text-slate-400">${name.slice(0, 2).toUpperCase()}</span>`;
          }
        }}
      />
    </div>
  );
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Category | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "frontend" as Category,
    level: "intermediate" as Level,
  });

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase.from("skills").select("*").order("category").order("name");
      if (error) throw new Error(error.message);
      setSkills(data || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch skills");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error("Skill name is required"); return; }
    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase.from("skills").update(formData).eq("id", editingId);
        if (error) throw error;
        toast.success("Skill updated!");
      } else {
        const { error } = await supabase.from("skills").insert([formData]);
        if (error) throw error;
        toast.success("Skill added!");
      }
      resetForm();
      await fetchSkills();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
      toast.success("Skill deleted!");
      await fetchSkills();
    } catch (err) {
      toast.error("Failed to delete skill");
    }
  };

  const startEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      category: skill.category as Category,
      level: (skill.level || "intermediate") as Level,
    });
    setEditingId(skill.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({ name: "", category: "frontend", level: "intermediate" });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredSkills = activeTab === "all" ? skills : skills.filter((s) => s.category === activeTab);

  const inputClass = "w-full px-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Skills</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your technical expertise and proficiency levels.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span>New Skill</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          const count = skills.filter((s) => s.category === cat).length;
          return (
            <div key={cat} className="p-5 rounded-2xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-white/5 shadow-sm">
              <div className={`w-10 h-10 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center mb-4 border ${cfg.border}`}>
                <cfg.icon size={20} />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{count}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-[#16191f] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
              <h2 className="font-bold text-slate-800 dark:text-slate-200">{editingId ? "Edit Skill" : "Add New Skill"}</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Skill Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} autoFocus required className={inputClass} placeholder="e.g. React" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })} className={inputClass}>
                    {CATEGORIES.map((c) => (<option key={c} value={c}>{CATEGORY_CONFIG[c].label}</option>))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Level</label>
                  <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value as Level })} className={inputClass}>
                    {LEVELS.map((l) => (<option key={l} value={l}>{LEVEL_CONFIG[l].label}</option>))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={resetForm} className="px-6 py-2 text-sm font-bold text-slate-500">Cancel</button>
                <button type="submit" disabled={saving} className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                  {saving ? "Saving..." : editingId ? "Update Skill" : "Add Skill"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs & List */}
      <div className="space-y-6">
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit">
          {(["all", ...CATEGORIES] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (<div key={n} className="h-20 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => {
              const cfg = CATEGORY_CONFIG[skill.category as Category] || CATEGORY_CONFIG.tools;
              return (
                <motion.div
                  key={skill.id}
                  layout
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#16191f] border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all shadow-sm"
                >
                  <SkillIcon name={skill.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{skill.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <LevelDots level={(skill.level || "intermediate") as Level} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{skill.level || "intermediate"}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(skill)} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(skill.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}