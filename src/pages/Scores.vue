<script lang="ts" setup>
import { map, switchMap } from 'rxjs/operators'
import { useObservable } from '@/composable/useObservable'
import CaretLeftIcon from '@/components/icons/CaretLeftIcon.vue'
import useRound from '@/composable/useRound'
import { getQuiz$ } from '@/lib/store/client'
import CreateLayout from '@/layouts/CreateLayout.vue'
import ScoresChart from '@/components/scores/ScoresChart.vue'

const round$ = useRound()

const quizName = useObservable(
  round$.pipe(
    switchMap((round) => getQuiz$(round!.quizId!)),
    map((quiz) => quiz?.name)
  )
)
</script>

<template>
  <CreateLayout>
    <template #title>
      <RouterLink to="/create" class="back-button">
        <CaretLeftIcon />
      </RouterLink>
      <h1 class="quizName">{{ quizName }}</h1>
    </template>
    <ScoresChart />
  </CreateLayout>
</template>

<style lang="scss" scoped>
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

.quizName {
  display: inline-block;
}

.scoresContainer {
  max-width: 400px;
  margin: 2rem auto 0;
}

.title {
  margin: 0 0 2rem;
  font-size: 1.5rem;
  text-align: center;
}

.playerAvatar {
  flex-shrink: 0;
}

.rankingListItem {
  margin-bottom: 1rem;
  background-color: var(--background1);
  border-radius: 100px;
}

.playerDetails {
  display: flex;
  align-items: center;
}

.playerName {
  display: block;
  margin: auto;
  font-size: 1.25rem;
}

.playerScore {
  margin-right: 2rem;
  font-size: 1.5rem;
}
</style>
