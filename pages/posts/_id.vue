<template>
  <div class="post">
    <nuxt-link to="/" class="post-controls">
      <Icon name="arrow-left" /> <span>All Posts &amp; Projects</span>
    </nuxt-link>
    <h1 class="post-title">{{ post.fields.title }}</h1>
    <div class="post-header">
      <div class="post-date">
        {{ new Date(post.fields.publishDate).toDateString().slice(4) }}
      </div>
      <!-- <div class="post-location">{{post.fields.tags}}</div> -->
      <div class="post-length">{{ stats.text }}</div>
    </div>
    <div class="container">
      <div class="body" v-html="body"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Entry } from 'contentful'
import { createClient } from '../../plugins/contentful'
import { BlogPost } from '../../assets/types'
import marked from 'marked'
import readingTime from 'reading-time'
// @ts-ignore
import Icon from '../../components/Icon'

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
      const description = marked(post.fields.description)
      const body = marked(post.fields.body || '')
      return {
        post,
        description,
        body,
        stats: readingTime(post.fields.body || ''),
      }
    })
  },
  head() {
    const post = (this as any).post as Entry<BlogPost>
    const title = post.fields.title + " | Peter's blog "
    return {
      title,
      meta: [
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
          content: post.fields.description,
        })),
        ...['og:description'].map((name) => ({
          property: name,
          hid: name,
          content: post.fields.description,
        })),
      ],
    }
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

  &-title
    margin-top: 1rem !important
    font-size: 2.25em

  &-header
    display: flex
    justify-content: space-between
    margin-bottom: 2rem

  &-controls
    display: flex
    align-items: center
    text-decoration: none !important
    color: inherit !important

    & .icon
      margin-right: 0.5rem

  &-length
    //
  &-date
    //

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
