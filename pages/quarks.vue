<template>
  <main class="main">
    <div class="head" style="padding-bottom: 1rem">
      <h1>QuarksJS Playground</h1>
      <div class="quark-input">
        Node count
        <input
          v-model="count"
          type="range"
          min="1"
          max="500"
          name="count"
          id="count"
        />
        {{ count }}
      </div>
      <!-- <div class="quark-input">
        Red
        <input
          v-model="red"
          type="range"
          min="0"
          max="255"
          name="red"
          id="red"
        />
        {{ red }}
      </div> -->
    </div>
    <canvas id="canvas" width="600" height="600"></canvas>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore

export default {
  head() {
    return { script: [{ src: '/quarks.js' }] }
  },
  data() {
    return {
      quark: null as any,
      padding: 100,
      boundsX: 600,
      boundsY: 600,
      count: 200,
      red: 0,
      green: 0,
      blue: 0,
    }
  },
  watch: {
    count(newCount) {
      this.update()
    },
  },
  methods: {
    update() {
      if (this.quark) {
        this.quark.update({
          bounds: { x: this.boundsX, y: this.boundsY },
          padding: 100,
          count: this.count,
          color: [this.red, this.green, this.blue].join(','),
        })
      }
    },
  },
  mounted() {
    const QA = (window as any).QuarkAnimation
    const quark = new QA({
      id: 'canvas',
    })
    this.quark = quark
    this.update()
    quark.start()
  },
}
</script>

<style lang="sass">
@import '../assets/global'
</style>
