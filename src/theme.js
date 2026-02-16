/**
 * Data Playground design tokens
 * Data Playground — palette inspired by MetMo (metmo.co.uk)
 */

export const spacing = {
  0: 0,
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
};

export const radius = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '18px',
  '2xl': '24px',
  full: '9999px',
};

export const shadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.04)',
  md: '0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.04)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
  xl: '0 16px 48px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.06)',
  inner: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
};

export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontFamilyMono: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
  fontSize: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    md: '15px',
    lg: '17px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.75,
  },
};

// MetMo-inspired dark theme — charcoal + brass/gold accent
export const dark = {
  name: 'dark',
  bg: {
    app: '#0a0a0a',
    surface: '#111111',
    surfaceElevated: '#1a1a1a',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  border: {
    default: 'rgba(255, 255, 255, 0.07)',
    strong: 'rgba(255, 255, 255, 0.1)',
    subtle: 'rgba(255, 255, 255, 0.04)',
  },
  text: {
    primary: '#fafafa',
    secondary: '#a3a3a3',
    tertiary: '#737373',
    inverse: '#0a0a0a',
  },
  accent: {
    primary: '#c9a227',       // MetMo brass/gold
    primaryHover: '#d4af37',
    primaryMuted: 'rgba(201, 162, 39, 0.12)',
    success: '#22c55e',
    successMuted: 'rgba(34, 197, 94, 0.12)',
    warning: '#eab308',
    warningMuted: 'rgba(234, 179, 8, 0.12)',
    error: '#ef4444',
    errorMuted: 'rgba(239, 68, 68, 0.12)',
  },
  card: {
    bg: '#141414',
    bgHover: '#1a1a1a',
    border: 'rgba(255, 255, 255, 0.06)',
  },
};

// Light theme
export const light = {
  name: 'light',
  bg: {
    app: '#f8f9fb',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  border: {
    default: 'rgba(0, 0, 0, 0.08)',
    strong: 'rgba(0, 0, 0, 0.12)',
    subtle: 'rgba(0, 0, 0, 0.05)',
  },
  text: {
    primary: '#1a1d23',
    secondary: '#5c6370',
    tertiary: '#8b95a5',
    inverse: '#ffffff',
  },
  accent: {
    primary: '#c45c32',
    primaryHover: '#d46b3e',
    primaryMuted: 'rgba(196, 92, 50, 0.12)',
    success: '#2a9d5e',
    successMuted: 'rgba(42, 157, 94, 0.12)',
    warning: '#c98a1e',
    warningMuted: 'rgba(201, 138, 30, 0.12)',
    error: '#c94a4a',
    errorMuted: 'rgba(201, 74, 74, 0.12)',
  },
  card: {
    bg: '#ffffff',
    bgHover: '#f8f9fb',
    border: 'rgba(0, 0, 0, 0.06)',
  },
};

// Active theme (default dark)
export const theme = dark;

export default {
  spacing,
  radius,
  shadows,
  typography,
  dark,
  light,
  theme,
};
