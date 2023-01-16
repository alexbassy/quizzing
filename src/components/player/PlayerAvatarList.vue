<script lang="ts" setup>
import { useObservable } from '@/composable/useObservable'
import { getPlayersById$ } from '@/lib/store/client'
import { PlayerEntry } from '@/lib/store/db'
import PlayerAvatar from './PlayerAvatar.vue'

const props = defineProps<{ playerIds: string[] }>()

const players = useObservable<PlayerEntry[]>(getPlayersById$(props.playerIds))
</script>

<template>
  <ul class="playerAvatarList">
    <li v-for="player in players" :key="player.id" class="playerAvatarList__item">
      <PlayerAvatar :player="player" class="playerAvatarList__icon" size="xsmall" />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.playerAvatarList {
  &__item {
    --offset: 12px;

    display: inline-block;
    margin-right: 0.5rem;

    &:nth-child(1n + 2) {
      margin-left: calc(var(--offset) * -1);
      transition: margin-left 0.2s ease-in-out;

      .playerAvatarList:hover & {
        margin-left: 0;
      }
    }
  }

  &__icon {
    box-shadow: 0 0 0 5px #1a1a1a;

    .playerAvatarList:hover & {
      box-shadow: 0 0 0 0 #1a1a1a;
      transition: box-shadow 0.2s ease-in-out;
    }
  }
}
</style>
