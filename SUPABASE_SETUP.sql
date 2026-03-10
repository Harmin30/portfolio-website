-- Supabase SQL Script: Create Portfolio Database Tables
-- Run this in your Supabase project's SQL editor

-- ============================================
-- STEP 1: DROP ALL EXISTING TABLES (CLEAN START)
-- ============================================
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS about CASCADE;
DROP TABLE IF EXISTS profile CASCADE;

-- ============================================
-- STEP 2: CREATE FRESH TABLES
-- ============================================

-- Profile table (Home section)
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  hero_image TEXT,
  github TEXT,
  linkedin TEXT,
  twitter TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- About section
CREATE TABLE IF NOT EXISTS about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  about_text TEXT,
  profile_photo TEXT,
  education TEXT,
  experience TEXT,
  resume_link TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  tech_stack TEXT[] DEFAULT ARRAY[]::TEXT[],
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'database', 'tools')),
  icon TEXT,
  level TEXT DEFAULT 'intermediate' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date_obtained DATE NOT NULL,
  certificate_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  image TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  viewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_certificates_issuer ON certificates(issuer);
CREATE INDEX idx_certificates_date ON certificates(date_obtained DESC);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_read ON contact_messages(read);

-- Enable RLS (Row Level Security) for security
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (allow public read, authenticated write)
-- Profile
CREATE POLICY "Allow public read" ON profile FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON profile FOR ALL USING (auth.role() = 'authenticated');

-- About
CREATE POLICY "Allow public read" ON about FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON about FOR ALL USING (auth.role() = 'authenticated');

-- Projects
CREATE POLICY "Allow public read" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- Skills
CREATE POLICY "Allow public read" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON skills FOR ALL USING (auth.role() = 'authenticated');

-- Certificates
CREATE POLICY "Allow public read" ON certificates FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON certificates FOR ALL USING (auth.role() = 'authenticated');

-- Blog Posts
CREATE POLICY "Allow public read published" ON blog_posts FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- Contact Messages
CREATE POLICY "Allow public insert" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read/write" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
