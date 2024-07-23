import { type ClassValue, clsx } from "clsx"
// import { twMerge } from "tailwind-merge"

const { twMerge } = await import('tailwind-merge');

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
