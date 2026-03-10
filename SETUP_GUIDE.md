# Modern Portfolio Website - Setup & Deployment Guide

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [Supabase Configuration](#supabase-configuration)
3. [Local Development](#local-development)
4. [Deployment](#deployment)
5. [Customization](#customization)

## Initial Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier available at supabase.com)
- Vercel or Netlify account (optional, for deployment)

### 1. Clone/Setup the Project
```bash
cd portfolio-website
npm install
```

### 2. Environment Variables
Copy the example environment file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Portfolio Configuration
NEXT_PUBLIC_PORTFOLIO_NAME=Your Name
NEXT_PUBLIC_PORTFOLIO_TITLE=Full Stack Developer
NEXT_PUBLIC_PORTFOLIO_EMAIL=your.email@example.com
NEXT_PUBLIC_PORTFOLIO_GITHUB=https://github.com/yourname
NEXT_PUBLIC_PORTFOLIO_LINKEDIN=https://linkedin.com/in/yourname
NEXT_PUBLIC_PORTFOLIO_TWITTER=https://twitter.com/yourname
```

## Supabase Configuration

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose your organization and enter project details
4. Set a strong database password
5. Choose a region closer to you
6. Wait for the project to be created

### 2. Get Your API Keys
1. Go to Project Settings > API
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Create Database Tables

Go to Supabase SQL Editor and run these queries:

#### Projects Table
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  techStack TEXT[] NOT NULL DEFAULT '{}',
  githubUrl TEXT,
  liveUrl TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Skills Table
```sql
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'database', 'tools')),
  icon TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Blog Posts Table
```sql
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image TEXT,
  published BOOLEAN DEFAULT FALSE,
  publishedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Contact Messages Table
```sql
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### 4. Set Up Row-Level Security (RLS)

#### Projects Table
```sql
-- Allow public read access
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON projects
  FOR SELECT USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Allow authenticated users to manage" ON projects
  FOR ALL USING (auth.role() = 'authenticated');
```

#### Skills Table
```sql
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON skills
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage" ON skills
  FOR ALL USING (auth.role() = 'authenticated');
```

#### Blog Posts Table
```sql
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read published posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Allow authenticated users to manage" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');
```

#### Contact Messages Table
```sql
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 5. Set Up Authentication Users

1. Go to Supabase > Authentication > Users
2. Click "Add user"
3. Enter your admin email and password
4. Create the user

This user can now log in to the admin dashboard at `/admin/login`

## Local Development

### Start the Development Server
```bash
npm run dev
```

Visit http://localhost:3000
- Portfolio pages: http://localhost:3000/
- Admin login: http://localhost:3000/admin/login
- Admin dashboard: http://localhost:3000/admin/dashboard

### Build for Production
```bash
npm run build
npm run start
```

## Deployment

### Option 1: Vercel (Recommended)

#### Steps:
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure project settings:
   - Framework: Next.js
   - Root Directory: ./
6. Add environment variables under "Environment Variables":
   - Copy all variables from `.env.local`
7. Click "Deploy"

#### Redeploy
- Vercel automatically redeploys on every push to your main branch

### Option 2: Netlify

#### Steps:
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Choose GitHub and select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables under "Build & deploy > Environment"
   - Copy all variables from `.env.local`
7. Click "Deploy"

### Option 3: Self-Hosted

For Heroku, AWS, or other providers:
```bash
npm run build
# Upload the entire project to your server
# Set environment variables on your hosting platform
# Run: npm run start
```

## Customization

### 1. Update Portfolio Content

Edit `.env.local`:
```env
NEXT_PUBLIC_PORTFOLIO_NAME=Your Name
NEXT_PUBLIC_PORTFOLIO_TITLE=Your Title
NEXT_PUBLIC_PORTFOLIO_EMAIL=your@email.com
```

### 2. Customize Colors

Edit `tailwind.config.ts`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      },
    },
  },
};
```

### 3. Add More Sections

Create new pages in `src/app/(public)/`:
- Create new folder: `src/app/(public)/your-page`
- Create `page.tsx` in that folder
- Add link in `src/components/Navbar.tsx`

### 4. Modify Admin Dashboard

Edit admin pages in `src/app/admin/`:
- Dashboard: `dashboard/page.tsx`
- Projects: `projects/page.tsx`
- Skills: `skills/page.tsx`
- Blog: `blog/page.tsx`

## Troubleshooting

### Issue: "Cannot find Supabase"
- Check that `.env.local` has correct values
- Verify Supabase project is active
- Restart dev server: `npm run dev`

### Issue: Database tables not accessible
- Check RLS policies in Supabase
- Verify user is authenticated for admin operations
- Check browser console for error messages

### Issue: Deployment fails
- Check build logs on Vercel/Netlify
- Ensure all environment variables are set
- Verify Node.js version matches project requirements

### Issue: Styles not working
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`
- Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public pages
│   │   ├── page.tsx       # Home
│   │   ├── about/
│   │   ├── projects/
│   │   ├── skills/
│   │   ├── contact/
│   │   └── blog/
│   ├── admin/             # Admin pages
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── skills/
│   │   └── blog/
│   ├── api/               # API routes
│   │   ├── contact/
│   │   ├── projects/
│   │   ├── skills/
│   │   └── blog/
│   └── layout.tsx
├── components/
│   ├── ui/               # shadcn components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ThemeSwitcher.tsx
│   └── Providers.tsx
├── lib/
│   ├── supabase.ts       # Supabase client
│   └── utils.ts
└── types/
    └── index.ts
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJ...` |
| `NEXT_PUBLIC_PORTFOLIO_NAME` | Your name | `John Doe` |
| `NEXT_PUBLIC_PORTFOLIO_TITLE` | Your title | `Full Stack Developer` |
| `NEXT_PUBLIC_PORTFOLIO_EMAIL` | Your email | `john@example.com` |
| `NEXT_PUBLIC_PORTFOLIO_GITHUB` | GitHub profile URL | `https://github.com/username` |
| `NEXT_PUBLIC_PORTFOLIO_LINKEDIN` | LinkedIn profile URL | `https://linkedin.com/in/username` |
| `NEXT_PUBLIC_PORTFOLIO_TWITTER` | Twitter profile URL | `https://twitter.com/username` |

## Features Implemented

✅ Modern, responsive design
✅ Dark mode support
✅ Smooth animations (Framer Motion)
✅ Multiple pages (Home, About, Projects, Skills, Contact, Blog)
✅ Admin dashboard with CRUD operations
✅ Supabase integration
✅ Authentication (Supabase Auth)
✅ Contact form with database storage
✅ SEO optimized
✅ TypeScript support
✅ Tailwind CSS styling
✅ shadcn/ui components
✅ Lucide React icons

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)

## License

This project is open source and available under the MIT License.

---

Happy building! 🚀
