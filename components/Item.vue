<template>
  <article :id="project.fields.slug" class="item">
    <span class="item-header">
      <span>
        <a
          v-if="project.fields.projectUrl"
          :href="project.fields.projectUrl"
          class="item-link -live"
        >
          Web
        </a>
        <nuxt-link
          v-if="project.fields.body"
          :to="'/posts/' + project.fields.slug"
          class="item-link"
        >
          Blog
        </nuxt-link>
        <a
          v-if="project.fields.githubUrl"
          :href="project.fields.githubUrl"
          class="item-link -code"
        >
          Code
        </a>
        <span class="item-title">{{ project.fields.title }}</span>
      </span>
      <span class="item-date"
        ><time :datetime="dateTime">{{ dateString }}</time></span
      >
    </span>
    <span class="item-description" v-html="project.fields.description"></span>
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
  computed: {
    dateString() {
      const eightHours = 8 * 1000 * 3600
      return new Date(
        new Date(this.project.fields.publishDate).getTime() + eightHours
      )
        .toDateString()
        .slice(4)
    },
    dateTime() {
      return this.project.fields.publishDate.slice(0, 10)
    },
  },
})
</script>

<style lang="sass">
@import '../assets/global'

.item
  margin-bottom: 1.5rem

  &-header
    display: flex
    justify-content: space-between
    margin-bottom: 0.5rem

  &-link
    cursor: pointer
    background-color: $color-link
    color: $color-white
    font-weight: bold
    margin-right: 0.5rem
    padding: 0.25rem 0.4rem
    @media (max-width: 1023px)
      padding: 0.3rem 0.5rem

    &.-live
      background-color: $color-link-live
    &.-code
      background-color: $color-link-code


  &-title
    margin-right: 1rem
    font-weight: bold
    color: $color-dark

  // &-description
  //   border-left: 1px solid black

  &-date
    margin-left: 0.2rem
    font-style: italic
    white-space: nowrap
</style>
