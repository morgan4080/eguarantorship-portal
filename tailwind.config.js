/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eg: {
          bgMain: 'rgba(224,224,224,0.5)',
          bgopacity: 'rgba(40,99,127,0.3)',
          bg: '#2A3F54',
          blue: '#28637f',
          text: '#459aab',
          lightblue: '#459aab',
          grey: '#829da9'
        },
      },
      spacing: {
        '18': '4.5rem',
      },
      fontSize: {
        'xxs': '0.65rem',
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
        serif: ['Poppins', ...defaultTheme.fontFamily.serif],
        mono: ['Poppins', ...defaultTheme.fontFamily.mono]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
