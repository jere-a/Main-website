# Components Knowledge Base

> **⚠️ IMPORTANT: This file should be updated when components change.**
> 
> When adding, removing, or modifying components in this project, update this file to reflect those changes.
> This ensures AI assistants have accurate information about available components and their usage.

> **💡 USE SUB-AGENTS FOR COMPLEX EXPLORATION**
>
> When exploring or documenting components, use the Task tool with `explore` subagent:
> ```typescript
> task({
>   description: "Explore UI components",
>   prompt: "Find all components in src/components and document their purposes...",
>   subagent_type: "explore"
> })
> ```

## Overview

This directory contains all UI components used in the Astro website. Components are organized by framework/type:
- `ui/` - Radix UI primitives and complex components
- `react/` - React components (mostly removed in e48fa19)
- `*.astro` - Astro components

---

## SplashCursor.tsx (WebGL Fluid Simulation)

**Path:** `src/components/ui/SplashCursor.tsx`
**Lines:** 1558
**Framework:** Preact (client-only)

### Purpose
Creates an interactive WebGL fluid simulation that follows the cursor/touch input with colorful fluid dynamics. This is the most complex component in the codebase.

### Technical Implementation

**WebGL2 Rendering:**
- Uses WebGL2 rendering context
- Implements fluid dynamics simulation with:
  - Velocity field computation
  - Pressure solving (20 iterations by default)
  - Curl noise for natural movement
  - Density dissipation
- Custom vertex and fragment shaders
- Supports splat effects on click/touch

### Configuration Props
```typescript
interface SplashCursorProps {
  SIM_RESOLUTION?: number;        // 128 - Simulation grid resolution
  DYE_RESOLUTION?: number;        // 1440 - Dye texture resolution
  CAPTURE_RESOLUTION?: number;     // 512 - Screenshot resolution
  DENSITY_DISSIPATION?: number;   // 3.5 - How fast dye fades
  VELOCITY_DISSIPATION?: number;  // 2 - How fast velocity fades
  PRESSURE?: number;              // 0.1 - Pressure weight
  PRESSURE_ITERATIONS?: number;   // 20 - Pressure solver iterations
  CURL?: number;                  // 3 - Curl noise strength
  SPLAT_RADIUS?: number;          // 0.2 - Splat effect radius
  SPLAT_FORCE?: number;          // 6000 - Splat force magnitude
  SHADING?: boolean;             // true - Enable shading
  COLOR_UPDATE_SPEED?: number;    // 10 - Color cycling speed
  BACK_COLOR?: ColorRGB;          // {r:0.5,g:0,b:0} - Background color
  TRANSPARENT?: boolean;         // true - Enable transparency
}
```

### Skip Conditions (when NOT rendered)
- Server-side rendering (SSR)
- Mobile devices (`isMobile()` returns true)
- User prefers reduced motion (`prefers-reduced-motion`)
- No WebGL support in browser
- Embedded in iframe (`window.frameElement` exists)
- Tab is hidden (`document.visibilityState !== "visible"`)
- Viewport too small (< 600x400)

### Dependencies
- `@nanostores/preact` - State management
- `@/ts/global` - `isMobile()` function
- `@/ts/stores` - `isPrefersReducedMotion` atom

### Usage
```astro
<SplashCursor client:only="preact" />
```

---

## Astro Components

### CommonHead.astro
**Path:** `src/components/CommonHead.astro`

**Purpose:** SEO metadata, meta tags, prefetching configuration

**Props:**
```typescript
{
  title: string;  // Page title
}
```

**Features:**
- PostHog initialization
- SEOMetadata integration
- View transitions support  
- Prefetch configuration
- Open Graph tags
- Twitter card tags

**Dependencies:**
- `@/ts/posthog` - Analytics

---

### nav-menu.astro
**Path:** `src/components/nav-menu.astro`

**Purpose:** Main navigation menu with i18n support

**Props:**
```typescript
{
  active?: string;           // Current page identifier
  transitionName?: string;   // View transition name
}
```

**Navigation Links:**
- Home (`/`, `/en/`)
- Images (`/images`, `/en/images`)
- Blog (`/blog`, `/en/blog`)
- Old Site (external link)

**Features:**
- Uses `useTranslations()` for Finnish/English
- View transition support
- Active state indication
- Responsive design

