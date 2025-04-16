module.exports = {
  mode: 'jit',
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-primeui')],
  daisyui: {
    themes: ['corporate', 'business']
  },
  darkMode: 'class',
  content: [
    "presets/**/*.{js,vue,ts}",
    "./components/**/*.{js,vue}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.js",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '328px',
      },
    },
  }
};
