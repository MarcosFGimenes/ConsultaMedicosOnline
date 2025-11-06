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
          DEFAULT: '#0071BC',
          dark: '#005A99',
        },
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        background: {
          light: '#F3F4F6',
          dark: '#0D1B2A',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1B263B',
        },
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
          'dark-primary': '#F8F9FA',
          'dark-secondary': '#ADB5BD',
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
