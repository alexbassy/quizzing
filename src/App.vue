<script setup lang="ts">
import '@/styles/reset.css'
</script>

<template>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Inter, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  font-size: 16px;
}

body {
  background-color: #000;
  color: #fff;
  overflow: hidden;
}

@media screen and (min-width: 320px) {
  html {
    font-size: calc(16px + 6 * ((100vw - 320px) / 680));
  }
}

@media screen and (min-width: 1000px) {
  html {
    font-size: 22px;
  }
}
</style>
