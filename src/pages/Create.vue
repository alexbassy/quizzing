<template>
  <CreateLayout title="Create">
    <template #sidebar>
      <SlideList :questions="questions" @active-change="onSlideChange" />
    </template>
    <SlideEditor :question="activeQuestion" />
  </CreateLayout>
</template>

<script lang="ts" setup>
import CreateLayout from '@/layouts/CreateLayout.vue'
import SlideList from '@/components/create/SlideList.vue'
import { IQuestion, questions } from '@/lib/questions'
import { ref, watch, watchEffect } from 'vue'
import SlideEditor from '@/components/create/SlideEditor.vue'

import { liveQuery } from 'dexie'
import { db, QuizEntry } from '@/lib/store/db'
import { useObservable } from '@vueuse/rxjs'
import { quizzes$ } from '@/lib/store/client'

const activeQuestion = ref<IQuestion>(questions[0])

function onSlideChange(id: IQuestion['id']) {
  activeQuestion.value = questions.find((q) => q.id === id)!
}

const dbQuestions = useObservable<QuizEntry[]>(quizzes$())

watchEffect(() => console.log(dbQuestions.value))
</script>

<style lang="scss" scoped>
.create {
}
</style>
