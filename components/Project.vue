<template>
  <article :id="project.fields.slug" class="project">
    <div class="project-img-wrap">
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
            <!-- GH-icon -->
          </nuxt-link>
          <nuxt-link
            v-if="project.fields.projectUrl"
            :to="project.fields.projectUrl"
            class="project-links-item"
          >
            <!-- Project-icon -->
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
    </nuxt-link>
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

.project-container
  // max-width: 100%
  // display: flex
  // flex-wrap: wrap
  // margin: 0 -1rem

.project
  position: relative
  align-self: flex-start
  max-width: 100%
  padding: 0 1rem 2rem
  // @media (min-width: 992px)
    // max-width: 50%
  &:not(:last-child)
    border-bottom: 1px solid $color-verylight

  &:not(:first-child)
    padding: 1rem 1rem 2rem

  &-internal
    box-shadow: 0 10px 25px -8px rgba(0, 0, 0, 0.2), 0 2px 5px -1px rgba(0,0,0,0.15)
    background: $color-card
    will-change: transform
    transition: 0.2s transform ease

    &:hover
      transform: translateY(-3px)

  &:hover &-image
    opacity: 1
    visibility: visible

  &-image
    transition: 0.2s ease-out
    max-width: 100%

  &-tags
    display: flex
    flex-wrap: wrap
    margin: 0
    margin-bottom: 0.5rem
    padding: 1rem 1.5rem 0

    &-item
      font-size: 0.75rem
      padding: 0 0.5rem

      &:first-child
        padding-left: 0

  &-content
    padding: 0 1.5rem 0rem

  &-header
    display: flex

  &-title
    font-size: 1.5rem
    margin: 0
    color: $color-dark

  &-description
    max-width: 600px
    width: 100%
    color: lighten($color-text, 10%)
    font-size: 1.2rem
    margin: 0.25rem 0 0

  &-mainlink
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0

  &-links
    display: flex
    align-self: center
    margin-left: 1rem

    .icon
      color: $color-soft
      height: 1.5em
      width: 1.5em

    // &-item
</style>
