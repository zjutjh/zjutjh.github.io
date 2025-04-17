// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  modules: ["@nuxtjs/sitemap"],
  site: {
    url: "https://zjutjh.github.io"
  },
  sitemap: {
    defaults: {
      lastmod: new Date().toISOString(),
      priority: 1,
      changefreq: "daily"
    }
  }
});