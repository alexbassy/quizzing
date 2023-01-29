<script lang="ts" setup>
import { inject, nextTick, ref, watch } from 'vue'
import * as client from '@/lib/store/client'
import { QuestionEntry } from '@/lib/store/db'
import SlideListItem from './SlideListItem.vue'

const props = defineProps<{ questions: QuestionEntry[]; activeQuestionId?: string }>()
const quizId = inject<string>('quizId')
const listElem = ref<HTMLOListElement>()

const emit = defineEmits(['active-change'])

function setActiveSlide(questionId: string) {
  emit('active-change', questionId)
}

async function addQuestion() {
  const id = await client.addQuestion({ quizId: quizId! })
  setTimeout(() => {
    if (listElem.value) {
      listElem.value.scrollTo({ top: listElem.value.scrollHeight * 2, behavior: 'smooth' })
      emit('active-change', id)
    }
  }, 300)
}

async function deleteQuestion(questionId: string) {
  if (!quizId || !questionId) {
    console.warn('Attempting to delete quiz; quiz ID or question ID is undefined')
    return
  }
  if (props.activeQuestionId === questionId) {
    const questionIndex = props.questions.findIndex((question) => question.id === questionId)
    const nextIndex = props.questions[questionIndex + 1]?.id || props.questions[questionIndex - 1]?.id || null
    emit('active-change', nextIndex)
  }
  await client.deleteQuestion(quizId, questionId)
}

// Scroll to the active question when the page loads
const didInitialScroll = ref(false)
watch(
  () => props.activeQuestionId,
  (questionId) => {
    if (didInitialScroll.value || !questionId) return
    if (!questionId && Object.keys(props.questions || {}).length > 0) {
      didInitialScroll.value = true
      return
    }
    nextTick(() => scrollQuestionIntoView(questionId))
    didInitialScroll.value = true
  }
)

function scrollQuestionIntoView(questionId: string) {
  const questionElem = document.getElementById(questionId)
  if (questionElem) questionElem.scrollIntoView({ block: 'center' })
}
</script>

<template>
  <div class="slideList">
    <ol ref="listElem" v-auto-animate class="slideList__container">
      <SlideListItem
        v-for="(question, index) in questions"
        :id="question.id"
        :key="question.id"
        :question="question"
        :index="index"
        :is-active="question.id === activeQuestionId"
        @set-active="setActiveSlide($event)"
        @delete="deleteQuestion($event)"
      />
      <li
        class="slideList__addQuestion"
        tabindex="0"
        role="button"
        aria-label="Add question"
        @click="addQuestion"
      >
        +
      </li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.slideList {
  position: relative;
  height: 100%;

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
    bottom: 0; // I don't understand this
    background: linear-gradient(to top, #000000aa, #00000000);
  }

  &__container {
    max-width: 100%;
    height: 100%;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    overflow-y: auto;
  }

  &__addQuestion {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 0.35rem;
    margin-bottom: 1.5rem;
    aspect-ratio: 4 / 3;
    background-color: rgb(30 30 30);
    border-radius: 8px;
    cursor: pointer;
    font-size: 3vw;
    transition: 0.25s ease;
    transition-property: transform, background-color, box-shadow;

    &:focus-visible {
      box-shadow: 0 0 0 0.25rem blue;
    }

    &:active {
      background-color: rgb(25 25 25);
      transform: scale(0.975);
    }
  }
}
</style>
