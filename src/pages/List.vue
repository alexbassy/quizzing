<template>
  <CreateLayout title="Quizzes">
    <template #title>
      <h1 class="title">Create</h1>
    </template>
    <template #action>
      <button @click="createQuiz" class="add-button"><AddIcon /> Create quiz</button>
    </template>
    <section class="table">
      <header>
        <div class="titles">
          <span>Name</span>
          <span>Questions</span>
          <span>Created</span>
          <span>Last updated</span>
          <span></span>
        </div>
      </header>
      <ol class="list" v-if="quizzes?.length">
        <Motion tag="li" class="item" v-for="quiz in quizzes" :key="quiz.id">
          <RouterLink class="link" :to="`/create/${quiz.id}`">
            <span>{{ quiz.name }}</span>
            <span>{{ quiz.questions?.length ?? 0 }}</span>
            <span>{{ formatRelativeTime(quiz.createdAt!) }}</span>
            <span>{{ formatRelativeTime(quiz.updatedAt!) }}</span>
            <span
              ><button
                class="delete-button"
                @click.prevent="remove(quiz.id!)"
                :aria-label="`Delete ${quiz.name}`"
              >
                <RubbishIcon /></button
            ></span>
          </RouterLink>
        </Motion>
      </ol>
      <div class="list" v-else>No quizzes yet. Create one?</div>
    </section>
  </CreateLayout>
</template>

<script lang="ts" setup>
import AddIcon from '@/components/icons/AddIcon.vue'
import RubbishIcon from '@/components/icons/RubbishIcon.vue'
import CreateLayout from '@/layouts/CreateLayout.vue'
import { formatRelativeTime } from '@/lib/relative-time'
import { addQuiz, deleteQuiz, getQuizzes$ } from '@/lib/store/client'
import { QuizEntry } from '@/lib/store/db'
import { useObservable } from '@vueuse/rxjs'
import { Motion } from 'motion/vue'
import { RouterLink } from 'vue-router'

const quizzes = useObservable<QuizEntry[]>(getQuizzes$())

async function createQuiz() {
  await addQuiz()
}

async function remove(id: string) {
  await deleteQuiz(id)
}
</script>

<style lang="scss" scoped>
.table {
  --columns: repeat(4, 2fr) 1fr;
  padding: 0 1.5rem;
  margin-top: 3rem;
}

.title {
  display: inline-block;
  margin: 0 auto 0 0;
  font-size: var(--create-header-font-size);
  font-weight: normal;
}

.add-button {
  --background-alpha: 5%;
  --foreground-alpha: 60%;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
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

.titles {
  display: grid;
  margin: 0 3.5rem;
  color: rgb(255 255 255 / 0.35);
  font-weight: bold;
  grid-template-columns: var(--columns);

  > span:not(:first-of-type) {
    text-align: center;
  }
  > span:last-of-type {
    display: flex;
    justify-content: flex-end;
  }
}

.list {
  padding: 0.5rem;
  margin: 1rem 2rem 0;
  background-color: rgb(255 255 255 / 5%);
  border-radius: 10px;
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
  display: grid;
  width: 100%;
  align-items: center;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  grid-template-columns: var(--columns);
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgb(255 255 255 / 7.5%);
  }

  &:focus-visible {
    box-shadow: inset 0 0 0 2px rgba(255 255 255 / 0.1);
  }

  > span:not(:first-of-type) {
    text-align: center;
  }
  > span:last-of-type {
    display: flex;
    justify-content: flex-end;
  }
}

.delete-button {
  --background-alpha: 0%;
  --foreground-alpha: 20%;
  display: flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  background: rgb(255 255 255 / var(--background-alpha));
  border-radius: 50%;
  color: rgb(255 255 255 / var(--foreground-alpha));
  cursor: pointer;
  transition: 0.25s ease;
  transition-property: color, background-color, transform;

  .item:hover & {
    --background-alpha: 10%;
    --foreground-alpha: 30%;

    &:hover {
      --background-alpha: 20%;
      --foreground-alpha: 50%;
    }

    &:active {
      --background-alpha: 10%;
      --foreground-alpha: 30%;
      transform: scale(0.95);
    }
  }
}
</style>
