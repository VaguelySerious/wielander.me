<template>
  <div class="container">
    <div>
      <h1 class="title">Peter's Blog</h1>
      <div class="links">
        <a
          href="https://github.com/VaguelySerious/wielander.me"
          target="_blank"
          rel="noopener noreferrer"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
      <ul>
        <li v-for="post in posts">
          <nuxt-link :to="'/posts/' + post.fields.slug">
            {{ post.fields.title }}
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
// import Vue from 'vue'
// export default Vue.extend({})

import { Entry } from 'contentful'
import { createClient } from '../plugins/contentful'
import { BlogPost } from '../assets/types'

const client = createClient()

export default {
  asyncData({ env }: any) {
    return Promise.all([
      client.getEntries({
        content_type: env.CTF_BLOG_POST_TYPE_ID,
        order: '-sys.createdAt',
      }),
    ]).then(([posts]) => {
      return {
        posts: posts.items as Entry<BlogPost>[],
      }
    })
  },
}
</script>

<style lang="sass">
.container
  margin: 0 auto
  min-height: 100vh
  display: flex
  justify-content: center
  align-items: center
  text-align: center

.title
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
  display: block
  font-weight: 300
  font-size: 100px
  color: #35495e
  letter-spacing: 1px

.subtitle
  font-weight: 300
  font-size: 42px
  color: #526488
  word-spacing: 5px
  padding-bottom: 15px

.links
  padding-top: 15px
</style>
