# 🚀 Quick Start Guide

## Your Portfolio Website is Ready!

Your modern, fully-functional portfolio website has been successfully created. Here's how to get started:

## ⚡ Quick Setup (5 minutes)

### Step 1: Copy Environment Variables
```bash
cp .env.local.example .env.local
```

### Step 2: Edit Environment Variables
Open `.env.local` and fill in your information:
- Your name, title, email
- GitHub, LinkedIn, Twitter URLs
- Supabase credentials (optional for now)

### Step 3: Start Development
```bash
npm run dev
```

### Step 4: Visit Your Portfolio
Open http://localhost:3000 in your browser

## 📍 What You'll See

- **Home**: Hero section with your name and typing effect
- **About**: Your bio, education, and experience
- **Projects**: Showcase your work (add via admin)
- **Skills**: Display your technical skills
- **Contact**: Contact form for visitors
- **Blog**: Share your thoughts and articles
- **Admin**: Manage all content (`/admin/login`)

## 🔄 Development Workflow

### Make Changes
Edit any file in `src/` and the site auto-updates:
- Pages: `src/app/(public)/`
- Components: `src/components/`
- Styles: Edit Tailwind classes

### Add Content
1. Build pages manually by editing files, OR
2. Set up Supabase and use the admin dashboard

### Test Responsiveness
- Open DevTools (F12)
- Click device toolbar to test mobile/tablet
- All pages are fully responsive

## 🎨 Customization

### Change Colors
Edit `src/app/globals.css` and adjust Tailwind colors, or modify `tailwind.config.ts`

### Add Pages
Create new folder in `src/app/(public)/`:
```
src/app/(public)/my-page/page.tsx
```

Update `src/components/Navbar.tsx` to add link

### Update Content
Edit `.env.local` with your actual information

## 🗄️ Set Up Database (Optional Now)

To use the admin dashboard and store content:

1. Create free account: https://supabase.com
2. Create new project
3. Copy Project URL and API Key to `.env.local`
4. Run SQL in Supabase SQL Editor (see SETUP_GUIDE.md)
5. Access admin: http://localhost:3000/admin/login

## 🚢 Deploy (When Ready)

### Vercel (Recommended)
1. Push code to GitHub
2. Go to vercel.com
3. Import your repository
4. Add environment variables
5. Deploy!

### Netlify
1. Connect GitHub repo
2. Set build: `npm run build`
3. Publish: `.next`
4. Add environment variables
5. Deploy!

See `SETUP_GUIDE.md` for detailed deployment steps.

## 📁 Project Files

- **`src/`** - Source code
- **`public/`** - Static files
- **`.env.local`** - Your secrets (don't share!)
- **`README.md`** - Project overview
- **`SETUP_GUIDE.md`** - Detailed setup guide
- **`PROJECT_COMPLETE.md`** - What's included
- **`package.json`** - Dependencies

## 🎯 Common Tasks

### Change Site Name
Edit `.env.local`:
```env
NEXT_PUBLIC_PORTFOLIO_NAME=Your Name
NEXT_PUBLIC_PORTFOLIO_TITLE=Your Title
```

### Add Your Photo
1. Replace image URL in `.env.local` or pages
2. Or add image to `public/` folder
3. Use in pages with `<img src="/image.jpg" />`

### Customize Theme
Edit `tailwind.config.ts`:
```js
colors: {
  primary: '#your-color'
}
```

### Update Social Links
Edit `.env.local`:
```env
NEXT_PUBLIC_PORTFOLIO_GITHUB=https://github.com/yourname
NEXT_PUBLIC_PORTFOLIO_LINKEDIN=https://linkedin.com/in/yourname
```

## ✅ Checklist

- ✅ Project created
- ✅ Dependencies installed
- ✅ Environment setup ready
- ✅ All pages created
- ✅ Admin dashboard ready
- ✅ Dark mode enabled
- ✅ Animations configured
- ✅ Production build tested
- ⏭️ Configure Supabase (next)
- ⏭️ Deploy to Vercel/Netlify (later)

## 🔗 Useful Links

- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com
- Supabase: https://supabase.com/docs
- shadcn/ui: https://ui.shadcn.com
- Framer Motion: https://www.framer.com/motion

## 🆘 Troubleshooting

### Dev server won't start
```bash
# Clear cache
rm -rf .next node_modules package-lock.json

# Reinstall
npm install
npm run dev
```

### Styling looks wrong
- Clear browser cache (Ctrl+Shift+R)
- Refresh in incognito mode
- Restart dev server

### TypeScript errors
- Most are fixed automatically
- Check error message
- Restart dev server

## 📞 Need Help?

1. Check `SETUP_GUIDE.md` - has most answers
2. Check `PROJECT_COMPLETE.md` - features list
3. See error message in terminal/console
4. Visit framework docs (Next.js, Tailwind, etc.)

## 🎉 You're Ready!

Your professional portfolio website is set up and ready to customize. Start with:

```bash
npm run dev
```

Then visit http://localhost:3000 to see it live!

**After customizing**, follow `SETUP_GUIDE.md` to:
1. Set up Supabase database
2. Deploy to Vercel/Netlify

Happy coding! 🚀
