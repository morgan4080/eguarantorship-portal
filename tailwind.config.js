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
          bgMain: '#F5F5F5',
          bg: '#00637F',
          text: '#5992A6'
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
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
