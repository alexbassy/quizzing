<script lang="ts" setup>
import { IQuestion } from '@/lib/questions'
import { defineProps, inject, ref } from 'vue'
import * as client from '@/lib/store/client'
import { QuestionEntry } from "@/lib/store/db";

const props = defineProps<{ questions: QuestionEntry[]; activeQuestionId?: string }>()
const quizId = inject<string>('quizId')

const emit = defineEmits(['active-change'])

function setActiveSlide(questionId: string) {
  emit('active-change', questionId)
}

async function addQuestion() {
  await client.addQuestion(quizId!)
}
</script>

<template>
  <div class="list-container">
    <ol class="list">
      <li
        class="item"
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
          v-if="question.image?.url"
          class="slide-image"
          :src="`/slide-images/${question.image.url}`"
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
  height: 100%;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2rem;
    pointer-events: none;
    z-index: 2;
  }

  &::before {
    top: 0;
    background: linear-gradient(to bottom, #000000, #00000000);
  }

  &::after {
    background: linear-gradient(to top, #000000aa, #00000000);
    bottom: 3.63rem; // I don't understand this
  }
}
.list {
  height: 100%;
  overflow-y: auto;
  max-width: 100%;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.item {
  width: 100%;
  position: relative;
  aspect-ratio: 4 / 3;
  background: rgb(120 120 120);
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.25s ease;
  transition-property: box-shadow;

  &:focus-visible {
    box-shadow: 0 0 0 0.25rem blue;
  }

  &.-active {
    box-shadow: 0 0 0 0.25rem #ffffff20;
  }
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
