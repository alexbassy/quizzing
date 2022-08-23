<script lang="ts" setup>
import { computed, defineProps, nextTick, ref, watch } from 'vue'
import { filter, switchMap, tap } from 'rxjs/operators'
import { watch$ } from '@/lib/observables'
import { deletePlayer, getPlayer$, updatePlayer } from '@/lib/store/client'
import { useObservable } from '@vueuse/rxjs'
import PlayerAvatar from './PlayerAvatar.vue'
import RubbishIcon from '../icons/RubbishIcon.vue'

const props = defineProps<{
  visible?: boolean
  x?: number
  y?: number
  stayOnTop?: boolean
}>()

const emit = defineEmits(['close'])

const container = ref<HTMLFormElement>()

// Focus the popover when it is opened (by changing the player ID prop)
watch(
  () => props.visible,
  (newValue) => {
    if (!newValue) return
    nextTick(() => {
      container.value?.focus()
      entryAnimation()
    })
  },
  { immediate: true }
)

const blurEmit = ref()
function onBlur() {
  if (props.stayOnTop) return
  // Queue the closure to account for new `focusin` event from interaction inside the popover
  blurEmit.value = setTimeout(() => exitAnimation(), 0)
}

function onFocus() {
  clearTimeout(blurEmit.value)
}

function entryAnimation() {
  container.value?.classList.add('-enter')
  container.value?.addEventListener(
    'animationend',
    () => container.value?.classList.remove('-enter'),
    { once: true }
  )
}

function exitAnimation() {
  container.value?.classList.add('-exit')
  const removeClasses = () => {
    container.value?.classList.remove('-exit')
    emit('close')
  }
  container.value?.addEventListener('animationend', removeClasses, { once: true })
}
</script>

<template>
  <div
    v-if="visible"
    class="popover"
    ref="container"
    tabIndex="-1"
    @focusout.capture="onBlur"
    @focusin="onFocus"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.popover {
  --top: calc(v-bind('y') * 1px);
  --left: calc(v-bind('x') * 1px);

  --background-color: rgb(50 50 50 / 70%);
  --border-color: rgb(60 60 60);

  --final-open-frame: translate(calc(-100% - 12px), -40%);

  position: absolute;
  z-index: 2;
  top: var(--top);
  left: var(--left);
  padding: 0.75rem;
  border: 1px solid var(--border-color);

  backdrop-filter: blur(10px);
  background: var(--background-color);
  border-radius: 6px;
  // `translate()` is not accurate
  // @todo: calculate position by element dimensions
  transform: var(--final-open-frame);
  transform-origin: center right;

  &.-enter {
    animation: pop-in 0.2s ease;
  }

  &.-exit {
    animation: pop-out 0.2s ease;
  }

  &::before {
    position: absolute;
    top: 50%;
    left: calc(100% - 6px);
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1px solid var(--border-color);
    background-color: rgb(43 43 43);
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    content: '';
    transform: rotate(45deg);
  }

  @keyframes pop-in {
    from {
      opacity: 0;
      transform: var(--final-open-frame) scale(0.95);
    }
    to {
      opacity: 1;
      transform: var(--final-open-frame) scale(1);
    }
  }

  @keyframes pop-out {
    from {
      opacity: 1;
      transform: var(--final-open-frame) scale(1);
    }
    to {
      opacity: 0;
      transform: var(--final-open-frame) scale(0.95);
    }
  }
}
</style>
