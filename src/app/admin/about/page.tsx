"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { About } from "@/types";
import { Loader, Save, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminAbout() {
  const [about, setAbout] = useState<About | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    about_text: "",
    profile_photo: "",
    education: "",
    experience: "",
    resume_link: "",
  });

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch("/api/about");
      if (!response.ok) throw new Error("Failed to fetch about");
      const data = await response.json();
      setAbout(data);
      setFormData({
        about_text: data.about_text || "",
        profile_photo: data.profile_photo || "",
        education:
          typeof data.education === "string"
            ? data.education
            : JSON.stringify(data.education || []),
        experience:
          typeof data.experience === "string"
            ? data.experience
            : JSON.stringify(data.experience || []),
        resume_link: data.resume_link || "",
      });
      setProfilePhotoPreview(data.profile_photo || "");
    } catch (error) {
      console.error("Error fetching about:", error);
      toast.error("Failed to load about section");
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

      if (!response.ok) {
        const errorMsg =
          result.details || result.error || "Failed to upload image";
        throw new Error(errorMsg);
      }

      if (!result.url) {
        throw new Error("No URL returned from upload");
      }

      setFormData({ ...formData, profile_photo: result.url });
      setProfilePhotoPreview(result.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      toast.error(`Upload error: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, profile_photo: "" });
    setProfilePhotoPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save about");
      await response.json();
      toast.success("About section updated successfully!");
      fetchAbout();
    } catch (error) {
      console.error("Error saving about:", error);
      toast.error("Failed to save about section");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin mr-2" />
        <span>Loading about section...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Edit About Section</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update your professional profile and background information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8">
        {/* Profile Photo Upload */}
        <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profilePhotoPreview ? (
              <div className="relative w-full max-w-sm mx-auto">
                <img
                  src={profilePhotoPreview}
                  alt="Profile Preview"
                  className="w-full h-80 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Upload size={32} className="text-blue-600 mb-2" />
                <span className="font-semibold">
                  Click to upload profile photo
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            )}
            {isUploading && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader size={16} className="animate-spin" />
                <span>Uploading...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* About Content */}
        <Card>
          <CardHeader>
            <CardTitle>About You</CardTitle>
          </CardHeader>
          <CardContent>
            <label className="block font-semibold mb-3 text-gray-700 dark:text-gray-200">
              Professional Summary
            </label>
            <textarea
              name="about_text"
              value={formData.about_text}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Write a compelling summary about yourself, your passion, and your professional journey..."
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              This will be displayed on your public about page
            </p>
          </CardContent>
        </Card>

        {/* Education & Experience */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Education Card */}
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="block font-semibold mb-3 text-gray-700 dark:text-gray-200">
                Education Details
              </label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder={`Example:
Bachelor of Science in Computer Science
University Name | 2018 - 2022
Relevant coursework: Web Development, Database Design

Full Stack Web Development Bootcamp
Coding Academy | 2023
Intensive training in modern web technologies`}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Write your education details in any format you prefer
              </p>
            </CardContent>
          </Card>

          {/* Experience Card */}
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="block font-semibold mb-3 text-gray-700 dark:text-gray-200">
                Experience Details
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder={`Example:
Senior Full Stack Developer
Tech Company | 2023 - Present
Leading development of client-facing web applications

Full Stack Developer
Digital Agency | 2021 - 2023
Developed and maintained multiple web projects using React and Node.js

Junior Developer
Startup | 2020 - 2021
Collaborated with team to build and deploy web applications`}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Write your experience details in any format you prefer
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resume Link */}
        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <label className="block font-semibold mb-3 text-gray-700 dark:text-gray-200">
              Resume Link
            </label>
            <input
              type="url"
              name="resume_link"
              value={formData.resume_link}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="https://example.com/resume.pdf"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Link to your resume PDF or document
            </p>
          </CardContent>
        </Card>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSaving}
          className="w-full h-12 text-base font-semibold"
        >
          <Save size={18} className="mr-2" />
          {isSaving ? "Saving..." : "Save About Section"}
        </Button>
      </form>
    </motion.div>
  );
}
