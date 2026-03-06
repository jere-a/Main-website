# UI Components (Radix/shadcn)

**Components:** 16 files | **Pattern:** Radix primitives + Tailwind styling

## COMPONENT PATTERNS

**CVA (class-variance-authority)** variants in 3 components:
- `buttonVariants`: variant (default/destructive/outline/secondary/ghost/link), size (default/sm/lg/icon)
- `alertVariants`: variant (default/destructive)
- `navigationMenuTriggerStyle`: data-[state], data-[active] selectors

**forwardRef + displayName**: All wrapped components follow pattern:
```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(...props, ref) => {...}
Button.displayName = "Button"
```

**cn() utility**: All components use `cn()` from `@/lib/utils` for Tailwind class merging (clsx + tailwind-merge)

## 16 UI COMPONENTS

| Component | Description |
|-----------|-------------|
| button.tsx | CVA variants, asChild with @radix-ui/react-slot |
| alert.tsx | CVA variants, AlertTitle/AlertDescription, role="alert" |
| navigation-menu.tsx | Radix menu, ChevronDown rotation on data-[state=open] |
| dialog.tsx | Modal with Portal, overlay + content, DialogHeader/Footer |
| dropdown-menu.tsx | Nested submenus, radio/checkbox items, inset prop |
| select.tsx | Form select with Portal, ScrollUp/Down buttons |
| input.tsx | Styled input, file input support |
| skeleton.tsx | Loading placeholder with animate-pulse |
| carousel.tsx | Embla slider with motion/react animations |
| link-preview.tsx | Hover preview effect with motion/react |
| file-upload.tsx | Drag-drop upload with react-dropzone + motion/react |
| card-spotlight.tsx | Mouse-following spotlight with CanvasRevealEffect |
| canvas-reveal-effect.tsx | Three.js shader for dot matrix reveal |
| card-hover-effect.tsx | Hover interactions with AnimatePresence |
| 3d-card.tsx | 3D perspective card with Context-based state |
| SplashCursor.tsx | WebGL fluid simulation (1,566 lines) |

## RADIX PRIMITIVES USED

@radix-ui/react-*: Dialog, DropdownMenu, NavigationMenu, Select, Slot, HoverCard
Icons: CheckIcon, ChevronDownIcon, ChevronUpIcon, ChevronRightIcon, Cross2Icon, ArrowLeftIcon, ArrowRightIcon

## STYLING APPROACH

Tailwind classes combined with Radix state data attributes:
- `data-[state=open/closed/visible/hidden]` - Animation triggers
- `data-[active]`, `data-[disabled]` - Interactive states
- `data-[side=bottom/left/right/top]` - Positioning
- `data-[motion=from-end/from-start]` - Navigation menu animations

Animation classes: `animate-in`, `animate-out`, `fade-in`, `zoom-in`, `slide-in-from-*`
Focus pattern: `focus-visible:ring-1 focus-visible:ring-ring`
