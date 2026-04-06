/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',

  theme: {
    extend: {

      // ═══════════════════════════════════════════════════
      // PALETTE — Professional Blue
      // ═══════════════════════════════════════════════════
      colors: {

        // ── Primary : Deep Ocean Blue ───────────────────
        primary: {
          50:  '#f0f5ff',
          100: '#e0eaff',
          200: '#c7d9fd',
          300: '#a4bffb',
          400: '#7b9cf6',
          500: '#4f74ef',
          600: '#2d52e3',   // ← Main brand
          700: '#1e3fc9',
          800: '#1a33a4',
          900: '#1a2f82',
          950: '#111d50',
        },

        // ── Accent : Steel Blue ─────────────────────────
        accent: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },

        // ── Slate : Neutral pro ─────────────────────────
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },

        // ── Surfaces Light ──────────────────────────────
        surface: {
          base:    '#ffffff',
          subtle:  '#f8fafc',
          muted:   '#f1f5f9',
          overlay: '#e2e8f0',
          border:  '#e2e8f0',
          'border-strong': '#cbd5e1',
        },

        // ── Surfaces Dark ───────────────────────────────
        'surface-dark': {
          base:    '#0c1120',
          subtle:  '#111827',
          muted:   '#1e293b',
          overlay: '#263347',
          border:  '#1e293b',
          'border-strong': '#334155',
        },

        // ── Semantic ─────────────────────────────────────
        success: {
          DEFAULT: '#16a34a',
          light:   '#dcfce7',
          dark:    '#14532d',
          muted:   '#f0fdf4',
        },
        warning: {
          DEFAULT: '#d97706',
          light:   '#fef3c7',
          dark:    '#78350f',
          muted:   '#fffbeb',
        },
        danger: {
          DEFAULT: '#dc2626',
          light:   '#fee2e2',
          dark:    '#7f1d1d',
          muted:   '#fff1f2',
        },
        info: {
          DEFAULT: '#2563eb',
          light:   '#dbeafe',
          dark:    '#1e3a8a',
          muted:   '#eff6ff',
        },
      },

      // ═══════════════════════════════════════════════════
      // TYPOGRAPHY
      // ═══════════════════════════════════════════════════
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body:    ['"Inter"',             'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"',    'Consolas',  'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.02em' }],
        xs:    ['0.75rem',  { lineHeight: '1.125rem', letterSpacing: '0.01em' }],
        sm:    ['0.875rem', { lineHeight: '1.375rem'  }],
        base:  ['1rem',     { lineHeight: '1.625rem'  }],
        lg:    ['1.125rem', { lineHeight: '1.75rem'   }],
        xl:    ['1.25rem',  { lineHeight: '1.875rem'  }],
        '2xl': ['1.5rem',   { lineHeight: '2rem',     letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem',  letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem',  { lineHeight: '2.5rem',   letterSpacing: '-0.02em' }],
        '5xl': ['3rem',     { lineHeight: '1.1',      letterSpacing: '-0.03em' }],
      },

      // ═══════════════════════════════════════════════════
      // SPACING
      // ═══════════════════════════════════════════════════
      spacing: {
        '4.5':  '1.125rem',
        '13':   '3.25rem',
        '15':   '3.75rem',
        '18':   '4.5rem',
        '68':   '17rem',     // sidebar expanded
        '20':   '5rem',      // sidebar collapsed
        '76':   '19rem',
        '88':   '22rem',
      },

      // ═══════════════════════════════════════════════════
      // SHADOWS — Subtle & professional
      // ═══════════════════════════════════════════════════
      boxShadow: {
        'xs':      '0 1px 2px 0 rgb(15 23 42 / 0.04)',
        'soft':    '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.04)',
        'card':    '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.04)',
        'card-md': '0 4px 8px -2px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.04)',
        'card-lg': '0 12px 24px -4px rgb(15 23 42 / 0.10), 0 4px 8px -4px rgb(15 23 42 / 0.06)',
        'card-xl': '0 24px 48px -8px rgb(15 23 42 / 0.12), 0 8px 16px -4px rgb(15 23 42 / 0.06)',
        'inner':   'inset 0 1px 2px 0 rgb(15 23 42 / 0.06)',
        'glow':    '0 0 0 3px rgb(45 82 227 / 0.15)',
        'glow-lg': '0 0 24px rgb(45 82 227 / 0.20)',
        'blue-sm': '0 2px 8px rgb(45 82 227 / 0.20)',
        'blue-md': '0 4px 16px rgb(45 82 227 / 0.25)',
      },

      // ═══════════════════════════════════════════════════
      // BORDER RADIUS
      // ═══════════════════════════════════════════════════
      borderRadius: {
        'card':   '0.625rem',   // 10px
        'modal':  '0.875rem',   // 14px
        'input':  '0.5rem',     // 8px
        'button': '0.5rem',     // 8px
        'tag':    '0.25rem',    // 4px
        'pill':   '9999px',
      },

      // ═══════════════════════════════════════════════════
      // ANIMATIONS
      // ═══════════════════════════════════════════════════
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)'   },
        },
        'fade-in-fast': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to:   { opacity: '1', transform: 'translateX(0)'    },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to:   { opacity: '1', transform: 'scale(1)'    },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-400px 0'   },
          '100%': { backgroundPosition:  '400px 0'   },
        },
        'progress': {
          from: { strokeDashoffset: '100' },
          to:   { strokeDashoffset: '0'   },
        },
      },
      animation: {
        'fade-in':      'fade-in 0.18s ease-out both',
        'fade-in-fast': 'fade-in-fast 0.12s ease-out both',
        'slide-in':     'slide-in 0.22s ease-out both',
        'scale-in':     'scale-in 0.16s ease-out both',
        'shimmer':      'shimmer 1.6s infinite linear',
      },

      // ═══════════════════════════════════════════════════
      // TRANSITIONS
      // ═══════════════════════════════════════════════════
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },

  plugins: [
    // require('@tailwindcss/forms'),  // Not installed
    // require('@tailwindcss/typography'),  // Not installed
  ],
};