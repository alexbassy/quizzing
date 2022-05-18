<template>
  <div class="container">
    <header class="header">
      <h1 class="title">{{ title || 'Create' }}</h1>
    </header>
    <div class="contentWrap">
      <aside class="sidebar"><slot name="sidebar" /></aside>
      <main class="content"><slot /></main>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ title: string }>()
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: #fff;
}
.contentWrap {
  display: flex;
  flex: 1;
  height: 100%;
}
.header {
  display: flex;
  height: 4rem;
  padding: 1.2rem 1.5rem;
}
.title {
  font-weight: normal;
  font-size: 1rem;
  margin: 0;
}
.content {
  flex: 4;
}
.sidebar {
  flex: 1;
  overflow: auto;
}
</style>
