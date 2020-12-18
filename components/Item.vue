<template>
  <article :id="project.fields.slug" class="item">
    <nuxt-link
      v-if="project.fields.projectUrl"
      :to="project.fields.projectUrl"
      class="item-link"
    >
      Live
    </nuxt-link>
    <nuxt-link
      v-if="project.fields.body"
      :to="'/posts/' + project.fields.slug"
      class="item-link"
    >
      Blog
    </nuxt-link>
    <nuxt-link
      v-if="project.fields.githubUrl"
      :to="project.fields.githubUrl"
      class="item-link"
    >
      Code
    </nuxt-link>
    <span class="item-title">{{ project.fields.title }}</span>
    <span class="item-description">{{ project.fields.description }}</span>
    <!-- <div class="project-img-wrap">
      <img
        v-if="project.fields.thumbImage"
        :src="project.fields.thumbImage"
        alt="Blog post example image"
        class="project-img"
      />
    </div>
    <ul class="project-tags">
      <li
        v-for="tag in project.fields.tags"
        :key="tag"
        class="project-tags-item"
      >
        {{ tag }}
      </li>
    </ul>
    <div class="project-content">
      <header class="project-header">
        <h2 class="project-title">{{ project.fields.title }}</h2>
        <div class="project-links">
          <nuxt-link
            v-if="project.fields.githubUrl"
            :to="project.fields.githubUrl"
            class="project-links-item"
          >
          </nuxt-link>
          <nuxt-link
            v-if="project.fields.projectUrl"
            :to="project.fields.projectUrl"
            class="project-links-item"
          >
          </nuxt-link>
        </div>
      </header>
      <p class="project-description" v-html="project.fields.description"></p>
    </div>
    <nuxt-link
      class="project-mainlink"
      :title="project.fields.title"
      :to="'/posts/' + project.fields.slug"
    >
    </nuxt-link> -->
  </article>
</template>

<script lang="ts">
import Vue from 'vue'
import { PropType } from 'vue'
import { Entry } from 'contentful'
import { BlogPost } from '../assets/types'
export default Vue.extend({
  props: {
    project: Object as PropType<Entry<BlogPost>>,
  },
})
</script>

<style lang="sass">
@import '../assets/global'

.item

  margin-bottom: 1rem

  &-link
    background-color: #faa
    font-weight: bold
    margin-right: 0.5rem
    padding: 0.1rem 0.3rem

  &-title
    margin-left: 0.5rem
    margin-right: 1rem
    font-weight: bold
    color: black

  // &-description
  //   border-left: 1px solid black
</style>
