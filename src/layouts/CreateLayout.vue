<template>
  <div class="container">
    <header class="header">
      <RouterLink to="/create" v-if="canGoBack" class="back-button"><CaretLeftIcon /></RouterLink>
      <h1 class="title">{{ title || 'Create' }}</h1>
      <button @click="createQuiz" class="add-button"><AddIcon /> Create quiz</button>
    </header>
    <div class="contentWrap">
      <aside class="sidebar" v-if="$slots.sidebar"><slot name="sidebar" /></aside>
      <main class="content"><slot /></main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AddIcon from '@/components/icons/AddIcon.vue'
import CaretLeftIcon from '@/components/icons/CaretLeftIcon.vue'
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

.add-button {
  --background-alpha: 5%;
  --foreground-alpha: 60%;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 1.15rem;
  background-color: #ef476f;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  transition: 0.25s ease;
  transition-property: color, background-color, transform;

  &:active {
    transform: scale(0.95);
  }

  svg {
    margin-right: 0.5rem;
    color: rgb(255 255 255 / var(--foreground-alpha));
  }
}

.back-button {
  --background-alpha: 5%;
  --foreground-alpha: 35%;
  display: flex;
  width: 1.75rem;
  height: 100%;
  height: 1.75rem;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  background: rgb(255 255 255 / var(--background-alpha));
  border-radius: 5px;
  color: rgb(255 255 255 / var(--foreground-alpha));
  cursor: pointer;
  transition: 0.25s ease;
  transition-property: color, background-color, transform;

  &:hover {
    --background-alpha: 10%;
    --foreground-alpha: 70%;
  }

  &:active {
    --background-alpha: 5%;
    --foreground-alpha: 30%;
    transform: scale(0.95);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
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
