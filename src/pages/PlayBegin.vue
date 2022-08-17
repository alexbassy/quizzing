<script lang="ts" setup>
import { catchError, map, of, switchMap } from 'rxjs'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PlayLayout from '@/layouts/PlayLayout.vue'
import { watch$ } from '@/lib/observables'
import { getQuiz$, getRound$ } from '@/lib/store/client'
import { useObservable } from '@vueuse/rxjs'

const router = useRouter()
const route = useRoute()
const id = ref<number>(0)
watch(
  () => route.params.questionIndex,
  (value) => (id.value = Number(value)),
  { immediate: true }
)

const roundId$ = watch$(() => String(route.params.roundId))
const round$ = roundId$.pipe(switchMap((id) => getRound$(id)))
const quiz$ = round$.pipe(
  switchMap((round) => getQuiz$(round!.quizId!)),
  catchError((error) => {
    console.log(error)
    router.push({ name: 'NotFound' })
    return of(undefined)
  })
)

const quiz = useObservable(quiz$)
const firstQuestionId = useObservable(quiz$.pipe(map((quiz) => quiz!.questions![0])))
</script>

<template>
  <PlayLayout>
    <div class="container">
      <h1>{{ quiz?.name }}</h1>
      Ready to begin??
      <!-- Could also resume an already started quiz here! -->
      <router-link
        v-if="firstQuestionId"
        :to="{ name: 'PlayQuestion', params: { questionId: firstQuestionId } }"
        >GO</router-link
      >
    </div>
  </PlayLayout>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  align-items: start;
  justify-content: center;
}
</style>
