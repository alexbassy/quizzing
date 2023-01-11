<script lang="ts" setup>
import { ref, watch } from 'vue'
import { catchError, map, of, switchMap } from 'rxjs'
import { useRoute, useRouter } from 'vue-router'
import { useObservable } from '@vueuse/rxjs'
import PlayLayout from '@/layouts/PlayLayout.vue'
import { watch$ } from '@/lib/observables'
import { getQuiz$, getRound$ } from '@/lib/store/client'
import { Routes } from '@/routes'
import PrimaryButton from '@/components/PrimaryButton.vue'

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
    router.push({ name: Routes.NotFound })
    return of(undefined)
  })
)

const quiz = useObservable(quiz$)
const firstQuestionId = useObservable(quiz$.pipe(map((quiz) => quiz!.questions![0])))
</script>

<template>
  <PlayLayout>
    <div class="playBeginContainer">
      <h1 class="title">{{ quiz?.name }}</h1>
      <p>Ready to rumble? Here are the controls</p>
      <dl>
        <dt>Show answer</dt>
        <dd>
          <kbd>{{ '->' }}</kbd>
        </dd>
        <dt>Hide answer</dt>
        <dd>
          <kbd>{{ '<-' }}</kbd> once
        </dd>
        <dt>Next question</dt>
        <dd>
          <kbd>{{ '->' }}</kbd> again
        </dd>
        <dt>Previous question</dt>
        <dd>
          <kbd>{{ '<-' }}</kbd> again
        </dd>
        <dt>Show background image</dt>
        <dd>
          <kbd>{{ '↑' }}</kbd> once
        </dd>
      </dl>

      <!-- Could also resume an already started quiz here! -->
      <div>
        <PrimaryButton
          v-if="firstQuestionId"
          :to="{ name: Routes.Present, params: { questionId: firstQuestionId } }"
          >Start quiz</PrimaryButton
        >
      </div>
    </div>
  </PlayLayout>
</template>

<style lang="scss" scoped>
.playBeginContainer {
  position: relative;
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.title {
  margin-bottom: 1em;
  font-size: 2rem;
}

dl {
  display: grid;
  padding: 1rem;
  margin: 1rem 0;
  background: var(--background1);
  border-radius: 6px;
  column-gap: 2rem;
  grid-template-columns: 3fr 2fr;
  row-gap: 0.5rem;
}

dt {
  text-align: right;
}

dd {
  text-align: left;
}

kbd {
  display: inline-block;
  padding: 0.2rem 0.3rem;
  border: 1px solid var(--background1);
  background-color: var(--background1);
  border-radius: 3px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5), 0 2px 0 0 rgba(255, 255, 255, 0.1) inset;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1;
}
</style>
