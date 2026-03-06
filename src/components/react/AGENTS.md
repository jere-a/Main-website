# React Components

**Components:** 8 files | **Animations:** GSAP, motion/react, Three.js

## COMPONENT OVERVIEW

| Component | Lines | Purpose | Key Features |
|-----------|-------|---------|--------------|
| magic-bento.tsx | 747 | Bento grid with particle effects | GSAP: tilt, magnetism, spotlight, ripple |
| ModeToggle.tsx | 56 | Theme switcher | useState/useEffect, Radix Dropdown |
| nav-menu.tsx | 67 | Navigation menu | Active state, animate.css bounceIn |
| nav-Listitem.tsx | 34 | Nav item | forwardRef pattern |
| SpotlightCard.tsx | 46 | Mouse-tracking spotlight | CSS custom properties (--mouse-x, --mouse-y) |
| snowfall.tsx | 19 | Snow wrapper | react-snowfall library |
| ImageHolder.tsx | 53 | 3D card | Uses 3d-card UI component |
| ConditionalLoader.tsx | 1 | Placeholder | Empty |

## REACT HOOKS USAGE

**useState** - ModeToggle (theme), magic-bento (mobile detection)
**useEffect** - ModeToggle (theme sync), magic-bento (event listeners, cleanup)
**useRef** - magic-bento (6 refs: DOM, particles, timeouts, animations), SpotlightCard (DOM ref)
**useCallback** - magic-bento (initializeParticles, clearAllParticles, animateParticles)
**forwardRef** - nav-Listitem (Radix pattern)

**No React.memo** - Performance opportunity for heavy components (magic-bento, SplashCursor)

## ANIMATION SYSTEMS

**GSAP (magic-bento.tsx):**
- Particle spawn: `gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 })`
- Tilt: `gsap.to(element, { rotateX, rotateY, duration: 0.1, transformPerspective: 1000 })`
- Magnetism: `gsap.to(element, { x, y, duration: 0.3 })`
- Ripple: `gsap.fromTo(ripple, { scale: 0 }, { scale: 1, opacity: 0, duration: 0.8 })`

**motion/react (ui/ directory only):**
- card-spotlight.tsx: `useMotionValue`, `useMotionTemplate` for radial gradient
- link-preview.tsx: `AnimatePresence`, `useSpring` for hover physics
- file-upload.tsx: Basic drag-drop motion

**Three.js (@react-three/fiber) - ui/ only:**
- canvas-reveal-effect.tsx: Custom GLSL shaders via useFrame, useThree

## COMPONENT ARCHITECTURE

**Props:** Optional configs with defaults (magic-bento: enableTilt, enableMagnetism, disableAnimations)
**forwardRef:** nav-Listitem.tsx uses `React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>`
**"use client"**: Required in nav-Listitem.tsx, ImageHolder.tsx for Radix primitives

## PERFORMANCE NOTES

- Particles created/destroyed on hover in magic-bento (DOM costly)
- No useMemo in react/ - particles recreated on each render
- Proper event cleanup in useEffect returns
