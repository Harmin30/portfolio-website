# Routes & Pages Reference

## 📱 Public Pages

### Home Page
- **Route**: `/`
- **File**: `src/app/(public)/page.tsx`
- **Features**:
  - Hero section with typing effect
  - Profile introduction
  - Tech stack badges
  - Call-to-action buttons
  - Statistics section
  - Animated elements

### About Page
- **Route**: `/about`
- **File**: `src/app/(public)/about/page.tsx`
- **Features**:
  - Personal biography
  - Profile image section
  - Education timeline
  - Work experience timeline
  - Career journey narrative

### Projects Page
- **Route**: `/projects`
- **File**: `src/app/(public)/projects/page.tsx`
- **Features**:
  - Grid layout for projects
  - Project cards with images
  - Tech stack display
  - GitHub and live demo links
  - Hover animations
  - Placeholder projects with CRUD ready

### Skills Page
- **Route**: `/skills`
- **File**: `src/app/(public)/skills/page.tsx`
- **Features**:
  - Categorized skills layout
  - Categories: Frontend, Backend, Database, Tools
  - Proficiency level indicators
  - Social links
  - Responsive grid

### Contact Page
- **Route**: `/contact`
- **File**: `src/app/(public)/contact/page.tsx`
- **Features**:
  - Contact form with validation
  - Contact information cards
  - Social media links
  - Toast notifications
  - Supabase integration

### Blog Page
- **Route**: `/blog`
- **File**: `src/app/(public)/blog/page.tsx`
- **Features**:
  - Blog post listing
  - Featured images
  - Excerpt previews
  - Publication dates
  - Placeholder posts

## 🔐 Admin Pages

### Admin Login
- **Route**: `/admin/login`
- **File**: `src/app/admin/login/page.tsx`
- **Features**:
  - Supabase authentication
  - Email/password login
  - Error handling
  - Session management
  - Redirect to dashboard on success

### Admin Dashboard
- **Route**: `/admin/dashboard`
- **File**: `src/app/admin/dashboard/page.tsx`
- **Features**:
  - Overview statistics
  - Projects count
  - Skills count
  - Messages count
  - Blog posts count
  - Quick action buttons
  - Admin layout with sidebar

### Admin Projects
- **Route**: `/admin/projects`
- **File**: `src/app/admin/projects/page.tsx`
- **Features**:
  - View all projects
  - Create new project
  - Edit existing projects
  - Delete projects
  - Form with validation
  - Tech stack management

### Admin Skills
- **Route**: `/admin/skills`
- **File**: `src/app/admin/skills/page.tsx`
- **Features**:
  - View all skills
  - Organized by category
  - Create new skill
  - Edit skills
  - Delete skills
  - Proficiency levels
  - Category management

### Admin Blog
- **Route**: `/admin/blog`
- **File**: `src/app/admin/blog/page.tsx`
- **Features**:
  - Create blog posts
  - Edit existing posts
  - Delete posts
  - Publish/unpublish
  - Markdown content editor
  - Featured image upload
  - Auto slug generation
  - Publication date management

## 📡 API Routes

