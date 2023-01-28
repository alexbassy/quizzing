<script lang="ts" setup>
import { ref } from 'vue'
import { catchError, combineLatest, fromEvent, map, of, switchMap } from 'rxjs'
import { useRoute, useRouter } from 'vue-router'
import { useObservable } from '@vueuse/rxjs'
import Slide from '@/components/slide'
import { useSubscribe } from '@/composable/useObservable'
import PlayLayout from '@/layouts/PlayLayout.vue'
import { watch$ } from '@/lib/observables'
import { getQuestion$, getQuiz$, getRound$ } from '@/lib/store/client'
import PlayerScoreToggles from '@/components/player/PlayerScoreToggles.vue'
import { Routes } from '@/routes'
import FixedHeight from '@/components/FixedHeight.vue'

const isAnswerShown = ref(false)
const isPhotoShown = ref(false)

const router = useRouter()
const route = useRoute()

const roundId$ = watch$(() => String(route.params.roundId))
const roundId = useObservable(roundId$)
const round$ = roundId$.pipe(switchMap((id) => getRound$(id)))
const quiz$ = round$.pipe(
  switchMap((round) => getQuiz$(round!.quizId!)),
  catchError((error) => {
    console.error(error)
    router.push({ name: Routes.NotFound })
    return of(undefined)
  })
)

const questionId$ = watch$(() => String(route.params.questionId))
const questionId = useObservable(questionId$)

const questionIndex = useObservable(
  combineLatest([quiz$, questionId$]).pipe(
    map(([quiz, questionId]) => quiz!.questions!.indexOf(questionId) + 1)
  )
)

const prevNextQuestions = useObservable(
  combineLatest([quiz$, questionId$]).pipe(
    map(([quiz, questionId]) => {
      const questions = quiz!.questions
      if (!questions) return [null, null]
      const index = questions.indexOf(questionId)
      return [questions[index - 1], questions[index + 1]]
    })
  ),
  { initialValue: [null, null] }
)

const activeQuestion = useObservable(questionId$.pipe(switchMap((id) => getQuestion$(id))))

const onPrevious = () => {
  // Hide the answer
  if (isAnswerShown.value) {
    isAnswerShown.value = false
    return
  }
  // Otherwise go back to previous question
  const previousQuestion = prevNextQuestions.value[0]
  if (!previousQuestion) return null
  isPhotoShown.value = false
  router.push({ params: { questionId: prevNextQuestions.value[0] } })
}

const onNext = () => {
  // Show the correct answer
  if (!isAnswerShown.value) {
    isAnswerShown.value = true
    return
  }

  // Otherwise go to next question
  const nextQuestion = prevNextQuestions.value[1]
  if (!nextQuestion) {
    router.push({ name: Routes.Scores, params: { roundId: roundId.value } })
    return
  }
  isAnswerShown.value = false
  isPhotoShown.value = false
  router.push({ params: { questionId: prevNextQuestions.value[1] } })
}

// TODO: handle touch events
useSubscribe(fromEvent<KeyboardEvent>(document, 'keyup'), (event) => {
  if (event.key === ' ' || event.key === 'ArrowRight') onNext()
  if (event.key === 'ArrowLeft') onPrevious()
  if (event.key === 'ArrowUp') isPhotoShown.value = !isPhotoShown.value
})
</script>

<template>
  <PlayLayout>
    <FixedHeight />
    <div class="playContainer">
      <Slide
        v-if="activeQuestion"
        :is-answer-shown="isAnswerShown"
        :is-photo-shown="isPhotoShown"
        :question="activeQuestion"
        :question-index="questionIndex"
        is-animated
      />
    </div>
    <div class="playersList">
      <PlayerScoreToggles :round-id="roundId" :question-id="questionId" />
    </div>
  </PlayLayout>
</template>

<style lang="scss" scoped>
.playContainer {
  position: absolute;
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  align-items: start;
  justify-content: center;
}

.playersList {
  position: absolute;
  z-index: 4;
  right: 4rem;
  bottom: 4rem;
  display: flex;
}
</style>
