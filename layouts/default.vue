<template>
  <div class="site">
    <Svgs />
    <div class="site-container">
      <header class="header">
        <ul class="header-nav">
          <li v-for="link in links" :key="link.href">
            <a :href="link.href" class="header-link">
              <Icon :name="link.slug" />
              <span>
                {{ link.name }}
              </span>
            </a>
          </li>
        </ul>
        <h1 class="header-title">
          <strong>{{ title }}</strong>
        </h1>
        <h2 class="header-subtitle" v-html="description"></h2>
      </header>

      <Nuxt />

      <footer class="footer">
        <!-- <p class="footer-text">{{ footer }}</p> -->
        <!-- <a :href="'mailto:' + mail" class="footer-mail">{{ mail }}</a> -->
        <ul class="footer-icons">
          <li v-for="link in links" :key="link.href">
            <a :href="link.href" class="footer-link" target="_blank">
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
  data() {
    const mail = 'peter.wielander@gmail.com'
    return {
      title: 'Peter Wielander',
      description:
        'Language learning, machine learning, and everything in between.',
      footer: 'Thank you for dropping by.',
      mail,
      links: [
        {
          slug: 'mail',
          name: mail,
          href: 'mailto:' + mail,
        },
        {
          slug: 'github',
          name: 'VaguelySerious',
          href: 'https://github.com/VaguelySerious',
        },
        // {
        //   slug: 'twitter',
        //   name: '@VaguelySerious',
        //   href: 'https://twitter.com/VaguelySerious',
        // },
      ],
    }
  },
})
</script>

<style lang="sass">
@import '../assets/global'

.header
  padding-bottom: 2rem
  @media (min-width: 992px)
    padding-top: 3rem

  &-nav
    display: flex

  &-link
    margin-right: 2rem
    color: $color-soft
    text-decoration: none
    display: flex
    align-items: center
    font-size: 0.875rem
    max-width: 400px
    .icon
      order: -1
      width: 1rem
      height: 1rem
      margin-right: 10px

  &-title
    font-size: 1.8rem
    @media (min-width: 992px)
      font-size: 3rem
    padding-top: 1rem
    margin: 0
    font-weight: 300
    line-height: 1.2

  &-subtitle
    margin-top: 0.25rem
    font-size: 1.4rem
    @media (min-width: 992px)
      font-size: 2.2rem
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
      order: -1
      width: 1em
      height: 1em
      margin-right: 20px
</style>
