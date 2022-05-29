<template>
  <div class="container">
    <header class="header">
      <RouterLink to="/create" v-if="canGoBack" class="back-button">{{ '⃪' }}</RouterLink>
      <h1 class="title">{{ title || 'Create' }}</h1>
      <button @click="createQuiz">Create quiz ✨</button>
      <button @click="updateQuiz">Update</button>
    </header>
    <div class="contentWrap">
      <aside class="sidebar" v-if="$slots.sidebar"><slot name="sidebar" /></aside>
      <main class="content"><slot /></main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { addQuiz } from '@/lib/store/client'
import { db } from '@/lib/store/db'
import { RouterLink } from 'vue-router'

const props = defineProps<{ title: string; canGoBack?: boolean }>()

async function createQuiz() {
  await addQuiz()
}

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
  height: 100%;
  flex: 1;
}
.header {
  display: flex;
  height: 4rem;
  align-items: center;
  padding: 1.2rem 1.5rem;
}

.back-button {
  margin-right: 1rem;
  text-indent: 1ch;
}

.title {
  margin: 0 auto 0 0;
  font-size: 1.6rem;
  font-weight: normal;
}
.content {
  flex: 4;
}
.sidebar {
  overflow: auto;
  flex: 1;
}
</style>
