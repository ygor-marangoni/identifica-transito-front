import colors from 'tailwindcss/colors'

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
    extend: {
      colors: {
        it: {
          primary: '#1422E4',
          secondary: '#1925E2',
          text: '#999999',
          accent: '#424EFF',
        }
        // Adicione suas cores personalizadas aqui
        // exemplo:
        // brand: '#your-color'
      }
    }
  },
  plugins: [
    require('tailwindcss-primeui')
  ]
}
