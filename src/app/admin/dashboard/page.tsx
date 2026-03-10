"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Zap,
  MessageSquare,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    posts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectRes, skillRes, messageRes, postRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/skills"),
          fetch("/api/messages"),
          fetch("/api/blog"),
        ]);

        const projects = await projectRes.json();
        const skills = await skillRes.json();
        const messages = await messageRes.json();
        const posts = await postRes.json();

        setStats({
          projects: projects.length || 0,
          skills: skills.length || 0,
          messages: messages.length || 0,
          posts: posts.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Projects",
      value: stats.projects,
      icon: Briefcase,
      href: "/admin/projects",
      color:
        "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/30",
    },
    {
      title: "Skills",
      value: stats.skills,
      icon: Zap,
      href: "/admin/skills",
      color:
        "bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/30",
    },
    {
      title: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      href: "/admin/messages",
      color:
        "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30",
    },
    {
      title: "Blog Posts",
      value: stats.posts,
      icon: BookOpen,
      href: "/admin/blog",
      color:
        "bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/30",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome Back!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's an overview of your portfolio activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link key={i} href={card.href}>
              <div className="h-full p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {card.title}
                  </span>
                  <div className={`p-2 rounded-lg ${card.color} border`}>
                    <Icon size={20} />
                  </div>
                </div>
                {isLoading ? (
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-4"></div>
                ) : (
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {card.value}
                    </p>
                  </div>
                )}
                <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  <span>View Details</span>
                  <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Access your portfolio management tools quickly.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "/admin/projects",
                label: "Manage Projects",
                icon: Briefcase,
              },
              { href: "/admin/skills", label: "Update Skills", icon: Zap },
              { href: "/admin/blog", label: "Write Blog Post", icon: BookOpen },
            ].map((action) => {
              const ActionIcon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <button className="w-full p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                    <ActionIcon size={18} />
                    <span>{action.label}</span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Getting Started */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="font-bold text-gray-900 dark:text-white">
              Getting Started
            </h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
                  1.
                </span>
                <span>Add your first project to showcase your work</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
                  2.
                </span>
                <span>List all your technical skills by category</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
                  3.
                </span>
                <span>Share your knowledge through blog posts</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="font-bold text-gray-900 dark:text-white">
              Portfolio Summary
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {[
                { label: "Total Projects", value: stats.projects },
                { label: "Total Skills", value: stats.skills },
                { label: "Messages", value: stats.messages },
                { label: "Blog Posts", value: stats.posts },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-800 last:border-b-0 last:pb-0"
                >
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {item.label}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
