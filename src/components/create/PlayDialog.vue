<script lang="ts" setup>
import { defineProps, reactive, ref, watch } from 'vue'
import { tap } from 'rxjs'
import PlayerAvatar from '@/components/player/PlayerAvatar.vue'
import { useObservable } from '@/composable/useObservable'
import { getPlayers$ } from '@/lib/store/client'
import TickIcon from '../icons/TickIcon.vue'

interface Props {
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), { visible: false })

const emit = defineEmits(['cancel', 'close'])

const dialog = ref<HTMLDialogElement>()
const isVisible = ref(props.visible)

const players = useObservable(getPlayers$())

const selectedPlayers = reactive<Record<string, boolean>>({})

function closeModal() {
  dialog.value?.classList.add('is-hidden')
  const removeClasses = () => {
    dialog.value?.classList.remove('is-hidden')
    ;(dialog.value as any)?.close()
    close()
  }
  dialog.value?.addEventListener('animationend', removeClasses, { once: true })
}

watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible) {
      ;(dialog.value as any)?.showModal()
    }
  }
)

const onPlayerClick = (id: string) => {
  if (selectedPlayers[id]) delete selectedPlayers[id]
  else selectedPlayers[id] = true
}

function cancel() {
  emit('cancel')
}

function close() {
  emit('close')
}
</script>

<template>
  <dialog
    class="playDialog"
    ref="dialog"
    @cancel="cancel"
    @close="close"
    aria-labelledby="play-dialog-description"
  >
    <form method="dialog">
      <h1 class="title">Who’s playing?</h1>
      <p class="message" id="play-dialog-description">
        Add some participants to the quiz for easy scoring as you go along. You can also start the
        quiz without adding any players.
      </p>
      <ul class="playerList">
        <li v-for="player in players" :key="player.id" class="playerListItem">
          <label class="playerCheckbox" :class="{'-checked': selectedPlayers[player.id!] }">
            <input
              type="checkbox"
              name="players"
              class="hiddenCheckbox"
              id="player-{{ player.id }}"
              :value="selectedPlayers[player.id!] || false"
            />
            <PlayerAvatar
              :player="player"
              class="playerAvatar"
              @click="onPlayerClick(player.id!)"
            />
            <TickIcon class="playerSelectedIndicator" />
          </label>
        </li>
      </ul>
      <button type="button">Start without scoring</button>
      <button type="button" @click="closeModal">Close</button>
    </form>
  </dialog>
</template>

<style lang="scss" scoped>
.playDialog {
  position: fixed;
  top: 0px;
  right: 0;
  bottom: 0px;
  left: 0;
  height: fit-content;
  padding: 2.5rem;
  margin: auto;
  backdrop-filter: blur(10px);
  background: rgb(15 15 15 / 80%);
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 1px 30px rgba(0, 0, 0, 0.5);
  max-block-size: min(80vh, 100%);
  max-inline-size: min(90vw, 45ch);

  @include animate-dialog-entry-exit;

  &::backdrop {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    width: 100vw;
    background-color: $backdrop-background;
  }
}

.title {
  font-size: 2rem;
  font-weight: bold;
}

.message {
  margin: 1rem 0;
}

.playerList {
  display: flex;
}

.playerListItem {
  margin: 0 1rem 1rem 0;
}

.playerAvatar {
}

.playerCheckbox {
  position: relative;
  display: flex;
  padding: 3px;
  border-radius: 50%;
  box-shadow: 0 0 0 0px white;
  cursor: pointer;
  transition: box-shadow 0.2s ease;

  &.-checked {
    box-shadow: 0 0 0 1px white;
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
</style>
