<script lang="ts" setup>
import { computed, defineProps, nextTick, ref, watch } from 'vue'
import { filter, switchMap, tap } from 'rxjs/operators'
import { watch$ } from '@/lib/observables'
import { deletePlayer, getPlayer$, updatePlayer } from '@/lib/store/client'
import { useObservable } from '@vueuse/rxjs'
import PlayerAvatar from './PlayerAvatar.vue'
import RubbishIcon from '../icons/RubbishIcon.vue'

const props = defineProps<{
  playerId: string | undefined
  x: number | undefined
  y: number | undefined
}>()

const emit = defineEmits(['close'])

const container = ref<HTMLFormElement>()

watch(
  () => props.playerId,
  () => {
    nextTick(() => {
      console.log('yues', container.value)
      container.value?.focus()
    })
  },
  { immediate: true }
)

const playerName = ref<string>()
const player = useObservable(
  watch$(() => props.playerId).pipe(
    filter((id) => Boolean(id)),
    switchMap((id) => getPlayer$(id!)),
    tap((player) => {
      playerName.value = player?.name
    })
  )
)

const nameChanged = computed(() => playerName.value !== player.value?.name)

async function saveName() {
  await updatePlayer(player.value!.id!, { name: playerName.value })
}

async function removePlayer() {
  await deletePlayer(player.value!.id!)
  emit('close')
}

const blurEmit = ref()
function onBlur() {
  console.log('blur')
  blurEmit.value = setTimeout(() => emit('close'), 1)
}
function onFocus() {
  console.log('blur')
  clearTimeout(blurEmit.value)
}
</script>

<template>
  <form
    class="playerAttributesPopover"
    v-if="playerId"
    @submit.prevent="saveName"
    tabIndex="-1"
    ref="container"
    @focusout.capture="onBlur"
    @focusin="onFocus"
  >
    <PlayerAvatar :player="player" v-if="player" large />
    <div class="inputContainer">
      <input class="playerName" type="text" v-model="playerName" />
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
      <button class="saveButton" @click="saveName" :disabled="!nameChanged">Save</button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.playerAttributesPopover {
  --top: calc(v-bind('y') * 1px);
  --left: calc(v-bind('x') * 1px);

  position: absolute;
  z-index: 2;
  top: var(--top);
  left: var(--left);
  display: flex;
  width: 180px;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid rgb(60 60 60);
  backdrop-filter: blur(10px);
  background: rgb(50 50 50 / 70%);
  border-radius: 6px;
  transform: translate(-100%, -35%);

  &::before {
    content: '';
  }
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
