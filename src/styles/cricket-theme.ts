
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Cricket theme colors
export const cricketColors = {
  blue: '#1A365D',      // Deep blue
  lightBlue: '#4299E1', // Light blue
  darkBlue: '#1E3A8A',  // Dark blue
  red: '#E53E3E',       // Cricket ball red
  green: '#2F855A',     // Cricket pitch green
  yellow: '#F6E05E',    // Cricket trophy gold
  cream: '#FFF9C4',     // Cricket whites
  navy: '#1A365D',      // Navy for backgrounds
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Cricket-themed gradient backgrounds
export const cricketGradients = {
  blueToLightBlue: 'bg-gradient-to-r from-cricket-blue to-cricket-lightBlue',
  redToYellow: 'bg-gradient-to-r from-cricket-red to-cricket-yellow',
  greenToDarkBlue: 'bg-gradient-to-r from-cricket-green to-cricket-darkBlue',
};

// Cricket-themed shadow styles
export const cricketShadows = {
  soft: 'shadow-[0_4px_20px_0px_rgba(26,54,93,0.15)]',
  medium: 'shadow-[0_8px_30px_0px_rgba(26,54,93,0.2)]',
  intense: 'shadow-[0_12px_40px_0px_rgba(26,54,93,0.3)]',
};

// Cricket-themed border styles
export const cricketBorders = {
  subtle: 'border border-gray-200 dark:border-gray-800',
  medium: 'border-2 border-cricket-blue/20',
  bold: 'border-2 border-cricket-red',
};
