<template>
  <div class="container">
    <div>
      <ul class="project-container">
        <li v-for="post in posts">
          <Item :project="post" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Entry } from 'contentful'
import { createClient } from '../plugins/contentful'
import { BlogPost } from '../assets/types'
// @ts-ignore
// import Project from '../components/Project'
import Item from '../components/Item'

const client = createClient()

export default {
  asyncData({ env }: any) {
    return Promise.all([
      client.getEntries({
        content_type: env.CTF_BLOG_POST_TYPE_ID,
        order: '-fields.publishDate',
        // select:
        //   'sys.id,fields.title,fields.slug,fields.description,fields.publishDate,fields.thumbImage,fields.tags,fields.githubUrl,fields.projectUrl',
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

@import '../assets/global'
</style>
