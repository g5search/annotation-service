require('dotenv').config()

module.exports = {
  mode: 'spa',
  server: {
    host: process.env.BASE_URL || '0.0.0.0',
    port: process.env.PORT || 5000
  },
  serverMiddleware: [],
  head: {
    title: 'Notes Service',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: '~/components/loading.vue',
  // loading: {
  //   color: '#3606e9',
  //   failedColor: '#ff0033',
  //   continuous: true,
  //   throttle: 300,
  //   duration: 2000,
  //   height: '2px'
  // },
  loadingIndicator: {
    // name: 'three-bounce',
    name: '~/static/custom.html',
    color: '#2f38b0',
    background: '#e8e8e8'
  },
  css: [
    '@/assets/theme.scss',
    '@/assets/transitions.scss'
  ],
  // TODO could this be set to a function that returns an array of paths to each file in the plugins directory?
  plugins: [
  ],
  buildModules: [
    '@nuxtjs/eslint-module'
  ],
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios'
  ],
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    icons: true
  },
  axios: {
    debug: false,
    https: true,
    browserBaseURL: `//${process.env.BROWSER_URL}`
  },
  googleAnalytics: {
    id: process.env.GA_PROPERTY,
    debug: {
      enabled: false,
      sendHitTask: true
    }
  },
  build: {
    extend (config, ctx) {
      // show correct line numbers in browser console
      if (ctx.isDev) {
        config.devtool = ctx.isClient
          ? 'source-map'
          : 'inline-source-map'
      }
    }
  }
}
