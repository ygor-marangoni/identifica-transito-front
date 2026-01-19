import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  components: true,
  app: {
    baseURL: '/identifica-transito/'
  },
  image: {
    provider: 'ipx',
    ipx: {
      baseURL: '/identifica-transito/'
    }
  },
  modules: ['@nuxt/fonts', '@nuxt/image', '@primevue/nuxt-module'],
  vite: {    plugins: [      tailwindcss(),    ],  },
  css: ['./app/assets/css/main.css', './app/assets/css/styles.scss'],
  primevue: {
        options: {
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: '.app-dark'
                }
            }
        }
    }
})