"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Award } from "lucide-react";
import toast from "react-hot-toast";
import { Certificate } from "@/types";
import { supabase } from "@/lib/supabase";

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    date_obtained: "",
    certificate_url: "",
    description: "",
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("date_obtained", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      setCertificates(data || []);
    } catch (error: any) {
      console.error("Error fetching certificates:", error);
      toast.error(error?.message || "Failed to fetch certificates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.issuer.trim() ||
      !formData.date_obtained ||
      !formData.certificate_url.trim()
    ) {
      toast.error(
        "Title, issuer, date obtained, and certificate URL are required",
      );
      return;
    }

    // Validate URL
    try {
      new URL(formData.certificate_url);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("certificates")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Certificate updated!");
      } else {
        const { error } = await supabase
          .from("certificates")
          .insert([formData]);

        if (error) throw error;
        toast.success("Certificate added!");
      }

      resetForm();
      await fetchCertificates();
    } catch (error: any) {
      console.error("Error saving certificate:", error);
      toast.error(error?.message || "Failed to save certificate");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;

    try {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Certificate deleted!");
      await fetchCertificates();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete certificate");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      issuer: "",
      date_obtained: "",
      certificate_url: "",
      description: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Certificates</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add and manage your professional certifications
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} className="mr-2" />
          {showForm ? "Cancel" : "Add Certificate"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Certificate" : "Add New Certificate"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="e.g., AWS Solutions Architect"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  value={formData.issuer}
                  onChange={(e) =>
                    setFormData({ ...formData, issuer: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="e.g., Amazon Web Services"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Date Obtained *
                </label>
                <input
                  type="date"
                  value={formData.date_obtained}
                  onChange={(e) =>
                    setFormData({ ...formData, date_obtained: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Certificate URL *
                </label>
                <input
                  type="url"
                  value={formData.certificate_url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      certificate_url: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="https://example.com/certificate"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 resize-none"
                  placeholder="Add any additional details about this certification..."
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit">
                  {editingId ? "Update Certificate" : "Add Certificate"}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Loading certificates...
            </p>
          </CardContent>
        </Card>
      ) : certificates.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Award size={32} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              No certificates yet. Add your first certificate to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Certificates List */
        <div className="space-y-4">
          {certificates.map((certificate) => (
            <Card
              key={certificate.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Award
                        size={20}
                        className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                      />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white break-words">
                        {certificate.title}
                      </h4>
                    </div>
                    <p className="text-base font-medium text-blue-600 dark:text-blue-400 mb-1">
                      {certificate.issuer}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Obtained: {formatDate(certificate.date_obtained)}
                    </p>
                    {certificate.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {certificate.description}
                      </p>
                    )}
                    <a
                      href={certificate.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View Certificate →
                    </a>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData({
                          title: certificate.title,
                          issuer: certificate.issuer,
                          date_obtained: certificate.date_obtained,
                          certificate_url: certificate.certificate_url,
                          description: certificate.description || "",
                        });
                        setEditingId(certificate.id);
                        setShowForm(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(certificate.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
