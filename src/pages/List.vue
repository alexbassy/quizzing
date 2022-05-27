<template>
  <CreateLayout title="Your quizzes">
    <section class="table">
      <header>
        <div class="titles">
          <span>Name</span>
          <span>Questions</span>
          <span>Created</span>
          <span>Last updated</span>
        </div>
      </header>
      <ol class="list">
        <Motion tag="li" class="item" v-for="quiz in quizzes" :key="quiz.id">
          <span>{{ quiz.name }}</span>
          <span>{{ quiz.questions?.length ?? 0 }}</span>
          <span>{{ formatRelativeTime(quiz.createdAt!) }}</span>
          <span>{{ formatRelativeTime(quiz.updatedAt!) }}</span>
        </Motion>
      </ol>
    </section>
  </CreateLayout>
</template>

<script lang="ts" setup>
import CreateLayout from '@/layouts/CreateLayout.vue'
import { watchEffect } from 'vue'
import { QuizEntry } from '@/lib/store/db'
import { useObservable } from '@vueuse/rxjs'
import { quizzes$ } from '@/lib/store/client'
import { Motion } from 'motion/vue'
import { formatRelativeTime } from '@/lib/relative-time'

const quizzes = useObservable<QuizEntry[]>(quizzes$())

watchEffect(() => console.log(quizzes.value))
</script>

<style lang="scss" scoped>
.table {
  --num-columns: 4;

  margin-top: 3rem;
}

.titles {
  display: grid;
  grid-template-columns: repeat(var(--num-columns), 1fr);
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
  display: grid;
  grid-template-columns: repeat(var(--num-columns), 1fr);
  padding: 1rem;
  margin: 0.25rem 0;
  transition: background-color 0.15s ease;
  border-radius: 8px;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background-color: rgb(255 255 255 / 0.075);
  }
}
</style>
