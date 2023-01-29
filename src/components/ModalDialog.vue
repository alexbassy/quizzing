<script lang="ts" setup>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

interface Props {
  title?: string
  visible: boolean
}

const emit = defineEmits(['cancel', 'close'])

withDefaults(defineProps<Props>(), { title: undefined, visible: false })

const closeModal = () => emit('close')
</script>

<template>
  <TransitionRoot :show="visible" as="template">
    <Dialog class="modalDialog" @close="closeModal">
      <TransitionChild
        enter="modalDialog__backdropTransition -enter"
        enter-from="modalDialog__backdropTransition -enter-from"
        enter-to="modalDialog__backdropTransition -enter-to"
        leave="modalDialog__backdropTransition -leave"
        leave-from="modalDialog__backdropTransition -leave-from"
        leave-to="modalDialog__backdropTransition -leave-to"
      >
        <div class="modalDialog__backdrop" aria-hidden="true" />
      </TransitionChild>
      <div class="modalDialog__container">
        <TransitionChild
          enter="modalDialog__panelTransition -enter"
          enter-from="modalDialog__panelTransition -enter-from"
          enter-to="modalDialog__panelTransition -enter-to"
          leave="modalDialog__panelTransition -leave"
          leave-from="modalDialog__panelTransition -leave-from"
          leave-to="modalDialog__panelTransition -leave-to"
        >
          <DialogPanel class="modalDialog__panel" v-bind="$attrs">
            <DialogTitle v-if="title" class="modalDialog__title">{{ title }}</DialogTitle>
            <slot :close="closeModal" />
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style lang="scss">
.modalDialog {
  position: relative;
  z-index: 5;
  top: 0;

  &__backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0 0 0 / 60%);
  }

  &__backdropTransition {
    &.-enter {
      transition: all 0.2s ease-out;
    }
    &.-enter-from {
      opacity: 0;
    }
    &.-enter-to {
      opacity: 1;
    }
    &.-leave {
      transition: all 0.2s ease-in;
    }
    &.-leave-from {
      opacity: 1;
    }
    &.-leave-to {
      opacity: 0;
    }
  }

  &__panelTransition {
    &.-enter {
      transition: 0.25s ease-out;
      transition-property: opacity, transform;
    }
    &.-enter-from {
      opacity: 0;
      transform: scale(0.95);
    }
    &.-enter-to {
      opacity: 1;
      transform: scale(1);
    }
    &.-leave {
      transition: 0.2s ease-in;
      transition-property: opacity, transform;
    }
    &.-leave-from {
      opacity: 1;
      transform: scale(1);
    }
    &.-leave-to {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  &__container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  &__panel {
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    background: rgb(15 15 15 / 80%);
    border-radius: 8px;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 1px 30px rgba(0, 0, 0, 0.5);
    max-inline-size: min(90vw, 45ch);
  }

  &__title {
    margin-bottom: 1rem;
    color: rgb(255 255 255 / 80%);
    font-size: 1.25rem;
    font-weight: bold;
  }
}
</style>
