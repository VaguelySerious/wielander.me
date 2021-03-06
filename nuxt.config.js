require('dotenv').config()
const config = require('./contentful.json')
const contentful = require('contentful')

const token = process.env.CONTENTFUL_API_TOKEN

const client = contentful.createClient({
  space: config.CTF_SPACE_ID,
  accessToken: token,
})

const title = "Peter's Blog"
const desc =
  "Peter Wielander's Blog. All about language learning, machine learning, tech, nature, exercise, and life lessons."

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  generate: {
    fallback: true,
    routes: () =>
      client
        .getEntries({
          content_type: config.CTF_BLOG_POST_TYPE_ID,
          order: '-sys.createdAt',
        })
        .then((entries) =>
          entries.items
            .filter((e) => e.fields.body)
            .map((e) => `/posts/${e.fields.slug}`)
        ),
  },

  env: {
    CTF_SPACE_ID: config.CTF_SPACE_ID,
    CTF_BLOG_POST_TYPE_ID: config.CTF_BLOG_POST_TYPE_ID,
    CTF_CDA_ACCESS_TOKEN: token,
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'twitter:creator', content: '@vaguelyserious' },
      ...['twitter:title'].map((name) => ({
        name,
        hid: name,
        content: title,
      })),
      ...['og:title'].map((name) => ({
        property: name,
        hid: name,
        content: title,
      })),
      ...['description', 'twitter:description'].map((name) => ({
        name,
        hid: name,
        content: desc,
      })),
      ...['og:description'].map((name) => ({
        property: name,
        hid: name,
        content: desc,
      })),
    ],
    link: [
      // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
}
