"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/types";
import { Loader, Save, Upload } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AdminProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    github: "",
    linkedin: "",
    twitter: "",
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
        twitter: data.twitter || "",
        email: data.email || "",
        hero_image: data.hero_image || "",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploadingImage(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      formDataObj.append("folder", "profile");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) throw new Error("Upload failed");
      const { url } = await response.json();

      setFormData({
        ...formData,
        hero_image: url,
      });
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
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

      if (!response.ok) throw new Error("Failed to save profile");
      await response.json();
      toast.success("Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin mr-2" />
        <span>Loading profile...</span>
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
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update your home page profile information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Title / Role</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                placeholder="e.g., Full Stack Developer"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Bio / Description
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                placeholder="Tell visitors about yourself"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Profile Photo</label>
              <div className="space-y-3">
                {formData.hero_image && (
                  <div className="relative w-32 h-40 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                    <Image
                      src={formData.hero_image}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer"
                  />
                  {isUploadingImage && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">Uploading...</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Upload your homepage profile photo here. Image will appear on the home page.
                </p>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                placeholder="your@email.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">GitHub URL</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                placeholder="https://github.com/yourname"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                placeholder="https://linkedin.com/in/yourname"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Twitter URL</label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                placeholder="https://twitter.com/yourname"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Button type="submit" disabled={isSaving} className="w-full">
          <Save size={16} className="mr-2" />
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </motion.div>
  );
}
