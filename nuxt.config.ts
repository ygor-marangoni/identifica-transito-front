import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
    ssr: true,
    routeRules: {
        '/': { ssr: true, prerender: true },
        '/**': { ssr: false }
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api',
            mercadoPagoPublicKey: process.env.NUXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || ''
        }
    },
  components: true,
  app: {
    baseURL: '/identifica-transito/',
    head: {
        link: [
            { rel: 'icon', type: 'image/svg+xml', href: '/images/logo-it-icon.svg' },
        ]
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