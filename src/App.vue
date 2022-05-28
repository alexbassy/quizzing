<script setup lang="ts">
import '@/styles/reset.css'
import '@/styles/variables.css'
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
</style>
