"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Gauge,
  User,
  BookOpen,
  Briefcase,
  Zap,
  MessageSquare,
  Settings,
  Award,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/about", label: "About", icon: Gauge },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Zap },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/blog", label: "Blog Posts", icon: BookOpen },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on the login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Skip auth check for login page - just render it directly
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/admin/login");
        } else {
          setUser(session.user);
        }
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/admin/login");
      }
      setIsLoading(false);
    };

    checkAuth();

    // Subscribe to auth changes
    try {
      const { data } = supabase.auth.onAuthStateChange(
        (_event: any, session: any) => {
          if (session) {
            setUser(session.user);
          } else {
            if (!isLoginPage) {
              router.push("/admin/login");
            }
          }
        },
      );

      return () => {
        if (data?.subscription) {
          data.subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.error("Auth subscription error:", error);
    }
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const isActiveLink = (href: string) => pathname === href;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow login page to render without authentication
  if (isLoginPage) {
    return children;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
            <Link
              href="/"
              className="text-lg font-bold text-gray-900 dark:text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              Admin
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-l-2 border-blue-600"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 border-l-2 border-transparent"
                  }`}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-4">
            <div className="px-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                Account
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 rounded-lg transition-colors duration-200"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
