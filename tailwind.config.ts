/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app.vue',
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}'
  ],
  theme: {
    extend: {}
  },
  plugins: [
    require('tailwindcss-primeui')
  ]
}
