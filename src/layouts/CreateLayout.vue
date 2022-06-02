<template>
  <div class="container">
    <header class="header">
      <div class="header-title"><slot name="title" /></div>
      <div class="header-action"><slot name="action" /></div>
    </header>
    <div class="contentWrap">
      <aside class="sidebar" v-if="$slots.sidebar"><slot name="sidebar" /></aside>
      <main class="content"><slot /></main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CaretLeftIcon from '@/components/icons/CaretLeftIcon.vue'
import { db } from '@/lib/store/db'
import { RouterLink } from 'vue-router'

async function updateQuiz() {
  const record = await db.quiz.where({ name: 'Untitled' }).first()
  if (!record) {
    console.info('No matching record')
    return
  }
  await db.quiz.update(record.id!, { name: 'Untitled ' + Math.round(Math.random() * 3) })
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100vh;
  flex-direction: column;
  color: #fff;
}

.contentWrap {
  display: flex;
  height: calc(100% - var(--create-header-height));
  flex: 1;
}

.header {
  display: flex;
  height: var(--create-header-height);
  align-items: center;
  padding: 1.2rem 1.5rem;
}

.header-title {
  margin-right: auto;
}

.content {
  flex: 4;
}

.sidebar {
  overflow: auto;
  flex: 1;
}
</style>
