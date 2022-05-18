<script lang="ts" setup>
import PlayLayout from '@/layouts/PlayLayout.vue'
import Slide from '@/components/slide'
import { questions } from '@/lib/questions'
import { getScoresFromCache, RoundState, saveScoresToCache, ScoresState } from '@/lib/scores'
import { fromEvent } from 'rxjs'
import { computed, ref, unref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { safeSubscribe } from '@/composable/useObservable'

const isAnswerShown = ref(false)
const isPhotoShown = ref(false)
const scores = ref<ScoresState>(getScoresFromCache())

const router = useRouter()
const route = useRoute()
const id = ref<number>(0)
watch(
  () => route.params.questionIndex,
  (value) => (id.value = Number(value)),
  { immediate: true }
)
const activeQuestion = computed(() => (id.value ? questions[id.value] : null))

if (!import.meta.env.PROD)
  console.log({ route, params: route.params, questionIndex: id.value, activeQuestion })

const handleSetScore = (newScores: RoundState) => {
  if (typeof id.value === 'undefined') {
    return
  }
  const currentScores = { ...unref(scores.value) }
  const updatedScores = { ...currentScores } || {}
  updatedScores[id.value.toString()] = newScores
  saveScoresToCache(updatedScores)
  scores.value = updatedScores
}

const onPrevious = () => {
  if (isAnswerShown.value) {
    isAnswerShown.value = false
  } else {
    const previousQuestion = id.value - 1
    if (!questions[previousQuestion]) {
      return null
    }
    isPhotoShown.value = false
    router.push({ params: { questionIndex: id.value - 1 } })
  }
}

const onNext = () => {
  if (!isAnswerShown.value) {
    isAnswerShown.value = true
    return
  }
  const nextQuestion = id.value + 1
  if (!questions[nextQuestion]) {
    return null
  }
  router.push({ params: { questionIndex: id.value + 1 } })
  isAnswerShown.value = false
  isPhotoShown.value = false
}

safeSubscribe(fromEvent<KeyboardEvent>(document, 'keyup'), (event) => {
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
        is-animated
      />
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
  justify-content: center;
  align-items: start;
}
</style>
