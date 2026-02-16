/**
 * Data Playground design tokens
 * Matches data-playground-delight: teal primary, amber secondary, violet accent
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
  sm: '10px',
  md: '12px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
};

/** Use for hover/focus so the app feels responsive and calm */
export const transition = {
  fast: '0.15s ease',
  default: '0.22s ease',
  smooth: '0.28s cubic-bezier(0.33, 1, 0.68, 1)',
};

export const shadows = {
  xs: '0 1px 3px rgba(0, 0, 0, 0.06)',
  sm: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
  md: '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
  lg: '0 8px 28px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)',
  xl: '0 16px 48px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.06)',
  inner: 'inset 0 1px 2px rgba(0, 0, 0, 0.06)',
  soft: '0 4px 20px -4px rgba(29, 173, 142, 0.18)',
  glow: '0 0 40px -8px rgba(29, 173, 142, 0.28)',
  card: '0 8px 32px -8px rgba(19, 28, 33, 0.08)',
};

export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontFamilyDisplay: "'Space Grotesk', sans-serif",
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

// Light theme — delight default: teal primary, amber secondary, violet accent
export const light = {
  name: 'light',
  bg: {
    app: '#f9fcfc',
    surface: '#ffffff',
    surfaceElevated: '#f4f9f9',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  border: {
    default: '#dce8e8',
    strong: '#c5d9d9',
    subtle: 'rgba(0, 0, 0, 0.05)',
  },
  text: {
    primary: '#131c21',
    secondary: '#647885',
    tertiary: '#7a8f9a',
    inverse: '#ffffff',
  },
  accent: {
    primary: '#1dad8e',
    primaryHover: '#189f82',
    primaryMuted: 'rgba(29, 173, 142, 0.12)',
    secondary: '#e8b923',
    secondaryHover: '#d4a91f',
    secondaryMuted: 'rgba(232, 185, 35, 0.12)',
    accent: '#9b7ddb',
    accentHover: '#8b6bce',
    accentMuted: 'rgba(155, 125, 219, 0.12)',
    success: '#1dad8e',
    successMuted: 'rgba(29, 173, 142, 0.12)',
    warning: '#e8b923',
    warningMuted: 'rgba(232, 185, 35, 0.12)',
    error: '#ef4444',
    errorMuted: 'rgba(239, 68, 68, 0.12)',
  },
  card: {
    bg: '#f4f9f9',
    bgHover: '#eef6f6',
    border: '#dce8e8',
  },
};

// Dark theme — delight .dark
export const dark = {
  name: 'dark',
  bg: {
    app: '#0a0f12',
    surface: '#0f1619',
    surfaceElevated: '#151d22',
    overlay: 'rgba(10, 15, 18, 0.85)',
  },
  border: {
    default: '#252f35',
    strong: '#2f3b42',
    subtle: 'rgba(37, 47, 53, 0.5)',
  },
  text: {
    primary: '#e8f4f3',
    secondary: '#6b8a94',
    tertiary: '#5a7680',
    inverse: '#0a0f12',
  },
  accent: {
    primary: '#1dad8e',
    primaryHover: '#22c49b',
    primaryMuted: 'rgba(29, 173, 142, 0.15)',
    secondary: '#e8b923',
    secondaryHover: '#f0c84a',
    secondaryMuted: 'rgba(232, 185, 35, 0.15)',
    accent: '#9b7ddb',
    accentHover: '#ab8ee8',
    accentMuted: 'rgba(155, 125, 219, 0.15)',
    success: '#1dad8e',
    successMuted: 'rgba(29, 173, 142, 0.12)',
    warning: '#e8b923',
    warningMuted: 'rgba(232, 185, 35, 0.12)',
    error: '#f87171',
    errorMuted: 'rgba(248, 113, 113, 0.12)',
  },
  card: {
    bg: '#0f1619',
    bgHover: '#151d22',
    border: '#252f35',
  },
};

// Active theme (default light to match delight)
export const theme = light;

export default {
  spacing,
  radius,
  shadows,
  transition,
  typography,
  dark,
  light,
  theme,
};
