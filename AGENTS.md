<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes: APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Website Remix Project

## What This Is
A new website built with a reference site as layout and interaction inspiration, filled with this project's own brand, copy and images. See `BRIEF.md` for the idea and `docs/research/REMIX_PLAN.md` for the section plan.

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict)
- **UI:** shadcn/ui (Radix primitives, Tailwind CSS v4, `cn()` utility)
- **Icons:** Lucide React or custom SVGs
- **Styling:** Tailwind CSS v4 with oklch design tokens

## Commands
- `npm run dev`: start dev server
- `npm run build`: production build
- `npm run lint`: ESLint check

## Code Style
- TypeScript strict mode, no `any`
- Named exports, PascalCase components, camelCase utils
- Tailwind utility classes, no inline styles
- 2-space indentation
- Responsive: mobile-first
- Site copy lives in `src/content/` so it is easy to edit

## Design Principles
- Borrow structure, rhythm and behaviour from the reference; never its logos, photos, brand name or written copy
- Use this project's own palette, fonts and content from `BRIEF.md`
- No em dash or en dash characters anywhere in copy, comments or docs

@docs/research/INSPECTION_GUIDE.md