### Contact Message API
- **Route**: `POST /api/contact`
- **File**: `src/app/api/contact/route.ts`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "message": "string"
  }
  ```
- **Response**: `{ success: true, message: string }`
- **Features**:
  - Validates input
  - Stores in Supabase
  - Error handling
  - No authentication required

### Projects API
- **Route**: `GET /api/projects` or `POST /api/projects`
- **File**: `src/app/api/projects/route.ts`
- **Methods**: 
  - GET: Fetch all projects
  - POST: Create new project (admin only)
- **GET Response**:
  ```json
  [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "image": "url",
      "techStack": ["string"],
      "githubUrl": "url",
      "liveUrl": "url",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
  ```
- **POST Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "image": "url",
    "techStack": ["string"],
    "githubUrl": "url",
    "liveUrl": "url"
  }
  ```

## 🧩 Components

### Layout Components
- **Navbar** (`src/components/Navbar.tsx`)
  - Navigation links
  - Mobile menu
  - Admin link
  - Dark mode toggle
  - Responsive design

- **Footer** (`src/components/Footer.tsx`)
  - Social media links
  - Quick links
  - Copyright info
  - Responsive layout

- **ThemeSwitcher** (`src/components/ThemeSwitcher.tsx`)
  - Dark/light mode toggle
  - Sun and moon icons
  - Smooth transitions

- **Providers** (`src/components/Providers.tsx`)
  - Theme provider
  - Toast notifications
  - App context

### UI Components (shadcn/ui)
- Button
- Card (with CardHeader, CardTitle, CardContent)
- Input fields
- Dialog/Modal (ready to add)
- Form components (ready to add)

## 🔗 Navigation Structure

```
/                    Home
├── /about           About
├── /projects        Projects
├── /skills          Skills
├── /contact         Contact
├── /blog            Blog
├── /admin           Admin
│   ├── /login       Login
│   ├── /dashboard   Dashboard
│   ├── /projects    Manage Projects
│   ├── /skills      Manage Skills
│   └── /blog        Manage Blog Posts
└── /api             API Routes
    ├── /contact     Contact submission
    ├── /projects    Projects CRUD
    └── /skills      Skills CRUD
```

## 💾 Database Tables

### projects
- `id` (UUID, primary key)
- `title` (TEXT)
- `description` (TEXT)
- `image` (TEXT)
- `techStack` (TEXT[])
- `githubUrl` (TEXT)
- `liveUrl` (TEXT)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### skills
- `id` (UUID, primary key)
- `name` (TEXT)
- `category` (TEXT) - 'frontend'|'backend'|'database'|'tools'
- `icon` (TEXT)
- `level` (TEXT) - 'beginner'|'intermediate'|'advanced'
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### blog_posts
- `id` (UUID, primary key)
- `title` (TEXT)
- `slug` (TEXT, unique)
- `content` (TEXT)
- `excerpt` (TEXT)
- `image` (TEXT)
- `published` (BOOLEAN)
- `publishedAt` (TIMESTAMP)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### contact_messages
- `id` (UUID, primary key)
- `name` (TEXT)
- `email` (TEXT)
- `message` (TEXT)
- `read` (BOOLEAN)
- `createdAt` (TIMESTAMP)

## 📝 Environment Variables

### Required (Public)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_PORTFOLIO_NAME` - Your name
- `NEXT_PUBLIC_PORTFOLIO_TITLE` - Your professional title
- `NEXT_PUBLIC_PORTFOLIO_EMAIL` - Contact email

### Optional (Public)
- `NEXT_PUBLIC_PORTFOLIO_GITHUB` - GitHub profile URL
- `NEXT_PUBLIC_PORTFOLIO_LINKEDIN` - LinkedIn profile URL
- `NEXT_PUBLIC_PORTFOLIO_TWITTER` - Twitter profile URL

### Required (Secret)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)

## 🎨 Styling

### Tailwind CSS
- Utility-first CSS framework
- Configured for dark mode
- Responsive breakpoints:
  - Mobile: < 640px (sm)
  - Tablet: 640px-1024px (md)
  - Desktop: > 1024px (lg)

### Custom Colors
Edit `tailwind.config.ts` to customize:
- Primary colors
- Accent colors
- Background colors
- Border colors

## 🔒 Authentication Flow

1. User visits `/admin/login`
2. Enters email and password
3. Supabase authenticates
4. Session created
5. Redirected to `/admin/dashboard`
6. Protected routes check session
7. Unauthorized users redirect to login

## 📊 Admin Features by Route

| Route | Features |
|-------|----------|
| /admin/login | Email/password auth |
| /admin/dashboard | Stats, quick links |
| /admin/projects | Full CRUD for projects |
| /admin/skills | Full CRUD for skills |
| /admin/blog | Full CRUD for blog posts |

## 🔄 State Management

- React Context for theme
- Supabase for data
- useState for forms
- SWR/Fetch for API calls (ready to integrate)

## 🚀 Deployment Routes

- Main domain: Home page
- /about, /projects, etc.: Public pages
- /admin/login: Admin access
- /api/*: Backend APIs (Vercel/Netlify serverless)

---

For more details, see:
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Database and deployment
- [PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md) - Features overview
- [QUICK_START.md](./QUICK_START.md) - Getting started
