const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1eb2bc',
      },

      fontFamily: {
        mono: ['Roboto Mono', ...fontFamily.mono],
        sans: ['Inter', ...fontFamily.sans],
      },

      spacing: {
        
      },

      fontSize: {
       
      },
    },
  },
  plugins: [],
}
