<script lang="ts" setup>
import { inject, ref } from 'vue'
import { useObservable } from '@vueuse/rxjs'
import randomColor from 'randomcolor'
import { map, switchMap } from 'rxjs/operators'
import { onMounted$ } from '@/composable/useObservable'
import * as client from '@/lib/store/client'
import { getQuestions$ } from '@/lib/store/client'
import { QuestionEntry } from '@/lib/store/db'
import RubbishIcon from '../icons/RubbishIcon.vue'

const props = defineProps<{ questions: QuestionEntry[]; activeQuestionId?: string }>()
const quizId = inject<string>('quizId')
const listElem = ref<HTMLOListElement>()

const questionsToTitles$ = getQuestions$(quizId!).pipe(
  map((questions) => Object.fromEntries<string>(questions.map(({ id, title }) => [id!, title!])))
)
const titles = useObservable(onMounted$().pipe(switchMap(() => questionsToTitles$)), {
  initialValue: {} as Record<string, string>,
})

const emit = defineEmits(['active-change'])

function setActiveSlide(questionId: string) {
  emit('active-change', questionId)
}

async function addQuestion() {
  const backgroundColor = randomColor({ luminosity: 'dark' })
  await client.addQuestion({ quizId: quizId!, backgroundColor })
  setTimeout(() => {
    if (listElem.value) {
      listElem.value.scrollTo({ top: listElem.value.scrollHeight * 2, behavior: 'smooth' })
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
    const nextIndex =
      props.questions[questionIndex + 1]?.id || props.questions[questionIndex - 1]?.id || null
    emit('active-change', nextIndex)
  }
  await client.deleteQuestion(quizId, questionId)
}

function getImageObjectURL(question: QuestionEntry) {
  const blob = question.thumbnailImage || question.image
  return blob ? URL.createObjectURL(blob) : ''
}
</script>

<template>
  <div class="list-container">
    <ol ref="listElem" v-auto-animate class="list">
      <li
        v-for="(question, index) in questions"
        :key="question.id"
        class="item"
        :style="`--background-color: ${question.backgroundColor || 'gray'};`"
        tabindex="0"
        role="button"
        :class="{ '-active': activeQuestionId === question.id }"
        @click="setActiveSlide(question.id!)"
        @keyup.enter="setActiveSlide(question.id!)"
        @keyup.space.prevent="setActiveSlide(question.id!)"
      >
        <button
          class="delete-button"
          :aria-label="`Delete question ${index}`"
          @click.stop="deleteQuestion(question.id!)"
        >
          <RubbishIcon />
        </button>
        <img
          v-if="question.image"
          class="slide-image"
          :src="getImageObjectURL(question)"
          :alt="question.title"
          loading="lazy"
        />
        <div class="slide-title">{{ titles[question.id!] }}</div>
      </li>
      <li
        class="item -addQuestion"
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
.list-container {
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
  display: flex;
  overflow: hidden;
  width: 100%;
  align-items: center;
  margin-bottom: 1.5rem;
  aspect-ratio: 4 / 3;
  background: var(--background-color);
  border-radius: 8px;
  cursor: pointer;
  transition: 0.25s ease;
  transition-property: transform, background-color, box-shadow;

  &:focus-visible {
    box-shadow: 0 0 0 0.25rem blue;
  }

  &.-active {
    box-shadow: 0 0 0 0.5rem #ffffff20;
  }

  &.-addQuestion {
    justify-content: center;
    padding-bottom: 0.35rem;
    background-color: rgb(30 30 30);
    font-size: 3vw;

    &:active {
      background-color: rgb(25 25 25);
      transform: scale(0.975);
    }
  }
}

.delete-button {
  --background-alpha: 0%;
  --foreground-alpha: 0%;

  position: absolute;
  z-index: 2;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  width: 1.85rem;
  height: 1.85rem;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0 / var(--background-alpha));
  border-radius: 5px;
  color: rgb(255 255 255 / var(--foreground-alpha));
  cursor: pointer;
  transition: 0.25s ease;
  transition-property: color, background-color, transform;

  .item:hover & {
    --background-alpha: 10%;
    --foreground-alpha: 30%;

    &:hover {
      --background-alpha: 20%;
      --foreground-alpha: 70%;
    }

    &:active {
      --background-alpha: 10%;
      --foreground-alpha: 30%;
      transform: scale(0.95);
    }
  }
}

.slide-title {
  position: relative;
  margin: 1vw;
  font-size: 1.1vw;
  font-weight: bold;
}

.slide-image {
  position: absolute;
  width: 100%;
  height: 100%;
  filter: brightness(0.5);
  object-fit: cover;
}
</style>
