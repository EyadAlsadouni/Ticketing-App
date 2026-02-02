// shared/theme/colors.ts
// Converted from oklch to hex for React Native compatibility

export const lightColors = {
  // Base colors
  background: '#FFFFFF',
  foreground: '#1A1A1A',
  card: '#FFFFFF',
  cardForeground: '#1A1A1A',
  
  // Primary colors
  primary: '#2563EB', // Blue
  primaryForeground: '#FFFFFF',
  
  // Secondary colors
  secondary: '#F7F7F7',
  secondaryForeground: '#1A1A1A',
  
  // Muted colors
  muted: '#F7F7F7',
  mutedForeground: '#737373',
  
  // Accent colors
  accent: '#F7F7F7',
  accentForeground: '#1A1A1A',
  
  // Destructive
  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',
  
  // Borders
  border: '#E5E5E5',
  input: '#E5E5E5',
  ring: '#2563EB',
  
  // Status colors
  success: '#10B981',
  warning: '#F97316',
  info: '#06B6D4',
};

export const darkColors = {
  // Base colors
  background: '#1A1A1A',
  foreground: '#FAFAFA',
  card: '#262626',
  cardForeground: '#FAFAFA',
  
  // Primary colors
  primary: '#3B82F6',
  primaryForeground: '#FFFFFF',
  
  // Secondary colors
  secondary: '#3D3D3D',
  secondaryForeground: '#FAFAFA',
  
  // Muted colors
  muted: '#3D3D3D',
  mutedForeground: '#A3A3A3',
  
  // Accent colors
  accent: '#3D3D3D',
  accentForeground: '#FAFAFA',
  
  // Destructive
  destructive: '#DC2626',
  destructiveForeground: '#FFFFFF',
  
  // Borders
  border: 'rgba(255, 255, 255, 0.1)',
  input: 'rgba(255, 255, 255, 0.15)',
  ring: '#3B82F6',
  
  // Status colors
  success: '#10B981',
  warning: '#F97316',
  info: '#06B6D4',
};

// Chart colors (same for both themes)
export const chartColors = {
  blue: '#2563EB',
  green: '#10B981',
  orange: '#F97316',
  violet: '#7C3AED',
  red: '#EF4444',
  teal: '#14B8A6',
  indigo: '#4F46E5',
  cyan: '#06B6D4',
  emerald: '#22C55E',
  gray: '#9CA3AF',
  lightBlue: '#93C5FD',
};

// Status-specific colors for tickets
export const statusColors = {
  open: chartColors.orange,
  inProgress: chartColors.blue,
  closed: chartColors.green,
  suspended: chartColors.red,
  pending: chartColors.violet,
};

// Priority colors
export const priorityColors = {
  critical: chartColors.red,
  high: chartColors.orange,
  medium: chartColors.blue,
  low: chartColors.green,
};

export type ThemeColors = typeof lightColors;
