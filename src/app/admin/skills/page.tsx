"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Skill } from "@/types";
import { Plus, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "frontend" as "frontend" | "backend" | "database" | "tools",
    level: "intermediate" as "beginner" | "intermediate" | "advanced",
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase.from("skills").select("*");

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message || "Failed to fetch skills");
      }
      setSkills(data || []);
    } catch (error: any) {
      console.error("Error fetching skills:", error?.message || error);
      toast.error(
        error?.message ||
          "Failed to fetch skills. Check if Supabase table exists.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Skill name is required");
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("skills")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Skill updated!");
      } else {
        const { error } = await supabase.from("skills").insert([formData]);

        if (error) throw error;
        toast.success("Skill added!");
      }

      resetForm();
      await fetchSkills();
    } catch (error: any) {
      console.error("Error saving skill:", error);
      toast.error(error?.message || "Failed to save skill");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);

      if (error) throw error;
      toast.success("Skill deleted!");
      await fetchSkills();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete skill");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", category: "frontend", level: "intermediate" });
    setEditingId(null);
    setShowForm(false);
  };

  const categories = ["frontend", "backend", "database", "tools"];
  const levels = ["beginner", "intermediate", "advanced"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Skills</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add and manage your professional skills
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} className="mr-2" />
          {showForm ? "Cancel" : "Add Skill"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Skill" : "Add New Skill"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Skill Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="e.g., React, Python, PostgreSQL"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      level: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit">
                  {editingId ? "Update Skill" : "Add Skill"}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Skills Grid */}
      <div className="grid gap-4">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-lg font-bold mb-3 capitalize">
              {category} Skills
            </h3>
            <div className="space-y-3">
              {skills
                .filter((s) => s.category === category)
                .map((skill) => (
                  <Card key={skill.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{skill.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {skill.level &&
                              skill.level.charAt(0).toUpperCase() +
                                skill.level.slice(1)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFormData({
                                name: skill.name,
                                category: skill.category,
                                level: (skill.level || "intermediate") as any,
                              });
                              setEditingId(skill.id);
                              setShowForm(true);
                            }}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(skill.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
