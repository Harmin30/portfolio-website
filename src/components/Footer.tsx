'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

const socialLinks = [
  {
    icon: Github,
    href: process.env.NEXT_PUBLIC_PORTFOLIO_GITHUB || '#',
    label: 'GitHub',
  },
  {
    icon: Linkedin,
    href: process.env.NEXT_PUBLIC_PORTFOLIO_LINKEDIN || '#',
    label: 'LinkedIn',
  },
  {
    icon: Twitter,
    href: process.env.NEXT_PUBLIC_PORTFOLIO_TWITTER || '#',
    label: 'Twitter',
  },
  {
    icon: Mail,
    href: `mailto:${process.env.NEXT_PUBLIC_PORTFOLIO_EMAIL}`,
    label: 'Email',
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:gap-12">
          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center gap-6"
          >
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  aria-label={social.label}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </motion.div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              About
            </Link>
            <Link
              href="/projects"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Projects
            </Link>
            <Link
              href="/blog"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Contact
            </Link>
          </div>

          {/* Copyright */}
          <div className="border-t text-center pt-8 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
            <p>
              © {currentYear} {process.env.NEXT_PUBLIC_PORTFOLIO_NAME}. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