---

### timeto.astro
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
- Server-side rendering
- Fallback client rendering
- Supports both fi and en locales

**Example:**
```astro
<timeto unixTime={1704067200} />
```

---

### ImageHolder.astro
**Path:** `src/components/ImageHolder.astro`

**Purpose:** Image card with lazy loading and optional effects

**Props:**
```typescript
{
  src: ImageMetadata;      // Astro image import
  title: string;          // Image title
  body?: string;          // Optional description
  alt: string;            // Alt text
  class?: string;         // Additional CSS classes
  transitionName?: string; // View transition name
}
```

**Features:**
- IntersectionObserver for lazy loading
- Blur-up placeholder effect
- Holiday-aware styling (adds "halloween" class during Halloween)
- View transition support
- Error handling for failed images

---

### Footer.astro
**Path:** `src/components/Footer.astro`

**Purpose:** Copyright footer with interactive hacker text effect

**Props:**
```typescript
{
  isCopyright?: boolean;  // Show copyright text (default: true)
}
```

**Features:**
- Dynamically imports `@/ts/hacker-text` on hover
- "Matrix-style" random letter cycling animation
- Customizable: letters, delay, iterations
- Finnish/English support

**Hacker Text Options:**
```typescript
{
  letters?: string;     // Characters to use (default: "01")
  delay?: number;      // Animation delay ms (default: 25)
  iterations?: number; // Number of iterations (default: 10)
}
```

---

### Latex.astro
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
- Error handling for invalid formulas

**Example:**
```astro
<Latex formula="\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}" />
```

---

### Other Components

| Component | Path | Purpose |
|-----------|------|---------|
| posthog.astro | `src/components/posthog.astro` | PostHog analytics initialization |
| cookies.astro | `src/components/cookies.astro` | Cookie consent banner |
| CloudTrace.astro | `src/components/CloudTrace.astro` | Display visitor IP |
| Card.astro | `src/components/Card.astro` | Link card with gradient |
| Social.astro | `src/components/Social.astro` | YouTube link component |
| ReloadPrompt.astro | `src/components/ReloadPrompt.astro` | PWA update notification |

---

## Component Hierarchy

```
Layout.astro (main layout)
├── SplashCursor (ui/SplashCursor.tsx) - WebGL background
├── CommonHead - SEO + PostHog
├── nav-menu.astro - Navigation
├── [page content]
│   ├── Card.astro - Link cards
│   ├── ImageHolder.astro - Image cards
│   ├── timeto.astro - Time display
│   └── Latex.astro - Math formulas
├── Footer.astro - Copyright + hacker text
├── cookies.astro - Cookie consent
├── CloudTrace.astro - IP display
└── ReloadPrompt.astro - PWA toast
```

---

## Key Dependencies

1. **Stores**: `isPrefersReducedMotion` from `@/ts/stores` controls SplashCursor
2. **Global utilities**: `query`, `isHoliday`, `language` from `@/ts/global`
3. **i18n**: `useTranslations` from `@/i18n/utils` used in nav-menu
4. **Analytics**: PostHog initialized in posthog.astro
5. **PWA**: ReloadPrompt uses `@/ts/pwa.ts`
6. **Special Effects**: Footer uses `@/ts/hacker-text` on hover
7. **Cloud**: CloudTrace uses `@/ts/cloudflare-trace`

---

## Removed Components (commit e48fa19)

The following components were removed in commit e48fa19:
- src/components/react/Glow.jsx
- src/components/react/ModeToggle.tsx
- src/components/react/nav-Listitem.tsx
- src/components/react/nav-menu.tsx
- src/components/ui/button.tsx
- src/components/ui/dialog.tsx
- src/components/ui/dropdown-menu.tsx
- src/components/ui/input.tsx
- src/components/ui/navigation-menu.tsx
- src/components/ui/select.tsx
- src/components/ui/skeleton.tsx
- src/pages/curl.txt.ts
- src/ts/global/globals.test.ts

---

## Anti-Patterns (DO NOT USE)

- ❌ Global CSS imports in components (import in Layout.astro)
- ❌ Inline styles in Astro templates (use `<style>` blocks)
- ❌ Using `@ts-ignore` without explanation
- ❌ Dead code (`false &&` blocks)
