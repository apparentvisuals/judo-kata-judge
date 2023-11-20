const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['corporate', 'business']
  },
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '328px',
      ...defaultTheme.screens,
    }
  }
};
