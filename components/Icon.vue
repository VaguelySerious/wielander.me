<template>
  <svg class="icon">
    <use :xlink:href="'#icon-' + name"></use>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    name: String,
  },
})
</script>
