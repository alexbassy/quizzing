<script lang="ts" setup>
import { catchError, combineLatest, fromEvent, map, of, switchMap } from 'rxjs'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Slide from '@/components/slide'
import { useSubscribe } from '@/composable/useObservable'
import PlayLayout from '@/layouts/PlayLayout.vue'
import { watch$ } from '@/lib/observables'
import { getQuestion$, getQuiz$, getRound$, getPlayersOfRound$ } from '@/lib/store/client'
import { useObservable } from '@vueuse/rxjs'
import PlayerAvatar from '@/components/player/PlayerAvatar.vue'

const isAnswerShown = ref(false)
const isPhotoShown = ref(false)

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

const players = useObservable(roundId$.pipe(switchMap(getPlayersOfRound$)))

const questionId$ = watch$(() => String(route.params.questionId))
const quiz = useObservable(quiz$)
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

const questionIndex = computed(() => quiz.value?.questions?.indexOf(activeQuestion.value?.id))

const onPrevious = () => {
  if (isAnswerShown.value) {
    isAnswerShown.value = false
  } else {
    const previousQuestion = prevNextQuestions.value[0]
    if (!previousQuestion) {
      return null
    }
    isPhotoShown.value = false
    router.push({ params: { questionId: prevNextQuestions.value[0] } })
  }
}

const onNext = () => {
  if (!isAnswerShown.value) {
    isAnswerShown.value = true
    return
  }
  const nextQuestion = prevNextQuestions.value[1]
  console.log(prevNextQuestions.value[1])
  if (!nextQuestion) {
    return null
  }
  router.push({ params: { questionId: prevNextQuestions.value[1] } })
  isAnswerShown.value = false
  isPhotoShown.value = false
}

useSubscribe(fromEvent<KeyboardEvent>(document, 'keyup'), (event) => {
  if (event.key === ' ' || event.key === 'ArrowRight') onNext()
  if (event.key === 'ArrowLeft') onPrevious()
  if (event.key === 'ArrowUp') isPhotoShown.value = !isPhotoShown.value
})
</script>

<template>
  <PlayLayout>
    <div class="container">
      <Slide
        v-if="activeQuestion"
        :is-answer-shown="isAnswerShown"
        :is-photo-shown="isPhotoShown"
        :question="activeQuestion"
        :question-index="questionIndex"
        is-animated
      />
      <ul class="playersList">
        <li v-for="player in players">
          <PlayerAvatar :player="player" />
        </li>
      </ul>
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

.playersList {
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
}
</style>
