-- Supabase SQL Script: Insert Sample Data for Testing
-- Run this in your Supabase project's SQL editor
-- You can delete all this data later and add real data

-- ============================================
-- SAMPLE DATA FOR ALL TABLES
-- ============================================

-- Insert Profile (Home section)
INSERT INTO profile (name, title, bio, github, linkedin, twitter, email)
VALUES (
  'Harmin Patel',
  'Full Stack Developer',
  'I create beautiful and functional web applications',
  'https://github.com/Harmin30',
  'https://www.linkedin.com/in/harmin-patel-37a605327/',
  'https://twitter.com/harmin30',
  'harminpatel30@gmail.com'
);

-- Insert About Section
INSERT INTO about (about_text, education, experience, resume_link)
VALUES (
  'I am a passionate full-stack developer with expertise in modern web technologies. I love building scalable applications and solving complex problems. With a strong foundation in both frontend and backend development, I create beautiful, functional web applications that users love. I stay updated with the latest technologies and best practices to deliver high-quality solutions.',
  'Bachelor of Science in Computer Science
University of California | 2018 - 2022
Graduated with honors. Relevant coursework included Web Development, Database Design, Software Engineering, and Data Structures.

Full Stack Web Development Bootcamp
Coding Academy | 2023
Intensive 12-week training in modern web development with React, Node.js, and the MERN stack. Completed capstone projects and learned industry best practices.',
  'Senior Full Stack Developer
Tech Company Inc. | 2023 - Present
Leading development of client-facing web applications using Next.js and TypeScript. Mentoring junior developers and architecting scalable solutions for millions of users.

Full Stack Developer
Digital Agency Solutions | 2021 - 2023
Developed and maintained multiple web projects using React and Node.js. Implemented responsive designs and optimized database queries for better performance.

Junior Developer
StartUp Hub | 2020 - 2021
Collaborated with cross-functional teams to build and deploy web applications. Learned best practices in version control, testing, and code review processes.',
  'https://example.com/resume.pdf'
);

-- Insert Sample Projects
INSERT INTO projects (title, description, tech_stack, github_url, live_url)
VALUES 
(
  'E-Commerce Platform',
  'A full-stack e-commerce platform with payment integration, user authentication, and admin dashboard.',
  ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'],
  'https://github.com/Harmin30/ecommerce',
  'https://ecommerce-demo.vercel.app'
), 
(
  'Task Management App',
  'Collaborative task management application with real-time updates and team features.',
  ARRAY['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
  'https://github.com/Harmin30/task-app',
  'https://task-app-demo.vercel.app'
),
(
  'AI Chat Bot',
  'An AI-powered chatbot using OpenAI API for intelligent conversations.',
  ARRAY['React', 'Express', 'OpenAI API', 'MongoDB'],
  'https://github.com/Harmin30/ai-chatbot',
  'https://ai-chatbot-demo.vercel.app'
);

-- Insert Sample Skills
INSERT INTO skills (name, category, level)
VALUES 
('React', 'frontend', 'advanced'),
('TypeScript', 'frontend', 'advanced'),
('Tailwind CSS', 'frontend', 'advanced'),
('Vue.js', 'frontend', 'intermediate'),
('Node.js', 'backend', 'advanced'),
('Express', 'backend', 'advanced'),
('Python', 'backend', 'intermediate'),
('PostgreSQL', 'database', 'advanced'),
('MongoDB', 'database', 'intermediate'),
('Supabase', 'database', 'advanced'),
('Git', 'tools', 'advanced'),
('Docker', 'tools', 'intermediate');

-- Insert Sample Blog Posts
INSERT INTO blog_posts (title, slug, content, excerpt, published, published_at)
VALUES 
(
  'Getting Started with Next.js 15',
  'getting-started-with-nextjs-15',
  'Next.js 15 introduces many exciting features and improvements. In this comprehensive guide, we will explore the latest features and how to leverage them in your projects... [Full content here]',
  'Learn how to get started with Next.js 15 and build modern web applications.',
  true,
  now()
),
(
  'Building Scalable APIs with Node.js',
  'building-scalable-apis-nodejs',
  'Creating scalable APIs is essential for modern web applications. This guide covers best practices and patterns for building robust Node.js APIs... [Full content here]',
  'Master the techniques for building fast and scalable APIs using Node.js and Express.',
  true,
  now()
),
(
  'React Hooks Deep Dive',
  'react-hooks-deep-dive',
  'React Hooks have revolutionized the way we write React components. This article explores custom hooks, hook rules, and advanced patterns... [Full content here]',
  'Understand React Hooks deeply and learn how to create custom hooks for reusable logic.',
  false,
  NULL
);

-- Insert Sample Contact Message (optional - can also test through contact form)
INSERT INTO contact_messages (name, email, message)
VALUES 
(
  'John Doe',
  'john@example.com',
  'Hi Harmin, I really enjoyed your portfolio. Would love to discuss a potential project!'
);
