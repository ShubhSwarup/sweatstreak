export const colors = {
  // Backgrounds
  bg: '#0d0d0d',
  card: '#1a1a1a',
  cardElevated: '#222222',
  input: '#222222',
  tabBar: '#111111',
  border: '#2a2a2a',
  borderMuted: '#1f1f1f',

  // Accent
  green: '#00e676',
  greenDark: '#1DB954',
  greenMuted: 'rgba(0,230,118,0.12)',
  greenBorder: 'rgba(0,230,118,0.3)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textMuted: '#555555',
  textGreen: '#00e676',

  // Semantic
  danger: '#FF4444',
  dangerMuted: 'rgba(255,68,68,0.12)',
  warning: '#FFA500',
  warningMuted: 'rgba(255,165,0,0.12)',
  gold: '#FFD700',
  goldMuted: 'rgba(255,215,0,0.12)',

  // Overlays
  overlay: 'rgba(0,0,0,0.7)',
  sheetBg: '#1a1a1a',
};

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
};

export const radius = {
  sm: 8, md: 12, lg: 16, xl: 20, full: 999,
};

export const typography = {
  hero: { fontSize: 36, fontWeight: '700' as const },
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 22, fontWeight: '600' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  h4: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  bodyLg: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  label: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.8, textTransform: 'uppercase' as const },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};
