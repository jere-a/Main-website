# Pages & Routing Knowledge Base

> **⚠️ IMPORTANT: This file should be updated when pages or routes change.**
> 
> When adding, removing, or modifying pages in this project, update this file to reflect those changes.
> This ensures AI assistants have accurate information about available routes and pages.

> **💡 USE SUB-AGENTS FOR COMPLEX EXPLORATION**
>
> When exploring or documenting pages and routing, use the Task tool with `explore` subagent:
> ```typescript
> task({
>   description: "Explore pages and routing",
>   prompt: "Find all pages in src/pages and document their routes and purposes...",
>   subagent_type: "explore"
> })
> ```

## Layouts

| File | Purpose |
|------|---------|
| `Layout.astro` | Main layout - CommonHead, NavMenu, SplashCursor, Footer, Cookies, view transitions |
| `BlogPost.astro` | Blog post layout - extends Layout with title, date, back link |

---

## Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `index.astro` | Home - intro, links to images/blog/oldsite |
| `/about` | `about.astro` | Author info |
| `/images` | `images/index.astro` | Image gallery |
| `/youtube` | `youtube.astro` | Empty placeholder |
| `/404` | `404.astro` | Not found |
| `/blog` | `blog/index.astro` | Blog listing filtered by language |
| `/blog/[lang]/[...id]` | `blog/[lang]/[...id].astro` | Individual MDX blog post |

---

## API Endpoints

| Route | File | Description |
|-------|------|-------------|
| `/robots.txt` | `robots.txt.ts` | Generates robots.txt |
| `/rss.xml` | `rss.xml.js` | RSS feed for blog |

---

## Data Fetching

- **Blog:** `getCollection('blog')` via Astro content collections
- **Images:** Static imports from `src/data/images/`
- **i18n:** Native Astro i18n with `getLangFromUrl()`, `useTranslations()`, `useTranslatedPath()`

---

## Language Support

- Default: Finnish (`fi`)
- Secondary: English (`en`)
- URL pattern: `/` (fi) vs `/en/` (en)
- Blog posts: `src/content/blog/fi/` and `src/content/blog/en/`
