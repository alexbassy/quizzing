<template>
  <CreateLayout title="Quizzes">
    <template #title>
      <h1 class="title">Quizzing 🥷</h1>
    </template>
    <template #action>
      <button @click="createQuiz" class="add-button"><AddIcon /> Create quiz</button>
    </template>

    <LinkTable :data="quizzes" class="table">
      <LinkTableColumn title="Name" v-slot="{ name }: QuizEntry">{{ name }}</LinkTableColumn>
      <LinkTableColumn title="Questions" v-slot="{ questions }: QuizEntry">
        {{ questions?.length ?? 0 }}
      </LinkTableColumn>
      <LinkTableColumn title="Created" v-slot="{ createdAt }: QuizEntry">
        {{ formatRelativeTime(createdAt!) }}
      </LinkTableColumn>
      <LinkTableColumn title="Updated" v-slot="{ updatedAt }: QuizEntry">
        {{ formatRelativeTime(updatedAt!) }}
      </LinkTableColumn>
      <LinkTableColumn title="" v-slot="{ id, name }: QuizEntry">
        <button class="delete-button" @click.prevent="remove(id!)" :aria-label="`Delete ${name}`">
          <RubbishIcon />
        </button>
      </LinkTableColumn>
      <template #empty>
        <p>No quizzes yet. Create one?</p>
      </template>
    </LinkTable>
  </CreateLayout>
</template>

<script lang="ts" setup>
import { useObservable } from '@vueuse/rxjs'
import AddIcon from '@/components/icons/AddIcon.vue'
import RubbishIcon from '@/components/icons/RubbishIcon.vue'
import CreateLayout from '@/layouts/CreateLayout.vue'
import { formatRelativeTime } from '@/lib/relative-time'
import { addQuiz, deleteQuiz, getQuizzes$ } from '@/lib/store/client'
import { type QuizEntry } from '@/lib/store/db'
import { LinkTable, LinkTableColumn } from '@/components/table'

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
  --column-spans: repeat(4, 2fr) 1fr;
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
