<template>
  <div class="container"></div>
</template>

<script lang="ts">
import { Entry } from 'contentful'
import { createClient } from '../../plugins/contentful'
import { BlogPost } from '../../assets/types'

const client = createClient()

export default {
  asyncData({ env, route }: any) {
    return Promise.all([client.getEntry(route.params.id)])
      .then(([post]) => {
        return {
          post: post as Entry<BlogPost>,
        }
      })
      .catch(console.error)
  },
}
</script>

<style lang="sass"></style>
