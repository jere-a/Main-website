# TypeScript Utilities Knowledge Base

> **⚠️ IMPORTANT: This file should be updated when utilities change.**
> 
> When adding, removing, or modifying utilities in this project, update this file to reflect those changes.
> This ensures AI assistants have accurate information about available utilities and their usage.

> **💡 USE SUB-AGENTS FOR COMPLEX EXPLORATION**
>
> When exploring or documenting utilities, use the Task tool with `explore` subagent:
> ```typescript
> task({
>   description: "Explore utilities",
>   prompt: "Find all TypeScript utilities in src/ts and document their purposes...",
>   subagent_type: "explore"
> })
> ```

## Overview

This directory contains all TypeScript utilities, libraries, and helper code used throughout the project.

---

## Table of Contents

1. [Global Utilities](#1-global-utilities)
2. [State Management](#2-state-management)
3. [jQuery Implementation](#3-jquery-implementation)
4. [Root Utilities](#4-root-utilities)
5. [Type Definitions](#5-type-definitions)

---

## 1. Global Utilities

### 1.1 checks.ts - Device & Browser Detection

**Path:** `src/ts/global/checks.ts`

```typescript
// Detect if device has touchscreen capability
function detectTouchscreen(): boolean;

// Check if device is mobile (touchscreen + not desktop)
function isMobile(): boolean;

// Set up prefers-reduced-motion listener
function PrefersReducedMotion(): void;
```

**How it works:**

`detectTouchscreen()` checks for touchscreen via:
- `pointerType` in PointerEvent
- `maxTouchPoints` in navigator
- `TouchEvent` in window
- `ontouchstart` in window

`isMobile()` combines:
- `detectTouchscreen()` = true
- NOT a desktop device (checked via user agent patterns)

`PrefersReducedMotion()`:
- Sets up `matchMedia('(prefers-reduced-motion: reduce)')` listener
- Updates `isPrefersReducedMotion` Nanostore atom
- Calls on change to notify components

**Used by:** SplashCursor.tsx (isMobile check), global code initialization

---

### 1.2 globals.ts - General Utilities

**Path:** `src/ts/global/globals.ts`

#### String Utilities

```typescript
// Convert string to Unicode escape sequences
toUnicode(str: string): string;

// Capitalize first letter
capitalize(str: string): string;
```

#### Browser Utilities

```typescript
// Get browser language (default: "fi")
language(onlyFi?: boolean, lang?: string): string;

// Throttle callback execution
throttle<T extends (...args: any[]) => any>(cb: T, delay: number): T;
```

#### DOM Utilities

```typescript
// Inject CSS into document head
injectCSS(css: string): HTMLElement;

// Link external CSS
addCSSFromURL(url: string): HTMLLinkElement;

// Event handler with delegation
addEventListener(
  element: Element | Document,
  eventName: string,
  handler: (e: Event) => void,
  selector?: string
): void;
```

#### Error Handling

```typescript
// Type-safe error catching
catchErrorTyped<T, E extends Error = Error>(
  promise: Promise<T>,
  errorsToCatch?: E[]
): Promise<[E, undefined] | [null, T]>;
```

#### Logging

```typescript
// Custom console.log
l(...args: any[]): void;
```

---

### 1.3 query.ts - DOM Query Utilities

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

**Type Safety:**
- `query()` returns typed HTMLElement or null
- `queryAll()` returns NodeList
- `queryAll_v2()` returns clean HTMLElement array

**Test file:** `src/ts/global/query.test.ts`

---

### 1.4 holidays.ts - Holiday Detection

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

#### Holiday Periods

| Holiday | Start | End |
|---------|-------|-----|
| Halloween | October 1 | November 10 |
| Christmas | November 30 | December 25 |
| New Year | December 26 | January 8 |

#### Feature Flag Integration

Uses PostHog feature flag "holiday-effects" to optionally disable holiday effects.

**Used by:** ImageHolder.astro, blog/index.astro, images/index.astro, global-code.ts

---

### 1.5 Holiday Effect Implementations

#### christmas.ts
**Path:** `src/ts/global/holidays/christmas.ts`

- Uses `let-it-go` library for string lights effect
- Injects "lightrope" HTML element (string of lights)
- Creates animated Christmas lights on page

```typescript
// Main function
export default function christmas(): void;
```

**CSS:** `src/styles/holidays/christmas.css`

---

#### halloween.ts
**Path:** `src/ts/global/holidays/halloween.ts`

- Adds "halloween" class to all `<p>` elements
- Adds "butcherman" font class to elements with "halloween-time" class
- Loads Halloween CSS and fonts

```typescript
// Main function
export default function halloween(): void;
```

**CSS:** `src/styles/holidays/halloween.css`
**Fonts:** Butcherman, Creepster

---

#### newYear.ts
**Path:** `src/ts/global/holidays/newYear.ts`

- Uses `fireworks-js` library for fullscreen fireworks
- Creates canvas overlay for animation
- Supports sound effects (after user interaction)

```typescript
// Main function - manual trigger
export function newYear(): void;
```

**Features:**
- Fullscreen canvas
- Configurable particle count
- Sound effects (optional)
- Auto-cleanup on page navigation

---

## 2. State Management

### stores.ts

**Path:** `src/ts/stores.ts`

```typescript
import { atom } from "nanostores";

// Tracks user's prefers-reduced-motion preference
export const isPrefersReducedMotion = atom<boolean>(false);
```

**Usage:**
```typescript
// In Preact/React components
import { useStore } from "@nanostores/preact";
import { isPrefersReducedMotion } from "@/ts/stores";

const prefersReducedMotion = useStore(isPrefersReducedMotion);
```

**Updated by:** `PrefersReducedMotion()` in checks.ts

---

## 3. jQuery Implementation

### 3.1 basic.ts - ElementCollection

**Path:** `src/ts/jquery/basic.ts`
**Lines:** 327

#### ElementCollection Class

Extends `Array<Element | Document>` with jQuery-like API:

```typescript
class ElementCollection extends Array<Element | Document> {
  constructor(param?: ElementCollectionParam);
  
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

#### $ Function (Proxy-based)

```typescript
const $ = (param?: ElementCollectionParam) => {
  // Returns Proxy-wrapped ElementCollection
  // Forwards unknown properties to first element
  // Allows setting properties on all elements
};
```

**Proxy Behavior:**
- Reads unknown property → returns from first element
- Sets unknown property → sets on ALL elements
- Method calls → forwarded to first element

#### Static Methods

```typescript
// GET request with query string
$.get({ url: string, data: object, dataType: string }): void;
```

#### Usage Examples

```typescript
// Select elements
$('.my-class').addClass('active');

// Event binding
$('button').on('click', handleClick);

// Event delegation
$('ul').on('click', 'li', handleListClick);

// Getter/Setter
$('input').attr('value', 'hello');
$('div').text('New text');

// Chaining
$('.card')
  .addClass('highlight')
  .on('click', handleClick)
  .each(el => console.log(el));
```

---

### 3.2 types.d.ts - Zod Schemas

**Path:** `src/ts/jquery/types.d.ts`

```typescript
// AJAX request validation
const ajaxSchema = z.object({...});
const ajaxgetSchema = z.object({...});

// Type guards
const ElementDocumentInstanceof = z.instanceof(Element);
const DocumentInstanceof = z.instanceof(Document);
const EventTargetInstanceof = z.instanceof(EventTarget);

// Parameter validation
const ParamSchema = z.union([...]);
```

---

## 4. Root Utilities

### 4.1 posthog.ts - PostHog Analytics

**Path:** `src/ts/posthog.ts`

```typescript
// Initialize PostHog
// - Skips on localhost
// - Custom API host: https://t.ozze.eu.org
// - Sets feature flags for holiday effects in DEV
```

**Features:**
- Auto-initialized in CommonHead.astro
- Captures page views
- Feature flags for holiday effects control

---

### 4.2 cloudflare-trace.ts - IP Detection

**Path:** `src/ts/cloudflare-trace.ts`

```typescript
interface CloudflareTrace {
  ip: string;
  uag: string;    // User agent
  tls: string;
  loc: string;    // Location
  http: string;
  h: string;
}

// Fetch Cloudflare trace data
fetchData(): Promise<CloudflareTrace>;
```

**Endpoint:** `/cdn-cgi/trace`

**Used by:** CloudTrace.astro, 404.mts

---

### 4.3 hacker-text.ts - Glitch Effect

**Path:** `src/ts/hacker-text.ts`

```typescript
// Matrix-style glitch effect
function hackerText(
  element: Element,
  options?: {
    letters?: string;     // Characters to cycle (default: "01")
    delay?: number;      // Animation delay ms (default: 25)
    iterations?: number; // Number of iterations (default: 10)
  }
): void;
```

**Used by:** Footer.astro (dynamically imported on hover)

---

### 4.4 global-code.ts - Main Initialization

**Path:** `src/ts/global-code.ts`

```typescript
// Initialize reduced motion listener
init(): void;

// Main initialization
main(): void;
// - Disables context menu on images
// - Runs holiday effects
```

**Used by:** Layout.astro

---

## 5. Type Definitions

### env.d.ts
**Path:** `src/env.d.ts`

Astro environment type declarations.

---

## Usage Summary

| Utility File | Used By |
|--------------|---------|
| `global/query.ts` | cookies.astro, Footer.astro, CloudTrace.astro, timeto.astro, ImageHolder.astro, blog/index.astro, images/index.astro |
| `global/checks.ts` | SplashCursor.tsx |
| `global/holidays.ts` | global-code.ts, ImageHolder.astro, blog/index.astro, images/index.astro |
| `stores.ts` | checks.ts, SplashCursor.tsx |
| `posthog.ts` | posthog.astro |
| `cloudflare-trace.ts` | CloudTrace.astro, 404.mts |
| `hacker-text.ts` | Footer.astro |
| `global-code.ts` | Layout.astro |

---

## Known Issues

1. **Circular import warning** between `network.ts` (if present) and `@/ts/global` barrel
2. **Type errors** in holidays.ts: `useTranslations()` expects `"fi" | "en"` but receives `string`

---

## Anti-Patterns (DO NOT USE)

- ❌ Using `eval()` or `new Function()` (security risk)
- ❌ String arguments to `setTimeout/setInterval` (security risk)
- ❌ Adding TODO/FIXME comments
- ❌ Using `@ts-ignore` without `@ts-expect-error` explanation
