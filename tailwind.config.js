/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  prefix: 'tw-',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:'#d0e9de',
          100: '#E6F2ED',
          200: '#E7F3EE',
          250: '#C7E7D8',
          280: '#92dab5',
          300: '#196C44',
          400: '#8CB6A4',
          500: '#005D34',
          550: '#007D46',
          600: '#004D2B',
          DEFAULT: '#005D34',
        },
        k_black: {
          DEFAULT: '#212121',
        },
        success: {
          DEFAULT: '#1ABC9C',
          100: "#dafaf7",
        },
        info: {
          DEFAULT: '#1DA1F2',
          100: "#d7ecf8",
        },
        warning: {
          DEFAULT: '#FFD32A',
          100: "#fbf5da",
        },
        error: {
          DEFAULT: '#ED4C67',
          100: "#fad4db",
        },
        secondary: {
          100: '#FFF2D4',
          200: '#fddfab',
          DEFAULT: '#f68b1f',
        },
      },
      fontFamily: {
        'YEKAN-BAKH': ['YEKAN-BAKH-REGULAR'],
        'YEKAN-BAKH-LIGHT': ['YEKAN-BAKH-LIGHT'],
        'YEKAN-BAKH-FAT': ['YEKAN-BAKH-FAT'],
        'YEKAN-BAKH-REGULAR': ['YEKAN-BAKH-REGULAR'],
        'YEKAN-BAKH-MEDIUM': ['YEKAN-BAKH-MEDIUM'],
        'YEKAN-BAKH-HEAVY': ['YEKAN-BAKH-HEAVY'],
        'YEKAN-BAKH-BOLD': ['YEKAN-BAKH-BOLD'],
      },
      borderRadius : {
        '3xl' : '20px',
      },
    },
    screens: {
      xs: '390px',
      ...defaultTheme.screens,
    },
    container: {
      center:true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
      },
    },
  },
  plugins: [],
  safelist: [
    'tw-border-t-primary',
    'tw-border-t-secondary',
    'tw-border-t-error',
    'tw-border-t-warning',
    'tw-border-t-success',
    'tw-border-t-info',
  ],
}
