<template>
  <div class="container">
    <h1>{{ post.fields.title }}</h1>
  </div>
</template>

<script lang="ts">
import { Entry } from 'contentful'
import { createClient } from '../../plugins/contentful'
import { BlogPost } from '../../assets/types'

const client = createClient()

export default {
  asyncData({ env, route, error }: any) {
    return Promise.all([
      client.getEntries({
        content_type: env.CTF_BLOG_POST_TYPE_ID,
        'fields.slug': route.params.id,
      }),
    ]).then(([posts]) => {
      const post = posts.items[0] as Entry<BlogPost>
      if (!post) {
        throw new Error('Post not available')
      }
      return { post }
    })
  },
}
</script>

<style lang="sass"></style>
