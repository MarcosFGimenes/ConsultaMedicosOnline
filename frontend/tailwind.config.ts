import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4CAF50', // Verde principal da landing page
          dark: '#45a049',
          light: '#81C784',
        },
        secondary: {
          DEFAULT: '#8BC34A', // Verde secundário
          dark: '#7CB342',
        },
        accent: {
          DEFAULT: '#66BB6A', // Verde accent
        },
        success: '#4CAF50',
        danger: '#EF4444',
        warning: '#FFC107',
        info: '#2196F3',
        background: {
          light: '#F5F5F5',
          dark: '#0F172A', // Fundo escuro (slate-900)
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E293B', // Superfícies escuras (slate-800)
        },
        border: {
          light: '#E5E7EB',
          dark: '#334155', // Bordas escuras (slate-700)
        },
        text: {
          primary: '#212121',
          secondary: '#757575',
          'dark-primary': '#F1F5F9', // Texto branco no escuro (slate-100)
          'dark-secondary': '#94A3B8', // Texto secundário no escuro (slate-400)
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
