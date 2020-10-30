<template>
  <div class="post container">
    <div class="body" v-html="post.fields.body"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Entry } from 'contentful'
import { createClient } from '../../plugins/contentful'
import { BlogPost } from '../../assets/types'
import marked from 'marked'

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
      post.fields.description = marked(post.fields.description)
      post.fields.body = marked(post.fields.body)
      return { post }
    })
  },
}
</script>

<style lang="sass"></style>
