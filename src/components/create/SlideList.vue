<script lang="ts" setup>
import * as client from '@/lib/store/client'
import { QuestionEntry } from '@/lib/store/db'
import randomColor from 'randomcolor'
import { defineProps, inject } from 'vue'

const props = defineProps<{ questions: QuestionEntry[]; activeQuestionId?: string }>()
const quizId = inject<string>('quizId')

const emit = defineEmits(['active-change'])

function setActiveSlide(questionId: string) {
  emit('active-change', questionId)
}

async function addQuestion() {
  const backgroundColor = randomColor({ luminosity: 'dark' })
  await client.addQuestion({ quizId: quizId!, backgroundColor })
}
</script>

<template>
  <div class="list-container">
    <ol class="list">
      <li
        class="item"
        :style="`--background-color: ${question.backgroundColor || 'gray'};`"
        v-for="question in questions"
        :key="question.id"
        tabindex="0"
        role="button"
        @click="setActiveSlide(question.id!)"
        @keyup.enter="setActiveSlide(question.id!)"
        @keyup.space.prevent="setActiveSlide(question.id!)"
        :class="{ '-active': activeQuestionId === question.id }"
      >
        <img
          v-if="question.image"
          class="slide-image"
          :src="`/slide-images/${question.image}`"
          :alt="question.title"
          loading="lazy"
        />
      </li>
      <li class="item" tabindex="0" role="button" @click="addQuestion">Add</li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.list-container {
  position: relative;
  height: 100%;
  padding-bottom: 2.5rem;

  &::before,
  &::after {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 1.5rem;
    content: '';
    pointer-events: none;
  }

  &::before {
    top: 0;
    background: linear-gradient(to bottom, #000000, #00000000);
  }

  &::after {
    bottom: 3.63rem; // I don't understand this
    background: linear-gradient(to top, #000000aa, #00000000);
  }
}
.list {
  max-width: 100%;
  height: 100%;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  overflow-y: auto;
}
.item {
  position: relative;
  overflow: hidden;
  width: 100%;
  margin-bottom: 1.5rem;
  aspect-ratio: 4 / 3;
  background: var(--background-color);
  border-radius: 8px;
  cursor: pointer;
  transition: 0.25s ease;
  transition-property: box-shadow;

  &:focus-visible {
    box-shadow: 0 0 0 0.25rem blue;
  }

  &.-active {
    box-shadow: 0 0 0 0.5rem #ffffff20;
  }
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
