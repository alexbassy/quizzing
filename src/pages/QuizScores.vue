<script lang="ts" setup>
import { map, mergeMap, switchMap } from 'rxjs/operators'
import { combineLatest } from 'rxjs'
import { useSubscription } from '@vueuse/rxjs'
import { useObservable } from '@/composable/useObservable'
import useRound from '@/composable/useRound'
import { getPlayer$, getPointsForRound$, getQuiz$ } from '@/lib/store/client'
import { PlayerEntry } from '@/lib/store/db'
import PlayerAvatar from '@/components/player/PlayerAvatar.vue'

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
  <div class="scoresContainer">
    <h1 class="title">Scores</h1>
    <ol class="rankingList">
      <li v-for="player in playerPoints" :key="player.id" class="rankingListItem">
        <div class="playerDetails">
          <PlayerAvatar :player="player" size="medium" />
          <span class="playerName">{{ player.name }}</span>
        </div>

        <span class="playerScore" aria-label="Score">
          <div>{{ player.score }} / {{ numQuestions }}</div>
          <div>{{ Math.round((player.score / numQuestions) * 1000) / 10 }}%</div>
        </span>
      </li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.scoresContainer {
  max-width: 400px;
  margin: 2rem auto 0;
}

.title {
  font-size: 2rem;
}
.rankingList {
  background-color: var(--background1);
}

.rankingListItem {
  display: flex;
  align-items: center;
  padding: 1rem;

  &:nth-child(odd) {
    background-color: var(--background1);
  }
}

.playerDetails {
  max-width: 75px;
  font-size: 0.875rem;
  text-align: center;
}

.playerName {
  display: block;
  margin-top: 0.25rem;
}

.playerScore {
  margin-left: auto;
  font-size: 1.5rem;
}
</style>
