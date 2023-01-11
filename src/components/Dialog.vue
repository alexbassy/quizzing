<script lang="ts" setup>
import { ref, watch } from 'vue'

interface Props {
  visible: boolean
}

const emit = defineEmits(['cancel', 'close'])

const props = withDefaults(defineProps<Props>(), { visible: false })

const dialog = ref<HTMLDialogElement>()

watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible) dialog.value?.showModal()
  }
)

function closeModal() {
  dialog.value?.classList.add('is-hidden')
  const removeClasses = () => {
    dialog.value?.classList.remove('is-hidden')
    dialog.value?.close()
  }
  dialog.value?.addEventListener('animationend', removeClasses, { once: true })
}
</script>

<template>
  <dialog ref="dialog" class="dialog" @cancel="$emit('cancel')" @close="$emit('close')">
    <slot :close="closeModal" />
  </dialog>
</template>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  top: 0px;
  right: 0;
  bottom: 0px;
  left: 0;
  height: fit-content;
  padding: 1.5rem;
  margin: auto;
  backdrop-filter: blur(10px);
  background: rgb(15 15 15 / 80%);
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 1px 30px rgba(0, 0, 0, 0.5);
  max-inline-size: min(90vw, 45ch);

  @include animate-dialog-entry-exit;

  &::backdrop {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background-color: $backdrop-background;
  }
}
</style>
