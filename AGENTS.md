# PROJECT KNOWLEDGE BASE -comprehensive

**Generated:** 2026-03-08
**Branch:** main

**Documentation:** [Astro Docs](https://docs.astro.build/llms-full.txt)

---

> **⚠️ IMPORTANT: This file should be updated regularly to keep it in sync with the codebase.**
>
> Whenever significant changes are made to the project (new features, refactoring, configuration changes, etc.),
> this knowledge base should be updated to reflect those changes. This ensures AI assistants always have
> accurate, up-to-date information about the project.
>
> **Update triggers include:**
> - New components added or removed
> - Configuration changes (astro.config.mjs, package.json, etc.)
> - New dependencies or integrations
> - Routing or page structure changes
> - New utility functions or libraries
> - Holiday effects system changes
> - i18n changes
>
> Run `git log` to review recent commits and ensure this file reflects the current state.

---

> **💡 USING SUB-AGENTS**
>
> When working on complex tasks, AI agents should use sub-agents (Task tool) to handle pieces of the work.
> This project has specialized sub-agents available:
>
> - **Explore Agent** (`explore`): For searching and understanding codebase patterns
> - **Security Auditor** (`security-auditor`): For security audits and vulnerability detection
> - **General Agent** (`general`): For multi-step tasks and research
>
> **When to use sub-agents:**
> - When searching through many files simultaneously
> - When analyzing complex code patterns
> - When doing research on specific topics
> - When the task can be parallelized
> - When exploring unfamiliar parts of the codebase
>
> **How to use:**
> ```typescript
> // Example: Launch explore agent
> task({
>   description: "Explore components directory",
>   prompt: "Find all UI components and their relationships...",
>   subagent_type: "explore"
> })
> ```
>
> Sub-agents can run in parallel for maximum efficiency. Always provide clear, detailed prompts
> and specify what information should be returned.

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Directory Structure](#3-directory-structure)
4. [Configuration](#4-configuration)
5. [Components](#5-components)
6. [Utilities & Libraries](#6-utilities--libraries)
7. [Pages & Routing](#7-pages--routing)
8. [Holiday Effects System](#8-holiday-effects-system)
9. [State Management](#9-state-management)
10. [i18n & Translations](#10-i18n--translations)
11. [Build & Deployment](#11-build--deployment)
12. [Code Quality](#12-code-quality)
13. [Testing](#13-testing)
14. [Known Issues](#14-known-issues)
15. [Recent Changes](#15-recent-changes)

---

## 1. PROJECT OVERVIEW

This is a multi-framework Astro website with support for React, Preact, Solid, Svelte, Vue, Qwik, Lit, and Alpine. It serves as a personal portfolio/blog site for the owner (Jere Laitinen / Åzze).

### Site Information
- **URL:** https://ozze.eu.org
- **Author:** Jere E.L
- **Main Language:** Finnish (fi)
- **Secondary Language:** English (en)
- **YouTube Channel:** UCNAVV2j-Bmuu9ApfTYwYAeA
- **GitHub:** jere-a

### Key Features
- Blog with MDX content support
- Image gallery with lazy loading
- Holiday effects (Halloween, Christmas, New Year)
- WebGL fluid simulation cursor (SplashCursor)
- PWA capabilities with service worker
- PostHog analytics
- Cookie consent banner
- View transitions between pages
- Cloudflare IP detection

---

## 2. TECHNOLOGY STACK

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| Astro | 5.18.0 | Main static site generator |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.3.1 | Build tool |

### UI Frameworks (Islands Architecture)
| Framework | Integration | Usage |
|-----------|-------------|-------|
| React | @astrojs/react | SplashCursor, some islands |
| Preact | @astrojs/react | SplashCursor (via nanostores/preact) |
| Solid | @astrojs/solid-js | Available but unused |
| Svelte | @astrojs/svelte | Available but unused |
| Vue | @astrojs/vue | Available but unused |
| Qwik | @qwikdev/astro | Available but unused |
| Lit | @astrojs/lit | Available but unused |
| Alpine | @astrojs/alpinejs | Available but unused |

### Styling
| Technology | Purpose |
|------------|---------|
| Tailwind CSS v4 | Utility-first CSS |
| CVA (class-variance-authority) | Component variants |
| clsx + tailwind-merge | Class concatenation |
| Sass (SCSS) | CSS preprocessing |

### State & Data
| Library | Purpose |
|---------|---------|
| Nanostores | Lightweight state management |
| @nanostores/react | React bindings |
| @nanostores/persistent | Persistent storage (installed but unused) |
| Zod | Schema validation |

### Integrations
| Package | Purpose |
|---------|---------|
| @astrojs/mdx | MDX content |
| @astrojs/sitemap | SEO sitemap |
| @astrojs/partytown | Third-party script offloading |
| @vite-pwa/astro | PWA with service worker |
| astro-purgecss | CSS purging |
| @playform/compress | HTML compression |
| @playform/inline | Inline small assets |
| @tailwindcss/vite | Tailwind CSS v4 |
| rollup-plugin-visualizer | Bundle analysis |

### Analytics & Monitoring
| Package | Purpose |
|---------|---------|
| @sentry/astro | Error tracking |
| posthog-js | Analytics (self-hosted) |
| @fingerprintjs/fingerprintjs | Browser fingerprinting |

### Other Notable Dependencies
| Package | Purpose |
|---------|---------|
| date-fns | Date formatting |
| dayjs | Date manipulation |
| katex | LaTeX math rendering |
| gsap | Animations |
| firework-s-js | New Year fireworks |
| let-it-go | Christmas lights effect |
| lucide-react | Icons |
| animate.css | CSS animations |
| fuse.js | Fuzzy search |

---

## 3. DIRECTORY STRUCTURE

```
src/
├── components/
│   ├── ui/                    # Radix UI components
│   │   └── SplashCursor.tsx   # WebGL fluid simulation (1558 lines)
│   ├── react/                 # Empty (all removed in e48fa19)
│   │   └── AGENTS.md
│   ├── CommonHead.astro       # SEO metadata
│   ├── nav-menu.astro         # Navigation
│   ├── timeto.astro           # Unix time converter
│   ├── posthog.astro          # Analytics init
│   ├── cookies.astro          # Cookie banner
│   ├── ImageHolder.astro      # Lazy image cards
│   ├── Footer.astro           # Copyright + hacker text
│   ├── CloudTrace.astro       # IP display
│   ├── Card.astro             # Link cards
│   ├── Latex.astro           # Math formulas
│   ├── Social.astro           # YouTube link
│   ├── ReloadPrompt.astro     # PWA update toast
│   └── ts/
│       └── pwa.ts             # PWA utilities
├── layouts/
│   ├── Layout.astro           # Main layout
│   └── BlogPost.astro         # Blog post layout
├── pages/
│   ├── index.astro            # Home (/)
│   ├── about.astro            # About (/about)
│   ├── 404.astro              # Not found (/404)
│   ├── youtube.astro         # YouTube (/youtube)
│   ├── robots.txt.ts          # robots.txt endpoint
│   ├── rss.xml.js             # RSS feed
│   ├── images/
│   │   └── index.astro        # Gallery (/images)
│   └── blog/
│       ├── index.astro        # Blog list (/blog)
│       └── [lang]/
│           └── [...id].astro  # Individual post
├── ts/
│   ├── stores.ts              # Nanostores atoms
│   ├── posthog.ts             # PostHog init
│   ├── cloudflare-trace.ts    # IP detection
│   ├── hacker-text.ts         # Glitch effect
│   ├── global-code.ts         # Main init
│   ├── global/
│   │   ├── index.ts          # Barrel export
│   │   ├── checks.ts         # Device detection
│   │   ├── globals.ts        # Utilities
│   │   ├── query.ts          # DOM queries
│   │   ├── holidays.ts       # Holiday detection
│   │   └── holidays/
│   │       ├── christmas.ts   # Christmas effects
│   │       ├── halloween.ts  # Halloween effects
│   │       └── newYear.ts    # Fireworks
│   └── jquery/
│       ├── basic.ts          # jQuery-like library
│       └── types.d.ts        # Zod types
├── i18n/
│   ├── index.ts              # Barrel
│   ├── ui.ts                 # Translation strings
│   └── utils.ts              # i18n helpers
├── content/
│   ├── blog/
│   │   ├── fi/               # Finnish posts
│   │   └── en/               # English posts
│   └── config.ts             # Content collection schema
├── data/
│   ├── images/               # Gallery images
│   ├── fonts/                # Custom fonts
│   └── sounds/               # Audio effects
├── styles/
│   ├── global.css            # Global styles
│   ├── custom.css            # Custom CSS
│   ├── view-transition.scss  # View transitions
│   └── holidays/            # Holiday CSS
├── config.ts                 # Site config
├── configFeatures.ts         # Feature flags
└── content.config.ts         # Zod schemas
```

---

## 4. CONFIGURATION

### Site Configuration (src/config.ts)

```typescript
export interface SiteConfig {
  host: string;        // "ozze.eu.org"
  url: string;        // "https://ozze.eu.org"
  oldSite: string;     // "http://old.ozze.eu.org/index.html"
  title: string;      // "Åzze"
  blogTitle: string;  // "Åzze's Blog"
  description: string; // "Pieni nettisivunu." (Finnish)
  rssDescription: string;
  postsPerPage: number;
  recentPosts: number;
  mainAuthor: string;
  youtubeChannelId: string;
  mainLanguage: string; // "fi-fi"
  github: string;
}
```

### Feature Flags (src/configFeatures.ts)

```typescript
interface FeatureParams {
  params: {
    cookies: boolean;       // Cookie consent
    holidayEffects: boolean;
    oldSiteRedirect: boolean;
    fetchIPP: boolean;     // IP display
    splashCursor: boolean;
  };
  cookieExpiry: number;    // Days
}
```

### Astro Configuration (astro.config.mjs)

**Output:** static

**Redirects:**
- `/posts` → `/blog`
- `/post` → `/blog`
- `/kuvat` → `/images`

**Integrations:**
- MDX, Preact, Sitemap, PWA, i18n, Partytown, PurgeCSS, Compress, TailwindCSS

**Security:**
- CSP allowed domains for content

---

## 5. COMPONENTS

### 5.1 SplashCursor.tsx (WebGL Fluid Simulation)

**Path:** `src/components/ui/SplashCursor.tsx`
**Lines:** 1558
**Type:** Preact component (client-only)

**Purpose:** Creates an interactive WebGL fluid simulation that follows the cursor/touch input with colorful fluid dynamics.

**Technical Details:**
- Uses WebGL2 rendering context
- Implements fluid dynamics simulation with:
  - Velocity field computation
  - Pressure solving (20 iterations)
  - Curl noise for natural movement
  - Density dissipation
- Custom shaders for rendering
- Supports splat effects on click/touch

**Configuration Props:**
```typescript
interface SplashCursorProps {
  SIM_RESOLUTION?: number;      // 128
  DYE_RESOLUTION?: number;     // 1440
  CAPTURE_RESOLUTION?: number;  // 512
  DENSITY_DISSIPATION?: number; // 3.5
  VELOCITY_DISSIPATION?: number;// 2
  PRESSURE?: number;            // 0.1
  PRESSURE_ITERATIONS?: number; // 20
  CURL?: number;               // 3
  SPLAT_RADIUS?: number;       // 0.2
  SPLAT_FORCE?: number;        // 6000
  SHADING?: boolean;           // true
  COLOR_UPDATE_SPEED?: number; // 10
  BACK_COLOR?: ColorRGB;       // {r:0.5,g:0,b:0}
  TRANSPARENT?: boolean;       // true
}
```

**Skip Conditions (when not rendered):**
- Server-side rendering
- Mobile devices (`isMobile()`)
- Reduced motion preference
- No WebGL support
- Small viewport (< 600x400)
- Hidden tab (visibilityState !== "visible")

**Usage:**
```astro
<SplashCursor client:only="preact" />
```

---

### 5.2 CommonHead.astro

**Path:** `src/components/CommonHead.astro`

**Purpose:** SEO metadata, meta tags, prefetching configuration

**Props:**
- `title` - Page title

**Features:**
- PostHog initialization
- SEOMetadata integration
- View transitions support
- Prefetch configuration

---

### 5.3 nav-menu.astro

**Path:** `src/components/nav-menu.astro`

**Purpose:** Main navigation menu

**Props:**
- `active` - Current page identifier
- `transitionName` - View transition name

**Links:**
- Home (`/`, `/en/`)
- Images (`/images`, `/en/images`)
- Blog (`/blog`, `/en/blog`)
- Old Site (external)

**i18n Support:** Uses `useTranslations()` for Finnish/English

---

### 5.4 ImageHolder.astro

**Path:** `src/components/ImageHolder.astro`

**Purpose:** Image card with lazy loading and optional blur placeholder

**Props:**
```typescript
{
  src: ImageMetadata;    // Astro image import
  title: string;
  body?: string;
  alt: string;
  class?: string;
  transitionName?: string;
}
```

**Features:**
- IntersectionObserver for lazy loading
- Blur-up placeholder effect
- Holiday-aware styling (adds "halloween" class during Halloween)
- View transition support

---

### 5.5 Footer.astro

**Path:** `src/components/Footer.astro`

**Purpose:** Copyright footer with interactive hacker text effect

**Props:**
- `isCopyright?: boolean` - Show copyright text (default: true)

**Features:**
- Dynamically imports `@/ts/hacker-text` on hover
- "Matrix-style" random letter cycling animation
- Customizable letters, delay, iterations

---

### 5.6 timeto.astro

**Path:** `src/components/timeto.astro`

**Purpose:** Convert Unix timestamp to human-readable date

**Props:**
```typescript
{
  unixTime: number;  // Unix timestamp in seconds
}
```

**Features:**
- Uses `date-fns` with Finnish locale
- Supports both server and client rendering

---

### 5.7 Latex.astro

**Path:** `src/components/Latex.astro`

**Purpose:** Render mathematical formulas using KaTeX

**Props:**
```typescript
{
  formula: string;  // KaTeX formula string
}
```

**Features:**
- Server-side rendering via KaTeX
- CSS loaded from CDN

---

### 5.8 Other Components

| Component | Path | Purpose |
|-----------|------|---------|
| posthog.astro | `src/components/posthog.astro` | PostHog analytics initialization |
| cookies.astro | `src/components/cookies.astro` | Cookie consent banner |
| CloudTrace.astro | `src/components/CloudTrace.astro` | Display visitor IP (feature-gated) |
| Card.astro | `src/components/Card.astro` | Link card with gradient background |
| Social.astro | `src/components/Social.astro` | YouTube link component |
| ReloadPrompt.astro | `src/components/ReloadPrompt.astro` | PWA update notification |

---

## 6. UTILITIES & LIBRARIES

### 6.1 checks.ts - Device & Browser Detection

**Path:** `src/ts/global/checks.ts`

```typescript
// Detect if device has touchscreen capability
function detectTouchscreen(): boolean;

// Check if device is mobile (touchscreen + not desktop)
function isMobile(): boolean;

// Set up prefers-reduced-motion listener
function PrefersReducedMotion(): void;
```

**Used by:** SplashCursor.tsx (isMobile check)

---

### 6.2 globals.ts - General Utilities

**Path:** `src/ts/global/globals.ts`

```typescript
// Convert string to Unicode escapes
toUnicode(str: string): string;

// Get browser language (default: "fi")
language(onlyFi?: boolean, lang?: string): string;

// Throttle callback execution
throttle<T extends (...args: any[]) => any>(cb: T, delay: number): T;

// Inject CSS into document head
injectCSS(css: string): HTMLElement;

// Link external CSS
addCSSFromURL(url: string): HTMLLinkElement;

// Type-safe error catching
catchErrorTyped<T, E extends Error = Error>(
  promise: Promise<T>,
  errorsToCatch?: E[]
): Promise<[E, undefined] | [null, T]>;

// Capitalize first letter
capitalize(str: string): string;

// Custom console.log
l(...args: any[]): void;

// Event handler with delegation
addEventListener(
  element: Element | Document,
  eventName: string,
  handler: (e: Event) => void,
  selector?: string
): void;
```

---

### 6.3 query.ts - DOM Query Utilities

**Path:** `src/ts/global/query.ts`

```typescript
// querySelector wrapper
function query<T extends HTMLElement = HTMLElement>(
  selector: string,
  context?: Element | Document
): T | null;

// querySelectorAll wrapper
function queryAll(
  selector: string,
  context?: Element | Document
): NodeListOf<Element>;

// querySelectorAll returning HTMLElement array
function queryAll_v2(
  selector: string,
  context?: Element | Document
): HTMLElement[];
```

**Test file:** `src/ts/global/query.test.ts`

---

### 6.4 holidays.ts - Holiday Detection

**Path:** `src/ts/global/holidays.ts`

```typescript
interface HolidayResult {
  bool: boolean;
  holiday: "halloween" | "christmas" | "newYear" | null;
  script: string | null;
  timeto: number;
}

// Async check if current date is within a holiday period
async function isHoliday(data?: any): Promise<HolidayResult>;

// Calculate time until target date
function holidayTimeTo(targetDate?: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};
```

**Holiday Periods:**
| Holiday | Start | End |
|---------|-------|-----|
| Halloween | October 1 | November 10 |
| Christmas | November 30 | December 25 |
| New Year | December 26 | January 8 |

---

### 6.5 Holiday Effect Implementations

#### christmas.ts
**Path:** `src/ts/global/holidays/christmas.ts`

- Uses `let-it-go` library for string lights effect
- Injects "lightrope" HTML element (string of lights)
- Loads Christmas CSS from `src/styles/holidays/`

#### halloween.ts
**Path:** `src/ts/global/holidays/halloween.ts`

- Adds "halloween" class to all `<p>` elements
- Adds "butcherman" font class to elements with "halloween-time" class
- Loads Halloween CSS

#### newYear.ts
**Path:** `src/ts/global/holidays/newYear.ts`

- Uses `fireworks-js` library for fullscreen fireworks
- Creates canvas overlay for animation
- Supports sound effects (after user interaction)
- Exports `newYear()` function for manual triggering

---

### 6.6 jQuery Implementation (basic.ts)

**Path:** `src/ts/jquery/basic.ts`

**ElementCollection Class** (extends Array):

```typescript
class ElementCollection extends Array<Element | Document> {
  // DOM ready handler
  ready(cb: (this: Document) => func): this;

  // Event binding (with delegation support)
  on(event: string, cbOrSelector, cbOrOptions?): this;

  // One-time event handler
  one(event: string, cbOrSelector): this;

  // Remove event listener
  off(event: string, cb: (e: Event) => func): this;

  // Match selector check
  is(selector: string): this;

  // Remove from DOM
  remove(): this;

  // Unwrap parent
  unwrap(): void;

  // Iterate elements
  each(cb: (el: ElementDocument) => each): this;

  // Get/set text content
  text(text?: string): string | this;

  // Get/set attributes
  attr(name: string, value?: string): string | this;

  // Get/set data attributes
  data(name?: string, value?: any): any;

  // AJAX request
  ajax(data: ajax): Promise<this>;

  // Class manipulation
  addClass(className: string): this;
  removeClass(className: string): this;
  hasClass(className: string): boolean;
}
```

**$ Function** (Proxy-based):
```typescript
const $ = (param?: ElementCollectionParam) => {
  // Returns Proxy-wrapped ElementCollection
  // Forwards unknown properties to first element
  // Allows setting properties on all elements
};
```

**Static Methods:**
```typescript
// GET request with query string
$.get({ url: string, data: object, dataType: string }): void;
```

---

### 6.7 Other Utilities

#### posthog.ts
- Initializes PostHog analytics
- Skips on localhost
- Custom API host: `https://t.ozze.eu.org`
- Sets feature flags for holiday effects in DEV

#### cloudflare-trace.ts
```typescript
// Fetch Cloudflare trace data
fetchData(): Promise<{
  ip: string;
  uag: string;  // User agent
  tls: string;
  loc: string;  // Location
  http: string;
  h: string;
}>;
```

#### hacker-text.ts
```typescript
// Matrix-style glitch effect
function hackerText(
  element: Element,
  options?: {
    letters?: string;
    delay?: number;
    iterations?: number;
  }
): void;
```

#### global-code.ts
```typescript
// Initialize reduced motion listener
init(): void;

// Main initialization
main(): void;
```

---

## 7. PAGES & ROUTING

### Routes Overview

| Route | File | Description |
|-------|------|-------------|
| `/` | `index.astro` | Home page |
| `/en/` | `index.astro` | English home |
| `/about` | `about.astro` | About page |
| `/images` | `images/index.astro` | Image gallery |
| `/youtube` | `youtube.astro` | YouTube placeholder |
| `/blog` | `blog/index.astro` | Blog listing |
| `/blog/[lang]/[...id]` | `blog/[lang]/[...id].astro` | Individual post |
| `/robots.txt` | `robots.txt.ts` | robots.txt |
| `/rss.xml` | `rss.xml.js` | RSS feed |
| `/404` | `404.astro` | Not found |

### Page Details

#### index.astro
- Fetches translations via `useTranslations()` and `useTranslatedPath()`
- Links to: `/images`, `/blog`, old site, YouTube
- GitHub corner SVG with animation
- Uses view transitions

#### about.astro
- Static page with author information

#### images/index.astro
- Imports 7 images from `src/data/images/`
- Uses `ImageHolder` component
- IntersectionObserver for lazy loading
- Grid layout with auto-fit
- Holiday-aware styling

#### blog/index.astro
- Fetches posts via `getCollection('blog')`
- Filters by current language
- Date formatting with `date-fns`
- Content truncation to 300 chars
- View transitions for title, time, content

#### blog/[lang]/[...id].astro
- Dynamic route with `getStaticPaths()`
- Renders MDX content via `astro:content`
- Params: `lang` (fi/en), `id` (slug)

---

## 8. HOLIDAY EFFECTS SYSTEM

The holiday effects system automatically activates based on the current date.

### How It Works

1. **Detection:** `isHoliday()` checks if current date falls within any holiday period
2. **Feature Flag:** Optionally controlled by PostHog feature flag ("holiday-effects")
3. **Effect Injection:** Holiday-specific scripts are loaded dynamically
4. **CSS Loading:** Holiday-themed CSS is injected

### CSS Files
| Holiday | CSS Path |
|---------|----------|
| Halloween | `src/styles/holidays/halloween.css` |
| Christmas | `src/styles/holidays/christmas.css` |
| New Year | (handled by fireworks-js library) |

### Fonts
- **Halloween:** Butcherman font
- **Christmas:** (string lights effect)

---

## 9. STATE MANAGEMENT

### Nanostores

**Path:** `src/ts/stores.ts`

```typescript
import { atom } from "nanostores";

// Tracks user's prefers-reduced-motion preference
export const isPrefersReducedMotion = atom<boolean>(false);
```

**Usage in Components:**
```typescript
import { useStore } from "@nanostores/preact";
import { isPrefersReducedMotion } from "@/ts/stores";

const prefersReducedMotion = useStore(isPrefersReducedMotion);
```

**Usage in checks.ts:**
```typescript
// PrefersReducedMotion() sets up media query listener
// Updates isPrefersReducedMotion atom when preference changes
```

---

## 10. I18N & TRANSLATIONS

### Supported Languages
- **Finnish (fi)** - Default
- **English (en)**

### URL Structure
- `/` → Finnish (default)
- `/en/` → English

### Translation Files

The i18n system now uses TypeScript files with compile-time type validation.

#### File Structure
```
src/i18n/
├── index.ts        # Barrel exports
├── types.ts        # Type definitions with DeepEqual validation
├── schema.ts       # LangSchema type definition
├── utils.ts        # Helper functions
└── locales/
    ├── index.ts    # Re-exports fi and en
    ├── fi.ts       # Finnish translations
    └── en.ts       # English translations
```

#### schema.ts
```typescript
export type LangSchema = {
  nav: {
    home: string;
    about: string;
    images: { title: string; desc: string; };
    blog: { title: string; desc: string; };
    oldsite: string;
    lang: string;
  };
  index: { github: string; h1: { title: string; }; title: string; };
  about: { title: string; author: string; };
  images: { title: string; subtitle: string; };
  notfound: { title: string; message: string; };
  youtube: { title: string; };
  holiday: { christmas: string; newyear: string; halloween: string; };
};
```

#### types.ts
```typescript
import { en, fi } from "./locales";

export const translations = { fi, en } as const;
export type Lang = keyof typeof translations;
export const defaultLang: Lang = "fi";

// Deep equality validation between languages
type DeepEqual<A, B> = ...;
type DeepValidate<A, B> = ...;

// Type-safe translation keys
export type TranslationKeys = Paths<DefaultSchema>;
export type TranslationShape = DeepObject<DefaultSchema>;
```

#### locales/fi.ts
```typescript
import type { LangSchema } from "../schema.ts";

export const fi: LangSchema = {
  nav: { home: "Koti", about: "Tietoja", ... },
  index: { github: "Näytä lähde koodi GitHub:issa", ... },
  ...
} satisfies LangSchema;
```

#### utils.ts
```typescript
// Get language from URL
getLangFromUrl(url: URL): "fi" | "en";

// Get translations for language
useTranslations(lang: "fi" | "en"): (key: string) => string;

// Generate path with language prefix
useTranslatedPath(lang: "fi" | "en"): (path: string) => string;
```

**Key Features:**
- Compile-time type validation between languages using DeepEqual/DeepValidate
- Type-safe translation keys via `TranslationKeys` type
- Schema validation ensures both languages have identical structure

---

## 11. BUILD & DEPLOYMENT

### Commands

```bash
bun run dev          # Start dev server
bun run build        # Production build
bun run check-types  # TypeScript type checking
bun run test         # Run astro check
```

### Linting

```bash
biome check --write --unsafe  # Auto-fix linting issues
```

### Build Output
- **Output directory:** `dist/`
- **Bundle analyzer:** Generates `stats.html`
- **Size limit:** 2 seconds load time (enforced by CI)

### Deployment
- **Platform:** Cloudflare Workers
- **Config:** `wrangler.toml`
- **CI/CD:** GitHub Actions

---

## 12. CODE QUALITY

### Linting
- **Tool:** Biome
- **Config:** `biome.json`
- **Pre-commit hook:** `biome check`

### Secret Detection
- **Tool:** gitleaks
- **Pre-commit hook:** Runs on every commit

### TypeScript
- **Strict mode:** Enabled
- **Type checking:** `tsc --noEmit`
- **Known issues:** 3 type errors with `useTranslations()` expecting `"fi" | "en"` but receiving `string`

---

## 13. TESTING

### Test Frameworks
| Framework | Status | Notes |
|-----------|--------|-------|
| Vitest | Configured but disabled | See commit d9d5b22 |
| Cypress | E2E tests | 1 spec file |
| Playwright | Configured | No tests exist |

### Test Coverage
- Very low: ~2% of source files have tests
- Tests exist for: `src/ts/global/query.test.ts`

---

## 14. KNOWN ISSUES

### Type Errors (3 instances)
`useTranslations()` expects `"fi" | "en"` but receives `string` in:
- `src/components/nav-menu.astro`
- `src/pages/index.astro`
- `src/ts/global/holidays.ts`

### Circular Import Warning
`src/ts/global/` barrel may cause circular import with `network.ts` (if present)

### Anti-Patterns to Avoid
- ❌ Using `@ts-ignore` without `@ts-expect-error` explanation
- ❌ Adding TODO/FIXME comments
- ❌ Using `eval()` or `new Function()`
- ❌ String arguments to `setTimeout/setInterval`
- ❌ Global CSS imports in components (use Layout.astro)
- ❌ Inline styles in Astro templates (use `<style>` blocks)
- ❌ Dead code (`false &&` blocks)

---

## 15. RECENT CHANGES

| Commit | Date | Description |
|--------|------|-------------|
| fb138d7 | 2026-03-08 | Removing unnecessary things |
| 3bf9a2b | 2026-03-08 | Changing the package manager back to bun |
| 6cb5aed | 2026-03-08 | Change github deploy to using mise |
| 0b905e2 | 2026-03-08 | Adding mise.toml config |
| c0bd391 | 2026-03-08 | Update wrangler to version 4 |
| c502bb3 | 2026-03-08 | Justifying NavMenu content to the left |
| aef8a14 | 2026-03-07 | Fix i18n errors |
| 56e384e | 2026-03-01 | Added view-transition.scss for transitions without JavaScript |
| 3010bca | 2026-03-01 | Modified cleanup.yml file |
| 24723bc | 2026-03-01 | Updated PWA service worker component |
| c40eb52 | 2026-03-01 | Updated type definitions |
| 6134ef0 | 2026-03-01 | Updated TypeScript utilities |
| e48fa19 | 2026-02-27 | Deleted unneeded files (shadcn/ui components, React components, test files) |
| a63f720 | 2026-02-04 | Changed to TypeScript (added ts-to-zod, renamed configs to .cts) |
| ca0efab | 2026-02-04 | Removed unnecessary packages, dynamic importing holidays |
| 88e7e79 | 2025-12-28 | Big update to working holiday effects and changed to bun |
| c29a512 | 2024-10-30 | Big Update Halloween (added fonts, effects system) |

---

## REFERENCE DOCUMENTATION

| Technology | Documentation | LLM Docs |
|-----------|--------------|----------|
| Astro | https://docs.astro.build/ | https://docs.astro.build/llms-full.txt |
| TypeScript | https://www.typescriptlang.org/docs/ | - |
| Tailwind CSS v4 | https://tailwindcss.com/docs | - |
| React | https://react.dev/ | - |
| Preact | https://preactjs.com/ | - |
| Vite | https://vite.dev/ | https://vite.dev/llms.txt |
| Svelte | https://svelte.dev/docs | https://svelte.dev/llms.txt |
| Biome | https://biomejs.dev/ | - |
| Nanostores | https://github.com/nanostores/nanostores | - |
| Radix UI | https://www.radix-ui.com/ | - |
| Partytown | https://partytown.builder.io/ | - |
| Vite PWA | https://vite-pwa-org.translate.goog/ | - |

---

*This document is maintained by AI agents and updated based on git commits.*
