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
      if (post.fields.description) {
        post.fields.description = marked(post.fields.description)
      }
      if (post.fields.body) {
        post.fields.body = marked(post.fields.body)
      }
      return { post }
    })
  },
}
</script>

<style lang="sass">
@import '../../assets/global'

%headlines
  margin: 0 0 0.5em
  font-weight: 500
  &:not(:first-child)
    margin-top: 2em

.post
  font-size: 1.125rem
  ul li
    list-style: disc
    margin-left: 2em
    padding-left: 0.5em
    color: inherit

    &:not(:last-child)
      margin-bottom: 0.25em
  a
    text-decoration: underline
    color: blue

  p
    margin: 0
    & + p
      margin-top: 0.5em
  blockquote
    font: normal italic 1.375em/1.3 Georgia, 'Times New Roman', Times, serif

    p:not(:first-child):last-child
      font-size: 1rem
      color: $color-soft
      font-style: normal
      margin-top: 0.5em
      font-weight: 400
      font-family: 'Radnika Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif

  h1
    @extend %headlines
  h2
    @extend %headlines
  h3
    @extend %headlines


  // hsl(86deg 56% 82%)
    // hsl(86deg 77% 12%)
</style>
