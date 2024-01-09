/** @type {import('tailwindcss').Config} */
import theme from './tailwind.theme'

module.exports = {
  prefix: 'tw-',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
  ],
  theme,
  plugins: [ require('@themesberg/flowbite/plugin')],
  safelist: [
    'tw-border-t-primary',
    'tw-border-t-secondary',
    'tw-border-t-error',
    'tw-border-t-warning',
    'tw-border-t-success',
    'tw-border-t-info',
  ],
}
