import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LayoutClient } from "./layout-client";
import "./globals.css";
import { createClient } from "@supabase/supabase-js";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

async function getProfileMetadata() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return null;
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data } = await supabase.from("profile").select("name, title, bio").single();
    
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfileMetadata();
  
  if (profile?.name && profile?.title) {
    return {
      title: `${profile.name} | ${profile.title}`,
      description: profile.bio || "Developer portfolio",
    };
  }
  
  return {
    title: "Portfolio",
    description: "Developer portfolio",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
