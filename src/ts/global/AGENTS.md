# Global Utilities

**Location:** `src/ts/global/` | **Purpose:** Barrel export for all shared utilities

## BARREL EXPORT (index.ts)

Exports from: checks, globals, holidays, network, query, Youtube

**Circular Dependency Issue:** `network.ts` imports from `@/ts/global` barrel, but barrel exports it. While it works via hoisting, can cause bundler warnings.

## DOM QUERY UTILITIES

**query()** - `querySelector` wrapper with context support
**queryAll()** - `querySelectorAll` wrapper
**queryAll_v2()** - Alternative implementation

## STRING UTILITIES

**capitalize()** - First letter uppercase
**toUnicode()** - Convert to Unicode escape sequences
**convertToUnicodeEscape()** - Extended unicode conversion

## CSS INJECTION

**injectCSS()** - Adds `<style>` element to document head, returns element
**addCSSFromURL()** - Links external CSS file

## BROWSER DETECTION

**isMobile()** - Device detection
**detectTouchscreen()** - Touch capability check
**PrefersReducedMotion()** - MediaQuery listener, updates `isPrefersReducedMotion` Nanostore

## LOGGING

**l()** - Custom console.log wrapper (exported, used across codebase)
**catchErrorTyped()** - Type-safe error catching

## NETWORK

**isOnline()** - Promise-based online check
**onlineCheck()** - Periodic status polling

## HOLIDAY SYSTEM

**isHoliday()** - Async detection (Christmas, Halloween, New Year)
**holidayTimeTo()** - Returns time/duration to/from holiday
**ExtendedDate** class - Extends Date with `isBetween()` method

## YOUTUBE

**latestVideo()** - Fetches latest video from channel

## PERFORMANCE

**throttle()** - Debounce/throttle wrapper (used in event handlers)
**timeStart/timeStop** - Performance timing (in `/src/ts/performance.ts`)

## LANGUAGE

**language()** - Extracts browser language code
**toLocale()** - Full locale string helper
