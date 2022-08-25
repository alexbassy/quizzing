<script lang="ts" setup>
import { computed, defineProps, ref, watch } from 'vue'
import { filter, switchMap, tap } from 'rxjs/operators'
import { useObservable, useSubscription } from '@vueuse/rxjs'
import { fromEvent } from 'rxjs'
import { watch$ } from '@/lib/observables'
import { deletePlayer, getPlayer$, updatePlayer } from '@/lib/store/client'
import RubbishIcon from '../icons/RubbishIcon.vue'
import Popover from '../Popover.vue'
import PlayerAvatar from './PlayerAvatar.vue'

const props = defineProps<{
  playerId?: string
  x?: number
  y?: number
}>()

const emit = defineEmits(['close'])

const isVisible = ref<boolean>(false)

// Focus the popover when it is opened (by changing the player ID prop)
watch(
  () => props.playerId,
  (playerId) => {
    isVisible.value = Boolean(playerId)
  },
  { immediate: true }
)

const playerName = ref<string>()
const player = useObservable(
  watch$(() => props.playerId).pipe(
    filter((id) => Boolean(id)),
    switchMap((id) => getPlayer$(id as string)),
    tap((player) => {
      playerName.value = player?.name
    })
  )
)

const nameChanged = computed(() => playerName.value !== player.value?.name)

async function saveName() {
  if (!player.value?.id) return
  await updatePlayer(player.value.id, { name: playerName.value })
}

async function removePlayer() {
  if (!player.value?.id) return
  await deletePlayer(player.value.id)
  close()
}

function close() {
  emit('close')
  isVisible.value = false
}

const isSelectingFile = ref(false)
const photoInput = ref<HTMLInputElement>()
function openFileInput() {
  isSelectingFile.value = true
  photoInput.value?.click()
}

useSubscription(
  fromEvent(window, 'focus').subscribe((e) => {
    if (isSelectingFile.value) {
      console.log('regained focus')
      isSelectingFile.value = false
    }
  })
)

async function fileInputChange(ev: Event) {
  isSelectingFile.value = false
  const file = (ev.target as HTMLInputElement).files?.[0]
  if (!player.value?.id || !file || !file.type.startsWith('image')) {
    return
  }
  const buffer = await file?.arrayBuffer()
  const blob = new Blob([buffer], { type: file?.type })
  await updatePlayer(player.value.id, { photo: blob })
}
</script>

<template>
  <Popover
    :x="x"
    :y="y"
    class="playerAttributesPopover"
    :stay-on-top="isSelectingFile"
    @close="close"
  >
    <form v-if="playerId" class="playerAttributesForm" @submit.prevent="saveName">
      <input ref="photoInput" type="file" class="fileUploadInput" @change="fileInputChange" />
      <button type="button" class="avatarUploadButton" @click="openFileInput">
        <PlayerAvatar v-if="player" :player="player" size="large" />
      </button>
      <div class="inputContainer">
        <input v-model="playerName" class="playerName" type="text" />
      </div>
      <div class="actions">
        <button
          class="deleteButton"
          type="button"
          aria-label="Delete player"
          title="Delete player"
          @click="removePlayer"
        >
          <RubbishIcon />
        </button>
        <button class="saveButton" :disabled="!nameChanged" @click="saveName">Save</button>
      </div>
    </form>
  </Popover>
</template>

<style lang="scss" scoped>
.playerAttributesPopover {
  width: 180px;
}

.playerAttributesForm {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}

.fileUploadInput {
  width: 0;
  height: 0;
  clip: 0 0 0 0;
  visibility: hidden;
}

.avatarUploadButton {
  all: unset;
}

.inputContainer {
  max-width: 100%;
  margin: 1rem 0;
}

.playerName {
  @include textarea-outline;
  max-width: 100%;
  padding: 0.5rem 0.15rem;
  text-align: center;
}

.actions {
  display: grid;
  width: 100%;
  column-gap: 0.75rem;
  grid-template-columns: 1fr 2fr;
}

.saveButton,
.deleteButton {
  @include button(#891d0c);
  flex-grow: 1;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}

.saveButton {
  background-color: #1361a4;
}
</style>
