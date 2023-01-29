<script lang="ts" setup>
defineProps<{
  inline?: boolean
  round?: boolean
  isIcon?: boolean
  to?: string
  disabled?: boolean
}>()
</script>

<template>
  <component
    :is="to ? 'RouterLink' : 'button'"
    :to="to"
    class="secondaryButton"
    :class="{ '-inline': inline, '-round': round, '-isIcon': isIcon }"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.secondaryButton {
  --background-alpha: 5%;
  --foreground-alpha: 35%;

  display: flex;

  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  margin-right: 0.75rem;
  background: rgb(255 255 255 / var(--background-alpha));
  border-radius: 5px;
  color: rgb(255 255 255 / var(--foreground-alpha));
  cursor: pointer;
  transition: 0.25s ease;
  transition-property: color, background-color, transform;

  &.-inline {
    display: inline-flex;
  }

  &.-round {
    border-radius: 50%;
  }

  &.-isIcon {
    width: 1.75rem;
    height: 1.75rem;
    padding: unset;
  }

  &:hover {
    --background-alpha: 10%;
    --foreground-alpha: 70%;
  }

  &:active {
    --background-alpha: 5%;
    --foreground-alpha: 30%;
    transform: scale(0.95);
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none;
    user-select: none;
  }

  &:deep(svg) {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
  }
}
</style>
