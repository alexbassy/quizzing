<template>
  <CreateLayout :title="quiz?.name || 'Create'" can-go-back>
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
import CreateLayout from '@/layouts/CreateLayout.vue'
import { getQuestions$, getQuiz$ } from '@/lib/store/client'
import { QuestionEntry, QuizEntry } from '@/lib/store/db'
import { useObservable } from '@vueuse/rxjs'
import { provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

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
</script>

<style lang="scss" scoped>
.create {
}
</style>
