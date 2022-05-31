<template>
  <CreateLayout>
    <template #title>
      <RouterLink to="/create" class="back-button"><CaretLeftIcon /></RouterLink>
      <input
        type="text"
        class="title-input"
        ref="titleInput"
        :value="quiz?.name"
        @input="handleTitleChange"
        placeholder="Untitled"
        maxlength="40"
      />
    </template>
    <template #action>
      <button @click="void 0" class="play-button">Play</button>
    </template>
    <template #sidebar>
      <SlideList
        :questions="questions"
        :active-question-id="activeQuestion?.id"
        @active-change="onSlideChange"
      />
    </template>
    <SlideEditor v-if="activeQuestion" :question="activeQuestion" />
  </CreateLayout>
</template>

<script lang="ts" setup>
import SlideEditor from '@/components/create/SlideEditor.vue'
import SlideList from '@/components/create/SlideList.vue'
import CaretLeftIcon from '@/components/icons/CaretLeftIcon.vue'
import CreateLayout from '@/layouts/CreateLayout.vue'
import { getQuestions$, getQuiz$, updateQuizTitle } from '@/lib/store/client'
import { QuestionEntry, QuizEntry } from '@/lib/store/db'
import { useObservable, useSubscription } from '@vueuse/rxjs'
import { nextTick, onMounted, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as Stretchy from 'stretchy'
import { take } from 'rxjs/operators'

const route = useRoute()

const quizId = route.params.id as string

provide('quizId', quizId)

const quiz$ = getQuiz$(quizId)

const quiz = useObservable<QuizEntry | undefined>(quiz$)

const questions = useObservable(getQuestions$(quizId), { initialValue: [] as QuestionEntry[] })

const activeQuestion = ref<QuestionEntry | undefined>(questions.value?.[0] ?? undefined)

watch(questions, (value, oldValue) => {
  if (oldValue.length === 0 && value.length > 0) {
    activeQuestion.value = value[0]
  }
})

function onSlideChange(id: QuestionEntry['id']) {
  activeQuestion.value = questions.value.find((q) => q.id === id)!
}

// Resize the title input when the quiz data is loaded
const titleInput = ref<HTMLInputElement>()
useSubscription(
  quiz$.pipe(take(1)).subscribe((value) => nextTick(() => Stretchy.resize(titleInput.value)))
)
// Save the title input value to the database and resize on input
async function handleTitleChange(ev: Event) {
  Stretchy.resize(ev.target as HTMLInputElement)
  await updateQuizTitle(quizId, (ev.target as HTMLInputElement).value)
}
</script>

<style lang="scss" scoped>
.title-input {
  @include textarea-outline;
  display: inline-block;
  margin: 0 auto 0 0;
  font-size: var(--create-header-font-size);
  font-weight: normal;

  &::placeholder {
    color: var(--placeholder-color);
  }
}

.back-button {
  --background-alpha: 5%;
  --foreground-alpha: 35%;
  display: inline-flex;
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

.play-button {
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
</style>
