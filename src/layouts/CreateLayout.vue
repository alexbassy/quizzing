<template>
  <div class="container">
    <header class="header">
      <RouterLink to="/create" v-if="canGoBack">{{ '<' }}</RouterLink>
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
  align-items: center;
}
.title {
  font-weight: normal;
  font-size: 1.6rem;
  margin: 0 auto 0 0;
}
.content {
  flex: 4;
}
.sidebar {
  flex: 1;
  overflow: auto;
}
</style>
