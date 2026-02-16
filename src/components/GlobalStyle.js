import { createGlobalStyle } from 'styled-components';
import { dark, spacing, radius, shadows, typography } from '../theme';

const theme = dark;

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    /* Colors */
    --bg-app: ${theme.bg.app};
    --bg-surface: ${theme.bg.surface};
    --bg-surface-elevated: ${theme.bg.surfaceElevated};
    --border-default: ${theme.border.default};
    --border-strong: ${theme.border.strong};
    --border-subtle: ${theme.border.subtle};
    --text-primary: ${theme.text.primary};
    --text-secondary: ${theme.text.secondary};
    --text-tertiary: ${theme.text.tertiary};
    --text-inverse: ${theme.text.inverse};
    --accent-primary: ${theme.accent.primary};
    --accent-primary-hover: ${theme.accent.primaryHover};
    --accent-primary-muted: ${theme.accent.primaryMuted};
    --accent-success: ${theme.accent.success};
    --accent-success-muted: ${theme.accent.successMuted};
    --accent-warning: ${theme.accent.warning};
    --accent-error: ${theme.accent.error};
    --accent-error-muted: ${theme.accent.errorMuted};
    --card-bg: ${theme.card.bg};
    --card-border: ${theme.card.border};
    /* Spacing */
    --space-1: ${spacing[1]};
    --space-2: ${spacing[2]};
    --space-3: ${spacing[3]};
    --space-4: ${spacing[4]};
    --space-6: ${spacing[6]};
    --space-8: ${spacing[8]};
    --space-10: ${spacing[10]};
    --space-12: ${spacing[12]};
    --space-16: ${spacing[16]};
    --space-20: ${spacing[20]};
    /* Radius */
    --radius-sm: ${radius.sm};
    --radius-md: ${radius.md};
    --radius-lg: ${radius.lg};
    --radius-xl: ${radius.xl};
    --radius-2xl: ${radius['2xl']};
    /* Shadows */
    --shadow-sm: ${shadows.sm};
    --shadow-md: ${shadows.md};
    --shadow-lg: ${shadows.lg};
    /* Typography */
    --font-sans: ${typography.fontFamily};
    --font-mono: ${typography.fontFamilyMono};
    --text-xs: ${typography.fontSize.xs};
    --text-sm: ${typography.fontSize.sm};
    --text-base: ${typography.fontSize.base};
    --text-md: ${typography.fontSize.md};
    --text-lg: ${typography.fontSize.lg};
    --text-xl: ${typography.fontSize.xl};
    --text-2xl: ${typography.fontSize['2xl']};
    --text-3xl: ${typography.fontSize['3xl']};
  }

  body {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--bg-app);
    color: var(--text-primary);
    line-height: ${typography.lineHeight.normal};
  }

  code {
    font-family: var(--font-mono);
  }

  .error {
    background: var(--accent-error-muted);
    border: 1px solid var(--accent-error);
    color: var(--accent-error);
    padding: var(--space-4) var(--space-5);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-4);
    font-weight: 600;
  }

  .success {
    background: var(--accent-success-muted);
    border: 1px solid var(--accent-success);
    color: var(--accent-success);
    padding: var(--space-4) var(--space-5);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-4);
    font-weight: 600;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-10);
    color: var(--text-secondary);
  }

  /* Smooth focus rings for a11y */
  :focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }
`;
