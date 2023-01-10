<script lang="ts" setup>
import { map, mergeMap, switchMap } from 'rxjs/operators'
import { combineLatest } from 'rxjs'
import { useSubscription } from '@vueuse/rxjs'
import { useObservable } from '@/composable/useObservable'
import CaretLeftIcon from '@/components/icons/CaretLeftIcon.vue'
import useRound from '@/composable/useRound'
import { getPlayer$, getPointsForRound$, getQuiz$ } from '@/lib/store/client'
import { PlayerEntry } from '@/lib/store/db'
import PlayerAvatar from '@/components/player/PlayerAvatar.vue'
import CreateLayout from '@/layouts/CreateLayout.vue'
import ScoresChart from '@/components/scores/ScoresChart.vue'

const round$ = useRound()

interface PlayerScore extends PlayerEntry {
  score: number
}

const playersInRound$ = round$.pipe(
  map((round) => round!.players!.map((id) => getPlayer$(id!))),
  mergeMap((players) => combineLatest(players)),
  map((players) => Object.fromEntries(players.map((player) => [player!.id as string, player])))
)

const pointsInRound$ = round$.pipe(
  switchMap((round) => getPointsForRound$(round!.id!)),
  map((points) =>
    points.reduce<Record<string, number>>((accum, point) => {
      if (!accum[point.playerId!]) accum[point.playerId!] = 0
      accum[point.playerId!]++
      return accum
    }, {})
  )
)

const quizName = useObservable(
  round$.pipe(
    switchMap((round) => getQuiz$(round!.quizId!)),
    map((quiz) => quiz?.name)
  )
)

const playerPoints$ = combineLatest([playersInRound$, pointsInRound$]).pipe(
  map(([players, points]) => {
    const scores = Object.values(players).map(
      (player) => ({ ...player, score: points[player!.id!] } as PlayerScore)
    )
    scores.sort((a, b) => b.score - a.score)
    return scores
  })
)

const numQuestions = useObservable(
  round$.pipe(
    switchMap((round) => getQuiz$(round!.quizId!)),
    map((quiz) => quiz!.questions!.length)
  )
)

const playerPoints = useObservable(playerPoints$)

useSubscription(
  playerPoints$.subscribe({
    next: (value) => {
      console.log('playerPoints', value)
    },
    error: console.error,
  })
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
    <div class="scoresContainer">
      <h2 class="title">The scores are in!</h2>
      <ol class="rankingList">
        <li v-for="player in playerPoints" :key="player.id" class="rankingListItem">
          <div class="playerDetails">
            <PlayerAvatar class="playerAvatar" :player="player" size="medium" />
            <span class="playerName">{{ player.name }}</span>

            <span class="playerScore" aria-label="Score">
              <div>{{ player.score }}</div>
            </span>
          </div>
        </li>
      </ol>
    </div>
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
