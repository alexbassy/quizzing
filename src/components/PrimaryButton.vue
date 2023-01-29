<script lang="ts" setup>
defineProps({
  bg: {
    type: String,
    default: '#ef476f',
  },
  inline: {
    type: Boolean,
    default: false,
  },
  to: {
    type: [String, Object],
    default: undefined,
  },
})
</script>

<template>
  <component :is="to ? 'RouterLink' : 'button'" :to="to" class="primaryButton" :class="{ '-inline': inline }">
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.primaryButton {
  --background-color: v-bind('bg');

  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: var(--background-color);
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  transition: 0.25s ease;
  transition-property: opacity, color, background-color, transform;

  &.-inline {
    display: inline-flex;
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none;
    user-select: none;
  }

  &:deep(svg) {
    margin-right: 0.5rem;
    color: rgb(255 255 255 / var(--foreground-alpha));
  }

  &:not([disabled]):active {
    transform: scale(0.95);
  }
}
</style>
