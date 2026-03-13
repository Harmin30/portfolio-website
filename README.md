# 🌟 Modern Portfolio Website

A production-ready, fully responsive portfolio website built with cutting-edge web technologies. Perfect for developers, designers, and creative professionals who want to showcase their work professionally.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?style=flat)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat)

## ✨ Features

### 🎨 Frontend

- **Modern Design**: Clean, professional, and visually appealing UI
- **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop
- **Dark Mode**: Built-in dark/light theme toggle with cinematic transitions
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Fast Performance**: Optimized with Next.js 16
- **SEO Optimized**: Meta tags, open graph included

### 📱 Public Pages

1. **Home**: Hero section with animations and introduction
2. **About**: Biography, education, and experience timeline
3. **Projects**: Showcase of your best works with details
4. **Skills**: Categorized technical skills display
5. **Certificates**: Display certifications with duration calculations
6. **Contact**: Contact form with email notifications
7. **Blog**: Publish and read articles with markdown support

### 🔐 Admin Dashboard

- **Secure Authentication**: Email/password with PIN recovery
- **Project Management**: Create, edit, delete projects
- **Skills Manager**: Manage all technical skills
- **Blog System**: Write and publish articles
- **Certificate Manager**: Add certifications with date tracking
- **Message Management**: View and manage contact form messages
- **Profile Manager**: Update personal information
- **Settings**: Manage site preferences
- **Dashboard Analytics**: View key metrics

### 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email**: Resend
- **Form Data**: SWR for data fetching
- **Markdown**: React Markdown with GitHub Flavored Markdown

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier available)

### Installation

```bash
# 1. Clone or extract the project
cd portfolio-website

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local

# 4. Edit .env.local with your information and Supabase credentials
# (See Environment Setup section below)

# 5. Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 🔧 Environment Setup

### Required Environment Variables

```env
# Portfolio Information
NEXT_PUBLIC_PORTFOLIO_NAME=Your Name
NEXT_PUBLIC_PORTFOLIO_TITLE=Your Title/Role
NEXT_PUBLIC_PORTFOLIO_EMAIL=your@email.com

# Supabase Setup (Get from https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Service (Using Resend)
RESEND_API_KEY=your_resend_api_key
```

See `.env.local.example` for all available variables.

## 📚 Database Setup

### Initialize Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL from `SUPABASE_SETUP.sql` in your Supabase SQL editor
4. Copy your API credentials to `.env.local`

### Tables Created

- `profiles` - User profile information
- `projects` - Portfolio projects
- `skills` - Technical skills
- `certificates` - Certifications and credentials
- `blog_posts` - Blog articles
- `contact_messages` - Contact form submissions
- `admin_recovery` - PIN-based password recovery

## 🔐 Admin Dashboard Access

1. Navigate to `/admin/login`
2. Sign up with your email
3. Set a 4-digit PIN in admin settings
4. Use email + PIN for recovery

## 📦 Project Structure

```
portfolio-website/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public-facing pages
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── about/         # About page
│   │   │   ├── projects/      # Projects showcase
│   │   │   ├── skills/        # Skills display
│   │   │   ├── certificates/  # Certificates display
│   │   │   ├── blog/          # Blog listing & articles
│   │   │   └── contact/       # Contact form
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── login/         # Login page
│   │   │   ├── dashboard/     # Analytics dashboard
│   │   │   ├── projects/      # Project management
│   │   │   ├── skills/        # Skills management
│   │   │   ├── certificates/  # Certificate management
│   │   │   ├── blog/          # Blog management
│   │   │   ├── messages/      # Message management
│   │   │   └── settings/      # Settings
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── Navbar.tsx         # Navigation
│   │   ├── Footer.tsx         # Footer
│   │   ├── ThemeSwitcher.tsx  # Dark mode toggle
│   │   └── Providers.tsx      # App providers
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client
│   │   ├── deleteModal.tsx    # Delete confirmation
│   │   ├── useNotification.ts # Toast notifications
│   │   └── utils.ts           # Utilities
│   └── types/
│       └── index.ts           # TypeScript types
├── public/                    # Static assets
├── SUPABASE_SETUP.sql        # Database schema
└── package.json
```

## 🚀 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push project to GitHub
2. Import repository on [vercel.com](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

### Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy!

### Self-Hosted

1. Build: `npm run build`
2. Start: `npm start`
3. Server listens on `http://localhost:3000`

## 🎨 Customization

### Update Your Information

Edit `src/app/layout.tsx` and `.env.local` with your personal details.

### Modify Colors & Styling

- Colors are controlled by Tailwind CSS
- Edit `tailwind.config.ts` for theme changes
- Component-specific styles use inline Tailwind classes

### Add New Pages

Create new folders in `src/app/(public)/` following Next.js structure.

## 📝 Blog Writing

1. Go to Admin Dashboard → Blog Posts
2. Click "Add Blog Post"
3. Write content in Markdown
4. Publish when ready

Supports:

- Headers, lists, tables
- Code blocks with syntax highlighting
- Images and links
- Blockquotes and emphasis

## 🐛 Troubleshooting

### Port Already in Use

```bash
npm run dev -- -p 3001
```

### Supabase Connection Issues

- Verify `NEXT_PUBLIC_SUPABASE_URL` and keys are correct
- Check Supabase project is active
- Ensure IP is whitelisted (if needed)

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## 📞 Support & Questions

- Check existing documentation files
- Review Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)

## 📄 License

This project is open source and available under the MIT License.

## ✅ Latest Updates

- Improved blog article mobile responsiveness
- Added certificate duration display (calculated months)
- Theme switcher available in admin dashboard
- Optional certificate date fields (single date or date range)
- Enhanced admin form UX with clear date options
- Fixed mobile text sizing across all pages

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
