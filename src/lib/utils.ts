import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns Tailwind color classes for a grade based on its percentage value.
 * Used to visually indicate grade quality across the app.
 * 
 * @param score - The score achieved (e.g., 85)
 * @param maxScore - The maximum possible score (e.g., 100)
 * @returns An object with bg, text, and border color classes
 */
export function getGradeColorClasses(score: number, maxScore: number): {
  bg: string;
  text: string;
  border: string;
} {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 80) {
    return {
      bg: 'bg-green-500/15',
      text: 'text-green-500',
      border: 'border-green-500/30',
    };
  }

  if (percentage >= 60) {
    return {
      bg: 'bg-amber-500/15',
      text: 'text-amber-500',
      border: 'border-amber-500/30',
    };
  }

  return {
    bg: 'bg-red-500/15',
    text: 'text-red-500',
    border: 'border-red-500/30',
  };
}
