"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Code2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Profile } from "@/types";

export function Footer() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const socialLinks = [
    { icon: Github, href: profile?.github || "#", label: "GitHub" },
    { icon: Linkedin, href: profile?.linkedin || "#", label: "LinkedIn" },
    {
      icon: Mail,
      href: profile?.email
        ? `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${profile.email}`
        : "#",
      label: "Email",
    },
    { icon: Code2, href: profile?.leetcode || "#", label: "LeetCode" },
  ];

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="relative border-t border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/50 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:items-start">
          
          {/* Brand/Identity Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Available for new opportunities
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {profile?.name || process.env.NEXT_PUBLIC_PORTFOLIO_NAME}
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Building digital experiences with focus on performance, 
              accessibility, and clean code.
            </p>
          </div>

          {/* Navigation Section */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12 md:justify-center">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Navigation</h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 transition-colors hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Socials</h3>
              <ul className="space-y-3">
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      <span>{social.label}</span>
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Connect Section */}
          <div className="flex flex-col md:items-end space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Stay Connected</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    whileHover={{ y: -3 }}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-600 shadow-sm transition-all hover:border-blue-500 hover:text-blue-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-blue-400"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            © {currentYear} {profile?.name || "Portfolio"}. All rights reserved.
          </p>
          {/* <div className="flex items-center gap-6">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              Built with Next.js & Tailwind
            </span>
          </div> */}
        </div>
      </div>
    </footer>
  );
}