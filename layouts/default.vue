<template>
  <div class="site">
    <Svgs />
    <div class="site-container">
      <header class="header">
        <ul class="header-nav">
          <li>
            <nuxt-link to="/" class="header-link" aria-label="My website">
              <Icon name="globe" />
              <span>Web</span>
            </nuxt-link>
          </li>
          <li v-for="link in links" :key="link.href">
            <a
              rel="noopener"
              :href="link.href"
              class="header-link"
              :aria-label="link.label"
            >
              <Icon :name="link.slug" />
              <span>
                {{ link.name }}
              </span>
            </a>
          </li>
        </ul>
        <div v-if="isMainPage" :class="{ '-is-small': !isMainPage }">
          <nuxt-link
            class="header-title clickable"
            to="/"
            :tag="isMainPage ? 'h1' : 'div'"
          >
            {{ title }}
          </nuxt-link>
          <h2 v-if="isMainPage" class="header-subtitle">
            <p>
              I obsess about languages, education, software, AI, movement, self-improvement, economics, frugality.
              Every month is a different project, every year a different lifetime.
            </p>
            <p>
              During work hours, I'm a Staff Software Engineer and Tech Lead for
              <a href="https://www.minervaproject.com/">Minerva Project</a>'s
              emerging products, striving to make active-learning the norm in
              higher-ed classrooms.
            </p>
          </h2>
          <!-- <div v-else class="header-subtitle" v-html="description"></div> -->
        </div>
      </header>

      <Nuxt />

      <footer class="footer">
        <!-- <p class="footer-text">{{ footer }}</p> -->
        <!-- <a :href="'mailto:' + mail" class="footer-mail">{{ mail }}</a> -->
        <ul class="footer-icons">
          <li>
            <nuxt-link to="/" class="footer-link" aria-label="My website">
              <span class="hidden">Web</span>
              <Icon name="globe" />
            </nuxt-link>
          </li>
          <li v-for="link in links" :key="link.href">
            <a
              rel="noopener"
              :href="link.href"
              class="footer-link"
              target="_blank"
              :aria-label="link.label"
            >
              <span class="hidden">{{ link.name }}</span>
              <Icon :name="link.slug" />
            </a>
          </li>
        </ul>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import Icon from '../components/Icon'
// @ts-ignore
import Svgs from '../components/Svgs'

export default Vue.extend({
  computed: {
    isMainPage() {
      return this.$route.path === '/'
    },
  },
  data() {
    const mail = 'peter.wielander@gmail.com'
    return {
      title: 'Peter Wielander',
      description:
        'Language learning, machine learning, and everything in between.',
      footer: "Thanks for dropping by, you're welcome anytime.",
      mail,
      links: [
        {
          slug: 'mail',
          name: 'Mail',
          href: 'mailto:' + mail,
          label: 'My email address',
        },
        {
          slug: 'github',
          name: 'Github',
          href: 'https://github.com/VaguelySerious',
          label: 'My github profile',
        },
        {
          slug: 'linkedin',
          name: 'LinkedIn',
          href: 'https://www.linkedin.com/in/peter-wielander/',
          label: 'My LinkedIn account',
        },
      ],
    }
  },
})
</script>

<style lang="sass">
@import '../assets/global'

.icon
  order: -1
  width: 1em
  height: 1em

.-is-small
  font-size: 0.75rem

.hidden
  display: none

.clickable
  cursor: pointer

.header
  padding-bottom: 2rem
  @media (min-width: 992px)
    padding-top: 3rem

  &-nav
    display: flex
    flex-wrap: wrap

    & li
      display: block

  &-link
    margin: 0 1rem 0.5rem 0
    color: $color-soft
    text-decoration: none
    display: flex
    align-items: center
    font-size: 0.875rem
    max-width: 400px
    .icon
      margin-right: 10px

  &-title
    font-size: 1.8em
    @media (min-width: 992px)
      font-size: 3em
    padding-top: 1rem
    margin: 0
    font-weight: 700
    line-height: 1.2

  &-subtitle
    margin-top: 0.25rem
    font-size: 1.2em
    @media (min-width: 992px)
      font-size: 1.5em
    font-weight: 300
    line-height: 1.2

  &-description
    font-size: 1.25rem
    @media (min-width: 992px)
      width: 75%
      font-size: 1.75rem

.footer
  // padding-top: 5rem
  flex-direction: column
  align-items: center
  text-align: center
  display: flex

  &-text
    font-size: 1.8rem
    @media (min-width: 992px)
      font-size: 3rem
    font-weight: 500
    margin: 0
    line-height: 1.2

  &-mail
    font-size: 1.25rem
    color: $color-light
    @media (min-width: 992px)
      font-size: 2.25rem

  &-icons
    display: flex
    padding-top: 6rem
    padding-bottom: 2rem

  &-link
    color: $color-light
    text-decoration: none
    display: flex
    align-items: center
    padding: 3px 0
    font-size: 2.25rem
    .icon
      margin: 0 10px
</style>
