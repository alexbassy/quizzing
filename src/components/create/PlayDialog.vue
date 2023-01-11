<script lang="ts" setup>
import { computed, inject, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import PlayerAvatar from '@/components/player/PlayerAvatar.vue'
import { useObservable } from '@/composable/useObservable'
import { addRound, getPlayers$ } from '@/lib/store/client'
import { Routes } from '@/routes'
import TickIcon from '../icons/TickIcon.vue'
import PrimaryButton from '../PrimaryButton.vue'
import SecondaryButton from '../SecondaryButton.vue'
import Dialog from '../Dialog.vue'

const quizId = inject<string>('quizId')

const players = useObservable(getPlayers$())
const selectedPlayers = reactive<Record<string, boolean>>({})
const selectedPlayersCount = computed(() => Object.values(selectedPlayers).length)

const router = useRouter()
async function startRound() {
  const players = Object.keys(selectedPlayers)
  const roundId = await addRound({ quizId, players })
  router.push({ name: Routes.PrePresent, params: { roundId } })
}

const onPlayerClick = (id: string) => {
  if (selectedPlayers[id]) delete selectedPlayers[id]
  else selectedPlayers[id] = true
}
</script>

<template>
  <Dialog v-slot="{ close }" class="playDialog" aria-labelledby="play-dialog-description" v-bind="$attrs">
    <form method="dialog">
      <h1 class="title">Who’s playing?</h1>
      <p id="play-dialog-description" class="message">
        Add some participants to the quiz for easy scoring as you go along. You can also start the quiz
        without adding any players.
      </p>
      <ul class="playerList">
        <li v-for="player in players" :key="player.id" class="playerListItem">
          <label
            class="playerCheckbox"
            :class="{'-checked': selectedPlayers[player.id!] }"
            role="button"
            tabindex="0"
            @click.prevent="onPlayerClick(player.id!)"
            @keydown.enter="onPlayerClick(player.id!)"
            @keydown.space="onPlayerClick(player.id!)"
          >
            <input
              id="player-{{ player.id }}"
              type="checkbox"
              name="players"
              class="hiddenCheckbox"
              :value="selectedPlayers[player.id!] || false"
            />
            <PlayerAvatar :player="player" class="playerAvatar" />
            <TickIcon class="playerSelectedIndicator" />
          </label>
        </li>
      </ul>
      <div class="playDialogActions">
        <SecondaryButton class="cancelButton" type="button" @click="close"> Close </SecondaryButton>
        <PrimaryButton bg="rgb(0, 36, 196)" type="button" @click="startRound">
          <template v-if="selectedPlayersCount > 0"> Start with {{ selectedPlayersCount }} players </template>
          <template v-else>Start without scoring</template>
        </PrimaryButton>
      </div>
    </form>
  </Dialog>
</template>

<style lang="scss" scoped>
.title {
  font-size: 2rem;
  font-weight: bold;
}

.message {
  margin: 1rem 0;
}

.playerList {
  display: flex;
  flex-wrap: wrap;
  margin: 2rem 0 1rem;
}

.playerListItem {
  margin: 0 1rem 1rem 0;
}

.playerCheckbox {
  position: relative;
  display: flex;
  padding: 3px;
  border-radius: 50%;
  box-shadow: 0 0 0 0px white;
  cursor: pointer;
  transition: box-shadow 0.2s ease;

  &:focus-visible {
    box-shadow: 0 0 1px 2px white;
  }

  &.-checked {
    box-shadow: 0 0 0 1px white;

    &:focus-visible {
      box-shadow: 0 0 0 1px white, 0 0 3px 3px white;
    }
  }
}

.playerSelectedIndicator {
  position: absolute;
  top: 0;
  right: 0;
  padding: 2px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #101010;
  color: #101010;
  opacity: 0;
  transform: scale(0);
  transition: 0.1s ease;
  transition-property: opacity, transform;

  .-checked & {
    opacity: 1;
    transform: scale(1);
  }
}

.hiddenCheckbox {
  width: 0;
  height: 0;
  clip: 1px 1px 1px 1px;
  visibility: hidden;
}

.playDialogActions {
  display: flex;
}

.cancelButton {
  margin-right: 1rem;
  margin-left: auto;
}
</style>
