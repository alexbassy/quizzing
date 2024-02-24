<script lang="ts" setup>
import { computed, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useObservable } from '@vueuse/rxjs'
import SlideEditor from '@/components/create/SlideEditor.vue'
import SlideList from '@/components/create/SlideList.vue'
import CaretLeftIcon from '@/components/icons/CaretLeftIcon.vue'
import CreateLayout from '@/layouts/CreateLayout.vue'
import { getQuestions$, getQuiz$, updateQuizTitle } from '@/lib/store/client'
import { QuestionEntry, QuestionType, QuizEntry } from '@/lib/store/db'
import PlayDialog from '@/components/create/PlayDialog.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import FixedHeight from '@/components/FixedHeight.vue'
import router from '@/routes'

const route = useRoute()

function getQuestionIdFromRoute() {
  const questionId = route.query.q as string | undefined
  return questionId || undefined
}

function updateQuestionIdInRoute(questionId: QuestionEntry['id'] | undefined) {
  router.replace({ params: route.params, query: { q: questionId } })
}

const quizId = route.params.id as string
provide('quizId', quizId)

const quiz$ = getQuiz$(quizId)
const quiz = useObservable<QuizEntry | undefined>(quiz$)
const questions = useObservable(getQuestions$(quizId), { initialValue: [] as QuestionEntry[] })
const activeQuestion = ref<QuestionEntry | undefined>()
const countableQuestions = computed(() => questions.value.filter((q) => q.type !== QuestionType.Category))
const activeQuestionIndex = computed(() =>
  countableQuestions.value.findIndex((q) => q.id === activeQuestion.value?.id)
)

// Set active question based on route on load
watch(questions, (value, oldValue) => {
  if (oldValue.length === 0 && value.length > 0) {
    activeQuestion.value = value[0]

    const routeQuestionId = getQuestionIdFromRoute()
    const foundQuestion = routeQuestionId ? value.find((q) => q.id === routeQuestionId) : null
    if (routeQuestionId && foundQuestion) {
      activeQuestion.value = foundQuestion
    }
  }
})

function onSlideChange(id: QuestionEntry['id']) {
  activeQuestion.value = questions.value.find((q) => q.id === id)!
  updateQuestionIdInRoute(id)
}

// Save the title input value to the database and resize on input
async function handleTitleChange(ev: Event) {
  await updateQuizTitle(quizId, (ev.target as HTMLInputElement).value)
}

const isPlayDialogShown = ref(false)
function showPlayDialog() {
  isPlayDialogShown.value = true
}
</script>

<template>
  <CreateLayout>
    <FixedHeight />
    <template #title>
      <SecondaryButton to="/create" inline is-icon>
        <CaretLeftIcon />
      </SecondaryButton>
      <input v-stretchy="quiz?.name" type="text" class="title-input" :value="quiz?.name" placeholder="Untitled"
        maxlength="40" @input="handleTitleChange" />
    </template>

    <template #action>
      <PrimaryButton bg="#ef476f" @click="showPlayDialog">Play</PrimaryButton>
    </template>

    <template #sidebar>
      <SlideList :questions="questions" :active-question-id="activeQuestion?.id" @active-change="onSlideChange" />
    </template>

    <SlideEditor v-if="activeQuestion" :question-id="activeQuestion.id!" :index="activeQuestionIndex" />

    <PlayDialog v-model:visible="isPlayDialogShown" />
  </CreateLayout>
</template>

<style lang="scss" scoped>
.title-input {
  @include textarea-outline;
  display: inline-block;
  padding: 0 0.5rem;
  margin: 0 auto 0 0;
  font-size: var(--create-header-font-size);
  font-weight: normal;

  &::placeholder {
    color: var(--placeholder-color);
  }
}
</style>
