<script lang="ts" setup>
import { defineProps } from 'vue'
import { combineLatest } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { addPoint, getPlayersOfRound$, getPoints$, removePoint } from '@/lib/store/client'
import { useObservable } from '@/composable/useObservable'
import PlayerAvatar from './PlayerAvatar.vue'
import { PlayerEntry } from '@/lib/store/db'
import { watch$ } from '@/lib/observables'

const props = defineProps<{
  roundId: string
  questionId: string
}>()

const roundId$ = watch$(() => props.roundId)
const questionId$ = watch$(() => props.questionId)

const players = useObservable(roundId$.pipe(switchMap(getPlayersOfRound$)))

const points = useObservable<Record<string, string>>(
  combineLatest([roundId$, questionId$]).pipe(
    switchMap(([roundId, questionId]) => getPoints$(roundId, questionId)),
    map((points) => Object.fromEntries(points.map((point) => [point.playerId, point.id])))
  )
)

async function togglePoint(player: PlayerEntry) {
  console.log(points.value, player.id)
  const playerPoint = points.value[player.id]
  if (typeof playerPoint === 'undefined') {
    await addPoint({ questionId: props.questionId, playerId: player.id, roundId: props.roundId })
  } else {
    await removePoint(playerPoint)
  }
}
</script>

<template>
  <ul class="list">
    <li v-for="player in players">
      <PlayerAvatar
        class="playerAvatarToggle"
        :class="{ '-hasPoint': points[player.id] }"
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
