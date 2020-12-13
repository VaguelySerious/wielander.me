<template>
  <div class="site">
    <Svgs />
    <div class="site-container">
      <header class="header">
        <ul>
          <li v-for="link in links" :key="link.href">
            <a :href="link.href" class="header-link">
              <Icon :name="link.slug" />
              {{ link.name }}
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
        <p class="footer-text">{{ footer }}</p>
        <a :href="'mailto:' + mail" class="footer-mail">{{ mail }}</a>
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
      description: 'Websites, Webapps, Web Shenanigans',
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
          href: 'https://github.com/vaguelyserious',
        },
        {
          slug: 'twitter',
          name: '@VaguelySerious',
          href: 'https://twitter.com/VaguelySerious',
        },
      ],
    }
  },
})
</script>

<style lang="sass">
@import '../assets/styles/styles'
</style>
