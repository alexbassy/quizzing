<script lang="ts" setup>
import { combineLatest, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { useObservable } from '@vueuse/rxjs'
import { addPoint, getPlayersOfRound$, getPointsForQuestion$, removePoint } from '@/lib/store/client'
import { PlayerEntry } from '@/lib/store/db'
import { watch$ } from '@/lib/observables'
import PlayerAvatar from './PlayerAvatar.vue'

const props = defineProps<{
  roundId: string | undefined
  questionId: string | undefined
}>()

const roundId$ = watch$(() => props.roundId)
const questionId$ = watch$(() => props.questionId)

const players = useObservable(
  roundId$.pipe(switchMap((roundId) => (roundId ? getPlayersOfRound$(roundId) : of([]))))
)

const points = useObservable<Record<string, string>, Record<string, string>>(
  combineLatest([roundId$, questionId$]).pipe(
    switchMap(([roundId, questionId]) =>
      roundId && questionId ? getPointsForQuestion$(roundId, questionId) : of([])
    ),
    map((points) => Object.fromEntries(points.map((point) => [point.playerId, point.id])))
  ),
  { initialValue: {} }
)

async function togglePoint(player: PlayerEntry) {
  const playerPoint = points.value[player.id!]
  if (typeof playerPoint === 'undefined') {
    await addPoint({ questionId: props.questionId, playerId: player.id, roundId: props.roundId })
  } else {
    await removePoint(playerPoint)
  }
}
</script>

<template>
  <ul v-if="roundId && questionId" class="list">
    <li v-for="player in players" :key="player.id">
      <PlayerAvatar
        class="playerAvatarToggle"
        :class="{ '-hasPoint': points[player.id!] }"
        :player="player"
        @click="togglePoint(player)"
      />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.list {
  display: flex;
}

.playerAvatarToggle {
  margin-left: 0.5rem;
  box-shadow: 0 2px 20px rgba(0 0 0 / 80%);
  cursor: pointer;
  opacity: 0.75;
  transform: scale(0.95);
  transition: 0.2s ease;
  transition-property: opacity, transform;
  user-select: none;

  &.-hasPoint {
    opacity: 1;
    transform: translateY(-5px) scale(1);
  }
}
</style>
