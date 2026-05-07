import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
    ssr: true,
    routeRules: {
        '/': { prerender: true },
        '/dashboard/**': { ssr: false },
        '/auth/**': { ssr: false },
        '/uikit/**': { prerender: false },
        '/uikit/ChartDoc': { prerender: false },
        '/uikit/TableDoc': { prerender: false },
    },
    nitro: {
        prerender: {
            failOnError: false,
        }
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api',
            mercadoPagoPublicKey: process.env.NUXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || ''
        }
    },
  components: true,
  app: {
        baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {}
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