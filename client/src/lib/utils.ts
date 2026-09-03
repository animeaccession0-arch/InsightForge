import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Safe JSON parser with fallback
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    // Check if it's HTML
    if (jsonString.trim().startsWith('<') || jsonString.trim().startsWith('<!DOCTYPE')) {
      console.warn('Received HTML instead of JSON');
      return fallback;
    }
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.warn('JSON parse error, using fallback:', error);
    return fallback;
  }
}

// Format date for display
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

// Check if running on GitHub Pages
export function isGitHubPages(): boolean {
  return window.location.hostname.includes('github.io');
}

// Get base path for GitHub Pages
export function getBasePath(): string {
  return isGitHubPages() ? '/InsightForge' : '';
}

// Truncate string with ellipsis
export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
