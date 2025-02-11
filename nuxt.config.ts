// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  build: {
    transpile: ['vue3-apexcharts']
  },
  vite: {
    optimizeDeps: {
      include: ['vue3-apexcharts']
    },
    ssr: {
      noExternal: ['vue3-apexcharts']
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL || 'https://wogiveaway.shop/api'
    }
  },
  nitro: {
    routeRules: {
      '/api/**': {
        proxy: process.env.NUXT_API_BASE_URL || 'https://wogiveaway.shop/api/**',
        headers: {
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    },
    serveStatic: true,
  },
  routeRules: {
    '/admin/**': { appMiddleware: ['auth'] },
    '/api/**': { proxy: process.env.NUXT_API_BASE_URL || 'https://wogiveaway.shop/api/**' }
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  app: {
    head: {
      title: 'Адмін панель WO для розіграшів',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/color-mode', '@nuxt/image', '@pinia/nuxt'],
})