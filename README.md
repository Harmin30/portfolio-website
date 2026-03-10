# 🌟 Modern Portfolio Website

A production-ready, fully responsive portfolio website built with cutting-edge web technologies. Perfect for developers, designers, and creative professionals who want to showcase their work professionally.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?style=flat)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat)

## ✨ Features

### 🎨 Frontend
- **Modern Design**: Clean, professional, and visually appealing UI
- **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop
- **Dark Mode**: Built-in dark/light theme toggle
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Fast Performance**: Optimized with Next.js 14
- **SEO Optimized**: Meta tags, open graph included

### 📱 Pages Included
1. **Home**: Hero section with typing effect
2. **About**: Biography, education, and experience timeline
3. **Projects**: Showcase of your best works
4. **Skills**: Categorized technical skills
5. **Contact**: Contact form with validation
6. **Blog**: Publish articles and insights

### 🔐 Admin Dashboard
- Secure Authentication with Supabase
- Project Management (CRUD)
- Skills Manager
- Blog System
- Message Management

### 🛠 Tech Stack
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Database**: Supabase
- **Auth**: Supabase Auth

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

Visit http://localhost:3000

## 📖 Documentation

- **[Setup & Deployment Guide](./SETUP_GUIDE.md)** - Complete setup instructions
- Environment variables configuration
- Supabase database setup
- Deployment to Vercel/Netlify

## 🔧 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
NEXT_PUBLIC_PORTFOLIO_NAME=Your Name
NEXT_PUBLIC_PORTFOLIO_TITLE=Your Title
NEXT_PUBLIC_PORTFOLIO_EMAIL=your@email.com
```

See `.env.local.example` for all variables.

## 🚢 Deployment

### Vercel (Recommended)
- Push to GitHub
- Import on Vercel
- Set environment variables
- Deploy!

### Netlify
- Connect GitHub repo
- Configure build settings
- Add environment variables
- Deploy

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

## 📊 Features Checklist

- ✅ Responsive design
- ✅ Dark mode
- ✅ Animations
- ✅ Admin dashboard
- ✅ Database integration
- ✅ Authentication
- ✅ Contact form
- ✅ Blog system
- ✅ SEO optimized
- ✅ Production ready

## 📄 License

MIT License

---

**[→ Get Started with Setup Guide](./SETUP_GUIDE.md)**

