<template>
  <CreateLayout :title="quiz?.name || 'Create'" can-go-back>
    <template #sidebar>
      <SlideList
        :questions="questions"
        :active-question="activeQuestion?.id"
        @active-change="onSlideChange"
      />
    </template>
    <SlideEditor v-if="activeQuestion" :question="activeQuestion" />
  </CreateLayout>
</template>

<script lang="ts" setup>
import CreateLayout from '@/layouts/CreateLayout.vue'
import SlideList from '@/components/create/SlideList.vue'
import { provide, ref, watchEffect } from 'vue'
import SlideEditor from '@/components/create/SlideEditor.vue'
import { QuizEntry, QuestionEntry } from '@/lib/store/db'
import { useObservable } from '@vueuse/rxjs'
import { getQuestions$, getQuiz$ } from '@/lib/store/client'
import { useRoute } from 'vue-router'

const route = useRoute()

const quizId = route.params.id as string

provide('quizId', quizId)

const quiz$ = getQuiz$(quizId)

const quiz = useObservable<QuizEntry>(quiz$)

const questions = useObservable(getQuestions$(quizId), { initialValue: [] as QuestionEntry[] })

watchEffect(() => console.log(questions.value))

const activeQuestion = ref(questions.value?.[0] || 0)

function onSlideChange(id: QuestionEntry['id']) {
  activeQuestion.value = questions.value.find((q) => q.id === id)!
}
</script>

<style lang="scss" scoped>
.create {
}
</style>
