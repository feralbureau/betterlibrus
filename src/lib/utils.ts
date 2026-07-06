import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Day } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the current day of week as a Day type (MON-FRI).
 * Weekends are mapped to Monday.
 */
export function getCurrentDay(): Day {
  const day = new Date().getDay();
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
  const today = daysOfWeek[day];
  if (today === 'SAT' || today === 'SUN') return 'MON';
  return today as Day;
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

/**
 * Subject color themes for consistent visual identification across views.
 * Colors are designed to work well on dark backgrounds.
 */
const SUBJECT_COLOR_THEMES = [
  { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', accent: 'bg-blue-500' },
  { bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30', accent: 'bg-violet-500' },
  { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', accent: 'bg-emerald-500' },
  { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', accent: 'bg-rose-500' },
  { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30', accent: 'bg-cyan-500' },
  { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30', accent: 'bg-orange-500' },
  { bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-500/30', accent: 'bg-teal-500' },
  { bg: 'bg-pink-500/15', text: 'text-pink-400', border: 'border-pink-500/30', accent: 'bg-pink-500' },
  { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30', accent: 'bg-indigo-500' },
  { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30', accent: 'bg-sky-500' },
] as const;

export interface SubjectColorTheme {
  bg: string;
  text: string;
  border: string;
  accent: string;
}

/**
 * Returns a consistent color theme for a given subject name.
 * The same subject always gets the same color using a hash of the name,
 * making subjects visually identifiable across timetable, grades, etc.
 */
export function getSubjectColor(subjectName: string): SubjectColorTheme {
  if (!subjectName) return SUBJECT_COLOR_THEMES[0];
  
  // Simple hash to get consistent colors per subject
  let hash = 0;
  const normalized = subjectName.toLowerCase().trim();
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
    hash |= 0; // Convert to 32-bit int
  }
  
  const index = Math.abs(hash) % SUBJECT_COLOR_THEMES.length;
  return SUBJECT_COLOR_THEMES[index];
}
