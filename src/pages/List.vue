<template>
  <CreateLayout title="Quizzes">
    <section class="table">
      <header>
        <div class="titles">
          <span>Name</span>
          <span>Questions</span>
          <span>Created</span>
          <span>Last updated</span>
        </div>
      </header>
      <ol class="list" v-if="quizzes?.length">
        <Motion tag="li" class="item" v-for="quiz in quizzes" :key="quiz.id">
          <RouterLink class="link" :to="`/create/${quiz.id}`">
            <span>{{ quiz.name }}</span>
            <span>{{ quiz.questions?.length ?? 0 }}</span>
            <span>{{ formatRelativeTime(quiz.createdAt!) }}</span>
            <span>{{ formatRelativeTime(quiz.updatedAt!) }}</span>
            <span><button @click="remove(quiz.id!)">Delete</button></span>
          </RouterLink>
        </Motion>
      </ol>
      <div class="list" v-else>No quizzes yet. Create one?</div>
    </section>
  </CreateLayout>
</template>

<script lang="ts" setup>
import CreateLayout from '@/layouts/CreateLayout.vue'
import { QuizEntry } from '@/lib/store/db'
import { useObservable } from '@vueuse/rxjs'
import { deleteQuiz, getQuizzes$ } from '@/lib/store/client'
import { Motion } from 'motion/vue'
import { formatRelativeTime } from '@/lib/relative-time'
import { RouterLink } from 'vue-router'

const quizzes = useObservable<QuizEntry[]>(getQuizzes$())

async function remove(id: string) {
  await deleteQuiz(id)
}
</script>

<style lang="scss" scoped>
.table {
  --columns: repeat(4, 2fr) 1fr;

  margin-top: 3rem;
}

.titles {
  display: grid;
  grid-template-columns: var(--columns);
  margin: 0 3.5rem;
  font-weight: bold;
  color: rgb(255 255 255 / 0.35);
}
.table {
  padding: 0 1.5rem;
}
.list {
  background-color: rgb(255 255 255 / 0.075);
  border-radius: 10px;
  margin: 1rem 2rem 0;
  padding: 0.5rem;
}

.item {
  display: flex;
  margin: 0.25rem 0;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.link {
  width: 100%;
  display: grid;
  grid-template-columns: var(--columns);
  padding: 1rem;
  transition: background-color 0.15s ease;
  border-radius: 8px;

  &:hover {
    background-color: rgb(255 255 255 / 0.075);
  }

  &:focus-visible {
    box-shadow: inset 0 0 0 2px rgba(255 255 255 / 0.1);
  }
}
</style>
