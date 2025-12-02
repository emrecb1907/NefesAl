export const lightTheme = {
  colors: {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f9fafb',
    card: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  gradients: {
    primary: ['#6366f1', '#8b5cf6'],
    secondary: ['#8b5cf6', '#ec4899'],
    background: ['#ffffff', '#f9fafb'],
  },
};

export const darkTheme = {
  colors: {
    primary: '#818cf8',
    primaryDark: '#6366f1',
    secondary: '#a78bfa',
    background: '#111827',
    surface: '#1f2937',
    card: '#374151',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    info: '#60a5fa',
  },
  gradients: {
    primary: ['#6366f1', '#8b5cf6'],
    secondary: ['#8b5cf6', '#ec4899'],
    background: ['#111827', '#1f2937'],
  },
};

export type Theme = typeof lightTheme;

